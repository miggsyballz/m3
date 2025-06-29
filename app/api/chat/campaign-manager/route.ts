export const runtime = "nodejs"
import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

/**
 * POST /api/chat/campaign-manager
 * Campaign Manager AI Chat Assistant
 */
export async function POST(request: NextRequest) {
  try {
    const { message, context, activeTab, selectedClient, messageHistory } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Build conversation history for context
    const conversationHistory =
      messageHistory?.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })) || []

    // System prompt for Campaign Manager
    const systemPrompt = `You are an expert Campaign Manager AI assistant for M3 (Mig Marketing Machine), a social media marketing platform. You help with:

🎯 Campaign Strategy & Planning
📱 Social Media Platform Optimization  
✍️ Content Creation & Copywriting
📊 Analytics & Performance Insights
🎨 Creative Direction & Branding
📅 Content Scheduling & Management
💡 Marketing Trends & Best Practices

Current Context:
- Active Tab: ${activeTab}
- Selected Client: ${selectedClient || "None"}

Guidelines:
- Provide actionable, specific advice
- Reference current context when relevant
- Keep responses concise but comprehensive
- Use emojis sparingly for clarity
- Focus on practical marketing solutions
- Consider platform-specific best practices

Be helpful, professional, and results-oriented.`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      messages: [...conversationHistory, { role: "user", content: message }],
      maxTokens: 500, // Keep responses reasonably sized
    })

    return NextResponse.json({
      response: text.trim(),
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[POST /api/chat/campaign-manager]", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to process chat message" },
      { status: 500 },
    )
  }
}
