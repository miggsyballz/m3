"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Calendar, FileText, Hash, Home, Plus, Settings, Sparkles, Target, Users, Wand2, Bot } from "lucide-react"

interface Client {
  id: string
  client_name: string
  contact_email: string
  created_at: string
}

interface AppSidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  selectedClient: string | null
  setSelectedClient: (client: string | null) => void
}

export function AppSidebar({ activeTab, setActiveTab, selectedClient, setSelectedClient }: AppSidebarProps) {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadClients()
  }, [])

  const loadClients = async () => {
    try {
      const response = await fetch("/api/clients")
      if (response.ok) {
        const data = await response.json()
        setClients(Array.isArray(data) ? data : data.clients || [])

        // Auto-select first client if none selected
        if (!selectedClient && data.length > 0) {
          setSelectedClient(data[0].client_name)
        }
      }
    } catch (error) {
      console.error("Error loading clients:", error)
    } finally {
      setLoading(false)
    }
  }

  const navigationItems = [
    { id: "dashboard", label: "Client Dashboard", icon: Home },
    { id: "campaigns", label: "Campaign Builder", icon: Target },
    { id: "calendar", label: "Calendar", icon: Calendar },
    { id: "content", label: "Content Library", icon: FileText },
    { id: "campaign-assistant", label: "Campaign Assistant", icon: Bot },
    { id: "ai-rewriter", label: "AI Rewriter", icon: Wand2 },
    { id: "hashtag-tools", label: "Hashtag Tools", icon: Hash },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  return (
    <div className="w-64 border-r bg-muted/10 flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-xl font-bold">M3</h1>
            <p className="text-xs text-muted-foreground">Marketing Machine</p>
          </div>
        </div>
      </div>

      {/* Clients Section */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-muted-foreground">Clients</h2>
          <Button size="sm" variant="ghost" onClick={() => setActiveTab("create-client")} className="h-6 w-6 p-0">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="h-32">
          <div className="space-y-1">
            {loading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mx-auto"></div>
                <p className="text-xs text-muted-foreground mt-2">Loading...</p>
              </div>
            ) : clients.length > 0 ? (
              clients.map((client) => (
                <Button
                  key={client.id}
                  variant={selectedClient === client.client_name ? "secondary" : "ghost"}
                  className="w-full justify-start text-left h-auto p-2"
                  onClick={() => setSelectedClient(client.client_name)}
                >
                  <div className="flex items-center gap-2 w-full">
                    <Users className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate text-sm">{client.client_name}</span>
                  </div>
                </Button>
              ))
            ) : (
              <div className="text-center py-4">
                <p className="text-xs text-muted-foreground">No clients yet</p>
                <Button size="sm" variant="outline" onClick={() => setActiveTab("create-client")} className="mt-2">
                  <Plus className="h-3 w-3 mr-1" />
                  Add Client
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab(item.id)}
              >
                <Icon className="mr-2 h-4 w-4" />
                {item.label}
                {item.id === "campaign-assistant" && (
                  <Badge variant="secondary" className="ml-auto text-xs">
                    AI
                  </Badge>
                )}
              </Button>
            )
          })}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t">
        <div className="text-xs text-muted-foreground text-center">
          <p>© 2024 Mig Media</p>
          <p className="text-green-600">🟢 Connected</p>
        </div>
      </div>
    </div>
  )
}
