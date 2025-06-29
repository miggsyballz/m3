"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Calendar, Play, Pause, Edit } from "lucide-react"

interface ScheduledPost {
  id: string
  date: string
  time: string
  platform: string
  campaign_name: string
  caption: string
  status: "scheduled" | "publishing" | "failed"
}

interface ScheduledContentQueueProps {
  selectedClient: string | null
}

export function ScheduledContentQueue({ selectedClient }: ScheduledContentQueueProps) {
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadScheduledPosts()
  }, [selectedClient])

  const loadScheduledPosts = async () => {
    setLoading(true)
    try {
      // Mock data for now - replace with actual API call
      const mockPosts: ScheduledPost[] = [
        {
          id: "1",
          date: "2024-01-20",
          time: "10:00 AM",
          platform: "Instagram",
          campaign_name: "Q1 Brand Awareness",
          caption:
            "Monday motivation! Start your week with these productivity tips that will transform your workflow...",
          status: "scheduled",
        },
        {
          id: "2",
          date: "2024-01-20",
          time: "2:00 PM",
          platform: "LinkedIn",
          campaign_name: "Product Launch",
          caption:
            "Industry insights: The future of digital marketing is evolving rapidly. Here's what you need to know...",
          status: "scheduled",
        },
        {
          id: "3",
          date: "2024-01-21",
          time: "9:00 AM",
          platform: "TikTok",
          campaign_name: "Q1 Brand Awareness",
          caption: "Quick tip Tuesday! Here's how to boost your social media engagement in 60 seconds ⚡",
          status: "scheduled",
        },
        {
          id: "4",
          date: "2024-01-21",
          time: "4:00 PM",
          platform: "Facebook",
          campaign_name: "Product Launch",
          caption: "Behind the scenes: Our team's creative process for developing innovative marketing strategies...",
          status: "publishing",
        },
        {
          id: "5",
          date: "2024-01-22",
          time: "11:00 AM",
          platform: "Instagram",
          campaign_name: "Q1 Brand Awareness",
          caption:
            "Client success story: How we helped increase their social media engagement by 300% in just 3 months",
          status: "failed",
        },
      ]
      setScheduledPosts(mockPosts)
    } catch (error) {
      console.error("Error loading scheduled posts:", error)
      setScheduledPosts([])
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "publishing":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Clock className="h-4 w-4" />
      case "publishing":
        return <Play className="h-4 w-4" />
      case "failed":
        return <Pause className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const truncateCaption = (caption: string, maxLength = 100) => {
    return caption.length > maxLength ? caption.substring(0, maxLength) + "..." : caption
  }

  const formatDateTime = (date: string, time: string) => {
    const postDate = new Date(date)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    let dateLabel = postDate.toLocaleDateString()
    if (postDate.toDateString() === today.toDateString()) {
      dateLabel = "Today"
    } else if (postDate.toDateString() === tomorrow.toDateString()) {
      dateLabel = "Tomorrow"
    }

    return `${dateLabel} at ${time}`
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Scheduled Content Queue
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
          <Clock className="h-5 w-5" />
          Scheduled Content Queue
        </CardTitle>
        <CardDescription>
          {selectedClient ? `Upcoming posts for ${selectedClient}` : "All scheduled posts"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {scheduledPosts.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Scheduled Posts</h3>
            <p className="text-muted-foreground">Schedule your first post to see it here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {scheduledPosts.map((post) => (
              <div
                key={post.id}
                className="flex items-start gap-4 p-4 border rounded-lg hover:shadow-sm transition-shadow"
              >
                <div className="flex-shrink-0">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      post.status === "scheduled"
                        ? "bg-blue-100 text-blue-600"
                        : post.status === "publishing"
                          ? "bg-orange-100 text-orange-600"
                          : "bg-red-100 text-red-600"
                    }`}
                  >
                    {getStatusIcon(post.status)}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{post.platform}</Badge>
                      <Badge className={getStatusColor(post.status)}>{post.status}</Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">{formatDateTime(post.date, post.time)}</span>
                  </div>

                  <h4 className="font-medium text-sm mb-1">{post.campaign_name}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{truncateCaption(post.caption)}</p>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    {post.status === "failed" && (
                      <Button variant="outline" size="sm">
                        <Play className="mr-2 h-4 w-4" />
                        Retry
                      </Button>
                    )}
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
