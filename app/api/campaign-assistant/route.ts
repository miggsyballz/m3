import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { campaignIdea, client } = await request.json()

    if (!campaignIdea) {
      return NextResponse.json({ error: "Campaign idea is required" }, { status: 400 })
    }

    const prompt = `You are an expert marketing strategist helping create a campaign strategy for ${client || "a music producer/content creator"}.

Campaign Idea: "${campaignIdea}"

Create a comprehensive marketing strategy with the following components:

1. Target Audience: Describe the ideal customer demographics, interests, and behaviors
2. Suggested Headline: Create a compelling, attention-grabbing headline
3. Suggested Copy: Write persuasive marketing copy (2-3 sentences)
4. CTA Button Text: Suggest effective call-to-action button text
5. Visual Theme: Describe the visual style, colors, and imagery recommendations

Make it specific to the music production/content creation industry. Be creative and actionable.

Respond in JSON format:
{
  "targetAudience": "...",
  "suggestedHeadline": "...",
  "suggestedCopy": "...",
  "ctaButtonText": "...",
  "visualTheme": "..."
}`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      temperature: 0.7,
    })

    // Parse the JSON response
    const strategy = JSON.parse(text)

    return NextResponse.json({ strategy })
  } catch (error) {
    console.error("Campaign Assistant Error:", error)
    return NextResponse.json({ error: "Failed to generate campaign strategy" }, { status: 500 })
  }
}
