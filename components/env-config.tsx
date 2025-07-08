"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Eye, EyeOff, CheckCircle, XCircle, ExternalLink } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

interface EnvVariable {
  key: string
  description: string
  required: boolean
  category: string
  placeholder?: string
  link?: string
  isSecret?: boolean
}

const envVariables: EnvVariable[] = [
  // Database
  {
    key: "DATABASE_URL",
    description: "Main Neon database connection string",
    required: true,
    category: "database",
    placeholder: "postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb",
    link: "https://neon.tech",
    isSecret: true,
  },
  {
    key: "POSTGRES_URL",
    description: "Alternative Postgres connection string",
    required: false,
    category: "database",
    placeholder: "postgresql://username:password@localhost:5432/m3_database",
    isSecret: true,
  },
  {
    key: "POSTGRES_PRISMA_URL",
    description: "Prisma-compatible connection string with pgbouncer",
    required: false,
    category: "database",
    placeholder: "postgresql://username:password@localhost:5432/m3_database?pgbouncer=true&connect_timeout=15",
    isSecret: true,
  },

  // AI Services
  {
    key: "OPENAI_API_KEY",
    description: "OpenAI API key for AI content rewriting and generation",
    required: true,
    category: "ai",
    placeholder: "sk-proj-...",
    link: "https://platform.openai.com/api-keys",
    isSecret: true,
  },

  // Social Media - Facebook/Meta
  {
    key: "FACEBOOK_CLIENT_ID",
    description: "Facebook App ID for OAuth integration",
    required: true,
    category: "social",
    placeholder: "1234567890123456",
    link: "https://developers.facebook.com/apps",
  },
  {
    key: "FACEBOOK_CLIENT_SECRET",
    description: "Facebook App Secret for OAuth integration",
    required: true,
    category: "social",
    placeholder: "abcdef1234567890abcdef1234567890",
    link: "https://developers.facebook.com/apps",
    isSecret: true,
  },

  // Social Media - Instagram
  {
    key: "INSTAGRAM_CLIENT_ID",
    description: "Instagram App ID (usually same as Facebook)",
    required: true,
    category: "social",
    placeholder: "1234567890123456",
    link: "https://developers.facebook.com/apps",
  },
  {
    key: "INSTAGRAM_CLIENT_SECRET",
    description: "Instagram App Secret (usually same as Facebook)",
    required: true,
    category: "social",
    placeholder: "abcdef1234567890abcdef1234567890",
    link: "https://developers.facebook.com/apps",
    isSecret: true,
  },

  // Social Media - LinkedIn
  {
    key: "LINKEDIN_CLIENT_ID",
    description: "LinkedIn App Client ID",
    required: false,
    category: "social",
    placeholder: "78abcdefghijklmn",
    link: "https://developer.linkedin.com/",
  },
  {
    key: "LINKEDIN_CLIENT_SECRET",
    description: "LinkedIn App Client Secret",
    required: false,
    category: "social",
    placeholder: "ABCDEFGHIJKLMNOP",
    link: "https://developer.linkedin.com/",
    isSecret: true,
  },

  // Social Media - Twitter/X
  {
    key: "TWITTER_CLIENT_ID",
    description: "Twitter/X App Client ID",
    required: false,
    category: "social",
    placeholder: "VGhpc0lzQW5FeGFtcGxlQ2xpZW50SWQ",
    link: "https://developer.twitter.com/",
  },
  {
    key: "TWITTER_CLIENT_SECRET",
    description: "Twitter/X App Client Secret",
    required: false,
    category: "social",
    placeholder: "VGhpc0lzQW5FeGFtcGxlQ2xpZW50U2VjcmV0",
    link: "https://developer.twitter.com/",
    isSecret: true,
  },

  // Social Media - Google/YouTube
  {
    key: "GOOGLE_CLIENT_ID",
    description: "Google OAuth Client ID for YouTube integration",
    required: false,
    category: "social",
    placeholder: "123456789012-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com",
    link: "https://console.cloud.google.com/",
  },
  {
    key: "GOOGLE_CLIENT_SECRET",
    description: "Google OAuth Client Secret",
    required: false,
    category: "social",
    placeholder: "GOCSPX-abcdefghijklmnopqrstuvwxyz",
    link: "https://console.cloud.google.com/",
    isSecret: true,
  },

  // Social Media - TikTok
  {
    key: "TIKTOK_CLIENT_KEY",
    description: "TikTok App Client Key",
    required: false,
    category: "social",
    placeholder: "aw123456789012345678",
    link: "https://developers.tiktok.com/",
  },
  {
    key: "TIKTOK_CLIENT_SECRET",
    description: "TikTok App Client Secret",
    required: false,
    category: "social",
    placeholder: "abcdef1234567890abcdef1234567890abcdef12",
    link: "https://developers.tiktok.com/",
    isSecret: true,
  },

  // App Configuration
  {
    key: "NEXTAUTH_URL",
    description: "Base URL for OAuth callbacks",
    required: true,
    category: "config",
    placeholder: "http://localhost:3000",
  },
  {
    key: "M3_BASE_DIR",
    description: "Base directory for M3 content storage",
    required: false,
    category: "config",
    placeholder: "/path/to/m3/content",
  },
]

export function EnvConfig() {
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({})
  const [envValues, setEnvValues] = useState<Record<string, string>>({})

  const toggleSecret = (key: string) => {
    setShowSecrets((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const generateEnvFile = () => {
    const envContent = envVariables
      .map((env) => {
        const value = envValues[env.key] || ""
        const comment = `# ${env.description}`
        const line = `${env.key}="${value}"`
        return `${comment}\n${line}`
      })
      .join("\n\n")

    return `# M3 Marketing Machine Environment Variables
# Copy this to your .env.local file

${envContent}`
  }

  const getStatusBadge = (env: EnvVariable) => {
    const hasValue = envValues[env.key]?.trim()
    if (env.required) {
      return hasValue ? (
        <Badge className="bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Set
        </Badge>
      ) : (
        <Badge variant="destructive">
          <XCircle className="w-3 h-3 mr-1" />
          Required
        </Badge>
      )
    }
    return hasValue ? (
      <Badge variant="outline" className="text-green-600">
        Optional - Set
      </Badge>
    ) : (
      <Badge variant="outline">Optional</Badge>
    )
  }

  const categorizedEnvs = {
    database: envVariables.filter((env) => env.category === "database"),
    ai: envVariables.filter((env) => env.category === "ai"),
    social: envVariables.filter((env) => env.category === "social"),
    config: envVariables.filter((env) => env.category === "config"),
  }

  const renderEnvInput = (env: EnvVariable) => (
    <div key={env.key} className="space-y-2 p-4 border rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Label htmlFor={env.key} className="font-medium">
            {env.key}
          </Label>
          {env.link && (
            <Button variant="ghost" size="sm" asChild>
              <a href={env.link} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-3 h-3" />
              </a>
            </Button>
          )}
        </div>
        {getStatusBadge(env)}
      </div>
      <p className="text-sm text-muted-foreground">{env.description}</p>
      <div className="flex gap-2">
        <Input
          id={env.key}
          type={env.isSecret && !showSecrets[env.key] ? "password" : "text"}
          placeholder={env.placeholder}
          value={envValues[env.key] || ""}
          onChange={(e) => setEnvValues((prev) => ({ ...prev, [env.key]: e.target.value }))}
          className="flex-1"
        />
        {env.isSecret && (
          <Button variant="outline" size="sm" onClick={() => toggleSecret(env.key)}>
            {showSecrets[env.key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
        )}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Environment Variables Configuration</CardTitle>
          <CardDescription>
            Configure your M3 Marketing Machine with the required API keys and connection strings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="database" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="database">Database</TabsTrigger>
              <TabsTrigger value="ai">AI Services</TabsTrigger>
              <TabsTrigger value="social">Social Media</TabsTrigger>
              <TabsTrigger value="config">Configuration</TabsTrigger>
            </TabsList>

            <TabsContent value="database" className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Database Configuration</h3>
                <p className="text-sm text-muted-foreground">
                  You need at least one database connection. Neon is recommended for production.
                </p>
                {categorizedEnvs.database.map(renderEnvInput)}
              </div>
            </TabsContent>

            <TabsContent value="ai" className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">AI Services</h3>
                <p className="text-sm text-muted-foreground">
                  Required for AI-powered content rewriting and generation features.
                </p>
                {categorizedEnvs.ai.map(renderEnvInput)}
              </div>
            </TabsContent>

            <TabsContent value="social" className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Social Media APIs</h3>
                <p className="text-sm text-muted-foreground">
                  Connect your social media platforms for automated posting and management.
                </p>
                {categorizedEnvs.social.map(renderEnvInput)}
              </div>
            </TabsContent>

            <TabsContent value="config" className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">App Configuration</h3>
                <p className="text-sm text-muted-foreground">Basic application settings and paths.</p>
                {categorizedEnvs.config.map(renderEnvInput)}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Generated .env.local File</CardTitle>
          <CardDescription>Copy this content to your .env.local file in your project root</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              value={generateEnvFile()}
              readOnly
              className="min-h-[300px] font-mono text-sm"
              placeholder="Fill in the values above to generate your .env.local file content"
            />
            <Button
              onClick={() => copyToClipboard(generateEnvFile())}
              className="w-full"
              disabled={Object.keys(envValues).length === 0}
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy to Clipboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
