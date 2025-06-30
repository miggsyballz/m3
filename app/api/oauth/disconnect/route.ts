export const runtime = "nodejs"
import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { clientId, platform } = await request.json()

    if (!clientId || !platform) {
      return NextResponse.json({ error: "Client ID and platform are required" }, { status: 400 })
    }

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
