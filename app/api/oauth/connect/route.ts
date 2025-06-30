export const runtime = "nodejs"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { clientId, platform, redirectUrl } = await request.json()

    if (!clientId || !platform) {
      return NextResponse.json({ error: "Client ID and platform are required" }, { status: 400 })
    }

    // Generate state parameter for security
    const state = `${clientId}-${platform}-${Date.now()}`
    const baseRedirectUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/oauth/callback`

    // Real OAuth URLs for production platforms
    const oauthUrls: Record<string, string> = {
      // Meta (Facebook & Instagram) - Using real Meta app
      facebook:
        `https://www.facebook.com/v18.0/dialog/oauth?` +
        `client_id=${process.env.FACEBOOK_CLIENT_ID}&` +
        `redirect_uri=${encodeURIComponent(baseRedirectUrl)}&` +
        `scope=pages_manage_posts,pages_read_engagement,instagram_basic,instagram_content_publish&` +
        `response_type=code&` +
        `state=${state}`,

      instagram:
        `https://www.facebook.com/v18.0/dialog/oauth?` +
        `client_id=${process.env.FACEBOOK_CLIENT_ID}&` +
        `redirect_uri=${encodeURIComponent(baseRedirectUrl)}&` +
        `scope=instagram_basic,instagram_content_publish&` +
        `response_type=code&` +
        `state=${state}`,

      // LinkedIn OAuth
      linkedin:
        `https://www.linkedin.com/oauth/v2/authorization?` +
        `response_type=code&` +
        `client_id=${process.env.LINKEDIN_CLIENT_ID}&` +
        `redirect_uri=${encodeURIComponent(baseRedirectUrl)}&` +
        `scope=w_member_social&` +
        `state=${state}`,

      // Twitter OAuth 2.0
      twitter:
        `https://twitter.com/i/oauth2/authorize?` +
        `response_type=code&` +
        `client_id=${process.env.TWITTER_CLIENT_ID}&` +
        `redirect_uri=${encodeURIComponent(baseRedirectUrl)}&` +
        `scope=tweet.read%20tweet.write%20users.read&` +
        `state=${state}`,

      // YouTube (Google OAuth)
      youtube:
        `https://accounts.google.com/oauth2/v2/auth?` +
        `response_type=code&` +
        `client_id=${process.env.GOOGLE_CLIENT_ID}&` +
        `redirect_uri=${encodeURIComponent(baseRedirectUrl)}&` +
        `scope=https://www.googleapis.com/auth/youtube.upload&` +
        `state=${state}`,

      // TikTok OAuth
      tiktok:
        `https://www.tiktok.com/auth/authorize/?` +
        `client_key=${process.env.TIKTOK_CLIENT_KEY}&` +
        `response_type=code&` +
        `scope=user.info.basic,video.upload&` +
        `redirect_uri=${encodeURIComponent(baseRedirectUrl)}&` +
        `state=${state}`,
    }

    const authUrl = oauthUrls[platform]
    if (!authUrl) {
      return NextResponse.json({ error: "Unsupported platform" }, { status: 400 })
    }

    return NextResponse.json({
      authUrl,
      state,
      platform,
    })
  } catch (error) {
    console.error("[POST /api/oauth/connect]", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to initiate OAuth" },
      { status: 500 },
    )
  }
}
