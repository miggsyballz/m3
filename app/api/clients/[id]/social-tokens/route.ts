export const runtime = "nodejs"
import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"

/**
 * GET /api/clients/[id]/social-tokens
 * Get all social tokens for a client
 */
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const clientId = Number.parseInt(params.id)

    if (isNaN(clientId)) {
      return NextResponse.json({ error: "Invalid client ID" }, { status: 400 })
    }

    const tokens = await db.getSocialTokensByClient(clientId)

    return NextResponse.json({
      success: true,
      tokens: tokens || [],
    })
  } catch (error) {
    console.error("[GET /api/clients/[id]/social-tokens]", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch social tokens" },
      { status: 500 },
    )
  }
}

/**
 * DELETE /api/clients/[id]/social-tokens
 * Delete a specific social token for a client
 */
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const clientId = Number.parseInt(params.id)
    const { platform } = await request.json()

    if (isNaN(clientId) || !platform) {
      return NextResponse.json({ error: "Invalid client ID or platform" }, { status: 400 })
    }

    await db.deleteSocialToken(clientId, platform)

    return NextResponse.json({
      success: true,
      message: `${platform} token deleted successfully`,
    })
  } catch (error) {
    console.error("[DELETE /api/clients/[id]/social-tokens]", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete social token" },
      { status: 500 },
    )
  }
}
