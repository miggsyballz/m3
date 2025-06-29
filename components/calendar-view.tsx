"use client"

import { useState } from "react"
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
  id: number
  title: string
  platform: string
  time: string
  date: string
  status: "scheduled" | "draft"
  content?: string
}

export function CalendarView({ selectedClient }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [editingPost, setEditingPost] = useState<ScheduledPost | null>(null)

  // Form state for new/editing posts
  const [postForm, setPostForm] = useState({
    title: "",
    platform: "",
    time: "10:00",
    content: "",
    date: "",
  })

  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([
    {
      id: 1,
      title: "Product Launch",
      platform: "Instagram",
      time: "10:00",
      date: "2024-01-15",
      status: "scheduled",
      content: "Exciting product launch announcement! 🚀 #ProductLaunch #Innovation",
    },
    {
      id: 2,
      title: "Company Update",
      platform: "TikTok",
      time: "14:00",
      date: "2024-01-15",
      status: "draft",
      content: "Behind the scenes of our latest company update 📈 #CompanyNews #Growth",
    },
    {
      id: 3,
      title: "Industry Tips",
      platform: "Twitter",
      time: "18:00",
      date: "2024-01-16",
      status: "scheduled",
      content: "5 industry tips that will transform your business strategy 💡 #BusinessTips #Strategy",
    },
    {
      id: 4,
      title: "Service Preview",
      platform: "Instagram",
      time: "12:00",
      date: "2024-01-17",
      status: "scheduled",
      content: "Sneak peek at our upcoming service launch! What do you think? 👀 #ComingSoon #Service",
    },
    {
      id: 5,
      title: "Behind Scenes",
      platform: "YouTube",
      time: "16:00",
      date: "2024-01-18",
      status: "draft",
      content: "Take a look behind the scenes of our creative process 🎬 #BehindTheScenes #Creative",
    },
  ])

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
    return scheduledPosts.filter((post) => post.date === dateStr)
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
    const fullDate = `${year}-${month}-${day}`

    setPostForm({
      title: "",
      platform: "",
      time: "10:00",
      content: "",
      date: fullDate,
    })
    setEditingPost(null)
    setIsScheduleDialogOpen(true)
  }

  const handleEditPost = (post: ScheduledPost) => {
    setPostForm({
      title: post.title,
      platform: post.platform,
      time: post.time,
      content: post.content || "",
      date: post.date,
    })
    setEditingPost(post)
    setIsScheduleDialogOpen(true)
  }

  const handleDeletePost = (postId: number) => {
    setScheduledPosts((prev) => prev.filter((post) => post.id !== postId))
  }

  const handleSavePost = () => {
    if (editingPost) {
      // Update existing post
      setScheduledPosts((prev) =>
        prev.map((post) =>
          post.id === editingPost.id ? { ...post, ...postForm, status: "scheduled" as const } : post,
        ),
      )
    } else {
      // Create new post
      const newPost: ScheduledPost = {
        id: Math.max(...scheduledPosts.map((p) => p.id)) + 1,
        title: postForm.title,
        platform: postForm.platform,
        time: postForm.time,
        date: postForm.date,
        status: "scheduled",
        content: postForm.content,
      }
      setScheduledPosts((prev) => [...prev, newPost])
    }

    setIsScheduleDialogOpen(false)
    setPostForm({ title: "", platform: "", time: "10:00", content: "", date: "" })
    setEditingPost(null)
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
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

  const platforms = ["Instagram", "TikTok", "Twitter", "Facebook", "LinkedIn", "YouTube"]

  // Generate time options (every 30 minutes)
  const timeOptions = []
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeValue = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
      const displayTime = formatTime(timeValue)
      timeOptions.push({ value: timeValue, label: displayTime })
    }
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
                                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                              }`}
                              onClick={(e) => {
                                e.stopPropagation()
                                handleEditPost(post)
                              }}
                            >
                              <div className="flex items-center justify-between">
                                <span>
                                  {formatTime(post.time)} {post.platform}
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
              {scheduledPosts.slice(0, 3).map((post) => (
                <div key={post.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{post.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {post.platform} • {formatTime(post.time)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={post.status === "scheduled" ? "default" : "secondary"}>{post.status}</Badge>
                    <Button variant="ghost" size="sm" onClick={() => handleEditPost(post)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">This Week</span>
                <span className="text-sm font-medium">12 posts</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Next Week</span>
                <span className="text-sm font-medium">8 posts</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Drafts</span>
                <span className="text-sm font-medium">5 posts</span>
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
              <Label htmlFor="title">Post Title</Label>
              <Input
                id="title"
                value={postForm.title}
                onChange={(e) => setPostForm((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Enter post title..."
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
                <Label htmlFor="time">Time</Label>
                <Select
                  value={postForm.time}
                  onValueChange={(value) => setPostForm((prev) => ({ ...prev, time: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    {timeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

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

            <div className="grid gap-2">
              <Label>Scheduled Date</Label>
              <div className="text-sm text-muted-foreground">
                {postForm.date
                  ? new Date(postForm.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "No date selected"}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsScheduleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePost} disabled={!postForm.title || !postForm.platform || !postForm.time}>
              {editingPost ? "Update Post" : "Schedule Post"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
