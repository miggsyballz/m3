export const runtime = "nodejs"
import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"

/**
 * POST /api/oauth/complete
 * Complete OAuth flow and store tokens
 */
export async function POST(request: NextRequest) {
  try {
    const { clientId, platform, code, accessToken, refreshToken } = await request.json()

    if (!clientId || !platform || !accessToken) {
      return NextResponse.json({ error: "Missing required OAuth data" }, { status: 400 })
    }

    // Store the social token
    const tokenData = {
      client_id: clientId,
      platform,
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour from now
      permissions: getPlatformPermissions(platform),
      platform_user_id: "demo_user_id",
      platform_username: `demo_${platform}_user`,
    }

    const savedToken = await db.createSocialToken(tokenData)

    return NextResponse.json({
      success: true,
      message: `Successfully connected ${platform}`,
      token: savedToken,
    })
  } catch (error) {
    console.error("[POST /api/oauth/complete]", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to complete OAuth" },
      { status: 500 },
    )
  }
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
