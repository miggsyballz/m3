"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Calendar, Clock, Plus } from "lucide-react"

interface CalendarViewProps {
  selectedClient: string | null
}

export function CalendarView({ selectedClient }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const scheduledPosts = [
    { id: 1, title: "New Beat Drop", platform: "Instagram", time: "10:00 AM", date: "2024-01-15", status: "scheduled" },
    { id: 2, title: "Studio Session", platform: "TikTok", time: "2:00 PM", date: "2024-01-15", status: "draft" },
    { id: 3, title: "Producer Tips", platform: "Twitter", time: "6:00 PM", date: "2024-01-16", status: "scheduled" },
    { id: 4, title: "Beat Preview", platform: "Instagram", time: "12:00 PM", date: "2024-01-17", status: "scheduled" },
    { id: 5, title: "Behind Scenes", platform: "YouTube", time: "4:00 PM", date: "2024-01-18", status: "draft" },
  ]

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
    const dateStr = `2024-01-${day.toString().padStart(2, "0")}`
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
        <Button>
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
                    className={`min-h-[80px] p-2 border rounded-lg ${
                      day ? "bg-background hover:bg-muted/50 cursor-pointer" : "bg-muted/20"
                    }`}
                  >
                    {day && (
                      <>
                        <div className="text-sm font-medium mb-1">{day}</div>
                        <div className="space-y-1">
                          {getPostsForDate(day).map((post) => (
                            <div
                              key={post.id}
                              className={`text-xs p-1 rounded truncate ${
                                post.status === "scheduled"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                              }`}
                            >
                              {post.time} {post.platform}
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
                      {post.platform} • {post.time}
                    </p>
                  </div>
                  <Badge variant={post.status === "scheduled" ? "default" : "secondary"}>{post.status}</Badge>
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
    </div>
  )
}
