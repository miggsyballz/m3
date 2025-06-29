export const runtime = "nodejs"
import { NextResponse } from "next/server"
import { db } from "@/lib/database"

/**
 * POST /api/clients/init
 * Initialize the database with a default client if none exist
 */
export async function POST() {
  try {
    // Check if any clients exist
    const existingClients = await db.getClients()

    if (existingClients.length > 0) {
      return NextResponse.json({
        message: "Clients already exist",
        count: existingClients.length,
      })
    }

    // Create default client for Mig Media
    const defaultClient = await db.createClient({
      client_name: "Mig Media",
      ig_handle: "@migmedia",
      fb_page: "facebook.com/migmedia",
      linkedin_url: "linkedin.com/company/migmedia",
      contact_email: "hello@migmedia.com",
      notes: "Main marketing agency client - Mig's personal brand and business",
    })

    return NextResponse.json(
      {
        message: "Default client created successfully",
        client: defaultClient,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[POST /api/clients/init]", error)
    return NextResponse.json(
      {
        error: (error as Error).message ?? "Failed to initialize clients",
      },
      { status: 500 },
    )
  }
}
