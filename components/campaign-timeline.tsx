"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Eye } from "lucide-react"

interface Campaign {
  id: string
  campaign_name: string
  start_date: string | null
  end_date: string | null
  platform: string[]
  status: "draft" | "active" | "scheduled" | "completed"
  type: string
}

interface CampaignTimelineProps {
  selectedClient: string | null
  onClickItem?: (campaign: Campaign) => void
}

export function CampaignTimeline({ selectedClient, onClickItem }: CampaignTimelineProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCampaigns()
  }, [selectedClient])

  const loadCampaigns = async () => {
    setLoading(true)
    try {
      // Mock data for now - replace with actual API call
      const mockCampaigns: Campaign[] = [
        {
          id: "1",
          campaign_name: "Q1 Brand Awareness",
          start_date: "2024-01-15",
          end_date: "2024-03-15",
          platform: ["Instagram", "Facebook"],
          status: "active",
          type: "Brand Awareness",
        },
        {
          id: "2",
          campaign_name: "Product Launch",
          start_date: "2024-02-01",
          end_date: "2024-02-28",
          platform: ["Instagram", "TikTok", "LinkedIn"],
          status: "scheduled",
          type: "Product Launch",
        },
        {
          id: "3",
          campaign_name: "Holiday Promotion",
          start_date: "2023-12-01",
          end_date: "2023-12-31",
          platform: ["Instagram", "Facebook"],
          status: "completed",
          type: "Promotional",
        },
      ]
      setCampaigns(mockCampaigns)
    } catch (error) {
      console.error("Error loading campaigns:", error)
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
      </CardHeader>
      <CardContent>
        {campaigns.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Campaigns Found</h3>
            <p className="text-muted-foreground">Create your first campaign to see it here.</p>
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
                      <h3 className="font-medium">{campaign.campaign_name}</h3>
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

                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        {campaign.platform.map((platform) => (
                          <Badge key={platform} variant="outline" className="text-xs">
                            {platform}
                          </Badge>
                        ))}
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Button>
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
