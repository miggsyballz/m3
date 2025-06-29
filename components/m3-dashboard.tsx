"use client"

import { useState, useEffect } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { MainContent } from "@/components/main-content"

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
      if (response.ok) {
        const data = await response.json()

        // Handle both success (array) and error (object with clients array) responses
        if (Array.isArray(data)) {
          setClients(data.map((client: any) => client.client_name))
        } else if (data.clients && Array.isArray(data.clients)) {
          setClients(data.clients.map((client: any) => client.client_name))
        }
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
    </SidebarProvider>
  )
}
