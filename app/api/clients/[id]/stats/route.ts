import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("GET /api/clients/[id]/stats - Starting request for client:", params.id)

    const client = await db.getClientById(params.id)
    if (!client) {
      console.log("GET /api/clients/[id]/stats - Client not found:", params.id)
      return NextResponse.json({ error: "Client not found" }, { status: 404 })
    }

    const stats = await db.getClientStats(params.id)

    console.log("GET /api/clients/[id]/stats - Stats:", stats)

    return NextResponse.json(stats)
  } catch (error) {
    console.error("GET /api/clients/[id]/stats - Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch client stats", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
