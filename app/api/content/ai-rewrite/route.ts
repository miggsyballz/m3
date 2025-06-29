export const runtime = "nodejs"
import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

/**
 * POST /api/content/ai-rewrite
 * Rewrite captions using AI (like your rewrite_caption function)
 */
export async function POST(request: NextRequest) {
  try {
    const { captions, tone = "engaging", platform = "instagram" } = await request.json()

    if (!captions || !Array.isArray(captions)) {
      return NextResponse.json({ error: "Captions array is required" }, { status: 400 })
    }

    const rewrittenCaptions: string[] = []

    // Process each caption with AI (mimicking your OpenAI integration)
    for (const caption of captions) {
      try {
        const { text } = await generateText({
          model: openai("gpt-4o"),
          system: `You are a social media marketer. Rewrite the post to be ${tone} and concise for ${platform}. Keep the core message but make it more engaging. Add relevant emojis and hashtags if appropriate.`,
          prompt: caption,
        })

        rewrittenCaptions.push(text.trim())
      } catch (error) {
        console.error("Error rewriting caption:", error)
        rewrittenCaptions.push(`[Error rewriting caption: ${error}]`)
      }
    }

    return NextResponse.json({
      success: true,
      originalCount: captions.length,
      rewrittenCaptions,
      message: `Successfully rewrote ${rewrittenCaptions.length} captions`,
    })
  } catch (error) {
    console.error("[POST /api/content/ai-rewrite]", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to rewrite captions" },
      { status: 500 },
    )
  }
}
