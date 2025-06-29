"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Wand2, Copy, RefreshCw, Sparkles, Target, Volume2 } from "lucide-react"

export function AIRewriter() {
  const [originalText, setOriginalText] = useState("")
  const [rewrittenText, setRewrittenText] = useState("")
  const [tone, setTone] = useState("")
  const [platform, setPlatform] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const tones = [
    { value: "professional", label: "Professional" },
    { value: "casual", label: "Casual" },
    { value: "energetic", label: "Energetic" },
    { value: "creative", label: "Creative" },
    { value: "inspirational", label: "Inspirational" },
    { value: "humorous", label: "Humorous" },
  ]

  const platforms = [
    { value: "instagram", label: "Instagram" },
    { value: "tiktok", label: "TikTok" },
    { value: "twitter", label: "Twitter" },
    { value: "facebook", label: "Facebook" },
    { value: "linkedin", label: "LinkedIn" },
    { value: "youtube", label: "YouTube" },
  ]

  const handleRewrite = async () => {
    if (!originalText.trim()) return

    setIsLoading(true)
    // Simulate AI processing
    setTimeout(() => {
      const sampleRewrite = `🎵 Just dropped another fire beat! This trap banger is perfect for your next project. The 808s hit different and the melody will have you vibing all day. 

Check it out on MaxxBeats.com and let me know what you think! 

#TrapBeats #ProducerLife #MaxxBeats #MusicProducer #BeatMaker #HipHop #StudioLife #NewMusic`

      setRewrittenText(sampleRewrite)
      setIsLoading(false)
    }, 2000)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const aiTools = [
    {
      name: "Caption Rewriter",
      description: "Transform your captions with AI-powered rewriting",
      icon: <Wand2 className="h-5 w-5" />,
      active: true,
    },
    {
      name: "Hashtag Generator",
      description: "Generate relevant hashtags for your content",
      icon: <Target className="h-5 w-5" />,
      active: false,
    },
    {
      name: "Tone Adjuster",
      description: "Adjust the tone and style of your posts",
      icon: <Volume2 className="h-5 w-5" />,
      active: false,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Content Tools</h1>
          <p className="text-muted-foreground">Enhance your content with AI-powered writing and optimization tools</p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          AI Powered
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">AI Tools</CardTitle>
              <CardDescription>Select an AI tool to get started</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {aiTools.map((tool) => (
                <div
                  key={tool.name}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    tool.active ? "bg-primary/10 border-primary" : "hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-md ${tool.active ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                    >
                      {tool.icon}
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">{tool.name}</h3>
                      <p className="text-xs text-muted-foreground">{tool.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="h-5 w-5" />
                Caption Rewriter (GPT)
              </CardTitle>
              <CardDescription>Transform your captions with AI to match your desired tone and platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tone</label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      {tones.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Platform</label>
                  <Select value={platform} onValueChange={setPlatform}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      {platforms.map((p) => (
                        <SelectItem key={p.value} value={p.value}>
                          {p.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Original Text</label>
                    <span className="text-xs text-muted-foreground">{originalText.length} characters</span>
                  </div>
                  <Textarea
                    placeholder="Paste your original caption here..."
                    value={originalText}
                    onChange={(e) => setOriginalText(e.target.value)}
                    rows={8}
                    className="resize-none"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">AI Rewritten</label>
                    <div className="flex gap-2">
                      {rewrittenText && (
                        <Button variant="outline" size="sm" onClick={() => copyToClipboard(rewrittenText)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      )}
                      <span className="text-xs text-muted-foreground">{rewrittenText.length} characters</span>
                    </div>
                  </div>
                  <Textarea
                    placeholder="AI rewritten text will appear here..."
                    value={rewrittenText}
                    readOnly
                    rows={8}
                    className="resize-none bg-muted/50"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleRewrite} disabled={!originalText.trim() || isLoading} className="flex-1">
                  {isLoading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Rewriting...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      Rewrite with AI
                    </>
                  )}
                </Button>
                {rewrittenText && (
                  <Button variant="outline" onClick={() => setRewrittenText("")}>
                    Clear
                  </Button>
                )}
              </div>

              {rewrittenText && (
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">Optimization Tips:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Added relevant emojis to increase engagement</li>
                    <li>• Optimized hashtags for music production niche</li>
                    <li>• Included call-to-action to drive traffic</li>
                    <li>• Adjusted tone to match {tone} style</li>
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
