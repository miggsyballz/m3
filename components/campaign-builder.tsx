"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Plus, X, Calendar, Target, Zap } from "lucide-react"

interface CampaignBuilderProps {
  selectedClient: string | null
}

export function CampaignBuilder({ selectedClient }: CampaignBuilderProps) {
  const [campaignName, setCampaignName] = useState("")
  const [campaignType, setCampaignType] = useState("")
  const [platforms, setPlatforms] = useState<string[]>([])
  const [hashtags, setHashtags] = useState<string[]>([])
  const [newHashtag, setNewHashtag] = useState("")

  const platformOptions = ["Instagram", "TikTok", "Twitter", "Facebook", "LinkedIn", "YouTube"]
  const campaignTypes = [
    "Product Launch",
    "Brand Awareness",
    "Lead Generation",
    "Educational",
    "Promotional",
    "Event Marketing",
  ]

  const togglePlatform = (platform: string) => {
    setPlatforms((prev) => (prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]))
  }

  const addHashtag = () => {
    if (newHashtag && !hashtags.includes(newHashtag)) {
      setHashtags([...hashtags, newHashtag])
      setNewHashtag("")
    }
  }

  const removeHashtag = (hashtag: string) => {
    setHashtags(hashtags.filter((h) => h !== hashtag))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Campaign Builder</h1>
          <p className="text-muted-foreground">
            Create and configure new marketing campaigns
            {selectedClient && ` for ${selectedClient}`}
          </p>
        </div>
        <Button>
          <Zap className="mr-2 h-4 w-4" />
          Launch Campaign
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Campaign Details
            </CardTitle>
            <CardDescription>Basic information about your campaign</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="campaign-name">Campaign Name</Label>
              <Input
                id="campaign-name"
                placeholder="e.g., Q1 Product Launch"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="campaign-type">Campaign Type</Label>
              <Select value={campaignType} onValueChange={setCampaignType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select campaign type" />
                </SelectTrigger>
                <SelectContent>
                  {campaignTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="campaign-description">Description</Label>
              <Textarea
                id="campaign-description"
                placeholder="Describe your campaign goals and content strategy..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="client-select">Client</Label>
              <Select defaultValue={selectedClient || ""}>
                <SelectTrigger>
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mig Media">Mig Media</SelectItem>
                  <SelectItem value="Tech Startup">Tech Startup</SelectItem>
                  <SelectItem value="Local Business">Local Business</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Platform & Targeting
            </CardTitle>
            <CardDescription>Choose platforms and configure targeting</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label>Target Platforms</Label>
              <div className="grid grid-cols-2 gap-2">
                {platformOptions.map((platform) => (
                  <div key={platform} className="flex items-center space-x-2">
                    <Checkbox
                      id={platform}
                      checked={platforms.includes(platform)}
                      onCheckedChange={() => togglePlatform(platform)}
                    />
                    <Label htmlFor={platform} className="text-sm">
                      {platform}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Campaign Hashtags</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add hashtag..."
                  value={newHashtag}
                  onChange={(e) => setNewHashtag(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addHashtag()}
                />
                <Button onClick={addHashtag} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {hashtags.map((hashtag) => (
                  <Badge key={hashtag} variant="secondary" className="flex items-center gap-1">
                    #{hashtag}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeHashtag(hashtag)} />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input type="date" id="start-date" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <Input type="date" id="end-date" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Campaign Preview</CardTitle>
          <CardDescription>Review your campaign configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <h4 className="font-medium mb-2">Campaign Info</h4>
              <p className="text-sm text-muted-foreground">{campaignName || "Untitled Campaign"}</p>
              <p className="text-sm text-muted-foreground">{campaignType || "No type selected"}</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Platforms ({platforms.length})</h4>
              <div className="flex flex-wrap gap-1">
                {platforms.map((platform) => (
                  <Badge key={platform} variant="outline" className="text-xs">
                    {platform}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Hashtags ({hashtags.length})</h4>
              <div className="flex flex-wrap gap-1">
                {hashtags.slice(0, 3).map((hashtag) => (
                  <Badge key={hashtag} variant="outline" className="text-xs">
                    #{hashtag}
                  </Badge>
                ))}
                {hashtags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{hashtags.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
