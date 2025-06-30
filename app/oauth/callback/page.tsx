"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, CheckCircle, XCircle } from "lucide-react"

export default function OAuthCallback() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")

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
        setMessage("Missing authorization code or state")
        return
      }

      try {
        // Parse state to get client ID and platform
        const [clientId, platform] = state.split("-")

        const response = await fetch("/api/oauth/exchange", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, state, clientId, platform }),
        })

        const result = await response.json()

        if (response.ok) {
          setStatus("success")
          setMessage(`Successfully connected ${platform}!`)

          // Close popup after 2 seconds
          setTimeout(() => {
            if (window.opener) {
              window.opener.postMessage(
                {
                  type: "oauth-success",
                  platform,
                  clientId,
                },
                "*",
              )
              window.close()
            }
          }, 2000)
        } else {
          setStatus("error")
          setMessage(result.error || "Failed to exchange authorization code")
        }
      } catch (error) {
        setStatus("error")
        setMessage("Network error during token exchange")
      }
    }

    handleCallback()
  }, [searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-96">
        <CardContent className="p-6 text-center">
          {status === "loading" && (
            <>
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <h2 className="text-lg font-semibold mb-2">Processing Authorization</h2>
              <p className="text-gray-600">Exchanging authorization code for access token...</p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-4" />
              <h2 className="text-lg font-semibold mb-2 text-green-700">Success!</h2>
              <p className="text-gray-600">{message}</p>
              <p className="text-sm text-gray-500 mt-2">This window will close automatically...</p>
            </>
          )}

          {status === "error" && (
            <>
              <XCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
              <h2 className="text-lg font-semibold mb-2 text-red-700">Error</h2>
              <p className="text-gray-600">{message}</p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
