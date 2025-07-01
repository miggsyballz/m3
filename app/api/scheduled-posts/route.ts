import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    console.log("GET /api/scheduled-posts - Starting request")

    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get("clientId")

    console.log("GET /api/scheduled-posts - Client ID:", clientId)

    const posts = await db.getScheduledPosts(clientId || undefined)

    console.log("GET /api/scheduled-posts - Found posts:", posts.length)

    return NextResponse.json(posts)
  } catch (error) {
    console.error("GET /api/scheduled-posts - Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch scheduled posts", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("POST /api/scheduled-posts - Starting request")

    const body = await request.json()
    console.log("POST /api/scheduled-posts - Request body:", body)

    const { client_id, campaign_id, platform, content, hashtags, scheduled_for, status } = body

    if (!client_id || !platform || !content || !scheduled_for) {
      return NextResponse.json(
        { error: "Missing required fields: client_id, platform, content, and scheduled_for are required" },
        { status: 400 },
      )
    }

    const post = await db.createScheduledPost({
      client_id,
      campaign_id: campaign_id || null,
      platform,
      content,
      hashtags: hashtags || null,
      scheduled_for,
      status: status || "draft",
    })

    console.log("POST /api/scheduled-posts - Created post:", post)

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error("POST /api/scheduled-posts - Error:", error)
    return NextResponse.json(
      { error: "Failed to create scheduled post", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
