import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { platform, clientId } = await request.json()

    if (!platform || !clientId) {
      return NextResponse.json({ error: "Platform and client ID required" }, { status: 400 })
    }

    // Generate state parameter for security
    const state = `${clientId}-${platform}-${Date.now()}`

    let authUrl = ""

    switch (platform) {
      case "facebook":
        const fbClientId = process.env.FACEBOOK_CLIENT_ID
        const redirectUri = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/oauth/callback`
        authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${fbClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=pages_manage_posts,pages_read_engagement,instagram_basic,instagram_content_publish&response_type=code&state=${state}`
        break

      case "instagram":
        const igClientId = process.env.FACEBOOK_CLIENT_ID // Instagram uses Facebook app
        const igRedirectUri = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/oauth/callback`
        authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${igClientId}&redirect_uri=${encodeURIComponent(igRedirectUri)}&scope=instagram_basic,instagram_content_publish&response_type=code&state=${state}`
        break

      default:
        // Demo flow for other platforms
        authUrl = `/oauth/demo?platform=${platform}&client=${clientId}&state=${state}`
    }

    return NextResponse.json({ authUrl, state })
  } catch (error) {
    console.error("OAuth connect error:", error)
    return NextResponse.json({ error: "Failed to initiate OAuth" }, { status: 500 })
  }
}
