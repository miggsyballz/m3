"use server"

/**
 * GET /api/clients/:id/stats
 *
 * Returns aggregate statistics for a single client.
 * Relies on the methods that exist in lib/db.ts:
 *   • getClientById
 *   • getCampaignsByClientId
 *   • getContentByClientId
 *   • getScheduledPostsByClientId
 */

import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const clientId = params.id

    /* ---------- 1.  Client ---------- */
    const client = await db.getClientById(clientId)
    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 })
    }

    /* ---------- 2.  Campaigns ---------- */
    const campaigns = await db.getCampaignsByClientId(clientId)

    /* ---------- 3.  Content ---------- */
    const contentItems = await db.getContentByClientId(clientId)

    /* ---------- 4.  Scheduled Posts ---------- */
    const scheduled = await db.getScheduledPostsByClientId(clientId)
    const upcoming = scheduled.filter((p) => p.status === "scheduled" && new Date(p.scheduled_time) > new Date())

    /* ---------- 5.  Build the stats object ---------- */
    const stats = {
      totalCampaigns: campaigns.length,
      activeCampaigns: campaigns.filter((c) => c.status === "active").length,
      scheduledPosts: upcoming.length,
      totalPosts: contentItems.length,
      campaigns: campaigns.slice(0, 5), // latest 5
      upcomingPosts: upcoming.slice(0, 5), // next 5
    }

    return NextResponse.json(stats)
  } catch (err) {
    /* ----------- Robust error logging ---------- */
    console.error("[api/clients/[id]/stats] Unhandled error:", err)
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Internal server error",
      },
      { status: 500 },
    )
  }
}
