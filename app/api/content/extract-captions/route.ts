export const runtime = "nodejs"
import { type NextRequest, NextResponse } from "next/server"
import { readFile } from "fs/promises"

/**
 * POST /api/content/extract-captions
 * Extract captions from Instagram JSON export (like your Python function)
 */
export async function POST(request: NextRequest) {
  try {
    const { filePath } = await request.json()

    if (!filePath) {
      return NextResponse.json({ error: "File path is required" }, { status: 400 })
    }

    // Read and parse JSON file
    const fileContent = await readFile(filePath, "utf-8")
    const data = JSON.parse(fileContent)

    // Extract captions (mimicking your extract_captions_from_json function)
    const captions: string[] = []

    if (Array.isArray(data)) {
      for (const item of data) {
        if (item.string_list_data && Array.isArray(item.string_list_data)) {
          const caption = item.string_list_data[0]?.value || ""
          if (caption.trim()) {
            captions.push(caption.trim())
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      captions,
      count: captions.length,
      message: `Extracted ${captions.length} captions from JSON`,
    })
  } catch (error) {
    console.error("[POST /api/content/extract-captions]", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to extract captions" },
      { status: 500 },
    )
  }
}
