"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Wand2, Copy, RefreshCw, Sparkles, CheckCircle, AlertCircle } from "lucide-react"

export function AIRewriterStandalone() {
  const [originalText, setOriginalText] = useState("")
  const [rewrittenText, setRewrittenText] = useState("")
  const [tone, setTone] = useState("Friendly")
  const [platform, setPlatform] = useState("Instagram")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const tones = [
    { value: "Friendly", label: "Friendly" },
    { value: "Professional", label: "Professional" },
    { value: "Casual", label: "Casual" },
    { value: "Energetic", label: "Energetic" },
    { value: "Creative", label: "Creative" },
    { value: "Inspirational", label: "Inspirational" },
    { value: "Humorous", label: "Humorous" },
    { value: "Authoritative", label: "Authoritative" },
  ]

  const platforms = [
    { value: "Instagram", label: "Instagram" },
    { value: "TikTok", label: "TikTok" },
    { value: "Twitter", label: "Twitter" },
    { value: "Facebook", label: "Facebook" },
    { value: "LinkedIn", label: "LinkedIn" },
    { value: "YouTube", label: "YouTube" },
  ]

  const handleRewrite = async () => {
    if (!originalText.trim()) {
      setError("Please enter some text to rewrite")
      return
    }

    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/content/ai-rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          captions: [originalText.trim()],
          tone,
          platform,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        if (result.rewrittenCaptions && result.rewrittenCaptions.length > 0) {
          setRewrittenText(result.rewrittenCaptions[0])
          setSuccess("Caption rewritten successfully!")
        } else {
          setError("No rewritten content received")
        }
      } else {
        const errorData = await response.json()
        if (errorData.needsSetup) {
          setError("⚙️ OpenAI API key not configured. Please add it in Settings → API Keys tab.")
        } else {
          setError(errorData.error || "Failed to rewrite caption")
        }
      }
    } catch (error) {
      console.error("Rewrite error:", error)
      setError("Failed to connect to AI service")
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setSuccess("Copied to clipboard!")
    setTimeout(() => setSuccess(""), 2000)
  }

  const clearAll = () => {
    setOriginalText("")
    setRewrittenText("")
    setError("")
    setSuccess("")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Caption Rewriter</h1>
          <p className="text-muted-foreground">Transform your captions with AI-powered rewriting</p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          GPT-4 Powered
        </Badge>
      </div>

      {success && (
        <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800 dark:text-green-200">{success}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800 dark:text-red-200">{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Settings</CardTitle>
              <CardDescription>Configure AI rewriting parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tone">Tone</Label>
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
                <Label htmlFor="platform">Platform</Label>
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

              <div className="p-3 bg-muted rounded-lg text-sm">
                <p className="font-medium mb-1">Current Settings:</p>
                <p>Platform: {platform}</p>
                <p>Tone: {tone}</p>
                <p>Model: GPT-4</p>
                <p>Max Length: 200 words</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="h-5 w-5" />
                Caption Rewriter
              </CardTitle>
              <CardDescription>Enter your original caption and get an AI-powered rewrite</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="original">Original Text</Label>
                    <span className="text-xs text-muted-foreground">{originalText.length} characters</span>
                  </div>
                  <Textarea
                    id="original"
                    placeholder="Enter your original caption here..."
                    value={originalText}
                    onChange={(e) => setOriginalText(e.target.value)}
                    rows={8}
                    className="resize-none"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="rewritten">AI Rewritten</Label>
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
                    id="rewritten"
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
                <Button variant="outline" onClick={clearAll}>
                  Clear
                </Button>
              </div>

              {rewrittenText && (
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">AI Analysis:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Maintained original content context and meaning</li>
                    <li>• Optimized for {platform} platform format</li>
                    <li>• Applied {tone.toLowerCase()} tone throughout</li>
                    <li>• Added relevant hashtags and engagement elements</li>
                    <li>• Kept under 200 words as requested</li>
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
