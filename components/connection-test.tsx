"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react"

interface ConnectionStatus {
  name: string
  status: "connected" | "error" | "testing" | "not-tested"
  message?: string
  details?: string
}

export function ConnectionTest() {
  const [connections, setConnections] = useState<ConnectionStatus[]>([
    { name: "Neon Database", status: "not-tested" },
    { name: "OpenAI API", status: "not-tested" },
    { name: "Facebook API", status: "not-tested" },
    { name: "Instagram API", status: "not-tested" },
  ])

  const testConnection = async (connectionName: string) => {
    setConnections((prev) => prev.map((conn) => (conn.name === connectionName ? { ...conn, status: "testing" } : conn)))

    try {
      let endpoint = ""
      switch (connectionName) {
        case "Neon Database":
          endpoint = "/api/clients"
          break
        case "OpenAI API":
          endpoint = "/api/content/ai-rewrite"
          break
        case "Facebook API":
          endpoint = "/api/oauth/connect"
          break
        case "Instagram API":
          endpoint = "/api/oauth/connect"
          break
      }

      const response = await fetch(endpoint, {
        method: connectionName === "OpenAI API" ? "POST" : "GET",
        headers: { "Content-Type": "application/json" },
        body:
          connectionName === "OpenAI API"
            ? JSON.stringify({
                content: "Test connection",
                tone: "professional",
              })
            : undefined,
      })

      const data = await response.json()

      setConnections((prev) =>
        prev.map((conn) =>
          conn.name === connectionName
            ? {
                ...conn,
                status: response.ok ? "connected" : "error",
                message: response.ok ? "Connection successful" : data.error || "Connection failed",
                details: JSON.stringify(data, null, 2),
              }
            : conn,
        ),
      )
    } catch (error) {
      setConnections((prev) =>
        prev.map((conn) =>
          conn.name === connectionName
            ? {
                ...conn,
                status: "error",
                message: error instanceof Error ? error.message : "Unknown error",
              }
            : conn,
        ),
      )
    }
  }

  const testAllConnections = async () => {
    for (const conn of connections) {
      await testConnection(conn.name)
      // Small delay between tests
      await new Promise((resolve) => setTimeout(resolve, 500))
    }
  }

  const getStatusIcon = (status: ConnectionStatus["status"]) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "testing":
        return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusBadge = (status: ConnectionStatus["status"]) => {
    switch (status) {
      case "connected":
        return <Badge className="bg-green-100 text-green-800">Connected</Badge>
      case "error":
        return <Badge variant="destructive">Error</Badge>
      case "testing":
        return <Badge className="bg-blue-100 text-blue-800">Testing...</Badge>
      default:
        return <Badge variant="outline">Not Tested</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5" />
          M3 Connection Status
        </CardTitle>
        <CardDescription>Test all your integrations to ensure everything is working properly</CardDescription>
        <Button onClick={testAllConnections} className="w-fit">
          Test All Connections
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {connections.map((conn) => (
            <div key={conn.name} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(conn.status)}
                <div>
                  <h4 className="font-medium">{conn.name}</h4>
                  {conn.message && <p className="text-sm text-muted-foreground">{conn.message}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(conn.status)}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => testConnection(conn.name)}
                  disabled={conn.status === "testing"}
                >
                  Test
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Environment Variables Check */}
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">Environment Variables Status</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex justify-between">
              <span>DATABASE_URL:</span>
              <Badge variant={process.env.DATABASE_URL ? "default" : "destructive"}>
                {process.env.DATABASE_URL ? "Set" : "Missing"}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>OPENAI_API_KEY:</span>
              <Badge variant={process.env.OPENAI_API_KEY ? "default" : "destructive"}>
                {process.env.OPENAI_API_KEY ? "Set" : "Missing"}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>FACEBOOK_CLIENT_ID:</span>
              <Badge variant={process.env.FACEBOOK_CLIENT_ID ? "default" : "destructive"}>
                {process.env.FACEBOOK_CLIENT_ID ? "Set" : "Missing"}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>INSTAGRAM_CLIENT_ID:</span>
              <Badge variant={process.env.INSTAGRAM_CLIENT_ID ? "default" : "destructive"}>
                {process.env.INSTAGRAM_CLIENT_ID ? "Set" : "Missing"}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
