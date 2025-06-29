"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Key, Folder, Database, Save, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react"
import { SocialAuth } from "@/components/social-auth"

interface SettingsViewProps {
  selectedClient?: string | null
}

export function SettingsView({ selectedClient }: SettingsViewProps) {
  const [showApiKeys, setShowApiKeys] = useState(false)
  const [apiKeys, setApiKeys] = useState({
    openai: "",
    meta: "",
    linkedin: "",
    tiktok: "",
  })
  const [folders, setFolders] = useState({
    baseClient: "/Users/mig/M3/clients",
    mediaSave: "/Users/mig/M3/media",
  })
  const [autoBackup, setAutoBackup] = useState(true)

  const apiConnections = [
    { name: "OpenAI", key: "openai", status: "connected", description: "For AI content generation" },
    { name: "Meta (Facebook/Instagram)", key: "meta", status: "disconnected", description: "For social media posting" },
    { name: "LinkedIn", key: "linkedin", status: "connected", description: "For professional content" },
    { name: "TikTok", key: "tiktok", status: "disconnected", description: "For short-form video content" },
  ]

  const handleApiKeyChange = (key: string, value: string) => {
    setApiKeys((prev) => ({ ...prev, [key]: value }))
  }

  const handleFolderChange = (key: string, value: string) => {
    setFolders((prev) => ({ ...prev, [key]: value }))
  }

  const getStatusIcon = (status: string) => {
    return status === "connected" ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <AlertCircle className="h-4 w-4 text-orange-500" />
    )
  }

  const getStatusBadge = (status: string) => {
    return <Badge variant={status === "connected" ? "default" : "secondary"}>{status}</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Configure your M3 application settings and integrations
            {selectedClient && ` for ${selectedClient}`}
          </p>
        </div>
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="social-auth" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="social-auth">Social Media</TabsTrigger>
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          <TabsTrigger value="folders">Folders</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
        </TabsList>

        <TabsContent value="social-auth" className="mt-6">
          <SocialAuth selectedClient={selectedClient} />
        </TabsContent>

        <TabsContent value="api-keys" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                API Connections
              </CardTitle>
              <CardDescription>Manage your third-party service integrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="show-keys">Show API Keys</Label>
                <Switch id="show-keys" checked={showApiKeys} onCheckedChange={setShowApiKeys} />
              </div>

              <Separator />

              <div className="space-y-4">
                {apiConnections.map((connection) => (
                  <div key={connection.key} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(connection.status)}
                        <div>
                          <Label className="font-medium">{connection.name}</Label>
                          <p className="text-xs text-muted-foreground">{connection.description}</p>
                        </div>
                      </div>
                      {getStatusBadge(connection.status)}
                    </div>
                    <div className="relative">
                      <Input
                        type={showApiKeys ? "text" : "password"}
                        placeholder={`Enter ${connection.name} API key`}
                        value={apiKeys[connection.key as keyof typeof apiKeys]}
                        onChange={(e) => handleApiKeyChange(connection.key, e.target.value)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                        onClick={() => setShowApiKeys(!showApiKeys)}
                      >
                        {showApiKeys ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="folders" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Folder className="h-5 w-5" />
                Folder Configuration
              </CardTitle>
              <CardDescription>Set up your file storage locations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="base-folder">Base Client Folder</Label>
                <Input
                  id="base-folder"
                  value={folders.baseClient}
                  onChange={(e) => handleFolderChange("baseClient", e.target.value)}
                  placeholder="/path/to/client/folders"
                />
                <p className="text-xs text-muted-foreground">Root directory where client folders are stored</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="media-folder">Default Media Save Location</Label>
                <Input
                  id="media-folder"
                  value={folders.mediaSave}
                  onChange={(e) => handleFolderChange("mediaSave", e.target.value)}
                  placeholder="/path/to/media/storage"
                />
                <p className="text-xs text-muted-foreground">Default location for uploaded media files</p>
              </div>

              <Button variant="outline" className="w-full bg-transparent">
                <Folder className="mr-2 h-4 w-4" />
                Browse Folders
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Backup & Data
                </CardTitle>
                <CardDescription>Manage your data backup and storage settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-backup">Automatic Backup</Label>
                    <p className="text-sm text-muted-foreground">Automatically backup your data daily</p>
                  </div>
                  <Switch id="auto-backup" checked={autoBackup} onCheckedChange={setAutoBackup} />
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-medium">Backup Actions</h4>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Database className="mr-2 h-4 w-4" />
                      Create Manual Backup
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Database className="mr-2 h-4 w-4" />
                      Restore from Backup
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Database className="mr-2 h-4 w-4" />
                      Export Data
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Storage Usage</CardTitle>
                <CardDescription>Current storage usage breakdown</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Media Files</span>
                    <span>2.4 GB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Database</span>
                    <span>45.2 MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Backups</span>
                    <span>1.1 GB</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total Usage</span>
                    <span>3.5 GB</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
