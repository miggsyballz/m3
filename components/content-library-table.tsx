"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Filter, FileText, Eye } from "lucide-react"

interface ContentPost {
  id: string
  date: string
  platform: string
  caption: string
  status: "published" | "scheduled" | "draft" | "failed"
  campaign_name: string
}

interface ContentLibraryTableProps {
  selectedClient: string | null
}

export function ContentLibraryTable({ selectedClient }: ContentLibraryTableProps) {
  const [posts, setPosts] = useState<ContentPost[]>([])
  const [filteredPosts, setFilteredPosts] = useState<ContentPost[]>([])
  const [loading, setLoading] = useState(true)
  const [platformFilter, setPlatformFilter] = useState("all")
  const [campaignFilter, setCampaignFilter] = useState("")

  const platformOptions = ["Instagram", "Facebook", "LinkedIn", "TikTok"]

  useEffect(() => {
    loadPosts()
  }, [selectedClient])

  useEffect(() => {
    applyFilters()
  }, [posts, platformFilter, campaignFilter])

  const loadPosts = async () => {
    setLoading(true)
    try {
      // Mock data for now - replace with actual API call
      const mockPosts: ContentPost[] = [
        {
          id: "1",
          date: "2024-01-15",
          platform: "Instagram",
          caption:
            "Exciting news! We're launching our new service that will transform how you approach your business goals...",
          status: "published",
          campaign_name: "Q1 Brand Awareness",
        },
        {
          id: "2",
          date: "2024-01-16",
          platform: "Facebook",
          caption: "Behind the scenes look at our latest project. The team has been working hard to deliver...",
          status: "scheduled",
          campaign_name: "Q1 Brand Awareness",
        },
        {
          id: "3",
          date: "2024-01-17",
          platform: "LinkedIn",
          caption:
            "Industry insights: The future of digital marketing is evolving rapidly. Here's what you need to know...",
          status: "draft",
          campaign_name: "Product Launch",
        },
        {
          id: "4",
          date: "2024-01-18",
          platform: "TikTok",
          caption: "Quick tip Tuesday! Here's how to boost your productivity in just 60 seconds ⚡",
          status: "published",
          campaign_name: "Product Launch",
        },
        {
          id: "5",
          date: "2024-01-19",
          platform: "Instagram",
          caption: "Client success story: How we helped increase their social media engagement by 300%",
          status: "failed",
          campaign_name: "Q1 Brand Awareness",
        },
      ]
      setPosts(mockPosts)
    } catch (error) {
      console.error("Error loading posts:", error)
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = posts

    if (platformFilter !== "all") {
      filtered = filtered.filter((post) => post.platform === platformFilter)
    }

    if (campaignFilter.trim()) {
      filtered = filtered.filter((post) => post.campaign_name.toLowerCase().includes(campaignFilter.toLowerCase()))
    }

    setFilteredPosts(filtered)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "scheduled":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "draft":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const truncateCaption = (caption: string, maxLength = 80) => {
    return caption.length > maxLength ? caption.substring(0, maxLength) + "..." : caption
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Content Library
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
          <FileText className="h-5 w-5" />
          Content Library
        </CardTitle>
        <CardDescription>
          {selectedClient ? `Content for ${selectedClient}` : "All content across clients"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by campaign..."
                value={campaignFilter}
                onChange={(e) => setCampaignFilter(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={platformFilter} onValueChange={setPlatformFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              {platformOptions.map((platform) => (
                <SelectItem key={platform} value={platform}>
                  {platform}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Content Found</h3>
            <p className="text-muted-foreground">
              {posts.length === 0 ? "Create your first post to see it here." : "Try adjusting your filters."}
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>Caption</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Campaign</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{new Date(post.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{post.platform}</Badge>
                    </TableCell>
                    <TableCell className="max-w-[300px]">
                      <span className="text-sm">{truncateCaption(post.caption)}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(post.status)}>{post.status}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{post.campaign_name}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
