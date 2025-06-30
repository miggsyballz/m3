export const runtime = "nodejs"
import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const clientId = params.id

    if (!clientId) {
      return NextResponse.json({ error: "Client ID is required" }, { status: 400 })
    }

    // Get client info
    const client = await db.getClientById(clientId)
    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 })
    }

    // Get real campaigns for this client
    const campaigns = await db.getCampaignsByClientId(clientId)

    // Get real content for this client
    const content = await db.getContentByClientId(clientId)

    // Get real scheduled posts for this client
    const scheduledPosts = await db.getScheduledPostsByClientId(clientId)

    // Calculate real stats
    const activeCampaigns = campaigns.filter((c) => c.status === "active")
    const upcomingPosts = scheduledPosts.filter(
      (p) => p.status === "scheduled" && new Date(p.scheduled_time) > new Date(),
    )

    const stats = {
      totalCampaigns: campaigns.length,
      activeCampaigns: activeCampaigns.length,
      scheduledPosts: upcomingPosts.length,
      totalPosts: content.length,
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
