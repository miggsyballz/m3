"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, ChevronLeft, ChevronRight, Clock, Edit, Trash2, Plus } from "lucide-react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths } from "date-fns"

interface ScheduledPost {
  id: string
  content: string
  platform: string
  scheduled_for: string
  status: "draft" | "scheduled" | "published" | "failed"
  hashtags?: string
  client_id: string
  campaign_id?: string
  created_at: string
}

interface CalendarViewProps {
  selectedClientId?: string
}

export function CalendarView({ selectedClientId }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<ScheduledPost | null>(null)
  const [formData, setFormData] = useState({
    content: "",
    platform: "",
    hashtags: "",
    date: "",
    time: "12:00",
  })

  // Load scheduled posts
  useEffect(() => {
    loadScheduledPosts()
  }, [selectedClientId])

  const loadScheduledPosts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (selectedClientId) {
        params.append("client_id", selectedClientId)
      }

      const response = await fetch(`/api/scheduled-posts?${params}`)
      if (!response.ok) throw new Error("Failed to load posts")

      const data = await response.json()
      setScheduledPosts(data.posts || [])
    } catch (error) {
      console.error("Error loading scheduled posts:", error)
      setScheduledPosts([])
    } finally {
      setLoading(false)
    }
  }

  // Get calendar days
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Get posts for a specific date
  const getPostsForDate = (date: Date) => {
    return scheduledPosts.filter((post) => isSameDay(new Date(post.scheduled_for), date))
  }

  // Get today's posts
  const todaysPosts = scheduledPosts.filter((post) => isSameDay(new Date(post.scheduled_for), new Date()))

  // Calculate stats
  const thisWeekStart = new Date()
  thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay())
  const thisWeekEnd = new Date(thisWeekStart)
  thisWeekEnd.setDate(thisWeekEnd.getDate() + 6)

  const nextWeekStart = new Date(thisWeekEnd)
  nextWeekStart.setDate(nextWeekStart.getDate() + 1)
  const nextWeekEnd = new Date(nextWeekStart)
  nextWeekEnd.setDate(nextWeekEnd.getDate() + 6)

  const thisWeekPosts = scheduledPosts.filter((post) => {
    const postDate = new Date(post.scheduled_for)
    return postDate >= thisWeekStart && postDate <= thisWeekEnd && post.status === "scheduled"
  }).length

  const nextWeekPosts = scheduledPosts.filter((post) => {
    const postDate = new Date(post.scheduled_for)
    return postDate >= nextWeekStart && postDate <= nextWeekEnd && post.status === "scheduled"
  }).length

  const draftPosts = scheduledPosts.filter((post) => post.status === "draft").length

  // Handle date click
  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setFormData({
      content: "",
      platform: "",
      hashtags: "",
      date: format(date, "yyyy-MM-dd"),
      time: "12:00",
    })
    setEditingPost(null)
    setIsScheduleDialogOpen(true)
  }

  // Handle edit post
  const handleEditPost = (post: ScheduledPost) => {
    const postDate = new Date(post.scheduled_for)
    setEditingPost(post)
    setFormData({
      content: post.content,
      platform: post.platform,
      hashtags: post.hashtags || "",
      date: format(postDate, "yyyy-MM-dd"),
      time: format(postDate, "HH:mm"),
    })
    setIsScheduleDialogOpen(true)
  }

  // Handle delete post
  const handleDeletePost = async (postId: string) => {
    try {
      const response = await fetch(`/api/scheduled-posts/${postId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete post")

      await loadScheduledPosts()
    } catch (error) {
      console.error("Error deleting post:", error)
    }
  }

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedClientId) {
      alert("Please select a client first")
      return
    }

    try {
      const scheduledFor = new Date(`${formData.date}T${formData.time}:00`)

      const postData = {
        content: formData.content,
        platform: formData.platform,
        hashtags: formData.hashtags,
        scheduled_for: scheduledFor.toISOString(),
        client_id: selectedClientId,
        status: "scheduled" as const,
      }

      const url = editingPost ? `/api/scheduled-posts/${editingPost.id}` : "/api/scheduled-posts"

      const method = editingPost ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      })

      if (!response.ok) throw new Error("Failed to save post")

      setIsScheduleDialogOpen(false)
      setEditingPost(null)
      await loadScheduledPosts()
    } catch (error) {
      console.error("Error saving post:", error)
    }
  }

  const getPlatformColor = (platform: string) => {
    const colors = {
      instagram: "bg-pink-100 text-pink-800",
      facebook: "bg-blue-100 text-blue-800",
      twitter: "bg-sky-100 text-sky-800",
      linkedin: "bg-indigo-100 text-indigo-800",
      tiktok: "bg-gray-100 text-gray-800",
      youtube: "bg-red-100 text-red-800",
    }
    return colors[platform as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const getStatusColor = (status: string) => {
    const colors = {
      draft: "bg-yellow-100 text-yellow-800",
      scheduled: "bg-green-100 text-green-800",
      published: "bg-blue-100 text-blue-800",
      failed: "bg-red-100 text-red-800",
    }
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Campaign Calendar</h1>
          <p className="text-muted-foreground">Schedule and manage your social media posts</p>
        </div>
        <Button onClick={() => handleDateClick(new Date())}>
          <Plus className="h-4 w-4 mr-2" />
          Schedule Post
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {format(currentDate, "MMMM yyyy")}
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((day) => {
                  const dayPosts = getPostsForDate(day)
                  const isCurrentDay = isToday(day)

                  return (
                    <div
                      key={day.toISOString()}
                      className={`
                        min-h-[100px] p-2 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors
                        ${isCurrentDay ? "bg-primary/10 border-primary" : "border-border"}
                      `}
                      onClick={() => handleDateClick(day)}
                    >
                      <div className={`text-sm font-medium mb-1 ${isCurrentDay ? "text-primary" : ""}`}>
                        {format(day, "d")}
                      </div>
                      <div className="space-y-1">
                        {dayPosts.slice(0, 2).map((post) => (
                          <div
                            key={post.id}
                            className={`text-xs p-1 rounded truncate ${getPlatformColor(post.platform)}`}
                          >
                            {post.content.slice(0, 20)}...
                          </div>
                        ))}
                        {dayPosts.length > 2 && (
                          <div className="text-xs text-muted-foreground">+{dayPosts.length - 2} more</div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Today's Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Today's Schedule
              </CardTitle>
              <p className="text-sm text-muted-foreground">Posts scheduled for today</p>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-sm text-muted-foreground">Loading...</div>
              ) : todaysPosts.length === 0 ? (
                <div className="text-sm text-muted-foreground">No posts scheduled for today</div>
              ) : (
                <div className="space-y-3">
                  {todaysPosts.map((post) => (
                    <div key={post.id} className="border rounded-lg p-3">
                      <div className="flex items-start justify-between mb-2">
                        <Badge className={getPlatformColor(post.platform)}>{post.platform}</Badge>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => handleEditPost(post)}>
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeletePost(post.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm mb-2">{post.content}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{format(new Date(post.scheduled_for), "h:mm a")}</span>
                        <Badge variant="outline" className={getStatusColor(post.status)}>
                          {post.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">This Week</span>
                <span className="font-medium">{thisWeekPosts} posts</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Next Week</span>
                <span className="font-medium">{nextWeekPosts} posts</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Drafts</span>
                <span className="font-medium">{draftPosts} posts</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Schedule Post Dialog */}
      <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingPost ? "Edit Post" : "Schedule New Post"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="platform">Platform</Label>
              <Select
                value={formData.platform}
                onValueChange={(value) => setFormData({ ...formData, platform: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="twitter">Twitter</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write your post content..."
                rows={4}
                required
              />
            </div>

            <div>
              <Label htmlFor="hashtags">Hashtags</Label>
              <Input
                id="hashtags"
                value={formData.hashtags}
                onChange={(e) => setFormData({ ...formData, hashtags: e.target.value })}
                placeholder="#hashtag1 #hashtag2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1">
                {editingPost ? "Update Post" : "Schedule Post"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsScheduleDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CalendarView
