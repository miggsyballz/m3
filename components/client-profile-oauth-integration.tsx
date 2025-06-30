"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  Music,
  CheckCircle,
  XCircle,
  RefreshCw,
  Calendar,
  Shield,
} from "lucide-react"

interface SocialToken {
  id: number
  platform: string
  access_token: string
  refresh_token?: string
  expires_at?: string
  permissions: string[]
  platform_user_id?: string
  platform_username?: string
  last_synced: string
  created_at: string
}

interface ClientProfileOAuthIntegrationProps {
  clientId: number
}

const PLATFORMS = [
  {
    id: "facebook",
    name: "Facebook",
    icon: Facebook,
    color: "bg-blue-600",
    permissions: ["publish posts", "manage pages", "read insights"],
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: Instagram,
    color: "bg-gradient-to-r from-purple-500 to-pink-500",
    permissions: ["publish posts", "read insights"],
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: Linkedin,
    color: "bg-blue-700",
    permissions: ["publish posts", "read profile"],
  },
  {
    id: "twitter",
    name: "Twitter/X",
    icon: Twitter,
    color: "bg-black",
    permissions: ["publish tweets", "read profile"],
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: Youtube,
    color: "bg-red-600",
    permissions: ["upload videos", "manage channel"],
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: Music,
    color: "bg-black",
    permissions: ["upload videos", "manage content"],
  },
]

export function ClientProfileOAuthIntegration({ clientId }: ClientProfileOAuthIntegrationProps) {
  const [tokens, setTokens] = useState<SocialToken[]>([])
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState<string | null>(null)

  useEffect(() => {
    loadTokens()
  }, [clientId])

  const loadTokens = async () => {
    try {
      const response = await fetch(`/api/clients/${clientId}/social-tokens`)
      if (response.ok) {
        const data = await response.json()
        setTokens(data.tokens || [])
      }
    } catch (error) {
      console.error("Failed to load social tokens:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleConnect = async (platform: string) => {
    setConnecting(platform)

    try {
      const response = await fetch("/api/oauth/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform, clientId }),
      })

      const data = await response.json()

      if (data.authUrl) {
        // Open OAuth popup
        const popup = window.open(data.authUrl, "oauth", "width=600,height=700,scrollbars=yes,resizable=yes")

        // Listen for OAuth completion
        const handleMessage = (event: MessageEvent) => {
          if (event.data.type === "oauth-success") {
            popup?.close()
            loadTokens() // Refresh tokens
            window.removeEventListener("message", handleMessage)
          }
        }

        window.addEventListener("message", handleMessage)

        // Check if popup was closed manually
        const checkClosed = setInterval(() => {
          if (popup?.closed) {
            clearInterval(checkClosed)
            window.removeEventListener("message", handleMessage)
          }
        }, 1000)
      }
    } catch (error) {
      console.error("Failed to initiate OAuth:", error)
    } finally {
      setConnecting(null)
    }
  }

  const handleDisconnect = async (platform: string) => {
    try {
      const response = await fetch("/api/oauth/disconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform, clientId }),
      })

      if (response.ok) {
        loadTokens() // Refresh tokens
      }
    } catch (error) {
      console.error("Failed to disconnect:", error)
    }
  }

  const handleRefresh = async (platform: string) => {
    try {
      const response = await fetch("/api/oauth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform, clientId }),
      })

      if (response.ok) {
        loadTokens() // Refresh tokens
      }
    } catch (error) {
      console.error("Failed to refresh token:", error)
    }
  }

  const getTokenForPlatform = (platform: string) => {
    return tokens.find((token) => token.platform === platform)
  }

  const isTokenExpired = (token: SocialToken) => {
    if (!token.expires_at) return false
    return new Date(token.expires_at) < new Date()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading social connections...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Social Media Integration
          </CardTitle>
          <CardDescription>
            Connect social media accounts to enable posting and analytics for this client.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4">
        {PLATFORMS.map((platform) => {
          const token = getTokenForPlatform(platform.id)
          const isConnected = !!token
          const isExpired = token ? isTokenExpired(token) : false
          const Icon = platform.icon

          return (
            <Card key={platform.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${platform.color} text-white`}>
                      <Icon className="h-6 w-6" />
                    </div>

                    <div>
                      <h3 className="font-semibold">{platform.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {isConnected ? (
                          <>
                            {isExpired ? (
                              <Badge variant="destructive" className="text-xs">
                                <XCircle className="h-3 w-3 mr-1" />
                                Token Expired
                              </Badge>
                            ) : (
                              <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Connected
                              </Badge>
                            )}
                            {token?.platform_username && (
                              <span className="text-sm text-muted-foreground">@{token.platform_username}</span>
                            )}
                          </>
                        ) : (
                          <Badge variant="secondary" className="text-xs">
                            Not Connected
                          </Badge>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1 mt-2">
                        {platform.permissions.map((permission) => (
                          <Badge key={permission} variant="outline" className="text-xs">
                            {permission}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isConnected ? (
                      <>
                        {isExpired && (
                          <Button size="sm" variant="outline" onClick={() => handleRefresh(platform.id)}>
                            <RefreshCw className="h-4 w-4 mr-1" />
                            Refresh
                          </Button>
                        )}
                        <Button size="sm" variant="destructive" onClick={() => handleDisconnect(platform.id)}>
                          Disconnect
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleConnect(platform.id)}
                        disabled={connecting === platform.id}
                      >
                        {connecting === platform.id ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                            Connecting...
                          </>
                        ) : (
                          "Connect"
                        )}
                      </Button>
                    )}
                  </div>
                </div>

                {token && (
                  <>
                    <Separator className="my-4" />
                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Connected: {formatDate(token.created_at)}</span>
                      </div>
                      {token.expires_at && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>Expires: {formatDate(token.expires_at)}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4" />
                        <span>Last Sync: {formatDate(token.last_synced)}</span>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
