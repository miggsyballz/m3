import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get("clientId") ?? undefined

    console.log("GET /api/scheduled-posts - clientId:", clientId)

    const posts = clientId ? await db.getScheduledPostsByClientId(clientId) : await db.getScheduledPosts()

    console.log("Scheduled posts fetched:", posts.length)
    return NextResponse.json(posts)
  } catch (error) {
    console.error("[GET /api/scheduled-posts] Error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch scheduled posts",
        posts: [],
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("POST /api/scheduled-posts - body:", body)

    if (!body.client_id || !body.platform || !body.content || !body.scheduled_time) {
      return NextResponse.json(
        { error: "Missing required fields: client_id, platform, content, scheduled_time" },
        { status: 400 },
      )
    }

    const newPost = await db.createScheduledPost({
      campaign_id: body.campaign_id || null,
      client_id: body.client_id,
      platform: body.platform,
      content: body.content,
      media_urls: body.media_urls || [],
      hashtags: body.hashtags || [],
      scheduled_time: body.scheduled_time,
      status: body.status || "draft",
    })

    console.log("Scheduled post created:", newPost)
    return NextResponse.json(newPost, { status: 201 })
  } catch (error) {
    console.error("[POST /api/scheduled-posts] Error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to create scheduled post",
      },
      { status: 500 },
    )
  }
}
