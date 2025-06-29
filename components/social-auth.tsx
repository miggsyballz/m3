"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Instagram,
  Facebook,
  Linkedin,
  Twitter,
  Youtube,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  RefreshCw,
} from "lucide-react"

interface SocialAccount {
  platform: string
  name: string
  icon: React.ReactNode
  connected: boolean
  username?: string
  lastSync?: string
  permissions?: string[]
}

interface SocialAuthProps {
  selectedClient?: string | null
}

export function SocialAuth({ selectedClient }: SocialAuthProps) {
  const [accounts, setAccounts] = useState<SocialAccount[]>([
    {
      platform: "instagram",
      name: "Instagram",
      icon: <Instagram className="h-5 w-5" />,
      connected: false,
      permissions: ["publish_posts", "read_insights"],
    },
    {
      platform: "facebook",
      name: "Facebook",
      icon: <Facebook className="h-5 w-5" />,
      connected: true,
      username: "@migmedia",
      lastSync: "2024-01-15T10:30:00Z",
      permissions: ["publish_posts", "manage_pages", "read_insights"],
    },
    {
      platform: "linkedin",
      name: "LinkedIn",
      icon: <Linkedin className="h-5 w-5" />,
      connected: false,
      permissions: ["publish_posts", "read_profile"],
    },
    {
      platform: "twitter",
      name: "Twitter/X",
      icon: <Twitter className="h-5 w-5" />,
      connected: false,
      permissions: ["publish_tweets", "read_profile"],
    },
    {
      platform: "youtube",
      name: "YouTube",
      icon: <Youtube className="h-5 w-5" />,
      connected: false,
      permissions: ["upload_videos", "manage_channel"],
    },
  ])

  const [connecting, setConnecting] = useState<string | null>(null)

  const handleConnect = async (platform: string) => {
    setConnecting(platform)

    // Simulate OAuth flow
    setTimeout(() => {
      setAccounts((prev) =>
        prev.map((account) =>
          account.platform === platform
            ? {
                ...account,
                connected: true,
                username: `@${selectedClient?.toLowerCase().replace(/\s+/g, "") || "user"}`,
                lastSync: new Date().toISOString(),
              }
            : account,
        ),
      )
      setConnecting(null)
    }, 2000)
  }

  const handleDisconnect = (platform: string) => {
    setAccounts((prev) =>
      prev.map((account) =>
        account.platform === platform
          ? {
              ...account,
              connected: false,
              username: undefined,
              lastSync: undefined,
            }
          : account,
      ),
    )
  }

  const handleRefresh = async (platform: string) => {
    setConnecting(platform)
    setTimeout(() => {
      setAccounts((prev) =>
        prev.map((account) =>
          account.platform === platform
            ? {
                ...account,
                lastSync: new Date().toISOString(),
              }
            : account,
        ),
      )
      setConnecting(null)
    }, 1000)
  }

  const connectedCount = accounts.filter((account) => account.connected).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Social Media Authentication</h2>
          <p className="text-muted-foreground">
            Connect your social media accounts to enable posting and analytics
            {selectedClient && ` for ${selectedClient}`}
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          {connectedCount}/{accounts.length} Connected
        </Badge>
      </div>

      {connectedCount === 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You need to connect at least one social media account to start posting content. Click "Connect" on any
            platform below to get started.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {accounts.map((account) => (
          <Card key={account.platform} className={account.connected ? "border-green-200" : ""}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      account.connected ? "bg-green-100 text-green-600" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {account.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{account.name}</CardTitle>
                    {account.connected && account.username && (
                      <p className="text-sm text-muted-foreground">{account.username}</p>
                    )}
                  </div>
                </div>
                {account.connected ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-orange-500" />
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Badge variant={account.connected ? "default" : "secondary"}>
                  {account.connected ? "Connected" : "Not Connected"}
                </Badge>
                {account.connected && account.lastSync && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Last synced: {new Date(account.lastSync).toLocaleString()}
                  </p>
                )}
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Permissions</h4>
                <div className="flex flex-wrap gap-1">
                  {account.permissions?.map((permission) => (
                    <Badge key={permission} variant="outline" className="text-xs">
                      {permission.replace(/_/g, " ")}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                {account.connected ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRefresh(account.platform)}
                      disabled={connecting === account.platform}
                      className="flex-1"
                    >
                      {connecting === account.platform ? (
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="mr-2 h-4 w-4" />
                      )}
                      Refresh
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDisconnect(account.platform)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Disconnect
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => handleConnect(account.platform)}
                    disabled={connecting === account.platform}
                    className="flex-1"
                  >
                    {connecting === account.platform ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Connect
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {connectedCount > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Connected Accounts Summary</CardTitle>
            <CardDescription>Overview of your connected social media accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {accounts
                .filter((account) => account.connected)
                .map((account) => (
                  <div key={account.platform} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-green-100 text-green-600">{account.icon}</div>
                      <div>
                        <p className="font-medium">{account.name}</p>
                        <p className="text-sm text-muted-foreground">{account.username}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="default">Active</Badge>
                      <p className="text-xs text-muted-foreground mt-1">{account.permissions?.length} permissions</p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
