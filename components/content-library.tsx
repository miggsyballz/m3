"use client"

import { useState } from "react"
import { Upload, FileText, ImageIcon, Video, Music, File, Search, Grid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ContentLibraryProps {
  selectedClient: string | null
}

export function ContentLibrary({ selectedClient }: ContentLibraryProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchTerm, setSearchTerm] = useState("")

  const mockContent = [
    {
      id: 1,
      name: "Summer Campaign Video",
      type: "video",
      size: "15.2 MB",
      uploadDate: "2024-01-15",
      tags: ["summer", "campaign", "promotional"],
      client: "MaxxBeats",
    },
    {
      id: 2,
      name: "Product Photo 1",
      type: "image",
      size: "2.1 MB",
      uploadDate: "2024-01-14",
      tags: ["product", "photography"],
      client: "MaxxBeats",
    },
    {
      id: 3,
      name: "Brand Guidelines",
      type: "document",
      size: "890 KB",
      uploadDate: "2024-01-13",
      tags: ["brand", "guidelines", "reference"],
      client: "MaxxBeats",
    },
  ]

  const getFileIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-8 w-8 text-blue-500" />
      case "image":
        return <ImageIcon className="h-8 w-8 text-green-500" />
      case "audio":
        return <Music className="h-8 w-8 text-purple-500" />
      case "document":
        return <FileText className="h-8 w-8 text-orange-500" />
      default:
        return <File className="h-8 w-8 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Content Library</h2>
          <p className="text-muted-foreground">
            Manage and organize your media assets
            {selectedClient && ` for ${selectedClient}`}
          </p>
        </div>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload Content
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All Content</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-64"
              />
            </div>
            <Select defaultValue="recent">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Recent</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="size">Size</SelectItem>
                <SelectItem value="type">Type</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex border rounded-md">
              <Button variant={viewMode === "grid" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("grid")}>
                <Grid className="h-4 w-4" />
              </Button>
              <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("list")}>
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <TabsContent value="all" className="space-y-4">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {mockContent.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-center h-20 bg-muted rounded-md">
                      {getFileIcon(item.type)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h3 className="font-semibold truncate">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.size}</p>
                    <p className="text-xs text-muted-foreground">{item.uploadDate}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {item.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{item.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {mockContent.map((item) => (
                <Card key={item.id}>
                  <CardContent className="flex items-center space-x-4 p-4">
                    {getFileIcon(item.type)}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">{item.uploadDate}</p>
                    </div>
                    <div className="text-sm text-muted-foreground">{item.size}</div>
                    <div className="flex flex-wrap gap-1">
                      {item.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="images">
          <div className="text-center py-8">
            <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-semibold">No images</h3>
            <p className="mt-1 text-sm text-muted-foreground">Upload your first image to get started.</p>
          </div>
        </TabsContent>

        <TabsContent value="videos">
          <div className="text-center py-8">
            <Video className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-semibold">No videos</h3>
            <p className="mt-1 text-sm text-muted-foreground">Upload your first video to get started.</p>
          </div>
        </TabsContent>

        <TabsContent value="documents">
          <div className="text-center py-8">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-semibold">No documents</h3>
            <p className="mt-1 text-sm text-muted-foreground">Upload your first document to get started.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
