export const runtime = "nodejs"
import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

/**
 * POST /api/content/ai-rewrite
 * Rewrite captions using AI (matching your Python rewrite_caption function)
 */
export async function POST(request: NextRequest) {
  try {
    const { captions, tone = "Friendly", platform = "Instagram" } = await request.json()

    if (!captions || !Array.isArray(captions)) {
      return NextResponse.json({ error: "Captions array is required" }, { status: 400 })
    }

    const rewrittenCaptions: string[] = []
    const errors: string[] = []

    // Process each caption with AI (matching your Python function exactly)
    for (let i = 0; i < captions.length; i++) {
      const caption = captions[i]
      try {
        // Exact instruction from your Python function
        const instruction = 
          `You are a social media marketing assistant. Rewrite the following caption ` +
          `to match the tone and format of a high-converting ${platform} post. Use a ${tone.toLowerCase()} voice. ` +
          `Include relevant hashtags if helpful. Keep it under 200 words.\n\n`

        const fullPrompt = instruction + caption

        const { text } = await generateText({
          model: openai("gpt-4o"), // Using GPT-4o (latest version)
          messages: [
            { role: "system", content: "You are a helpful social media assistant." },
            { role: "user", content: fullPrompt }
          ],
        })

        rewrittenCaptions.push(text.trim())
      } catch (error) {
        console.error(`Error rewriting caption ${i + 1}:`, error)
        const errorMessage = `[Error rewriting caption: ${error instanceof Error ? error.message : 'Unknown error'}]`
        rewrittenCaptions.push(errorMessage)
        errors.push(`Caption ${i + 1}: ${errorMessage}`)
      }
    }

    return NextResponse.json({
      success: true,
      originalCount: captions.length,
      rewrittenCaptions,
      errors: errors.length > 0 ? errors : undefined,
      settings: {
        platform,
        tone,
        model: "gpt-4o"
      },
      message: `Successfully processed ${captions.length} captions (${rewrittenCaptions.length - errors.length} successful, ${errors.length} errors)`,
    })
  } catch (error) {
    console.error("[POST /api/content/ai-rewrite]", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to rewrite captions" },
      { status: 500 },
    )
  }
}
