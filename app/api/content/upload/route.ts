export const runtime = "nodejs"
import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import path from "path"
import { db } from "@/lib/database"

/**
 * POST /api/content/upload
 * Handle file uploads and save to client folders
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const clientId = formData.get("clientId") as string
    const contentType = (formData.get("contentType") as string) || "posts"

    if (!file || !clientId) {
      return NextResponse.json({ error: "File and clientId are required" }, { status: 400 })
    }

    // Get client info
    const client = await db.getClientById(clientId)
    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 })
    }

    // Create client directory structure (mimicking your Python setup)
    const baseDir = process.env.M3_BASE_DIR || "/tmp/m3-content"
    const clientDir = path.join(baseDir, "clients", client.client_name.replace(/\s+/g, "_"))
    const contentDir = path.join(clientDir, contentType)

    // Ensure directories exist
    if (!existsSync(contentDir)) {
      await mkdir(contentDir, { recursive: true })
    }

    // Save file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const fileName = `${Date.now()}_${file.name}`
    const filePath = path.join(contentDir, fileName)

    await writeFile(filePath, buffer)

    // Save to database
    const contentItem = await db.createContentItem({
      client_id: clientId,
      campaign_id: null,
      name: file.name,
      type: getContentType(file.type),
      file_path: filePath,
      file_size: file.size,
    })

    return NextResponse.json({
      success: true,
      contentItem,
      filePath: filePath,
      message: `File uploaded to ${client.client_name}/${contentType}/`,
    })
  } catch (error) {
    console.error("[POST /api/content/upload]", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Upload failed" }, { status: 500 })
  }
}

function getContentType(mimeType: string): "image" | "video" | "audio" | "document" {
  if (mimeType.startsWith("image/")) return "image"
  if (mimeType.startsWith("video/")) return "video"
  if (mimeType.startsWith("audio/")) return "audio"
  return "document"
}
