import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!db) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const postId = params.id

    if (!postId) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 })
    }

    const post = await db.getScheduledPostById(postId)

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error("Error fetching scheduled post:", error)
    return NextResponse.json({ error: "Failed to fetch scheduled post" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!db) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const postId = params.id
    const body = await request.json()

    if (!postId) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 })
    }

    const updatedPost = await db.updateScheduledPost(postId, body)

    if (!updatedPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    return NextResponse.json(updatedPost)
  } catch (error) {
    console.error("Error updating scheduled post:", error)
    return NextResponse.json({ error: "Failed to update scheduled post" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!db) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const postId = params.id

    if (!postId) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 })
    }

    const success = await db.deleteScheduledPost(postId)

    if (!success) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Post deleted successfully" })
  } catch (error) {
    console.error("Error deleting scheduled post:", error)
    return NextResponse.json({ error: "Failed to delete scheduled post" }, { status: 500 })
  }
}
