export const runtime = "nodejs"
import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"

/**
 * POST /api/oauth/disconnect
 * Disconnect a social media platform for a client
 */
export async function POST(request: NextRequest) {
  try {
    const { clientId, platform } = await request.json()

    if (!clientId || !platform) {
      return NextResponse.json({ error: "Client ID and platform are required" }, { status: 400 })
    }

    // Delete the social token from database
    await db.deleteSocialToken(clientId, platform)

    return NextResponse.json({
      success: true,
      message: `Successfully disconnected ${platform}`,
    })
  } catch (error) {
    console.error("[POST /api/oauth/disconnect]", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to disconnect platform" },
      { status: 500 },
    )
  }
}
