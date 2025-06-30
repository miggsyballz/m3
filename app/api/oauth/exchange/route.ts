export const runtime = "nodejs"
import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { code, clientId, platform, state } = await request.json()

    if (!code || !clientId || !platform) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    let tokenData

    if (platform === "facebook" || platform === "instagram") {
      // Exchange code for Facebook/Instagram access token
      tokenData = await exchangeFacebookToken(code, platform)
    } else if (platform === "linkedin") {
      tokenData = await exchangeLinkedInToken(code)
    } else if (platform === "twitter") {
      tokenData = await exchangeTwitterToken(code)
    } else if (platform === "youtube") {
      tokenData = await exchangeYouTubeToken(code)
    } else if (platform === "tiktok") {
      tokenData = await exchangeTikTokToken(code)
    } else {
      return NextResponse.json({ error: "Unsupported platform" }, { status: 400 })
    }

    // Save token to database
    const socialToken = await db.saveSocialToken({
      client_id: clientId,
      platform,
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_at: tokenData.expires_in ? new Date(Date.now() + tokenData.expires_in * 1000).toISOString() : null,
      permissions: getPlatformPermissions(platform),
      platform_user_id: tokenData.platform_user_id,
      platform_username: tokenData.platform_username,
    })

    return NextResponse.json({
      success: true,
      message: `Successfully connected ${platform}`,
      token: socialToken,
    })
  } catch (error) {
    console.error("[POST /api/oauth/exchange]", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to exchange token" },
      { status: 500 },
    )
  }
}

async function exchangeFacebookToken(code: string, platform: string) {
  const tokenUrl = "https://graph.facebook.com/v18.0/oauth/access_token"
  const redirectUri = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/oauth/callback`

  const params = new URLSearchParams({
    client_id: process.env.FACEBOOK_CLIENT_ID!,
    client_secret: process.env.FACEBOOK_CLIENT_SECRET!,
    redirect_uri: redirectUri,
    code,
  })

  const response = await fetch(`${tokenUrl}?${params}`)
  const data = await response.json()

  if (data.error) {
    throw new Error(`Facebook OAuth error: ${data.error.message}`)
  }

  // Get user info
  const userResponse = await fetch(`https://graph.facebook.com/me?access_token=${data.access_token}&fields=id,name`)
  const userData = await userResponse.json()

  return {
    access_token: data.access_token,
    expires_in: data.expires_in,
    platform_user_id: userData.id,
    platform_username: userData.name,
  }
}

async function exchangeLinkedInToken(code: string) {
  // Implement LinkedIn token exchange
  throw new Error("LinkedIn OAuth not yet implemented")
}

async function exchangeTwitterToken(code: string) {
  // Implement Twitter OAuth 2.0 token exchange
  throw new Error("Twitter OAuth not yet implemented")
}

async function exchangeYouTubeToken(code: string) {
  // Implement YouTube (Google) OAuth token exchange
  throw new Error("YouTube OAuth not yet implemented")
}

async function exchangeTikTokToken(code: string) {
  // Implement TikTok OAuth token exchange
  throw new Error("TikTok OAuth not yet implemented")
}

function getPlatformPermissions(platform: string): string[] {
  const permissions: Record<string, string[]> = {
    instagram: ["publish_posts", "read_insights"],
    facebook: ["publish_posts", "manage_pages", "read_insights"],
    linkedin: ["publish_posts", "read_profile"],
    twitter: ["publish_tweets", "read_profile"],
    youtube: ["upload_videos", "manage_channel"],
    tiktok: ["upload_videos", "manage_content"],
  }
  return permissions[platform] || []
}
