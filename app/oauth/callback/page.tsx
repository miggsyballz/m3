"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

export default function OAuthCallbackPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code")
      const state = searchParams.get("state")
      const error = searchParams.get("error")

      if (error) {
        setStatus("error")
        setMessage(`OAuth error: ${error}`)
        return
      }

      if (!code || !state) {
        setStatus("error")
        setMessage("Missing authorization code or state parameter")
        return
      }

      try {
        // Parse state to get client ID and platform
        const [clientId, platform] = state.split("-")

        // Exchange code for access token
        const response = await fetch("/api/oauth/exchange", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code,
            clientId,
            platform,
            state,
          }),
        })

        const data = await response.json()

        if (data.success) {
          setStatus("success")
          setMessage(`Successfully connected ${platform}!`)

          // Close popup after 2 seconds
          setTimeout(() => {
            window.close()
          }, 2000)
        } else {
          setStatus("error")
          setMessage(data.error || "Failed to complete OAuth")
        }
      } catch (error) {
        console.error("OAuth callback error:", error)
        setStatus("error")
        setMessage("An unexpected error occurred")
      }
    }

    handleCallback()
  }, [searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            {status === "loading" && <Loader2 className="h-5 w-5 animate-spin" />}
            {status === "success" && <CheckCircle className="h-5 w-5 text-green-500" />}
            {status === "error" && <XCircle className="h-5 w-5 text-red-500" />}
            OAuth Callback
          </CardTitle>
          <CardDescription>
            {status === "loading" && "Processing your authorization..."}
            {status === "success" && "Authorization successful!"}
            {status === "error" && "Authorization failed"}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground">{message}</p>
          {status === "success" && (
            <p className="text-xs text-muted-foreground mt-2">This window will close automatically...</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
