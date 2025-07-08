import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"

export async function GET() {
  try {
    if (!db) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const posts = await db.getScheduledPosts()
    return NextResponse.json(posts)
  } catch (error) {
    console.error("Error fetching scheduled posts:", error)
    return NextResponse.json({ error: "Failed to fetch scheduled posts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const body = await request.json()
    const post = await db.createScheduledPost(body)
    return NextResponse.json(post)
  } catch (error) {
    console.error("Error creating scheduled post:", error)
    return NextResponse.json({ error: "Failed to create scheduled post" }, { status: 500 })
  }
}
