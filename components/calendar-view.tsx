"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight, Calendar, Clock, Plus, Edit, Trash2 } from "lucide-react"

interface CalendarViewProps {
  selectedClient: string | null
}

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
  campaign_name?: string
}

interface CalendarStats {
  thisWeek: number
  nextWeek: number
  drafts: number
}

export function CalendarView({ selectedClient }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [editingPost, setEditingPost] = useState<ScheduledPost | null>(null)
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([])
  const [todaysPosts, setTodaysPosts] = useState<ScheduledPost[]>([])
  const [calendarStats, setCalendarStats] = useState<CalendarStats>({
    thisWeek: 0,
    nextWeek: 0,
    drafts: 0,
  })
  const [loading, setLoading] = useState(true)

  // Form state for new/editing posts
  const [postForm, setPostForm] = useState({
    content: "",
    platform: "",
    scheduled_time: "",
    campaign_id: "",
  })

  const [campaigns, setCampaigns] = useState<Array<{ id: string; name: string }>>([])

  useEffect(() => {
    loadScheduledPosts()
    loadCampaigns()
  }, [selectedClient])

  const loadScheduledPosts = async () => {
    setLoading(true)
    try {
      const url = selectedClient ? `/api/scheduled-posts?clientId=${selectedClient}` : "/api/scheduled-posts"

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error("Failed to fetch scheduled posts")
      }

      const data = await response.json()
      setScheduledPosts(data.posts || [])

      // Calculate today's posts
      const today = new Date().toISOString().split("T")[0]
      const todaysScheduled = (data.posts || []).filter((post: ScheduledPost) => post.scheduled_time.startsWith(today))
      setTodaysPosts(todaysScheduled)

      // Calculate stats
      calculateStats(data.posts || [])
    } catch (error) {
      console.error("Error loading scheduled posts:", error)
      setScheduledPosts([])
      setTodaysPosts([])
    } finally {
      setLoading(false)
    }
  }

  const loadCampaigns = async () => {
    try {
      const url = selectedClient ? `/api/campaigns?clientId=${selectedClient}` : "/api/campaigns"

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error("Failed to fetch campaigns")
      }

      const data = await response.json()
      setCampaigns(data.campaigns || [])
    } catch (error) {
      console.error("Error loading campaigns:", error)
      setCampaigns([])
    }
  }

  const calculateStats = (posts: ScheduledPost[]) => {
    const now = new Date()
    const thisWeekStart = new Date(now)
    thisWeekStart.setDate(now.getDate() - now.getDay()) // Start of this week
    const thisWeekEnd = new Date(thisWeekStart)
    thisWeekEnd.setDate(thisWeekStart.getDate() + 6) // End of this week

    const nextWeekStart = new Date(thisWeekEnd)
    nextWeekStart.setDate(thisWeekEnd.getDate() + 1) // Start of next week
    const nextWeekEnd = new Date(nextWeekStart)
    nextWeekEnd.setDate(nextWeekStart.getDate() + 6) // End of next week

    const thisWeekPosts = posts.filter((post) => {
      const postDate = new Date(post.scheduled_time)
      return postDate >= thisWeekStart && postDate <= thisWeekEnd && post.status === "scheduled"
    })

    const nextWeekPosts = posts.filter((post) => {
      const postDate = new Date(post.scheduled_time)
      return postDate >= nextWeekStart && postDate <= nextWeekEnd && post.status === "scheduled"
    })

    const draftPosts = posts.filter((post) => post.status === "draft")

    setCalendarStats({
      thisWeek: thisWeekPosts.length,
      nextWeek: nextWeekPosts.length,
      drafts: draftPosts.length,
    })
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return days
  }

  const getPostsForDate = (day: number) => {
    const year = currentDate.getFullYear()
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0")
    const dayStr = day.toString().padStart(2, "0")
    const dateStr = `${year}-${month}-${dayStr}`

    return scheduledPosts.filter((post) => post.scheduled_time.startsWith(dateStr))
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const handleSchedulePost = () => {
    const year = currentDate.getFullYear()
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0")
    const day = selectedDate.padStart(2, "0")
    const fullDate = `${year}-${month}-${day}T10:00:00`

    setPostForm({
      content: "",
      platform: "",
      scheduled_time: fullDate,
      campaign_id: "",
    })
    setEditingPost(null)
    setIsScheduleDialogOpen(true)
  }

  const handleEditPost = (post: ScheduledPost) => {
    setPostForm({
      content: post.content,
      platform: post.platform,
      scheduled_time: post.scheduled_time,
      campaign_id: post.campaign_id || "",
    })
    setEditingPost(post)
    setIsScheduleDialogOpen(true)
  }

  const handleDeletePost = async (postId: string) => {
    try {
      const response = await fetch(`/api/scheduled-posts/${postId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete post")
      }

      // Reload posts after deletion
      await loadScheduledPosts()
    } catch (error) {
      console.error("Error deleting post:", error)
    }
  }

  const handleSavePost = async () => {
    try {
      const postData = {
        ...postForm,
        client_id: selectedClient,
        media_urls: [],
        hashtags: extractHashtags(postForm.content),
        status: "scheduled" as const,
      }

      if (editingPost) {
        // Update existing post
        const response = await fetch(`/api/scheduled-posts/${editingPost.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(postData),
        })

        if (!response.ok) {
          throw new Error("Failed to update post")
        }
      } else {
        // Create new post
        const response = await fetch("/api/scheduled-posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(postData),
        })

        if (!response.ok) {
          throw new Error("Failed to create post")
        }
      }

      setIsScheduleDialogOpen(false)
      setPostForm({ content: "", platform: "", scheduled_time: "", campaign_id: "" })
      setEditingPost(null)

      // Reload posts after save
      await loadScheduledPosts()
    } catch (error) {
      console.error("Error saving post:", error)
    }
  }

  const extractHashtags = (text: string): string[] => {
    const hashtags = text.match(/#\w+/g) || []
    return hashtags.map((tag) => tag.toLowerCase())
  }

  const formatTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString)
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const formatDate = (dateTimeString: string) => {
    const date = new Date(dateTimeString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow"
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    }
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const platforms = ["Instagram", "Facebook", "TikTok", "Twitter", "LinkedIn", "YouTube"]

  // Generate time options (every 30 minutes)
  const timeOptions = []
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeValue = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
      const displayTime = new Date(`2000-01-01T${timeValue}`).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
      timeOptions.push({ value: timeValue, label: displayTime })
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Campaign Calendar</h1>
            <p className="text-muted-foreground">Loading scheduled posts...</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Campaign Calendar</h1>
          <p className="text-muted-foreground">
            Schedule and manage your social media posts
            {selectedClient && ` for ${selectedClient}`}
          </p>
        </div>
        <Button
          onClick={() => {
            const today = new Date()
            setSelectedDate(today.getDate().toString())
            handleSchedulePost()
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Schedule Post
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2 mb-4">
                {dayNames.map((day) => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {getDaysInMonth(currentDate).map((day, index) => (
                  <div
                    key={index}
                    className={`min-h-[100px] p-2 border rounded-lg ${
                      day ? "bg-background hover:bg-muted/50 cursor-pointer" : "bg-muted/20"
                    }`}
                    onClick={() => {
                      if (day) {
                        setSelectedDate(day.toString())
                        handleSchedulePost()
                      }
                    }}
                  >
                    {day && (
                      <>
                        <div className="text-sm font-medium mb-1">{day}</div>
                        <div className="space-y-1">
                          {getPostsForDate(day).map((post) => (
                            <div
                              key={post.id}
                              className={`text-xs p-1 rounded truncate group relative ${
                                post.status === "scheduled"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                  : post.status === "draft"
                                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                    : post.status === "published"
                                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                              }`}
                              onClick={(e) => {
                                e.stopPropagation()
                                handleEditPost(post)
                              }}
                            >
                              <div className="flex items-center justify-between">
                                <span>
                                  {formatTime(post.scheduled_time)} {post.platform}
                                </span>
                                <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-4 w-4 p-0"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleEditPost(post)
                                    }}
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-4 w-4 p-0 text-red-600"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleDeletePost(post.id)
                                    }}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Today's Schedule
              </CardTitle>
              <CardDescription>Posts scheduled for today</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {todaysPosts.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">No posts scheduled for today</p>
                </div>
              ) : (
                todaysPosts.slice(0, 5).map((post) => (
                  <div key={post.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <p className="text-sm font-medium truncate max-w-[150px]">{post.content.substring(0, 30)}...</p>
                      <p className="text-xs text-muted-foreground">
                        {post.platform} • {formatTime(post.scheduled_time)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={post.status === "scheduled" ? "default" : "secondary"}>{post.status}</Badge>
                      <Button variant="ghost" size="sm" onClick={() => handleEditPost(post)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">This Week</span>
                <span className="text-sm font-medium">{calendarStats.thisWeek} posts</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Next Week</span>
                <span className="text-sm font-medium">{calendarStats.nextWeek} posts</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Drafts</span>
                <span className="text-sm font-medium">{calendarStats.drafts} posts</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Schedule/Edit Post Dialog */}
      <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingPost ? "Edit Scheduled Post" : "Schedule New Post"}</DialogTitle>
            <DialogDescription>
              {editingPost ? "Update your scheduled post details" : "Create a new scheduled post for your campaign"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="content">Post Content</Label>
              <Textarea
                id="content"
                value={postForm.content}
                onChange={(e) => setPostForm((prev) => ({ ...prev, content: e.target.value }))}
                placeholder="Write your post content here..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="platform">Platform</Label>
                <Select
                  value={postForm.platform}
                  onValueChange={(value) => setPostForm((prev) => ({ ...prev, platform: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {platforms.map((platform) => (
                      <SelectItem key={platform} value={platform}>
                        {platform}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="campaign">Campaign</Label>
                <Select
                  value={postForm.campaign_id}
                  onValueChange={(value) => setPostForm((prev) => ({ ...prev, campaign_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select campaign" />
                  </SelectTrigger>
                  <SelectContent>
                    {campaigns.map((campaign) => (
                      <SelectItem key={campaign.id} value={campaign.id}>
                        {campaign.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="scheduled_time">Scheduled Date & Time</Label>
              <Input
                id="scheduled_time"
                type="datetime-local"
                value={postForm.scheduled_time.slice(0, 16)}
                onChange={(e) => setPostForm((prev) => ({ ...prev, scheduled_time: e.target.value }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsScheduleDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSavePost}
              disabled={!postForm.content || !postForm.platform || !postForm.scheduled_time}
            >
              {editingPost ? "Update Post" : "Schedule Post"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
