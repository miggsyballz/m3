import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("GET /api/scheduled-posts/[id] - Starting request for post:", params.id)

    const post = await db.getScheduledPostById(params.id)
    if (!post) {
      console.log("GET /api/scheduled-posts/[id] - Post not found:", params.id)
      return NextResponse.json({ error: "Scheduled post not found" }, { status: 404 })
    }

    console.log("GET /api/scheduled-posts/[id] - Found post:", post)

    return NextResponse.json(post)
  } catch (error) {
    console.error("GET /api/scheduled-posts/[id] - Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch scheduled post", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("PUT /api/scheduled-posts/[id] - Starting request for post:", params.id)

    const body = await request.json()
    console.log("PUT /api/scheduled-posts/[id] - Request body:", body)

    const post = await db.updateScheduledPost(params.id, body)
    if (!post) {
      console.log("PUT /api/scheduled-posts/[id] - Post not found:", params.id)
      return NextResponse.json({ error: "Scheduled post not found" }, { status: 404 })
    }

    console.log("PUT /api/scheduled-posts/[id] - Updated post:", post)

    return NextResponse.json(post)
  } catch (error) {
    console.error("PUT /api/scheduled-posts/[id] - Error:", error)
    return NextResponse.json(
      { error: "Failed to update scheduled post", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("DELETE /api/scheduled-posts/[id] - Starting request for post:", params.id)

    const success = await db.deleteScheduledPost(params.id)
    if (!success) {
      console.log("DELETE /api/scheduled-posts/[id] - Post not found:", params.id)
      return NextResponse.json({ error: "Scheduled post not found" }, { status: 404 })
    }

    console.log("DELETE /api/scheduled-posts/[id] - Deleted post:", params.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE /api/scheduled-posts/[id] - Error:", error)
    return NextResponse.json(
      { error: "Failed to delete scheduled post", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
