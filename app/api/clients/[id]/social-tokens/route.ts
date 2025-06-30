export const runtime = "nodejs"
import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const clientId = params.id

    if (!clientId) {
      return NextResponse.json({ error: "Client ID is required" }, { status: 400 })
    }

    const tokens = await db.getSocialTokensByClient(clientId)

    return NextResponse.json({
      tokens: tokens.map((token) => ({
        id: token.id,
        platform: token.platform,
        status: token.expires_at && new Date(token.expires_at) < new Date() ? "expired" : "connected",
        expires_at: token.expires_at,
        last_synced: token.last_synced,
        permissions: token.permissions || [],
        platform_user_id: token.platform_user_id,
        platform_username: token.platform_username,
      })),
    })
  } catch (error) {
    console.error("[GET /api/clients/[id]/social-tokens]", error)
    return NextResponse.json(
      {
        tokens: [],
        error: error instanceof Error ? error.message : "Failed to fetch social tokens",
      },
      { status: 500 },
    )
  }
}
