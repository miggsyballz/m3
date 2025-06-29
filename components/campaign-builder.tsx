"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, X, Calendar, Target, Zap, CheckCircle, AlertCircle, Save } from "lucide-react"

interface CampaignBuilderProps {
  selectedClient: string | null
}

interface Client {
  id: string
  client_name: string
  contact_email: string
}

export function CampaignBuilder({ selectedClient }: CampaignBuilderProps) {
  const [clients, setClients] = useState<Client[]>([])
  const [campaignName, setCampaignName] = useState("")
  const [campaignType, setCampaignType] = useState("")
  const [selectedClientId, setSelectedClientId] = useState("")
  const [platforms, setPlatforms] = useState<string[]>([])
  const [hashtags, setHashtags] = useState<string[]>([])
  const [newHashtag, setNewHashtag] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const platformOptions = ["Instagram", "TikTok", "Twitter", "Facebook", "LinkedIn", "YouTube"]
  const campaignTypes = [
    "Product Launch",
    "Brand Awareness",
    "Lead Generation",
    "Educational",
    "Promotional",
    "Event Marketing",
    "Content Series",
    "Holiday Campaign",
  ]

  useEffect(() => {
    loadClients()
  }, [])

  useEffect(() => {
    // Auto-select client if one is selected in sidebar
    if (selectedClient && clients.length > 0) {
      const client = clients.find((c) => c.client_name === selectedClient)
      if (client) {
        setSelectedClientId(client.id)
      }
    }
  }, [selectedClient, clients])

  const loadClients = async () => {
    try {
      const response = await fetch("/api/clients")
      const data = await response.json()
      const clientList = Array.isArray(data) ? data : data.clients || []
      setClients(clientList)
    } catch (error) {
      console.error("Error loading clients:", error)
    }
  }

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

  const validateForm = (): string | null => {
    if (!campaignName.trim()) return "Campaign name is required"
    if (!campaignType) return "Campaign type is required"
    if (!selectedClientId) return "Client selection is required"
    if (platforms.length === 0) return "At least one platform must be selected"
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      return "End date must be after start date"
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      const campaignData = {
        client_id: selectedClientId,
        name: campaignName,
        type: campaignType,
        platforms: platforms,
        hashtags: hashtags,
        start_date: startDate || null,
        end_date: endDate || null,
        status: "draft",
        description: description || null,
      }

      const response = await fetch("/api/campaigns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(campaignData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create campaign")
      }

      const newCampaign = await response.json()
      console.log("Campaign created successfully:", newCampaign)

      // Reset form
      setCampaignName("")
      setCampaignType("")
      setPlatforms([])
      setHashtags([])
      setStartDate("")
      setEndDate("")
      setDescription("")
      setNewHashtag("")

      setSuccess(true)
      setTimeout(() => setSuccess(false), 5000)
    } catch (error) {
      console.error("Error creating campaign:", error)
      setError(error instanceof Error ? error.message : "Failed to create campaign")
    } finally {
      setLoading(false)
    }
  }

  const getSelectedClient = () => {
    return clients.find((c) => c.id === selectedClientId)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Campaign Builder</h1>
          <p className="text-muted-foreground">
            Create and configure new marketing campaigns with real database integration
            {selectedClient && ` for ${selectedClient}`}
          </p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <Target className="h-4 w-4" />
          Real Campaign Creation
        </Badge>
      </div>

      {success && (
        <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800 dark:text-green-200">
            Campaign created successfully and saved to Neon database!
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800 dark:text-red-200">{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
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
                <Label htmlFor="campaign-name">Campaign Name *</Label>
                <Input
                  id="campaign-name"
                  placeholder="e.g., Q1 Product Launch"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="campaign-type">Campaign Type *</Label>
                <Select value={campaignType} onValueChange={setCampaignType} required>
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
                <Label htmlFor="client-select">Client *</Label>
                <Select value={selectedClientId} onValueChange={setSelectedClientId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.client_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedClient && (
                  <p className="text-xs text-muted-foreground">Auto-selected from sidebar: {selectedClient}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="campaign-description">Description</Label>
                <Textarea
                  id="campaign-description"
                  placeholder="Describe your campaign goals and content strategy..."
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
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
                <Label>Target Platforms *</Label>
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
                {platforms.length === 0 && <p className="text-xs text-red-600">At least one platform is required</p>}
              </div>

              <div className="space-y-2">
                <Label>Campaign Hashtags</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add hashtag..."
                    value={newHashtag}
                    onChange={(e) => setNewHashtag(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addHashtag())}
                  />
                  <Button type="button" onClick={addHashtag} size="sm">
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
                <Input type="date" id="start-date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <Input type="date" id="end-date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Campaign Preview</CardTitle>
            <CardDescription>Review your campaign configuration before creating</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <h4 className="font-medium mb-2">Campaign Info</h4>
                <p className="text-sm text-muted-foreground">{campaignName || "Untitled Campaign"}</p>
                <p className="text-sm text-muted-foreground">{campaignType || "No type selected"}</p>
                <p className="text-sm text-muted-foreground">
                  Client: {getSelectedClient()?.client_name || "No client selected"}
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Platforms ({platforms.length})</h4>
                <div className="flex flex-wrap gap-1">
                  {platforms.map((platform) => (
                    <Badge key={platform} variant="outline" className="text-xs">
                      {platform}
                    </Badge>
                  ))}
                  {platforms.length === 0 && (
                    <Badge variant="outline" className="text-xs text-muted-foreground">
                      No platforms selected
                    </Badge>
                  )}
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
                  {hashtags.length === 0 && (
                    <Badge variant="outline" className="text-xs text-muted-foreground">
                      No hashtags
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            {(startDate || endDate) && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Timeline</h4>
                <p className="text-sm text-muted-foreground">
                  {startDate ? `Start: ${new Date(startDate).toLocaleDateString()}` : "No start date"}
                  {startDate && endDate && " → "}
                  {endDate ? `End: ${new Date(endDate).toLocaleDateString()}` : "No end date"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" className="flex-1" disabled={loading}>
            {loading ? (
              <>
                <Save className="mr-2 h-4 w-4 animate-spin" />
                Creating Campaign...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                Create Campaign
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setCampaignName("")
              setCampaignType("")
              setPlatforms([])
              setHashtags([])
              setStartDate("")
              setEndDate("")
              setDescription("")
              setError("")
            }}
          >
            Clear Form
          </Button>
        </div>
      </form>
    </div>
  )
}
