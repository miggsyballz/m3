"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Target, MessageSquare, MousePointer, Palette, Loader2, Copy, CheckCircle } from "lucide-react"

interface CampaignStrategy {
  targetAudience: string
  suggestedHeadline: string
  suggestedCopy: string
  ctaButtonText: string
  visualTheme: string
}

interface CampaignAssistantProps {
  selectedClient?: string | null
}

export function CampaignAssistant({ selectedClient }: CampaignAssistantProps) {
  const [campaignIdea, setCampaignIdea] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [strategy, setStrategy] = useState<CampaignStrategy | null>(null)
  const [rawOutput, setRawOutput] = useState("")
  const [copied, setCopied] = useState<string | null>(null)

  const generateStrategy = async () => {
    if (!campaignIdea.trim()) return

    setIsGenerating(true)
    setStrategy(null)
    setRawOutput("")

    try {
      const response = await fetch("/api/generate-campaign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: campaignIdea,
          client: selectedClient || "MaxxBeats",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate strategy")
      }

      const data = await response.json()
      setRawOutput(data.result)

      // Parse the structured response into strategy object
      const parsedStrategy = parseStrategyFromText(data.result)
      setStrategy(parsedStrategy)
    } catch (error) {
      console.error("Error generating strategy:", error)
      // Fallback to demo data
      setStrategy({
        targetAudience:
          "Music producers, beatmakers, and independent artists aged 18-35 who are actively creating music and looking for high-quality instrumentals and production tools.",
        suggestedHeadline: "🔥 Elevate Your Sound with Premium Beats",
        suggestedCopy:
          "Transform your music with professional-grade instrumentals crafted by industry experts. From trap to R&B, find the perfect beat to match your vision. Plus, get exclusive access to production courses and plugins that will take your skills to the next level.",
        ctaButtonText: "Browse Beats Now",
        visualTheme:
          "Dark, modern aesthetic with neon accents. Feature studio equipment, waveforms, and music production setups. Use vibrant colors like electric blue and purple against dark backgrounds to convey premium quality and creativity.",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const parseStrategyFromText = (text: string): CampaignStrategy => {
    const sections = text.split(/\n\n+/)

    const findSection = (keywords: string[]) => {
      const section = sections.find((s) => keywords.some((keyword) => s.toLowerCase().includes(keyword.toLowerCase())))
      return section ? section.replace(/^[^:]*:?\s*/, "").trim() : ""
    }

    return {
      targetAudience:
        findSection(["target audience", "audience", "demographics"]) ||
        "Music producers and content creators looking for high-quality beats and production tools.",
      suggestedHeadline: findSection(["headline", "title", "header"]) || "🎵 Premium Beats for Serious Producers",
      suggestedCopy:
        findSection(["copy", "description", "content"]) ||
        "Discover professional-grade instrumentals that will elevate your music production to the next level.",
      ctaButtonText: findSection(["cta", "call to action", "button"]) || "Get Started",
      visualTheme:
        findSection(["visual", "theme", "design", "imagery"]) ||
        "Modern, dark aesthetic with vibrant accent colors and studio equipment imagery.",
    }
  }

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      setTimeout(() => setCopied(null), 2000)
    } catch (error) {
      console.error("Failed to copy text:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold flex items-center justify-center gap-2 mb-2">
          <Sparkles className="h-8 w-8 text-purple-500" />
          Campaign Assistant
        </h2>
        <p className="text-muted-foreground">
          Describe your campaign idea and let AI create a comprehensive marketing strategy
        </p>
      </div>

      <Card className="border-2 border-dashed border-purple-200 hover:border-purple-300 transition-colors">
        <CardContent className="p-6">
          <div className="space-y-4">
            <Textarea
              placeholder="Describe your campaign idea… (e.g., 'Launch new beat pack for hip-hop producers', 'Promote music production course', 'Build awareness for custom beat services')"
              value={campaignIdea}
              onChange={(e) => setCampaignIdea(e.target.value)}
              className="min-h-[120px] text-base"
            />
            <Button
              onClick={generateStrategy}
              disabled={!campaignIdea.trim() || isGenerating}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating Strategy...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Strategy
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {strategy && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg justify-between">
                <span className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  Target Audience
                </span>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(strategy.targetAudience, "audience")}>
                  {copied === "audience" ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">{strategy.targetAudience}</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg justify-between">
                <span className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-green-500" />
                  Suggested Headline
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(strategy.suggestedHeadline, "headline")}
                >
                  {copied === "headline" ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-semibold text-lg mb-2">{strategy.suggestedHeadline}</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-purple-500">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg justify-between">
                <span className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-purple-500" />
                  Suggested Copy
                </span>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(strategy.suggestedCopy, "copy")}>
                  {copied === "copy" ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">{strategy.suggestedCopy}</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-orange-500">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg justify-between">
                <span className="flex items-center gap-2">
                  <MousePointer className="h-5 w-5 text-orange-500" />
                  CTA Button Text
                </span>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(strategy.ctaButtonText, "cta")}>
                  {copied === "cta" ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge
                variant="outline"
                className="text-base px-4 py-2 font-semibold bg-orange-50 border-orange-200 text-orange-700"
              >
                {strategy.ctaButtonText}
              </Badge>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-pink-500 md:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg justify-between">
                <span className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-pink-500" />
                  Visual Theme
                </span>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(strategy.visualTheme, "visual")}>
                  {copied === "visual" ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">{strategy.visualTheme}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {rawOutput && (
        <Card className="bg-gray-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 justify-between">
              <span>Full AI Response</span>
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(rawOutput, "full")}>
                {copied === "full" ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy All
                  </>
                )}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm whitespace-pre-wrap text-muted-foreground">{rawOutput}</pre>
          </CardContent>
        </Card>
      )}

      {selectedClient && (
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardContent className="p-4">
            <p className="text-sm text-center text-muted-foreground">
              💡 <strong>Tip:</strong> This strategy is tailored for <Badge variant="outline">{selectedClient}</Badge>.
              Switch clients to get personalized recommendations for different brands.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default CampaignAssistant
