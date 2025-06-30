"use server"

/**
 * GET /api/campaigns
 *
 * Optional query param ?clientId=... to filter by client.
 * Uses db.getCampaigns() or db.getCampaignsByClientId().
 */

import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const clientId = searchParams.get("clientId") ?? undefined

    const campaigns = clientId ? await db.getCampaignsByClientId(clientId) : await db.getCampaigns()

    return NextResponse.json(campaigns)
  } catch (err) {
    console.error("[api/campaigns] Unhandled error:", err)
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Internal server error",
      },
      { status: 500 },
    )
  }
}
