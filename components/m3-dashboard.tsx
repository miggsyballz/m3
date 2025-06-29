"use client"

import { useState, useEffect } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { MainContent } from "@/components/main-content"
import { PersistentSaveManager } from "@/components/persistent-save-manager"
import { CampaignManagerChat } from "@/components/campaign-manager-chat"

export function M3Dashboard() {
  const [activeTab, setActiveTab] = useState("Client Dashboard")
  const [selectedClient, setSelectedClient] = useState<string | null>(null)
  const [clients, setClients] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadClients()
  }, [])

  const loadClients = async () => {
    try {
      const response = await fetch("/api/clients")

      let data: any = null
      try {
        data = await response.json()
      } catch {
        // If JSON parsing fails, set empty array
        setClients([])
        setLoading(false)
        return
      }

      // Handle both success (array) and error (object with clients array) responses
      if (Array.isArray(data)) {
        setClients(data.map((client: any) => client.client_name))
      } else if (data.clients && Array.isArray(data.clients)) {
        setClients(data.clients.map((client: any) => client.client_name))
      } else {
        setClients([])
      }
    } catch (error) {
      console.error("Error loading clients:", error)
      // Set empty array on error to prevent crashes
      setClients([])
    } finally {
      setLoading(false)
    }
  }

  // Refresh clients every 10 seconds to keep sidebar updated
  useEffect(() => {
    const interval = setInterval(loadClients, 10000)
    return () => clearInterval(interval)
  }, [])

  const handleSaveProgress = () => {
    console.log("Manual save triggered for:", activeTab, selectedClient)
  }

  const handleLoadProgress = (data: any) => {
    console.log("Loading saved progress:", data)
    // You can implement form restoration logic here
  }

  return (
    <SidebarProvider>
      <AppSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedClient={selectedClient}
        setSelectedClient={setSelectedClient}
        clients={clients}
        loading={loading}
      />
      <MainContent activeTab={activeTab} setActiveTab={setActiveTab} selectedClient={selectedClient} />

      {/* Persistent Save Manager - Bottom Left */}
      <PersistentSaveManager
        activeTab={activeTab}
        selectedClient={selectedClient}
        onSave={handleSaveProgress}
        onLoad={handleLoadProgress}
      />

      {/* Campaign Manager Chat - Bottom Right */}
      <CampaignManagerChat activeTab={activeTab} selectedClient={selectedClient} />
    </SidebarProvider>
  )
}
