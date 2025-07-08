import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get("clientId") ?? undefined

    console.log("GET /api/campaigns - clientId:", clientId)

    const campaigns = clientId ? await db.getCampaignsByClientId(clientId) : await db.getCampaigns()

    console.log("Campaigns fetched:", campaigns.length)
    return NextResponse.json(campaigns)
  } catch (error) {
    console.error("[GET /api/campaigns] Error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch campaigns",
        campaigns: [],
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("POST /api/campaigns - body:", body)

    if (!body.client_id || !body.name || !body.type) {
      return NextResponse.json({ error: "Missing required fields: client_id, name, type" }, { status: 400 })
    }

    const newCampaign = await db.createCampaign(body)
    console.log("Campaign created:", newCampaign)

    return NextResponse.json(newCampaign, { status: 201 })
  } catch (error) {
    console.error("[POST /api/campaigns] Error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to create campaign",
      },
      { status: 500 },
    )
  }
}
