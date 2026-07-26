import { NextRequest, NextResponse } from "next/server";
import { insforge } from "@/lib/insforge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const host = req.headers.get("host") || "localhost:3000";
  const protocol = req.headers.get("x-forwarded-proto") || "http";
  const baseUrl = `${protocol}://${host}`;

  if (error || !code) {
    return NextResponse.redirect(`${baseUrl}/auth?error=${encodeURIComponent("GitHub OAuth authentication was canceled or failed.")}`);
  }

  const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${baseUrl}/auth?error=${encodeURIComponent("NEXT_PUBLIC_GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET missing in .env.local")}`);
  }

  try {
    // 1. Exchange code for access_token with GitHub
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    const tokenData = await tokenRes.json();
    if (tokenData.error || !tokenData.access_token) {
      throw new Error(tokenData.error_description || "Failed to retrieve access token from GitHub.");
    }

    const accessToken = tokenData.access_token;

    // 2. Fetch GitHub User Profile
    const userRes = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "User-Agent": "Kairo-Studio-Auth",
      },
    });

    if (!userRes.ok) throw new Error("Failed to fetch user profile from GitHub.");
    const ghUser = await userRes.json();

    // 3. Fetch primary email if user.email is null/private
    let email = ghUser.email;
    if (!email) {
      const emailRes = await fetch("https://api.github.com/user/emails", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "User-Agent": "Kairo-Studio-Auth",
        },
      });
      if (emailRes.ok) {
        const emails = await emailRes.json();
        const primary = emails.find((e: any) => e.primary) || emails[0];
        if (primary) email = primary.email;
      }
    }

    const userObj = {
      name: ghUser.name || ghUser.login,
      email: email || `${ghUser.login}@github.user`,
      avatar: ghUser.avatar_url,
      provider: "GitHub",
    };

    // 4. Sync to InsForge Backend Database
    try {
      await insforge.database.from("users").upsert([
        {
          email: userObj.email,
          full_name: userObj.name,
          picture: userObj.avatar,
          google_id: `github:${ghUser.id}`,
        },
      ]);
    } catch (dbErr) {
      console.warn("Sync to InsForge DB failed:", dbErr);
    }

    // 5. Redirect back to frontend with user data
    const redirectUrl = new URL(`${baseUrl}/auth`);
    redirectUrl.searchParams.set("github_success", "1");
    redirectUrl.searchParams.set("user", JSON.stringify(userObj));

    return NextResponse.redirect(redirectUrl.toString());
  } catch (err: any) {
    console.error("GitHub OAuth Error:", err);
    return NextResponse.redirect(`${baseUrl}/auth?error=${encodeURIComponent(err.message || "GitHub authentication failed.")}`);
  }
}
