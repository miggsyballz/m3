"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Eye, RefreshCw } from "lucide-react"

interface Campaign {
  id: string
  client_id: string
  name: string
  type: string
  platforms: string[]
  hashtags: string[]
  start_date: string | null
  end_date: string | null
  status: "draft" | "active" | "scheduled" | "completed"
  created_at: string
  updated_at: string
}

interface CampaignTimelineProps {
  selectedClient: string | null
  onClickItem?: (campaign: Campaign) => void
}

export function CampaignTimeline({ selectedClient, onClickItem }: CampaignTimelineProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadCampaigns()
  }, [selectedClient])

  const loadCampaigns = async () => {
    setLoading(true)
    setError(null)

    try {
      // Get the selected client's ID from the client name
      let clientId = null
      if (selectedClient) {
        const clientsResponse = await fetch("/api/clients")
        const clientsData = await clientsResponse.json()
        const clients = Array.isArray(clientsData) ? clientsData : clientsData.clients || []
        const client = clients.find((c: any) => c.client_name === selectedClient)
        clientId = client?.id
      }

      // Fetch campaigns
      const url = clientId ? `/api/campaigns?clientId=${clientId}` : "/api/campaigns"
      const response = await fetch(url)
      const data = await response.json()

      if (Array.isArray(data)) {
        setCampaigns(data)
      } else if (data.campaigns && Array.isArray(data.campaigns)) {
        setCampaigns(data.campaigns)
        if (data.error) setError(data.error)
      } else {
        setCampaigns([])
        if (data.error) setError(data.error)
      }
    } catch (error) {
      console.error("Error loading campaigns:", error)
      setError("Failed to load campaigns")
      setCampaigns([])
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "scheduled":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "completed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
      case "draft":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not set"
    return new Date(dateString).toLocaleDateString()
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Campaign Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Campaign Timeline
        </CardTitle>
        <CardDescription>
          {selectedClient ? `Campaigns for ${selectedClient}` : "All campaigns across clients"}
        </CardDescription>
        <Button variant="outline" size="sm" onClick={loadCampaigns} className="w-fit bg-transparent">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="text-center py-4 text-red-600 text-sm">
            <p>Error: {error}</p>
            <Button variant="outline" size="sm" onClick={loadCampaigns} className="mt-2 bg-transparent">
              Retry
            </Button>
          </div>
        )}

        {campaigns.length === 0 && !error ? (
          <div className="text-center py-8">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Campaigns Found</h3>
            <p className="text-muted-foreground">
              {selectedClient
                ? `No campaigns found for ${selectedClient}. Create your first campaign to see it here.`
                : "Create your first campaign to see it here."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {campaigns.map((campaign, index) => (
              <div key={campaign.id} className="relative">
                {/* Timeline line */}
                {index < campaigns.length - 1 && <div className="absolute left-4 top-12 w-0.5 h-16 bg-border"></div>}

                <div className="flex items-start gap-4">
                  {/* Timeline dot */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      campaign.status === "active"
                        ? "bg-green-500"
                        : campaign.status === "scheduled"
                          ? "bg-blue-500"
                          : campaign.status === "completed"
                            ? "bg-gray-500"
                            : "bg-yellow-500"
                    }`}
                  >
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>

                  {/* Campaign card */}
                  <div
                    className="flex-1 p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => onClickItem?.(campaign)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{campaign.name}</h3>
                      <Badge className={getStatusColor(campaign.status)}>{campaign.status}</Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Start: {formatDate(campaign.start_date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>End: {formatDate(campaign.end_date)}</span>
                      </div>
                    </div>

                    {(() => {
                      const platforms = Array.isArray(campaign.platforms) ? campaign.platforms : []

                      return (
                        <div className="flex items-center justify-between">
                          <div className="flex gap-1">
                            {platforms.map((platform) => (
                              <Badge key={platform} variant="outline" className="text-xs">
                                {platform}
                              </Badge>
                            ))}
                            {platforms.length === 0 && (
                              <Badge variant="outline" className="text-xs">
                                No platforms
                              </Badge>
                            )}
                          </div>
                          <Button variant="outline" size="sm">
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Button>
                        </div>
                      )
                    })()}

                    <div className="mt-2 text-xs text-muted-foreground">
                      <p>Type: {campaign.type}</p>
                      <p>Created: {new Date(campaign.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
