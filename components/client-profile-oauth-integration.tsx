"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import {
  Instagram,
  Facebook,
  Linkedin,
  Twitter,
  Youtube,
  Music,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  Unlink,
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
  last_synced?: string
}

interface ClientProfileOAuthIntegrationProps {
  clientId: number
}

const PLATFORMS = [
  {
    id: "instagram",
    name: "Instagram",
    icon: Instagram,
    color: "bg-gradient-to-r from-purple-500 to-pink-500",
    permissions: ["publish posts", "read insights"],
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: Facebook,
    color: "bg-blue-600",
    permissions: ["publish posts", "manage pages", "read insights"],
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
  const { toast } = useToast()

  useEffect(() => {
    fetchTokens()
  }, [clientId])

  const fetchTokens = async () => {
    try {
      const response = await fetch(`/api/clients/${clientId}/social-tokens`)
      if (response.ok) {
        const data = await response.json()
        setTokens(data.tokens || [])
      }
    } catch (error) {
      console.error("Failed to fetch tokens:", error)
      toast({
        title: "Error",
        description: "Failed to load social media connections",
        variant: "destructive",
      })
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
        body: JSON.stringify({
          clientId,
          platform,
          redirectUrl: `${window.location.origin}/oauth/callback`,
        }),
      })

      const data = await response.json()

      if (data.authUrl) {
        // Open OAuth popup
        const popup = window.open(
          data.authUrl,
          `oauth-${platform}`,
          "width=600,height=700,scrollbars=yes,resizable=yes",
        )

        // Listen for popup completion
        const checkClosed = setInterval(() => {
          if (popup?.closed) {
            clearInterval(checkClosed)
            setConnecting(null)
            fetchTokens() // Refresh tokens after connection
          }
        }, 1000)
      }
    } catch (error) {
      console.error("Failed to connect:", error)
      toast({
        title: "Connection Failed",
        description: `Failed to connect to ${platform}`,
        variant: "destructive",
      })
      setConnecting(null)
    }
  }

  const handleRefresh = async (platform: string) => {
    try {
      const response = await fetch("/api/oauth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId, platform }),
      })

      if (response.ok) {
        toast({
          title: "Token Refreshed",
          description: `${platform} connection refreshed successfully`,
        })
        fetchTokens()
      } else {
        throw new Error("Failed to refresh token")
      }
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: `Failed to refresh ${platform} token`,
        variant: "destructive",
      })
    }
  }

  const handleDisconnect = async (platform: string) => {
    try {
      const response = await fetch("/api/oauth/disconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId, platform }),
      })

      if (response.ok) {
        toast({
          title: "Disconnected",
          description: `${platform} disconnected successfully`,
        })
        fetchTokens()
      } else {
        throw new Error("Failed to disconnect")
      }
    } catch (error) {
      toast({
        title: "Disconnect Failed",
        description: `Failed to disconnect ${platform}`,
        variant: "destructive",
      })
    }
  }

  const getTokenForPlatform = (platform: string) => {
    return tokens.find((token) => token.platform === platform)
  }

  const getConnectionStatus = (platform: string) => {
    const token = getTokenForPlatform(platform)
    if (!token) return "not_connected"

    if (token.expires_at) {
      const expiresAt = new Date(token.expires_at)
      const now = new Date()
      if (expiresAt <= now) return "expired"
    }

    return "connected"
  }

  const formatLastSync = (lastSynced?: string) => {
    if (!lastSynced) return "Never"
    return new Date(lastSynced).toLocaleDateString()
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Social Media Integration</CardTitle>
          <CardDescription>Loading connections...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Media Integration</CardTitle>
        <CardDescription>Connect social media accounts to enable automated posting and analytics</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {PLATFORMS.map((platform) => {
          const token = getTokenForPlatform(platform.id)
          const status = getConnectionStatus(platform.id)
          const Icon = platform.icon
          const isConnecting = connecting === platform.id

          return (
            <div key={platform.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-lg ${platform.color} text-white`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">{platform.name}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    {status === "connected" && (
                      <>
                        <Badge variant="secondary" className="text-green-700 bg-green-100">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Connected
                        </Badge>
                        {token?.platform_username && (
                          <span className="text-sm text-muted-foreground">@{token.platform_username}</span>
                        )}
                      </>
                    )}
                    {status === "expired" && (
                      <Badge variant="secondary" className="text-orange-700 bg-orange-100">
                        <Clock className="h-3 w-3 mr-1" />
                        Token Expired
                      </Badge>
                    )}
                    {status === "not_connected" && (
                      <Badge variant="secondary" className="text-gray-700 bg-gray-100">
                        <XCircle className="h-3 w-3 mr-1" />
                        Not Connected
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Permissions: {platform.permissions.join(", ")}
                  </div>
                  {token && (
                    <div className="text-xs text-muted-foreground">
                      Last synced: {formatLastSync(token.last_synced)}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {status === "not_connected" && (
                  <Button onClick={() => handleConnect(platform.id)} disabled={isConnecting} size="sm">
                    {isConnecting ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      "Connect"
                    )}
                  </Button>
                )}

                {status === "connected" && (
                  <>
                    <Button onClick={() => handleRefresh(platform.id)} variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                    <Button onClick={() => handleDisconnect(platform.id)} variant="outline" size="sm">
                      <Unlink className="h-4 w-4 mr-2" />
                      Disconnect
                    </Button>
                  </>
                )}

                {status === "expired" && (
                  <>
                    <Button onClick={() => handleRefresh(platform.id)} size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh Token
                    </Button>
                    <Button onClick={() => handleDisconnect(platform.id)} variant="outline" size="sm">
                      <Unlink className="h-4 w-4 mr-2" />
                      Disconnect
                    </Button>
                  </>
                )}
              </div>
            </div>
          )
        })}

        <Separator />

        <div className="text-sm text-muted-foreground">
          <p className="font-medium mb-2">Connection Notes:</p>
          <ul className="space-y-1 text-xs">
            <li>• Tokens are stored securely and encrypted</li>
            <li>• Each client manages their own social media connections</li>
            <li>• Refresh tokens automatically when they expire</li>
            <li>• Disconnect anytime to revoke access</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
