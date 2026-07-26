// Kairo Studio Auth API Edge Function
// Handles Google OAuth and JWT token management

const GOOGLE_CLIENT_ID = Deno.env.get("GOOGLE_CLIENT_ID") || "";
const GOOGLE_CLIENT_SECRET = Deno.env.get("GOOGLE_CLIENT_SECRET") || "";
const SECRET_KEY = Deno.env.get("SECRET_KEY") || "kairo-studio-secret";
const FRONTEND_URL = Deno.env.get("FRONTEND_URL") || "http://localhost:3000";

// Simple JWT implementation
async function base64UrlEncode(data: string): Promise<string> {
  const encoded = btoa(JSON.stringify(data));
  return encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

async function createJWT(payload: object, expiresIn = 3600): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const expPayload = { ...payload, iat: now, exp: now + expiresIn };
  
  const headerEncoded = await base64UrlEncode(JSON.stringify(header));
  const payloadEncoded = await base64UrlEncode(JSON.stringify(expPayload));
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(SECRET_KEY),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign(
    'HMAC',
    cryptoKey,
    new TextEncoder().encode(`${headerEncoded}.${payloadEncoded}`)
  );
  
  const signatureArray = new Uint8Array(signature);
  const signatureEncoded = btoa(String.fromCharCode(...signatureArray))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  
  return `${headerEncoded}.${payloadEncoded}.${signatureEncoded}`;
}

// Google OAuth endpoints
const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo";

export default async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const path = url.pathname;

  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // GET /auth/google - Redirect to Google OAuth
    if (path === '/auth/google' && req.method === 'GET') {
      const state = crypto.randomUUID();
      const params = new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        redirect_uri: `${url.origin}/auth/callback`,
        response_type: 'code',
        scope: 'openid email profile',
        access_type: 'offline',
        state,
      });
      
      return new Response(null, {
        status: 302,
        headers: {
          ...corsHeaders,
          'Location': `${GOOGLE_AUTH_URL}?${params}`,
        },
      });
    }

    // GET /auth/callback - Handle Google OAuth callback
    if (path === '/auth/callback' && req.method === 'GET') {
      const code = url.searchParams.get('code');
      const state = url.searchParams.get('state');
      
      if (!code) {
        return new Response(JSON.stringify({ error: 'No code provided' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Exchange code for tokens
      const tokenResponse = await fetch(GOOGLE_TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: GOOGLE_CLIENT_ID,
          client_secret: GOOGLE_CLIENT_SECRET,
          redirect_uri: `${url.origin}/auth/callback`,
          grant_type: 'authorization_code',
        }),
      });

      if (!tokenResponse.ok) {
        throw new Error('Failed to exchange code for tokens');
      }

      const tokens = await tokenResponse.json();

      // Get user info
      const userInfoResponse = await fetch(GOOGLE_USERINFO_URL, {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      });

      if (!userInfoResponse.ok) {
        throw new Error('Failed to get user info');
      }

      const userInfo = await userInfoResponse.json();

      // Create JWT for our app
      const jwt = await createJWT({
        sub: userInfo.id,
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
      }, 7 * 24 * 3600); // 7 days

      // Redirect to frontend with token
      return new Response(null, {
        status: 302,
        headers: {
          ...corsHeaders,
          'Location': `${FRONTEND_URL}/auth/success?token=${jwt}`,
        },
      });
    }

    // GET /auth/me - Get current user info from token
    if (path === '/auth/me' && req.method === 'GET') {
      const authHeader = req.headers.get('Authorization');
      if (!authHeader?.startsWith('Bearer ')) {
        return new Response(JSON.stringify({ error: 'No token provided' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const token = authHeader.slice(7);
      
      // Decode JWT (simplified - in production use proper JWT verification)
      const parts = token.split('.');
      if (parts.length !== 3) {
        return new Response(JSON.stringify({ error: 'Invalid token' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));

      return new Response(JSON.stringify({
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // POST /auth/refresh - Refresh JWT token
    if (path === '/auth/refresh' && req.method === 'POST') {
      const { token } = await req.json();
      
      if (!token) {
        return new Response(JSON.stringify({ error: 'No token provided' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Create new JWT
      const parts = token.split('.');
      if (parts.length !== 3) {
        return new Response(JSON.stringify({ error: 'Invalid token' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      const newToken = await createJWT({
        sub: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
      }, 7 * 24 * 3600);

      return new Response(JSON.stringify({ token: newToken }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Health check
    if (path === '/health' && req.method === 'GET') {
      return new Response(JSON.stringify({ status: 'ok', service: 'auth-api' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Auth API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}
