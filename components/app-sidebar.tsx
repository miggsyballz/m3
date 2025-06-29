"use client"

import { Calendar, Users, Plus, Eye, Rocket, Upload, Wand2, Grid3X3, Key, Folder, Database } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"

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
    <Sidebar className="border-r">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Wand2 className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">M3</h2>
            <p className="text-xs text-muted-foreground">Mig Marketing Machine</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Clients</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setActiveTab("Create Client")}>
                  <Plus className="h-4 w-4" />
                  <span>Create Client</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setActiveTab("Client Dashboard")}>
                  <Eye className="h-4 w-4" />
                  <span>View All</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {(clients.length > 0 || loading) && (
          <>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupLabel>
                {loading ? "Loading Clients..." : `Active Clients (${clients.length})`}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {loading ? (
                    <SidebarMenuItem>
                      <SidebarMenuButton disabled>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                        <span>Loading from Neon...</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ) : (
                    clients.map((client) => (
                      <SidebarMenuItem key={client}>
                        <SidebarMenuButton
                          onClick={() => setSelectedClient(client)}
                          isActive={selectedClient === client}
                        >
                          <Users className="h-4 w-4" />
                          <span>{client}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Campaigns</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setActiveTab("Campaign Builder")}>
                  <Plus className="h-4 w-4" />
                  <span>Create Campaign</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setActiveTab("Calendar")}>
                  <Calendar className="h-4 w-4" />
                  <span>View Calendar</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setActiveTab("Launch Campaign")}>
                  <Rocket className="h-4 w-4" />
                  <span>Launch</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Content Library</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setActiveTab("Content Library")}>
                  <Upload className="h-4 w-4" />
                  <span>Import</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setActiveTab("AI Rewriter")}>
                  <Wand2 className="h-4 w-4" />
                  <span>AI Tools</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setActiveTab("Content Library")}>
                  <Grid3X3 className="h-4 w-4" />
                  <span>Media Grid</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setActiveTab("Settings")}>
                  <Key className="h-4 w-4" />
                  <span>APIs</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setActiveTab("Settings")}>
                  <Folder className="h-4 w-4" />
                  <span>Folders</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setActiveTab("Settings")}>
                  <Database className="h-4 w-4" />
                  <span>Backup</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="text-xs text-muted-foreground">
          <p>© 2024 Mig Media</p>
          <p>Marketing Machine Suite</p>
          <p className="text-green-600">🟢 Connected to Neon</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
