import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!db) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const clientId = params.id

    if (!clientId) {
      return NextResponse.json({ error: "Client ID is required" }, { status: 400 })
    }

    // Get client campaigns
    const campaigns = await db.getCampaignsByClientId(clientId)

    // Get scheduled posts for this client
    const scheduledPosts = await db.getScheduledPostsByClientId(clientId)

    // Calculate stats
    const stats = {
      totalCampaigns: campaigns.length,
      activeCampaigns: campaigns.filter((c) => c.status === "active").length,
      totalScheduledPosts: scheduledPosts.length,
      publishedPosts: scheduledPosts.filter((p) => p.status === "published").length,
      pendingPosts: scheduledPosts.filter((p) => p.status === "scheduled").length,
      draftPosts: scheduledPosts.filter((p) => p.status === "draft").length,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching client stats:", error)
    return NextResponse.json({ error: "Failed to fetch client stats" }, { status: 500 })
  }
}
