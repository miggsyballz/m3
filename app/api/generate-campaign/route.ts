import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(req: Request) {
  try {
    const { prompt, client } = await req.json()

    if (!prompt) {
      return NextResponse.json({ error: "No prompt provided" }, { status: 400 })
    }

    // Enhanced prompt based on client type
    const systemPrompt = `You are an expert social media marketing strategist specializing in the music production and content creation industry.

Client Context: ${client || "Music Producer/Content Creator"}

Your task is to create a comprehensive campaign strategy that includes:

1. TARGET AUDIENCE: Detailed demographics, interests, and behaviors
2. HEADLINE: Compelling, attention-grabbing headline
3. COPY: Persuasive marketing copy (2-3 sentences)
4. CTA BUTTON TEXT: Effective call-to-action button text
5. VISUAL THEME: Specific visual style, colors, and imagery recommendations

Make it specific to the music production/beat-making industry. Focus on:
- Music producers, beatmakers, artists
- Studio equipment, production tools
- Beat sales, music courses, plugins
- Modern, professional aesthetic

Be creative, actionable, and industry-specific.

Format your response as structured sections with clear headings.`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: `Campaign Idea: ${prompt}`,
        },
      ],
      temperature: 0.8,
    })

    return NextResponse.json({ result: text })
  } catch (error) {
    console.error("Campaign generation error:", error)
    return NextResponse.json({ error: "Failed to generate campaign strategy" }, { status: 500 })
  }
}
