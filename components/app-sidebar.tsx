"use client"

import { Calendar, Users, Plus, Eye, Rocket, Upload, Wand2, Grid3X3, Key, Folder, Database } from "lucide-react"

interface AppSidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  selectedClient: string | null
  setSelectedClient: (client: string | null) => void
  clients: string[]
  loading?: boolean
}

export function AppSidebar({
  activeTab,
  setActiveTab,
  selectedClient,
  setSelectedClient,
  clients,
  loading,
}: AppSidebarProps) {
  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Wand2 className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">M3</h2>
            <p className="text-xs text-muted-foreground">Mig Marketing Machine</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-2">
        {/* Clients Section */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2 px-2">Clients</h3>
          <div className="space-y-1">
            <button
              onClick={() => setActiveTab("Create Client")}
              className="w-full flex items-center gap-2 px-2 py-2 text-sm rounded-md hover:bg-gray-100 text-left"
            >
              <Plus className="h-4 w-4" />
              <span>Create Client</span>
            </button>
            <button
              onClick={() => setActiveTab("Client Dashboard")}
              className="w-full flex items-center gap-2 px-2 py-2 text-sm rounded-md hover:bg-gray-100 text-left"
            >
              <Eye className="h-4 w-4" />
              <span>View All</span>
            </button>
          </div>
        </div>

        {/* Active Clients */}
        {(clients.length > 0 || loading) && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2 px-2">
              {loading ? "Loading Clients..." : `Active Clients (${clients.length})`}
            </h3>
            <div className="space-y-1">
              {loading ? (
                <div className="flex items-center gap-2 px-2 py-2 text-sm">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  <span>Loading from Neon...</span>
                </div>
              ) : (
                clients.map((client) => (
                  <button
                    key={client}
                    onClick={() => setSelectedClient(client)}
                    className={`w-full flex items-center gap-2 px-2 py-2 text-sm rounded-md hover:bg-gray-100 text-left ${
                      selectedClient === client ? "bg-primary text-primary-foreground" : ""
                    }`}
                  >
                    <Users className="h-4 w-4" />
                    <span>{client}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        {/* Campaigns Section */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2 px-2">Campaigns</h3>
          <div className="space-y-1">
            <button
              onClick={() => setActiveTab("Campaign Builder")}
              className="w-full flex items-center gap-2 px-2 py-2 text-sm rounded-md hover:bg-gray-100 text-left"
            >
              <Plus className="h-4 w-4" />
              <span>Create Campaign</span>
            </button>
            <button
              onClick={() => setActiveTab("Calendar")}
              className="w-full flex items-center gap-2 px-2 py-2 text-sm rounded-md hover:bg-gray-100 text-left"
            >
              <Calendar className="h-4 w-4" />
              <span>View Calendar</span>
            </button>
            <button
              onClick={() => setActiveTab("Launch Campaign")}
              className="w-full flex items-center gap-2 px-2 py-2 text-sm rounded-md hover:bg-gray-100 text-left"
            >
              <Rocket className="h-4 w-4" />
              <span>Launch</span>
            </button>
          </div>
        </div>

        {/* Content Library Section */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2 px-2">Content Library</h3>
          <div className="space-y-1">
            <button
              onClick={() => setActiveTab("Content Library")}
              className="w-full flex items-center gap-2 px-2 py-2 text-sm rounded-md hover:bg-gray-100 text-left"
            >
              <Upload className="h-4 w-4" />
              <span>Import</span>
            </button>
            <button
              onClick={() => setActiveTab("AI Tools")}
              className="w-full flex items-center gap-2 px-2 py-2 text-sm rounded-md hover:bg-gray-100 text-left"
            >
              <Wand2 className="h-4 w-4" />
              <span>AI Tools</span>
            </button>
            <button
              onClick={() => setActiveTab("M3 Content System")}
              className="w-full flex items-center gap-2 px-2 py-2 text-sm rounded-md hover:bg-gray-100 text-left"
            >
              <Grid3X3 className="h-4 w-4" />
              <span>M3 System</span>
            </button>
          </div>
        </div>

        {/* Settings Section */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2 px-2">Settings</h3>
          <div className="space-y-1">
            <button
              onClick={() => setActiveTab("Settings")}
              className="w-full flex items-center gap-2 px-2 py-2 text-sm rounded-md hover:bg-gray-100 text-left"
            >
              <Key className="h-4 w-4" />
              <span>APIs</span>
            </button>
            <button
              onClick={() => setActiveTab("Settings")}
              className="w-full flex items-center gap-2 px-2 py-2 text-sm rounded-md hover:bg-gray-100 text-left"
            >
              <Folder className="h-4 w-4" />
              <span>Folders</span>
            </button>
            <button
              onClick={() => setActiveTab("Settings")}
              className="w-full flex items-center gap-2 px-2 py-2 text-sm rounded-md hover:bg-gray-100 text-left"
            >
              <Database className="h-4 w-4" />
              <span>Backup</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t">
        <div className="text-xs text-muted-foreground">
          <p>© 2024 Mig Media</p>
          <p>Marketing Machine Suite</p>
          <p className="text-green-600">🟢 Connected to Neon</p>
        </div>
      </div>
    </div>
  )
}
