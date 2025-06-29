"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Upload, Search, Grid3X3, List, Filter, ImageIcon, Video, Music, FileText } from "lucide-react"

interface ContentLibraryProps {
  selectedClient: string | null
}

export function ContentLibrary({ selectedClient }: ContentLibraryProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")

  const contentItems = [
    {
      id: 1,
      name: "Trap Beat Preview.mp4",
      type: "video",
      size: "15.2 MB",
      client: "MaxxBeats Studio",
      campaign: "Beat Drop Friday",
      date: "2024-01-10",
    },
    {
      id: 2,
      name: "Studio Session Photo.jpg",
      type: "image",
      size: "2.8 MB",
      client: "Artist Collective",
      campaign: "Behind Scenes",
      date: "2024-01-09",
    },
    {
      id: 3,
      name: "New Beat Sample.wav",
      type: "audio",
      size: "8.5 MB",
      client: "MaxxBeats Studio",
      campaign: "Sample Pack Launch",
      date: "2024-01-08",
    },
    {
      id: 4,
      name: "Producer Tips Script.txt",
      type: "text",
      size: "1.2 KB",
      client: "Indie Producer",
      campaign: "Educational",
      date: "2024-01-07",
    },
    {
      id: 5,
      name: "Beat Making Process.mp4",
      type: "video",
      size: "45.7 MB",
      client: "MaxxBeats Studio",
      campaign: "Tutorial Series",
      date: "2024-01-06",
    },
    {
      id: 6,
      name: "Album Cover Draft.psd",
      type: "image",
      size: "12.3 MB",
      client: "Artist Collective",
      campaign: "Album Promo",
      date: "2024-01-05",
    },
  ]

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />
      case "image":
        return <ImageIcon className="h-4 w-4" />
      case "audio":
        return <Music className="h-4 w-4" />
      case "text":
        return <FileText className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "video":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "image":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "audio":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "text":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const filteredContent = contentItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.campaign.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || item.type === filterType
    const matchesClient = !selectedClient || item.client === selectedClient

    return matchesSearch && matchesType && matchesClient
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Content Library</h1>
          <p className="text-muted-foreground">
            Manage your media files and content assets
            {selectedClient && ` for ${selectedClient}`}
          </p>
        </div>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload Content
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Media Files</CardTitle>
              <CardDescription>Browse and manage your content library</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="video">Videos</SelectItem>
                <SelectItem value="image">Images</SelectItem>
                <SelectItem value="audio">Audio</SelectItem>
                <SelectItem value="text">Documents</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {viewMode === "grid" ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredContent.map((item) => (
                <Card key={item.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(item.type)}
                        <Badge className={getTypeColor(item.type)}>{item.type}</Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">{item.size}</span>
                    </div>
                    <h3 className="font-medium text-sm mb-2 truncate">{item.name}</h3>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <p>Client: {item.client}</p>
                      <p>Campaign: {item.campaign}</p>
                      <p>Date: {item.date}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredContent.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(item.type)}
                      <Badge className={getTypeColor(item.type)}>{item.type}</Badge>
                    </div>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.client} • {item.campaign}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{item.size}</span>
                    <span>{item.date}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredContent.length === 0 && (
            <div className="text-center py-12">
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No content found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || filterType !== "all"
                  ? "Try adjusting your search or filters"
                  : "Upload your first content file to get started"}
              </p>
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                Upload Content
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
