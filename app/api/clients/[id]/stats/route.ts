export const runtime = "nodejs"
import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"

/**
 * GET /api/clients/[id]/stats
 * Get real statistics for a specific client
 */
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const clientId = params.id

    // Get client info
    const client = await db.getClientById(clientId)
    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 })
    }

    // Get real campaign stats
    const campaigns = await db.getCampaignsByClientId(clientId)
    const activeCampaigns = campaigns.filter((c) => c.status === "active")

    // Get real scheduled posts
    const scheduledPosts = await db.getScheduledPostsByClientId(clientId)
    const upcomingPosts = scheduledPosts.filter(
      (p) => p.status === "scheduled" && new Date(p.scheduled_time) > new Date(),
    )

    // Get content items
    const contentItems = await db.getContentByClientId(clientId)

    const stats = {
      totalCampaigns: campaigns.length,
      activeCampaigns: activeCampaigns.length,
      scheduledPosts: upcomingPosts.length,
      totalPosts: contentItems.length,
      campaigns: campaigns.slice(0, 5), // Recent campaigns
      upcomingPosts: upcomingPosts.slice(0, 5), // Next 5 posts
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("[GET /api/clients/[id]/stats]", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch client stats",
      },
      { status: 500 },
    )
  }
}
