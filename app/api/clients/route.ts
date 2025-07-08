import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    console.log("GET /api/clients")
    const clients = await db.getClients()
    console.log("Clients fetched:", clients.length)
    return NextResponse.json(clients)
  } catch (error) {
    console.error("[GET /api/clients] Error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch clients",
        clients: [],
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("POST /api/clients - body:", body)

    if (!body.client_name || !body.contact_email) {
      return NextResponse.json({ error: "Missing required fields: client_name, contact_email" }, { status: 400 })
    }

    const newClient = await db.createClient({
      client_name: body.client_name,
      ig_handle: body.ig_handle || null,
      fb_page: body.fb_page || null,
      linkedin_url: body.linkedin_url || null,
      contact_email: body.contact_email,
      notes: body.notes || null,
    })

    console.log("Client created:", newClient)
    return NextResponse.json(newClient, { status: 201 })
  } catch (error) {
    console.error("[POST /api/clients] Error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to create client",
      },
      { status: 500 },
    )
  }
}
