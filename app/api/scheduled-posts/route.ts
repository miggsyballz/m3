import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get("clientId")

    let posts
    if (clientId) {
      posts = await db?.getScheduledPostsByClientId(clientId)
    } else {
      posts = await db?.getScheduledPosts()
    }

    return NextResponse.json({
      success: true,
      posts: posts || [],
    })
  } catch (error) {
    console.error("[GET /api/scheduled-posts]", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch scheduled posts",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      client_id,
      campaign_id,
      platform,
      content,
      media_urls = [],
      hashtags = [],
      scheduled_time,
      status = "scheduled",
    } = body

    if (!client_id || !platform || !content || !scheduled_time) {
      return NextResponse.json(
        { error: "Missing required fields: client_id, platform, content, scheduled_time" },
        { status: 400 },
      )
    }

    const post = await db?.createScheduledPost({
      client_id,
      campaign_id: campaign_id || null,
      platform: platform.toLowerCase(),
      content,
      media_urls,
      hashtags,
      scheduled_time,
      status,
    })

    return NextResponse.json({
      success: true,
      post,
    })
  } catch (error) {
    console.error("[POST /api/scheduled-posts]", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create scheduled post",
      },
      { status: 500 },
    )
  }
}
