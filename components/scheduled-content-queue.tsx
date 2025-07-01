"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, Edit, Trash2, Instagram, Facebook, Twitter, Linkedin, Youtube } from "lucide-react"
import { format } from "date-fns"

interface ScheduledPost {
  id: string
  content: string
  platform: string
  scheduled_for: string
  status: "draft" | "scheduled" | "published" | "failed"
  hashtags: string | string[]
  media_urls: string | string[]
  client_id: string
  campaign_id?: string
}

interface ScheduledContentQueueProps {
  selectedClient?: string | null
}

const platformIcons = {
  instagram: Instagram,
  facebook: Facebook,
  twitter: Twitter,
  linkedin: Linkedin,
  youtube: Youtube,
}

const platformColors = {
  instagram: "bg-pink-100 text-pink-700 border-pink-200",
  facebook: "bg-blue-100 text-blue-700 border-blue-200",
  twitter: "bg-sky-100 text-sky-700 border-sky-200",
  linkedin: "bg-blue-100 text-blue-700 border-blue-200",
  youtube: "bg-red-100 text-red-700 border-red-200",
}

const statusColors = {
  draft: "bg-gray-100 text-gray-700 border-gray-200",
  scheduled: "bg-green-100 text-green-700 border-green-200",
  published: "bg-blue-100 text-blue-700 border-blue-200",
  failed: "bg-red-100 text-red-700 border-red-200",
}

export function ScheduledContentQueue({ selectedClient }: ScheduledContentQueueProps) {
  const [posts, setPosts] = useState<ScheduledPost[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [platformFilter, setPlatformFilter] = useState<string>("all")

  useEffect(() => {
    loadScheduledPosts()
  }, [selectedClient])

  const loadScheduledPosts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (selectedClient) {
        params.append("clientId", selectedClient)
      }

      const response = await fetch(`/api/scheduled-posts?${params}`)
      if (!response.ok) {
        throw new Error("Failed to load scheduled posts")
      }

      const data = await response.json()
      setPosts(data.posts || [])
    } catch (error) {
      console.error("Error loading scheduled posts:", error)
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  const updatePostStatus = async (postId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/scheduled-posts/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error("Failed to update post status")
      }

      // Refresh the posts
      loadScheduledPosts()
    } catch (error) {
      console.error("Error updating post status:", error)
    }
  }

  const deletePost = async (postId: string) => {
    try {
      const response = await fetch(`/api/scheduled-posts/${postId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete post")
      }

      // Refresh the posts
      loadScheduledPosts()
    } catch (error) {
      console.error("Error deleting post:", error)
    }
  }

  // Helper function to safely handle hashtags
  const getHashtagsArray = (hashtags: string | string[] | undefined | null): string[] => {
    if (!hashtags) return []
    if (Array.isArray(hashtags)) return hashtags
    if (typeof hashtags === "string") {
      return hashtags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    }
    return []
  }

  // Filter posts based on selected filters
  const filteredPosts = posts.filter((post) => {
    const statusMatch = statusFilter === "all" || post.status === statusFilter
    const platformMatch = platformFilter === "all" || post.platform === platformFilter
    return statusMatch && platformMatch
  })

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Scheduled Content Queue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Scheduled Content Queue</h2>
          <p className="text-muted-foreground">Manage your upcoming social media posts</p>
        </div>

        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={platformFilter} onValueChange={setPlatformFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Filter by platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="facebook">Facebook</SelectItem>
              <SelectItem value="twitter">Twitter</SelectItem>
              <SelectItem value="linkedin">LinkedIn</SelectItem>
              <SelectItem value="youtube">YouTube</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredPosts.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No scheduled posts</h3>
              <p className="text-muted-foreground">
                {posts.length === 0
                  ? "Create your first scheduled post to get started"
                  : "No posts match your current filters"}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredPosts.map((post) => {
            const PlatformIcon = platformIcons[post.platform as keyof typeof platformIcons] || Calendar
            const hashtags = getHashtagsArray(post.hashtags)

            return (
              <Card key={post.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge
                          variant="outline"
                          className={
                            platformColors[post.platform as keyof typeof platformColors] || "bg-gray-100 text-gray-700"
                          }
                        >
                          <PlatformIcon className="w-3 h-3 mr-1" />
                          {post.platform.charAt(0).toUpperCase() + post.platform.slice(1)}
                        </Badge>

                        <Badge variant="outline" className={statusColors[post.status]}>
                          {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                        </Badge>

                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {format(new Date(post.scheduled_for), "MMM d, yyyy 'at' h:mm a")}
                        </div>
                      </div>

                      <p className="text-sm leading-relaxed">{post.content}</p>

                      {hashtags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {hashtags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {post.status === "draft" && (
                        <Button size="sm" variant="outline" onClick={() => updatePostStatus(post.id, "scheduled")}>
                          Schedule
                        </Button>
                      )}

                      {post.status === "scheduled" && (
                        <Button size="sm" variant="outline" onClick={() => updatePostStatus(post.id, "draft")}>
                          Unschedule
                        </Button>
                      )}

                      <Button size="sm" variant="ghost">
                        <Edit className="w-4 h-4" />
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deletePost(post.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ScheduledContentQueue
