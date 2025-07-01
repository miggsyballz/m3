"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Copy, Wand2, Sparkles, CheckCircle } from "lucide-react"

export default function AIRewriterStandalone() {
  const [originalText, setOriginalText] = useState("")
  const [rewrittenText, setRewrittenText] = useState("")
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleRewrite = async () => {
    if (!originalText.trim()) return

    setLoading(true)
    try {
      const response = await fetch("/api/content/ai-rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: originalText,
          style: "engaging",
          platform: "general",
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setRewrittenText(data.rewrittenContent || "Unable to rewrite content at this time.")
      } else {
        setRewrittenText("Error: Unable to rewrite content. Please try again.")
      }
    } catch (error) {
      console.error("Error rewriting content:", error)
      setRewrittenText("Error: Unable to connect to AI service. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async () => {
    if (rewrittenText) {
      await navigator.clipboard.writeText(rewrittenText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Wand2 className="h-8 w-8 text-primary" />
            AI Content Rewriter
          </h1>
          <p className="text-muted-foreground">
            Transform your content with AI-powered rewriting for better engagement
          </p>
        </div>
        <Badge variant="secondary" className="flex items-center gap-1">
          <Sparkles className="h-3 w-3" />
          AI Powered
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle>Original Content</CardTitle>
            <CardDescription>Paste your content here to rewrite it with AI</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Enter your content here..."
              value={originalText}
              onChange={(e) => setOriginalText(e.target.value)}
              className="min-h-[200px] resize-none"
            />
            <Button onClick={handleRewrite} disabled={!originalText.trim() || loading} className="w-full">
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Rewriting...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Rewrite Content
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card>
          <CardHeader>
            <CardTitle>AI Rewritten Content</CardTitle>
            <CardDescription>Your content optimized for better engagement</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="min-h-[200px] p-3 border rounded-md bg-muted/50">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-sm text-muted-foreground">AI is rewriting your content...</p>
                  </div>
                </div>
              ) : rewrittenText ? (
                <p className="whitespace-pre-wrap text-sm">{rewrittenText}</p>
              ) : (
                <p className="text-muted-foreground text-sm">Rewritten content will appear here...</p>
              )}
            </div>
            <Button
              onClick={copyToClipboard}
              disabled={!rewrittenText}
              variant="outline"
              className="w-full bg-transparent"
            >
              {copied ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy to Clipboard
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Tips Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">💡 Rewriting Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium mb-2">Best Practices:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Keep original meaning intact</li>
                <li>• Improve clarity and flow</li>
                <li>• Optimize for your target audience</li>
                <li>• Maintain brand voice consistency</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Use Cases:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Social media captions</li>
                <li>• Email marketing content</li>
                <li>• Blog post excerpts</li>
                <li>• Product descriptions</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Named export for compatibility
export { AIRewriterStandalone }
export const AiRewriterStandalone = AIRewriterStandalone
