# Google OAuth Setup Guide for Kairo Studio

This guide will help you set up Google OAuth authentication for Kairo Studio.

## Prerequisites

- A Google account
- Access to [Google Cloud Console](https://console.cloud.google.com/)

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Give your project a name (e.g., "Kairo Studio")
4. Click "Create"

## Step 2: Enable Google+ API

1. In your project, go to "APIs & Services" → "Library"
2. Search for "Google+ API"
3. Click on it and click "Enable"

## Step 3: Configure OAuth Consent Screen

1. Go to "APIs & Services" → "OAuth consent screen"
2. Choose "External" and click "Create"
3. Fill in the required information:
   - App name: Kairo Studio
   - User support email: Your email
   - Developer contact: Your email
4. Click "Save and Continue"
5. On Scopes page, click "Add or Remove Scopes"
6. Select these scopes:
   - `email`
   - `profile`
   - `openid`
7. Click "Save and Continue"
8. Add test users (your Google account for testing)
9. Click "Save and Continue"

## Step 4: Create OAuth Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Application type: "Web application"
4. Name: "Kairo Studio Web Client"
5. Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - `https://your-production-domain.com/api/auth/callback/google` (for production)
6. Click "Create"
7. Copy the **Client ID** and **Client Secret**

## Step 5: Configure Environment Variables

1. Copy the example env file:
   ```bash
   cp backend/.env.example backend/.env
   ```

2. Edit `backend/.env`:
   ```env
   GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-client-secret
   SECRET_KEY=your-secure-random-key
   FRONTEND_URL=http://localhost:3000
   ```

3. Generate a secure secret key:
   ```bash
   # Linux/Mac
   openssl rand -hex 32
   
   # Or use Python
   python -c "import secrets; print(secrets.token_hex(32))"
   ```

## Step 6: Set Up Frontend Environment

1. Create `frontend/.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
   ```

## Step 7: Install Dependencies

```bash
# Backend
cd backend
uv sync

# Frontend
cd frontend
npm install
```

## Step 8: Test the Authentication

1. Start the backend:
   ```bash
   cd backend
   uvicorn main:app --reload --port 8000
   ```

2. Start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

3. Open http://localhost:3000/auth
4. Click "Continue with Google"
5. You should be redirected to Google's consent screen
6. After authorizing, you should be redirected back and logged in

## Troubleshooting

### "redirect_uri_mismatch" error

- Make sure the redirect URI in Google Cloud Console matches exactly:
  - `http://localhost:3000/api/auth/callback/google`
- The URI is case-sensitive

### "access_denied" error

- Make sure you've added your email as a test user in OAuth consent screen
- Or make the app "Production" (requires verification for non-Google accounts)

### Token not persisting

- Check browser console for cookie errors
- Make sure cookies are not blocked
- In production, use HTTPS (cookies require Secure flag)

## Production Deployment

For production, make sure to:

1. Use HTTPS (required for secure cookies)
2. Update redirect URIs in Google Console to your production domain
3. Use a strong, unique `SECRET_KEY`
4. Set `ENVIRONMENT=production` in `.env`
5. Consider using a proper database for user session storage
