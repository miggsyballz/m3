import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { id } = params

    const updatedPost = await db?.updateScheduledPost(id, body)

    if (!updatedPost) {
      return NextResponse.json({ error: "Scheduled post not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      post: updatedPost,
    })
  } catch (error) {
    console.error("[PUT /api/scheduled-posts/[id]]", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update scheduled post",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // First check if post exists
    const existingPost = await db?.getScheduledPosts()
    const postExists = existingPost?.find((p) => p.id === id)

    if (!postExists) {
      return NextResponse.json({ error: "Scheduled post not found" }, { status: 404 })
    }

    // Delete the post (you'll need to implement this method in your database class)
    const success = await db?.updateScheduledPost(id, { status: "deleted" })

    return NextResponse.json({
      success: true,
      message: "Scheduled post deleted successfully",
    })
  } catch (error) {
    console.error("[DELETE /api/scheduled-posts/[id]]", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete scheduled post",
      },
      { status: 500 },
    )
  }
}
