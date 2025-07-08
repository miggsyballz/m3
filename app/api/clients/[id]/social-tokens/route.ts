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

    const tokens = await db.getSocialTokensByClientId(clientId)
    return NextResponse.json(tokens)
  } catch (error) {
    console.error("Error fetching social tokens:", error)
    return NextResponse.json({ error: "Failed to fetch social tokens" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!db) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const clientId = params.id
    const body = await request.json()

    if (!clientId) {
      return NextResponse.json({ error: "Client ID is required" }, { status: 400 })
    }

    if (!body.platform || !body.access_token) {
      return NextResponse.json({ error: "Platform and access_token are required" }, { status: 400 })
    }

    const token = await db.createSocialToken({
      client_id: clientId,
      platform: body.platform,
      access_token: body.access_token,
      refresh_token: body.refresh_token || null,
      expires_at: body.expires_at || null,
      scope: body.scope || null,
    })

    return NextResponse.json(token, { status: 201 })
  } catch (error) {
    console.error("Error creating social token:", error)
    return NextResponse.json({ error: "Failed to create social token" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!db) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const clientId = params.id
    const { searchParams } = new URL(request.url)
    const platform = searchParams.get("platform")

    if (!clientId || !platform) {
      return NextResponse.json({ error: "Client ID and platform are required" }, { status: 400 })
    }

    const success = await db.deleteSocialToken(clientId, platform)

    if (!success) {
      return NextResponse.json({ error: "Token not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Token deleted successfully" })
  } catch (error) {
    console.error("Error deleting social token:", error)
    return NextResponse.json({ error: "Failed to delete social token" }, { status: 500 })
  }
}
