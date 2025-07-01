import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const postId = params.id
    console.log("GET /api/scheduled-posts/[id] - postId:", postId)

    const posts = await db.getScheduledPosts()
    const post = posts.find((p) => p.id === postId)

    if (!post) {
      return NextResponse.json({ error: "Scheduled post not found" }, { status: 404 })
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error("[GET /api/scheduled-posts/[id]] Error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch scheduled post",
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const postId = params.id
    const body = await request.json()
    console.log("PUT /api/scheduled-posts/[id] - postId:", postId, "body:", body)

    const updatedPost = await db.updateScheduledPost(postId, body)

    if (!updatedPost) {
      return NextResponse.json({ error: "Scheduled post not found" }, { status: 404 })
    }

    console.log("Scheduled post updated:", updatedPost)
    return NextResponse.json(updatedPost)
  } catch (error) {
    console.error("[PUT /api/scheduled-posts/[id]] Error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to update scheduled post",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const postId = params.id
    console.log("DELETE /api/scheduled-posts/[id] - postId:", postId)

    const success = await db.deleteScheduledPost(postId)

    if (!success) {
      return NextResponse.json({ error: "Scheduled post not found" }, { status: 404 })
    }

    console.log("Scheduled post deleted successfully")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[DELETE /api/scheduled-posts/[id]] Error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to delete scheduled post",
      },
      { status: 500 },
    )
  }
}
