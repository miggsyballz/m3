import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { code, state, clientId, platform } = await request.json()

    if (!code || !state || !clientId || !platform) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    let tokenData = null

    switch (platform) {
      case "facebook":
      case "instagram":
        tokenData = await exchangeFacebookToken(code, platform)
        break

      default:
        return NextResponse.json({ error: "Unsupported platform" }, { status: 400 })
    }

    if (!tokenData) {
      return NextResponse.json({ error: "Failed to exchange token" }, { status: 500 })
    }

    // Save token to database
    await db.saveSocialToken({
      clientId: Number.parseInt(clientId),
      platform,
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token || null,
      expiresAt: tokenData.expires_in ? new Date(Date.now() + tokenData.expires_in * 1000) : null,
      userInfo: tokenData.user_info || null,
    })

    return NextResponse.json({ success: true, platform })
  } catch (error) {
    console.error("Token exchange error:", error)
    return NextResponse.json({ error: "Failed to exchange token" }, { status: 500 })
  }
}

async function exchangeFacebookToken(code: string, platform: string) {
  const clientId = process.env.FACEBOOK_CLIENT_ID
  const clientSecret = process.env.FACEBOOK_CLIENT_SECRET
  const redirectUri = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/oauth/callback`

  if (!clientId || !clientSecret) {
    throw new Error("Facebook credentials not configured")
  }

  // Exchange code for access token
  const tokenResponse = await fetch("https://graph.facebook.com/v18.0/oauth/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      code: code,
    }),
  })

  const tokenData = await tokenResponse.json()

  if (!tokenResponse.ok) {
    throw new Error(tokenData.error?.message || "Failed to exchange Facebook token")
  }

  // Get long-lived token
  const longLivedResponse = await fetch(
    `https://graph.facebook.com/v18.0/oauth/access_token?` +
      `grant_type=fb_exchange_token&` +
      `client_id=${clientId}&` +
      `client_secret=${clientSecret}&` +
      `fb_exchange_token=${tokenData.access_token}`,
  )

  const longLivedData = await longLivedResponse.json()
  const finalToken = longLivedResponse.ok ? longLivedData.access_token : tokenData.access_token

  // Get user info
  const userResponse = await fetch(
    `https://graph.facebook.com/v18.0/me?fields=id,name,email&access_token=${finalToken}`,
  )
  const userData = await userResponse.json()

  return {
    access_token: finalToken,
    expires_in: longLivedData.expires_in || tokenData.expires_in,
    user_info: userData,
  }
}
