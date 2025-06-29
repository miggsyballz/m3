export const runtime = "nodejs"
import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"

/**
 * GET /api/campaigns?clientId=xxx
 * Get campaigns, optionally filtered by client
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get("clientId")

    let campaigns
    if (clientId) {
      campaigns = await db.getCampaignsByClientId(clientId)
    } else {
      campaigns = await db.getCampaigns()
    }

    return NextResponse.json(campaigns)
  } catch (error) {
    console.error("[GET /api/campaigns]", error)
    return NextResponse.json(
      {
        campaigns: [],
        error: error instanceof Error ? error.message : "Failed to fetch campaigns",
      },
      { status: 200 },
    )
  }
}

/**
 * POST /api/campaigns
 * Create a new campaign
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.client_id || !data.name || !data.type) {
      return NextResponse.json({ error: "Missing required fields: client_id, name, type" }, { status: 400 })
    }

    const newCampaign = await db.createCampaign({
      client_id: data.client_id,
      name: data.name,
      type: data.type,
      platforms: data.platforms || [],
      hashtags: data.hashtags || [],
      start_date: data.start_date || null,
      end_date: data.end_date || null,
      status: data.status || "draft",
    })

    return NextResponse.json(newCampaign, { status: 201 })
  } catch (error) {
    console.error("[POST /api/campaigns]", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to create campaign",
      },
      { status: 500 },
    )
  }
}
