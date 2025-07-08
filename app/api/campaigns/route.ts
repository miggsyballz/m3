import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get("clientId")

    const campaigns = clientId ? await db.getCampaignsByClientId(clientId) : await db.getCampaigns()

    return NextResponse.json(campaigns)
  } catch (error) {
    console.error("Error fetching campaigns:", error)
    return NextResponse.json({ error: "Failed to fetch campaigns" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const body = await request.json()

    if (!body.name || !body.client_id) {
      return NextResponse.json({ error: "Name and client_id are required" }, { status: 400 })
    }

    const campaign = await db.createCampaign({
      name: body.name,
      client_id: body.client_id,
      description: body.description || null,
      start_date: body.start_date || null,
      end_date: body.end_date || null,
      budget: body.budget || null,
      status: body.status || "draft",
      goals: body.goals || [],
      target_audience: body.target_audience || {},
      platforms: body.platforms || [],
    })

    return NextResponse.json(campaign, { status: 201 })
  } catch (error) {
    console.error("Error creating campaign:", error)
    return NextResponse.json({ error: "Failed to create campaign" }, { status: 500 })
  }
}
