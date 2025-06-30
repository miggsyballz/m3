export const runtime = "nodejs"
import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

/**
 * GET /api/clients/[id]/social-tokens
 * Get social media tokens for a specific client
 */
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const clientId = params.id

    if (!clientId) {
      return NextResponse.json({ error: "Client ID is required" }, { status: 400 })
    }

    const tokens = await db.getSocialTokensByClient(Number.parseInt(clientId))

    return NextResponse.json({
      success: true,
      tokens: tokens || [],
    })
  } catch (error) {
    console.error("[GET /api/clients/[id]/social-tokens]", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch social tokens",
        tokens: [],
      },
      { status: 500 },
    )
  }
}
