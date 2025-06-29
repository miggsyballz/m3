import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"

/**
 * GET /api/clients
 * Returns the full client list.
 */
export async function GET() {
  try {
    const clients = await db.getClients()
    return NextResponse.json(clients)
  } catch (error) {
    console.error("[GET /api/clients] Database error:", error)

    // Check if it's a configuration error
    const errorMessage = error instanceof Error ? error.message : "Unknown error"

    if (errorMessage.includes("DATABASE_URL")) {
      return NextResponse.json(
        {
          clients: [],
          error: "Database not configured",
          message: "Please add your DATABASE_URL environment variable in Vercel settings.",
          needsSetup: true,
        },
        { status: 200 },
      ) // Return 200 to avoid frontend errors
    }

    // Return empty array with error info for other database errors
    return NextResponse.json(
      {
        clients: [],
        error: errorMessage,
        message: "Database connection failed. Please check your configuration.",
      },
      { status: 200 },
    ) // Return 200 to avoid frontend errors
  }
}

/**
 * POST /api/clients
 * Creates a new client with the JSON body supplied.
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const newClient = await db.createClient(data)
    return NextResponse.json(newClient, { status: 201 })
  } catch (error) {
    console.error("[POST /api/clients]", error)
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error"

    if (errorMessage.includes("DATABASE_URL")) {
      return NextResponse.json(
        {
          error: "Database not configured. Please add DATABASE_URL environment variable.",
        },
        { status: 400 },
      )
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
