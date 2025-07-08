"use client"

import { useState, useEffect } from "react"
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
        setClients([])
        setLoading(false)
        return
      }

      if (Array.isArray(data)) {
        setClients(data.map((client: any) => client.client_name))
      } else if (data.clients && Array.isArray(data.clients)) {
        setClients(data.clients.map((client: any) => client.client_name))
      } else {
        setClients([])
      }
    } catch (error) {
      console.error("Error loading clients:", error)
      setClients([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const interval = setInterval(loadClients, 10000)
    return () => clearInterval(interval)
  }, [])

  const handleSaveProgress = () => {
    console.log("Manual save triggered for:", activeTab, selectedClient)
  }

  const handleLoadProgress = (data: any) => {
    console.log("Loading saved progress:", data)
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Fixed Sidebar */}
      <aside className="w-[240px] bg-gray-50 h-full fixed left-0 top-0 z-10 border-r">
        <AppSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedClient={selectedClient}
          setSelectedClient={setSelectedClient}
          clients={clients}
          loading={loading}
        />
      </aside>

      {/* Main Content */}
      <main className="ml-[240px] flex-1 overflow-y-auto">
        <MainContent activeTab={activeTab} setActiveTab={setActiveTab} selectedClient={selectedClient} />
      </main>

      {/* Persistent Save Manager - Bottom Left */}
      <PersistentSaveManager
        activeTab={activeTab}
        selectedClient={selectedClient}
        onSave={handleSaveProgress}
        onLoad={handleLoadProgress}
      />

      {/* Campaign Manager Chat - Bottom Right */}
      <CampaignManagerChat activeTab={activeTab} selectedClient={selectedClient} />
    </div>
  )
}
