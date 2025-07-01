import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    console.log("GET /api/clients - Starting request")

    const clients = await db.getClients()

    console.log("GET /api/clients - Found clients:", clients.length)

    return NextResponse.json(clients)
  } catch (error) {
    console.error("GET /api/clients - Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch clients", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("POST /api/clients - Starting request")

    const body = await request.json()
    console.log("POST /api/clients - Request body:", body)

    const { client_name, contact_email, ig_handle, fb_page, linkedin_url, notes } = body

    if (!client_name || !contact_email) {
      return NextResponse.json(
        { error: "Missing required fields: client_name and contact_email are required" },
        { status: 400 },
      )
    }

    const client = await db.createClient({
      client_name,
      contact_email,
      ig_handle: ig_handle || null,
      fb_page: fb_page || null,
      linkedin_url: linkedin_url || null,
      notes: notes || null,
    })

    console.log("POST /api/clients - Created client:", client)

    return NextResponse.json(client, { status: 201 })
  } catch (error) {
    console.error("POST /api/clients - Error:", error)
    return NextResponse.json(
      { error: "Failed to create client", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
