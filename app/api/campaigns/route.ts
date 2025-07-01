import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    console.log("GET /api/campaigns - Starting request")

    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get("clientId")

    console.log("GET /api/campaigns - Client ID:", clientId)

    const campaigns = await db.getCampaigns(clientId || undefined)

    console.log("GET /api/campaigns - Found campaigns:", campaigns.length)

    return NextResponse.json(campaigns)
  } catch (error) {
    console.error("GET /api/campaigns - Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch campaigns", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("POST /api/campaigns - Starting request")

    const body = await request.json()
    console.log("POST /api/campaigns - Request body:", body)

    const { client_id, name, description, status, start_date, end_date, budget } = body

    if (!client_id || !name) {
      return NextResponse.json({ error: "Missing required fields: client_id and name are required" }, { status: 400 })
    }

    const campaign = await db.createCampaign({
      client_id,
      name,
      description: description || null,
      status: status || "draft",
      start_date: start_date || null,
      end_date: end_date || null,
      budget: budget || null,
    })

    console.log("POST /api/campaigns - Created campaign:", campaign)

    return NextResponse.json(campaign, { status: 201 })
  } catch (error) {
    console.error("POST /api/campaigns - Error:", error)
    return NextResponse.json(
      { error: "Failed to create campaign", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
