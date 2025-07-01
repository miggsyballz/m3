"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { MainContent } from "@/components/main-content"
import { SidebarProvider } from "@/components/ui/sidebar"

export function M3Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [selectedClient, setSelectedClient] = useState<string | null>(null)

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedClient={selectedClient}
          setSelectedClient={setSelectedClient}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <MainContent activeTab={activeTab} selectedClient={selectedClient} />
        </div>
      </div>
    </SidebarProvider>
  )
}
