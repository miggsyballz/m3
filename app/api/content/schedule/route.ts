export const runtime = "nodejs"
import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import path from "path"
import { db } from "@/lib/database"

/**
 * POST /api/content/schedule
 * Generate 30-day schedule (like your build_schedule function)
 */
export async function POST(request: NextRequest) {
  try {
    const {
      captions,
      clientId,
      campaignId,
      startDate,
      platforms = ["Instagram"],
      frequency = "daily",
    } = await request.json()

    if (!captions || !Array.isArray(captions) || !clientId) {
      return NextResponse.json({ error: "Captions array and clientId are required" }, { status: 400 })
    }

    // Get client info
    const client = await db.getClientById(clientId)
    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 })
    }

    const schedule: any[] = []
    const start = new Date(startDate || Date.now())

    // Generate schedule (mimicking your Python logic)
    for (let i = 0; i < captions.length && i < 30; i++) {
      const postDate = new Date(start)

      if (frequency === "daily") {
        postDate.setDate(start.getDate() + i)
      } else if (frequency === "every-other-day") {
        postDate.setDate(start.getDate() + i * 2)
      }

      for (const platform of platforms) {
        const scheduledPost = {
          campaign_id: campaignId,
          client_id: clientId,
          platform: platform.toLowerCase(),
          content: captions[i],
          media_urls: [`media_${i + 1}.jpg`], // Placeholder for now
          hashtags: extractHashtags(captions[i]),
          scheduled_time: postDate.toISOString(),
          status: "draft" as const,
        }

        // Save to database
        const savedPost = await db.createScheduledPost(scheduledPost)
        schedule.push({
          ...savedPost,
          date: postDate.toISOString().split("T")[0],
          time: "10:00 AM", // Default time
        })
      }
    }

    // Save CSV file (like your Python function)
    const csvContent = generateCSV(schedule)
    const baseDir = process.env.M3_BASE_DIR || "/tmp/m3-content"
    const clientDir = path.join(baseDir, "clients", client.client_name.replace(/\s+/g, "_"))

    if (!existsSync(clientDir)) {
      await mkdir(clientDir, { recursive: true })
    }

    const csvPath = path.join(clientDir, `schedule_${Date.now()}.csv`)
    await writeFile(csvPath, csvContent)

    return NextResponse.json({
      success: true,
      schedule,
      csvPath,
      message: `Generated ${schedule.length} scheduled posts for ${client.client_name}`,
    })
  } catch (error) {
    console.error("[POST /api/content/schedule]", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate schedule" },
      { status: 500 },
    )
  }
}

function extractHashtags(text: string): string[] {
  const hashtags = text.match(/#\w+/g) || []
  return hashtags.map((tag) => tag.toLowerCase())
}

function generateCSV(schedule: any[]): string {
  const headers = ["Date", "Platform", "Type", "Caption", "Media_File", "Status"]
  const rows = schedule.map((item) => [
    item.date,
    item.platform,
    "Post",
    `"${item.content.replace(/"/g, '""')}"`, // Escape quotes
    item.media_urls[0] || "",
    item.status,
  ])

  return [headers, ...rows].map((row) => row.join(",")).join("\n")
}
