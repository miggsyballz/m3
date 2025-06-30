export const runtime = "nodejs"
import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

/**
 * POST /api/oauth/refresh
 * Refresh an expired access token
 */
export async function POST(request: NextRequest) {
  try {
    const { clientId, platform } = await request.json()

    if (!clientId || !platform) {
      return NextResponse.json({ error: "Client ID and platform are required" }, { status: 400 })
    }

    // Get existing token
    const existingToken = await db.getSocialToken(Number.parseInt(clientId), platform)
    if (!existingToken) {
      return NextResponse.json({ error: "No token found for this platform" }, { status: 404 })
    }

    let newTokenData

    if (platform === "facebook" || platform === "instagram") {
      // Refresh Facebook/Instagram token
      newTokenData = await refreshFacebookToken(existingToken.access_token)
    } else {
      // For demo platforms, generate new demo token
      newTokenData = {
        access_token: `refreshed_${platform}_token_${Date.now()}`,
        expires_in: 3600,
      }
    }

    // Update token in database
    const updatedToken = await db.updateSocialToken(Number.parseInt(clientId), platform, {
      access_token: newTokenData.access_token,
      expires_at: newTokenData.expires_in ? new Date(Date.now() + newTokenData.expires_in * 1000).toISOString() : null,
      last_synced: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      message: `Successfully refreshed ${platform} token`,
      token: updatedToken,
    })
  } catch (error) {
    console.error("[POST /api/oauth/refresh]", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to refresh token" },
      { status: 500 },
    )
  }
}

async function refreshFacebookToken(accessToken: string) {
  const refreshUrl = "https://graph.facebook.com/v18.0/oauth/access_token"

  const params = new URLSearchParams({
    grant_type: "fb_exchange_token",
    client_id: process.env.FACEBOOK_CLIENT_ID!,
    client_secret: process.env.FACEBOOK_CLIENT_SECRET!,
    fb_exchange_token: accessToken,
  })

  const response = await fetch(`${refreshUrl}?${params}`)
  const data = await response.json()

  if (data.error) {
    throw new Error(`Facebook token refresh error: ${data.error.message}`)
  }

  return {
    access_token: data.access_token,
    expires_in: data.expires_in,
  }
}
