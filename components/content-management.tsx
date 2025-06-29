"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { Upload, FileText, Wand2, Calendar, Download, RefreshCw, CheckCircle, Copy, AlertCircle, Settings } from 'lucide-react'

interface ContentManagementProps {
  selectedClient: string | null
}

export function ContentManagement({ selectedClient }: ContentManagementProps) {
  const [activeTab, setActiveTab] = useState("import")
  const [captions, setCaptions] = useState<string[]>([])
  const [rewrittenCaptions, setRewrittenCaptions] = useState<string[]>([])
  const [schedule, setSchedule] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([])
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // AI Rewriter Settings (matching your Python function)
  const [aiPlatform, setAiPlatform] = useState("Instagram")
  const [aiTone, setAiTone] = useState("Friendly")
  const [manualCaption, setManualCaption] = useState("")

  const fileInputRef = useRef<HTMLInputElement>(null)
  const jsonInputRef = useRef<HTMLInputElement>(null)

  const platformOptions = ["Instagram", "TikTok", "Twitter", "Facebook", "LinkedIn", "YouTube"]
  const toneOptions = ["Friendly", "Professional", "Casual", "Energetic", "Creative", "Inspirational", "Humorous", "Authoritative"]

  // Import & Extract Tab
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || !selectedClient) return

    setLoading(true)
    setError("")
    const uploaded = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const formData = new FormData()
      formData.append("file", file)
      formData.append("clientId", selectedClient) // We'll need to convert client name to ID
      formData.append("contentType", "posts")

      try {
        const response = await fetch("/api/content/upload", {
          method: "POST",
          body: formData,
        })

        if (response.ok) {
          const result = await response.json()
          uploaded.push(result)
        }
      } catch (error) {
        console.error("Upload error:", error)
        setError("Failed to upload some files")
      }

      setProgress(((i + 1) / files.length) * 100)
    }

    setUploadedFiles(uploaded)
    setLoading(false)
    setProgress(0)
    if (uploaded.length > 0) {
      setSuccess(`Successfully uploaded ${uploaded.length} files`)
    }
  }

  const handleJSONExtract = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setLoading(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append("file", file)

      // First upload the JSON file
      const uploadResponse = await fetch("/api/content/upload", {
        method: "POST",
        body: formData,
      })

      if (uploadResponse.ok) {
        const uploadResult = await uploadResponse.json()

        // Then extract captions
        const extractResponse = await fetch("/api/content/extract-captions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filePath: uploadResult.filePath }),
        })

        if (extractResponse.ok) {
          const extractResult = await extractResponse.json()
          setCaptions(extractResult.captions)
          setSuccess(`Extracted ${extractResult.captions.length} captions from Instagram JSON`)
        } else {
          setError("Failed to extract captions from JSON file")
        }
      }
    } catch (error) {
      console.error("JSON extract error:", error)
      setError("Failed to process JSON file")
    } finally {
      setLoading(false)
    }
  }

  // AI Rewrite Tab (matching your Python function)
  const handleAIRewrite = async () => {
    const captionsToRewrite = captions.length > 0 ? captions : (manualCaption ? [manualCaption] : [])
    
    if (captionsToRewrite.length === 0) {
      setError("No captions to rewrite. Either extract captions from JSON or enter manual text.")
      return
    }

    setLoading(true)
    setError("")
    setProgress(0)

    try {
      const response = await fetch("/api/content/ai-rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          captions: captionsToRewrite,
          tone: aiTone,
          platform: aiPlatform,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        setRewrittenCaptions(result.rewrittenCaptions)
        setSuccess(`Successfully rewrote ${result.originalCount} captions using ${result.settings.model}`)
        
        if (result.errors && result.errors.length > 0) {
          setError(`Some captions had errors: ${result.errors.join(", ")}`)
        }
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to rewrite captions")
      }
    } catch (error) {
      console.error("AI rewrite error:", error)
      setError("Failed to connect to AI service")
    } finally {
      setLoading(false)
      setProgress(0)
    }
  }

  // Schedule Builder Tab
  const handleScheduleGeneration = async () => {
    const captionsToUse = rewrittenCaptions.length > 0 ? rewrittenCaptions : captions
    if (captionsToUse.length === 0 || !selectedClient) {
      setError("No captions available for scheduling. Please extract or rewrite captions first.")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/content/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          captions: captionsToUse,
          clientId: selectedClient, // We'll need to convert client name to ID
          startDate: new Date().toISOString(),
          platforms: [aiPlatform],
          frequency: "daily",
        }),
      })

      if (response.ok) {
        const result = await response.json()
        setSchedule(result.schedule)
        setSuccess(`Generated ${result.schedule.length} scheduled posts`)
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to generate schedule")
      }
    } catch (error) {
      console.error("Schedule generation error:", error)
      setError("Failed to generate schedule")
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setSuccess("Copied to clipboard!")
    setTimeout(() => setSuccess(""), 2000)
  }

  const addManualCaption = () => {
    if (manualCaption.trim()) {
      setCaptions([...captions, manualCaption.trim()])
      setManualCaption("")
      setSuccess("Caption added to list")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">M3 Content Management</h1>
          <p className="text-muted-foreground">
            AI-powered Social Media Content System (Python-powered backend)
            {selectedClient && ` for ${selectedClient}`}
          </p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <Wand2 className="h-4 w-4" />
          GPT-4 Powered
        </Badge>
      </div>

      {success && (
        <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800 dark:text-green-200">{success}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800 dark:text-red-200">{error}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="import">Import & Extract</TabsTrigger>
          <TabsTrigger value="ai-rewrite">AI Rewrite</TabsTrigger>
          <TabsTrigger value="funnel">Funnel Tagging</TabsTrigger>
          <TabsTrigger value="schedule">Schedule Builder</TabsTrigger>
          <TabsTrigger value="export">Export & API</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="import" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  File Upload
                </CardTitle>
                <CardDescription>Upload media files to client folders</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Files</Label>
                  <Input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileUpload}
                    disabled={!selectedClient || loading}
                  />
                  {!selectedClient && <p className="text-sm text-muted-foreground">Select a client first</p>}
                </div>

                {loading && progress > 0 && (
                  <div className="space-y-2">
                    <Progress value={progress} />
                    <p className="text-sm text-muted-foreground">Uploading files...</p>
                  </div>
                )}

                {uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Uploaded Files</h4>
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>{file.contentItem.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Caption Extraction
                </CardTitle>
                <CardDescription>Extract captions from Instagram JSON export</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Instagram JSON File</Label>
                  <Input 
                    ref={jsonInputRef} 
                    type="file" 
                    accept=".json" 
                    onChange={handleJSONExtract}
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Manual Caption Entry</Label>
                  <Textarea
                    placeholder="Enter a caption manually..."
                    value={manualCaption}
                    onChange={(e) => setManualCaption(e.target.value)}
                    rows={3}
                  />
                  <Button onClick={addManualCaption} disabled={!manualCaption.trim()} size="sm">
                    Add Caption
                  </Button>
                </div>

                {captions.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Extracted Captions ({captions.length})</h4>
                    <div className="max-h-40 overflow-y-auto space-y-2">
                      {captions.slice(0, 3).map((caption, index) => (
                        <div key={index} className="p-2 bg-muted rounded text-sm">
                          {caption.substring(0, 100)}...
                        </div>
                      ))}
                      {captions.length > 3 && (
                        <p className="text-sm text-muted-foreground">+{captions.length - 3} more captions</p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ai-rewrite" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  AI Settings
                </CardTitle>
                <CardDescription>Configure AI rewriting parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Platform</Label>
                  <Select value={aiPlatform} onValueChange={setAiPlatform}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {platformOptions.map((platform) => (
                        <SelectItem key={platform} value={platform}>
                          {platform}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Tone</Label>
                  <Select value={aiTone} onValueChange={setAiTone}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {toneOptions.map((tone) => (
                        <SelectItem key={tone} value={tone}>
                          {tone}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-3 bg-muted rounded-lg text-sm">
                  <p className="font-medium mb-1">Current Settings:</p>
                  <p>Platform: {aiPlatform}</p>
                  <p>Tone: {aiTone}</p>
                  <p>Model: GPT-4</p>
                  <p>Max Length: 200 words</p>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wand2 className="h-5 w-5" />
                  AI Caption Rewriter
                </CardTitle>
                <CardDescription>
                  Rewrite captions with AI ({captions.length} captions loaded)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={handleAIRewrite} 
                  disabled={(captions.length === 0 && !manualCaption) || loading} 
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Rewriting with GPT-4...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      Rewrite All Captions with AI
                    </>
                  )}
                </Button>

                {rewrittenCaptions.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-medium">Rewritten Captions ({rewrittenCaptions.length})</h4>
                    <div className="max-h-96 overflow-y-auto space-y-3">
                      {rewrittenCaptions.map((caption, index) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <Badge variant="outline">Caption {index + 1}</Badge>
                            <Button variant="outline" size="sm" onClick={() => copyToClipboard(caption)}>
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-sm whitespace-pre-wrap">{caption}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                30-Day Schedule Builder
              </CardTitle>
              <CardDescription>Generate posting schedule from captions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={handleScheduleGeneration}
                disabled={(captions.length === 0 && rewrittenCaptions.length === 0) || loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Generating Schedule...
                  </>
                ) : (
                  <>
                    <Calendar className="mr-2 h-4 w-4" />
                    Generate 30-Day Schedule
                  </>
                )}
              </Button>

              {schedule.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-medium">Generated Schedule ({schedule.length} posts)</h4>
                  <div className="max-h-96 overflow-y-auto space-y-2">
                    {schedule.slice(0, 10).map((post, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <p className="font-medium text-sm">{post.date}</p>
                          <p className="text-xs text-muted-foreground">{post.platform}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline">{post.status}</Badge>
                        </div>
                      </div>
                    ))}
                    {schedule.length > 10 && (
                      <p className="text-sm text-muted-foreground text-center">
                        +{schedule.length - 10} more scheduled posts
                      </p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Export & API
              </CardTitle>
              <CardDescription>Export schedules and manage API connections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button variant="outline" className="w-full bg-transparent" disabled={schedule.length === 0}>
                  <Download className="mr-2 h-4 w-4" />
                  Download CSV Schedule ({schedule.length} posts)
                </Button>
                <Button variant="outline" className="w-full bg-transparent" disabled={rewrittenCaptions.length === 0}>
                  <Download className="mr-2 h-4 w-4" />
                  Export Rewritten Captions ({rewrittenCaptions.length} captions)
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  <Download className="mr-2 h-4 w-4" />
                  Export to Social Media APIs
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>M3 Settings</CardTitle>
              <CardDescription>Configure your content management system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Base Directory</Label>
                <Input defaultValue="/Volumes/4 TB Backup/Instagram Content" placeholder="Base content directory" />
              </div>
              <div className="space-y-2">
                <Label>Clients Directory</Label>
                <Input defaultValue="~/Desktop/Apps Code/M3/Clients" placeholder="Client folders location" />
              </div>
              <div className="space-y-2">
                <Label>OpenAI API Key</Label>
                <Input type="password" placeholder="sk-..." />
              </div>
              <Button className="w-full">Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
