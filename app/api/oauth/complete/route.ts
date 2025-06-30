export const runtime = "nodejs"
import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { clientId, platform, code, accessToken, refreshToken } = await request.json()

    if (!clientId || !platform || !accessToken) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // Save token to database
    const socialToken = await db.saveSocialToken({
      client_id: clientId,
      platform,
      access_token: accessToken,
      refresh_token: refreshToken || null,
      expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour from now
    })

    return NextResponse.json({
      success: true,
      message: `Successfully connected ${platform}`,
      token: socialToken,
    })
  } catch (error) {
    console.error("[POST /api/oauth/complete]", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to complete OAuth" },
      { status: 500 },
    )
  }
}
