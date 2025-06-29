export const runtime = "nodejs"
import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"

/**
 * GET /api/campaigns/[id]
 * Get a specific campaign by ID
 */
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const campaignId = params.id
    const campaign = await db.getCampaignById(campaignId)

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
    }

    return NextResponse.json(campaign)
  } catch (error) {
    console.error("[GET /api/campaigns/[id]]", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch campaign" },
      { status: 500 },
    )
  }
}

/**
 * PUT /api/campaigns/[id]
 * Update a campaign
 */
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const campaignId = params.id
    const updates = await request.json()

    const updatedCampaign = await db.updateCampaign(campaignId, updates)

    if (!updatedCampaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
    }

    return NextResponse.json(updatedCampaign)
  } catch (error) {
    console.error("[PUT /api/campaigns/[id]]", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update campaign" },
      { status: 500 },
    )
  }
}

/**
 * DELETE /api/campaigns/[id]
 * Delete a campaign
 */
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const campaignId = params.id
    const success = await db.deleteCampaign(campaignId)

    if (!success) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Campaign deleted successfully" })
  } catch (error) {
    console.error("[DELETE /api/campaigns/[id]]", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete campaign" },
      { status: 500 },
    )
  }
}
