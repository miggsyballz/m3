export const runtime = "nodejs"
import { type NextRequest, NextResponse } from "next/server"

/**
 * POST /api/oauth/connect
 * Initiate OAuth flow for a platform
 */
export async function POST(request: NextRequest) {
  try {
    const { clientId, platform, redirectUrl } = await request.json()

    if (!clientId || !platform) {
      return NextResponse.json({ error: "Client ID and platform are required" }, { status: 400 })
    }

    // In a real implementation, you would:
    // 1. Generate OAuth URLs for each platform
    // 2. Store state parameter to prevent CSRF
    // 3. Redirect to platform's OAuth endpoint

    const oauthUrls: Record<string, string> = {
      instagram: `https://api.instagram.com/oauth/authorize?client_id=${process.env.INSTAGRAM_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUrl)}&scope=user_profile,user_media&response_type=code&state=${clientId}`,
      facebook: `https://www.facebook.com/v18.0/dialog/oauth?client_id=${process.env.FACEBOOK_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUrl)}&scope=pages_manage_posts,pages_read_engagement&response_type=code&state=${clientId}`,
      linkedin: `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUrl)}&scope=w_member_social&state=${clientId}`,
      twitter: `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${process.env.TWITTER_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUrl)}&scope=tweet.read%20tweet.write%20users.read&state=${clientId}`,
      youtube: `https://accounts.google.com/oauth2/v2/auth?response_type=code&client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUrl)}&scope=https://www.googleapis.com/auth/youtube.upload&state=${clientId}`,
      tiktok: `https://www.tiktok.com/auth/authorize/?client_key=${process.env.TIKTOK_CLIENT_KEY}&response_type=code&scope=user.info.basic,video.upload&redirect_uri=${encodeURIComponent(redirectUrl)}&state=${clientId}`,
    }

    const authUrl = oauthUrls[platform]
    if (!authUrl) {
      return NextResponse.json({ error: "Unsupported platform" }, { status: 400 })
    }

    // For demo purposes, we'll simulate a successful OAuth flow
    // In production, this would return the actual OAuth URL
    return NextResponse.json({
      authUrl: `/oauth/demo?platform=${platform}&clientId=${clientId}`,
      state: clientId,
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
