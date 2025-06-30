"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Instagram,
  Facebook,
  Linkedin,
  Twitter,
  Youtube,
  Music,
  CheckCircle,
  Loader2,
  Shield,
  ExternalLink,
} from "lucide-react"

const PLATFORM_CONFIG = {
  instagram: {
    name: "Instagram",
    icon: Instagram,
    color: "bg-gradient-to-r from-purple-500 to-pink-500",
    permissions: ["Basic Profile", "Publish Posts", "Read Insights"],
    description: "Connect your Instagram account to post photos, stories, and reels automatically.",
  },
  facebook: {
    name: "Facebook",
    icon: Facebook,
    color: "bg-blue-600",
    permissions: ["Manage Pages", "Publish Posts", "Read Insights", "Manage Ads"],
    description: "Connect your Facebook page to manage posts and access detailed analytics.",
  },
  linkedin: {
    name: "LinkedIn",
    icon: Linkedin,
    color: "bg-blue-700",
    permissions: ["Basic Profile", "Share Content", "Company Pages"],
    description: "Share professional content and manage your company's LinkedIn presence.",
  },
  twitter: {
    name: "Twitter/X",
    icon: Twitter,
    color: "bg-black",
    permissions: ["Read Profile", "Post Tweets", "Read Timeline"],
    description: "Post tweets and manage your Twitter presence automatically.",
  },
  youtube: {
    name: "YouTube",
    icon: Youtube,
    color: "bg-red-600",
    permissions: ["Upload Videos", "Manage Channel", "Read Analytics"],
    description: "Upload videos and manage your YouTube channel content.",
  },
  tiktok: {
    name: "TikTok",
    icon: Music,
    color: "bg-black",
    permissions: ["Upload Videos", "Manage Content", "Read Profile"],
    description: "Upload short-form videos and manage your TikTok content.",
  },
}

export default function OAuthDemoPage() {
  const searchParams = useSearchParams()
  const platform = searchParams.get("platform") || "instagram"
  const clientId = searchParams.get("clientId")

  const [step, setStep] = useState<"authorize" | "loading" | "success" | "error">("authorize")
  const [error, setError] = useState("")

  const platformConfig = PLATFORM_CONFIG[platform as keyof typeof PLATFORM_CONFIG]
  const Icon = platformConfig?.icon || Instagram

  useEffect(() => {
    // Auto-close if no platform or clientId
    if (!platform || !clientId) {
      setError("Missing required parameters")
      setStep("error")
      return
    }
  }, [platform, clientId])

  const handleAuthorize = async () => {
    setStep("loading")

    try {
      // Simulate OAuth flow delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Complete OAuth flow
      const response = await fetch("/api/oauth/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId,
          platform,
          code: "demo_auth_code_" + Date.now(),
          accessToken: "demo_access_token_" + Date.now(),
          refreshToken: "demo_refresh_token_" + Date.now(),
        }),
      })

      if (response.ok) {
        setStep("success")
        // Auto-close window after success
        setTimeout(() => {
          window.close()
        }, 2000)
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to complete OAuth")
        setStep("error")
      }
    } catch (error) {
      console.error("OAuth error:", error)
      setError("Failed to connect to " + platformConfig?.name)
      setStep("error")
    }
  }

  const handleCancel = () => {
    window.close()
  }

  if (!platformConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-lg font-semibold text-red-600">Unsupported Platform</h2>
              <p className="text-sm text-muted-foreground mt-2">The requested platform is not supported.</p>
              <Button onClick={handleCancel} className="mt-4">
                Close
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className={`mx-auto p-3 rounded-full ${platformConfig.color} text-white w-fit`}>
            <Icon className="h-8 w-8" />
          </div>
          <CardTitle className="text-xl">Connect to {platformConfig.name}</CardTitle>
          <CardDescription>Authorize M3 to access your {platformConfig.name} account</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === "authorize" && (
            <>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-sm mb-2">M3 will be able to:</h3>
                  <div className="space-y-2">
                    {platformConfig.permissions.map((permission) => (
                      <div key={permission} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>{permission}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="text-xs text-muted-foreground">
                  <p>{platformConfig.description}</p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div className="text-xs text-blue-800">
                      <p className="font-medium">Secure Connection</p>
                      <p>Your credentials are encrypted and stored securely. You can revoke access anytime.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleCancel} variant="outline" className="flex-1 bg-transparent">
                  Cancel
                </Button>
                <Button onClick={handleAuthorize} className="flex-1">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Authorize
                </Button>
              </div>
            </>
          )}

          {step === "loading" && (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <h3 className="font-medium mt-4">Connecting to {platformConfig.name}</h3>
              <p className="text-sm text-muted-foreground mt-2">Please wait while we establish the connection...</p>
            </div>
          )}

          {step === "success" && (
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-medium mt-4 text-green-800">Successfully Connected!</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Your {platformConfig.name} account has been connected to M3.
              </p>
              <Badge className="mt-3 bg-green-100 text-green-800">Connection Active</Badge>
              <p className="text-xs text-muted-foreground mt-4">This window will close automatically...</p>
            </div>
          )}

          {step === "error" && (
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <ExternalLink className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="font-medium mt-4 text-red-800">Connection Failed</h3>
              <p className="text-sm text-muted-foreground mt-2">{error}</p>
              <div className="flex gap-3 mt-6">
                <Button onClick={handleCancel} variant="outline" className="flex-1 bg-transparent">
                  Close
                </Button>
                <Button onClick={() => setStep("authorize")} className="flex-1">
                  Try Again
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
