"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, Trash2, Filter } from "lucide-react"
import { format } from "date-fns"

interface ScheduledPost {
  id: string
  campaign_id: string | null
  client_id: string
  platform: string
  content: string
  media_urls: string[]
  hashtags: string[]
  scheduled_time: string
  status: "draft" | "scheduled" | "published" | "failed"
  created_at: string
  updated_at: string
}

interface ScheduledContentQueueProps {
  selectedClientId?: string
}

const PLATFORMS = [
  { value: "instagram", label: "Instagram", color: "bg-pink-500" },
  { value: "facebook", label: "Facebook", color: "bg-blue-600" },
  { value: "twitter", label: "Twitter", color: "bg-sky-500" },
  { value: "linkedin", label: "LinkedIn", color: "bg-blue-700" },
  { value: "tiktok", label: "TikTok", color: "bg-black" },
  { value: "youtube", label: "YouTube", color: "bg-red-600" },
]

const STATUS_COLORS = {
  draft: "bg-gray-500",
  scheduled: "bg-blue-500",
  published: "bg-green-500",
  failed: "bg-red-500",
}

export default function ScheduledContentQueue({ selectedClientId }: ScheduledContentQueueProps) {
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [platformFilter, setPlatformFilter] = useState<string>("all")

  // Load scheduled posts
  const loadScheduledPosts = async () => {
    try {
      setLoading(true)
      const url = selectedClientId ? `/api/scheduled-posts?client_id=${selectedClientId}` : "/api/scheduled-posts"

      const response = await fetch(url)
      if (!response.ok) throw new Error("Failed to fetch posts")

      const posts = await response.json()
      setScheduledPosts(Array.isArray(posts) ? posts : [])
    } catch (error) {
      console.error("Error loading scheduled posts:", error)
      setScheduledPosts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadScheduledPosts()
  }, [selectedClientId])

  // Filter posts
  const filteredPosts = scheduledPosts.filter((post) => {
    const statusMatch = statusFilter === "all" || post.status === statusFilter
    const platformMatch = platformFilter === "all" || post.platform === platformFilter
    return statusMatch && platformMatch
  })

  // Sort posts by scheduled time
  const sortedPosts = filteredPosts.sort(
    (a, b) => new Date(a.scheduled_time).getTime() - new Date(b.scheduled_time).getTime(),
  )

  const getPlatformColor = (platform: string) => {
    const platformConfig = PLATFORMS.find((p) => p.value === platform)
    return platformConfig?.color || "bg-gray-500"
  }

  const getPlatformLabel = (platform: string) => {
    const platformConfig = PLATFORMS.find((p) => p.value === platform)
    return platformConfig?.label || platform
  }

  // Handle status change
  const handleStatusChange = async (postId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/scheduled-posts/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) throw new Error("Failed to update status")

      await loadScheduledPosts()
    } catch (error) {
      console.error("Error updating status:", error)
      alert("Failed to update post status")
    }
  }

  // Handle delete post
  const handleDeletePost = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return

    try {
      const response = await fetch(`/api/scheduled-posts/${postId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete post")

      await loadScheduledPosts()
    } catch (error) {
      console.error("Error deleting post:", error)
      alert("Failed to delete post")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading scheduled posts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Scheduled Content Queue</h1>
          <p className="text-gray-600">Manage your scheduled social media posts</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Platform</label>
              <Select value={platformFilter} onValueChange={setPlatformFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  {PLATFORMS.map((platform) => (
                    <SelectItem key={platform.value} value={platform.value}>
                      {platform.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Posts List */}
      <Card>
        <CardHeader>
          <CardTitle>Scheduled Posts ({sortedPosts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {sortedPosts.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No scheduled posts found</p>
              <p className="text-sm text-gray-500">Posts you schedule will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedPosts.map((post) => (
                <div key={post.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      {/* Header */}
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={`${getPlatformColor(post.platform)} text-white`}>
                          {getPlatformLabel(post.platform)}
                        </Badge>
                        <Badge variant="secondary" className={`${STATUS_COLORS[post.status]} text-white`}>
                          {post.status}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(post.scheduled_time), "MMM d, yyyy")}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          {format(new Date(post.scheduled_time), "h:mm a")}
                        </div>
                      </div>

                      {/* Content */}
                      <p className="text-gray-900 mb-2 line-clamp-3">{post.content}</p>

                      {/* Hashtags */}
                      {post.hashtags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {post.hashtags.map((hashtag, index) => (
                            <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              #{hashtag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Status Change */}
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Change status:</span>
                        <Select value={post.status} onValueChange={(value) => handleStatusChange(post.id, value)}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="scheduled">Scheduled</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                            <SelectItem value="failed">Failed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeletePost(post.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Provide a named export in addition to the default export
export { ScheduledContentQueue }
