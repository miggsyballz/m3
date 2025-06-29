"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Hash, Copy, TrendingUp, Target, Zap, RefreshCw } from "lucide-react"

export function HashtagTools() {
  const [keyword, setKeyword] = useState("")
  const [generatedHashtags, setGeneratedHashtags] = useState<string[]>([])
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const trendingHashtags = [
    "#Marketing",
    "#BusinessGrowth",
    "#DigitalMarketing",
    "#Entrepreneur",
    "#SmallBusiness",
    "#SocialMedia",
    "#ContentMarketing",
    "#Branding",
    "#MarketingTips",
    "#BusinessStrategy",
    "#OnlineMarketing",
    "#MarketingAgency",
  ]

  const hashtagCategories = {
    "Business Growth": ["#BusinessGrowth", "#Entrepreneur", "#SmallBusiness", "#StartupLife", "#BusinessTips"],
    Marketing: ["#DigitalMarketing", "#ContentMarketing", "#SocialMedia", "#MarketingStrategy", "#OnlineMarketing"],
    Industry: ["#MarketingAgency", "#BusinessConsulting", "#ProfessionalServices", "#B2B", "#B2C"],
    Engagement: ["#MondayMotivation", "#TipTuesday", "#WisdomWednesday", "#ThrowbackThursday", "#FeatureFriday"],
  }

  const generateHashtags = async () => {
    if (!keyword.trim()) return

    setIsLoading(true)
    // Simulate AI hashtag generation
    setTimeout(() => {
      const sampleHashtags = [
        `#${keyword}`,
        `#${keyword}Marketing`,
        `#${keyword}Business`,
        `#${keyword}Strategy`,
        `#${keyword}Growth`,
        `#${keyword}Solutions`,
        "#Marketing",
        "#BusinessGrowth",
        "#DigitalMarketing",
        "#SmallBusiness",
        "#Entrepreneur",
        "#BusinessStrategy",
        "#MarketingTips",
        "#OnlineMarketing",
        "#ProfessionalServices",
        "#MarketingAgency",
        "#BusinessConsulting",
        "#ContentMarketing",
        "#SocialMediaMarketing",
        "#BrandStrategy",
        "#LeadGeneration",
        "#BusinessDevelopment",
      ]
      setGeneratedHashtags(sampleHashtags)
      setIsLoading(false)
    }, 1500)
  }

  const toggleHashtag = (hashtag: string) => {
    setSelectedHashtags((prev) => (prev.includes(hashtag) ? prev.filter((h) => h !== hashtag) : [...prev, hashtag]))
  }

  const copyHashtags = () => {
    const hashtagString = selectedHashtags.join(" ")
    navigator.clipboard.writeText(hashtagString)
  }

  const clearSelection = () => {
    setSelectedHashtags([])
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Hashtag Tools</h1>
          <p className="text-muted-foreground">Generate and optimize hashtags for maximum reach and engagement</p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <Hash className="h-4 w-4" />
          {selectedHashtags.length} Selected
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Hashtag Generator
              </CardTitle>
              <CardDescription>Generate relevant hashtags based on your content keywords</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter keyword (e.g., marketing, business, consulting)"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && generateHashtags()}
                />
                <Button onClick={generateHashtags} disabled={!keyword.trim() || isLoading}>
                  {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
                </Button>
              </div>

              {generatedHashtags.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium">Generated Hashtags</h4>
                  <div className="flex flex-wrap gap-2">
                    {generatedHashtags.map((hashtag) => (
                      <Badge
                        key={hashtag}
                        variant={selectedHashtags.includes(hashtag) ? "default" : "outline"}
                        className="cursor-pointer hover:bg-primary/80"
                        onClick={() => toggleHashtag(hashtag)}
                      >
                        {hashtag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Hashtag Categories
              </CardTitle>
              <CardDescription>Browse hashtags by category for targeted content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(hashtagCategories).map(([category, hashtags]) => (
                <div key={category} className="space-y-2">
                  <h4 className="font-medium text-sm">{category}</h4>
                  <div className="flex flex-wrap gap-2">
                    {hashtags.map((hashtag) => (
                      <Badge
                        key={hashtag}
                        variant={selectedHashtags.includes(hashtag) ? "default" : "outline"}
                        className="cursor-pointer hover:bg-primary/80"
                        onClick={() => toggleHashtag(hashtag)}
                      >
                        {hashtag}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Trending Now
              </CardTitle>
              <CardDescription>Popular hashtags in business and marketing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {trendingHashtags.map((hashtag) => (
                  <Badge
                    key={hashtag}
                    variant={selectedHashtags.includes(hashtag) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/80"
                    onClick={() => toggleHashtag(hashtag)}
                  >
                    {hashtag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Selected Hashtags</CardTitle>
              <CardDescription>{selectedHashtags.length}/30 hashtags selected</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={selectedHashtags.join(" ")}
                readOnly
                rows={6}
                className="resize-none bg-muted/50"
                placeholder="Selected hashtags will appear here..."
              />
              <div className="flex gap-2">
                <Button onClick={copyHashtags} disabled={selectedHashtags.length === 0} className="flex-1">
                  <Copy className="mr-2 h-4 w-4" />
                  Copy
                </Button>
                <Button variant="outline" onClick={clearSelection} disabled={selectedHashtags.length === 0}>
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hashtag Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• Use 5-10 hashtags for Instagram posts</p>
              <p>• Mix popular and niche hashtags</p>
              <p>• Research hashtag performance regularly</p>
              <p>• Create branded hashtags for campaigns</p>
              <p>• Avoid banned or shadowbanned hashtags</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
