"use client"

import { useState, useEffect } from "react"
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
  Users,
  BarChart3,
  Camera,
  MessageSquare,
  Video,
} from "lucide-react"

const PLATFORM_CONFIG = {
  instagram: {
    name: "Instagram",
    icon: Instagram,
    color: "bg-gradient-to-r from-purple-500 to-pink-500",
    description: "Connect your Instagram account to schedule posts and view analytics",
    permissions: [
      { icon: Camera, label: "Publish posts and stories" },
      { icon: BarChart3, label: "Read insights and analytics" },
      { icon: Users, label: "Access follower data" },
    ],
  },
  facebook: {
    name: "Facebook",
    icon: Facebook,
    color: "bg-blue-600",
    description: "Connect your Facebook pages to manage posts and engagement",
    permissions: [
      { icon: MessageSquare, label: "Publish posts to pages" },
      { icon: Users, label: "Manage page followers" },
      { icon: BarChart3, label: "Read page insights" },
    ],
  },
  linkedin: {
    name: "LinkedIn",
    icon: Linkedin,
    color: "bg-blue-700",
    description: "Connect your LinkedIn profile for professional content sharing",
    permissions: [
      { icon: MessageSquare, label: "Publish posts and articles" },
      { icon: Users, label: "Read profile information" },
      { icon: BarChart3, label: "View post analytics" },
    ],
  },
  twitter: {
    name: "Twitter/X",
    icon: Twitter,
    color: "bg-black",
    description: "Connect your X (Twitter) account to schedule tweets",
    permissions: [
      { icon: MessageSquare, label: "Publish tweets and threads" },
      { icon: Users, label: "Read profile information" },
      { icon: BarChart3, label: "View tweet analytics" },
    ],
  },
  youtube: {
    name: "YouTube",
    icon: Youtube,
    color: "bg-red-600",
    description: "Connect your YouTube channel to upload and manage videos",
    permissions: [
      { icon: Video, label: "Upload videos" },
      { icon: Users, label: "Manage channel settings" },
      { icon: BarChart3, label: "View channel analytics" },
    ],
  },
  tiktok: {
    name: "TikTok",
    icon: Music,
    color: "bg-black",
    description: "Connect your TikTok account to upload short-form videos",
    permissions: [
      { icon: Video, label: "Upload videos" },
      { icon: Users, label: "Manage content" },
      { icon: BarChart3, label: "View video analytics" },
    ],
  },
}

export default function OAuthDemoPage() {
  const searchParams = useSearchParams()
  const platform = searchParams.get("platform") || "instagram"
  const clientId = searchParams.get("clientId")

  const [step, setStep] = useState<"authorize" | "loading" | "success">("authorize")
  const [countdown, setCountdown] = useState(3)

  const config = PLATFORM_CONFIG[platform as keyof typeof PLATFORM_CONFIG]
  const Icon = config?.icon || Instagram

  useEffect(() => {
    if (step === "success") {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            window.close()
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [step])

  const handleAuthorize = async () => {
    setStep("loading")

    // Simulate OAuth process
    setTimeout(async () => {
      try {
        // Complete the OAuth flow
        const response = await fetch("/api/oauth/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clientId: Number.parseInt(clientId || "0"),
            platform,
            code: "demo_auth_code",
            accessToken: `demo_access_token_${platform}_${Date.now()}`,
            refreshToken: `demo_refresh_token_${platform}_${Date.now()}`,
          }),
        })

        if (response.ok) {
          setStep("success")
        } else {
          throw new Error("Failed to complete OAuth")
        }
      } catch (error) {
        console.error("OAuth completion failed:", error)
        alert("Failed to complete authorization. Please try again.")
        window.close()
      }
    }, 2000)
  }

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-red-600">Invalid platform specified</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className={`w-16 h-16 rounded-full ${config.color} flex items-center justify-center mx-auto mb-4`}>
            <Icon className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-xl">
            {step === "authorize" && `Connect to ${config.name}`}
            {step === "loading" && "Authorizing..."}
            {step === "success" && "Successfully Connected!"}
          </CardTitle>
          <CardDescription>
            {step === "authorize" && config.description}
            {step === "loading" && "Please wait while we connect your account"}
            {step === "success" && `Your ${config.name} account has been connected successfully`}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === "authorize" && (
            <>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="font-medium">M3 Marketing Machine will be able to:</span>
                </div>

                {config.permissions.map((permission, index) => {
                  const PermissionIcon = permission.icon
                  return (
                    <div key={index} className="flex items-center space-x-3 text-sm text-gray-600 ml-6">
                      <PermissionIcon className="h-4 w-4" />
                      <span>{permission.label}</span>
                    </div>
                  )
                })}
              </div>

              <Separator />

              <div className="space-y-3">
                <Badge variant="secondary" className="w-full justify-center py-2">
                  <Shield className="h-4 w-4 mr-2" />
                  Secure OAuth 2.0 Connection
                </Badge>

                <p className="text-xs text-gray-500 text-center">
                  Your credentials are never stored. We only receive an access token to perform authorized actions.
                </p>
              </div>

              <Button onClick={handleAuthorize} className="w-full" size="lg">
                Authorize M3 Marketing Machine
              </Button>

              <Button variant="outline" onClick={() => window.close()} className="w-full">
                Cancel
              </Button>
            </>
          )}

          {step === "loading" && (
            <div className="text-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
              <p className="text-sm text-gray-600">Connecting to {config.name}...</p>
            </div>
          )}

          {step === "success" && (
            <div className="text-center space-y-4">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  You can now schedule posts and view analytics for your {config.name} account.
                </p>
                <p className="text-xs text-gray-500">This window will close automatically in {countdown} seconds...</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
