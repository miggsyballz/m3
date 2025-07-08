"use client"

import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { ClientDashboard } from "@/components/client-dashboard"
import { CampaignBuilder } from "@/components/campaign-builder"
import { CalendarView } from "@/components/calendar-view"
import { ContentLibrary } from "@/components/content-library"
import { ContentManagement } from "@/components/content-management"
import { AIContentTools } from "@/components/ai-content-tools"
import { SettingsView } from "@/components/settings-view"
import { CreateClient } from "@/components/create-client"

interface MainContentProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  selectedClient: string | null
}

export function MainContent({ activeTab, setActiveTab, selectedClient }: MainContentProps) {
  /* Top-level tabs */
  const tabs = ["Client Dashboard", "Campaign Builder", "Calendar", "Content Library", "AI Tools", "Settings"]

  return (
    <div className="h-full flex flex-col">
      {/* Sticky header */}
      <header className="h-16 flex items-center gap-2 border-b bg-background px-4">
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>M3 Dashboard</BreadcrumbPage>
            </BreadcrumbItem>

            {selectedClient && (
              <>
                <Separator orientation="vertical" className="mx-2 h-4" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{selectedClient}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      {/* Main scrolling area */}
      <div className="flex-1 flex flex-col gap-4 p-4 overflow-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-4">
            {tabs.map((tab) => (
              <TabsTrigger key={tab} value={tab} className="text-sm">
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Individual tab panels */}
          <TabsContent value="Client Dashboard">
            <ClientDashboard selectedClient={selectedClient} />
          </TabsContent>

          <TabsContent value="Campaign Builder">
            <CampaignBuilder selectedClient={selectedClient} />
          </TabsContent>

          <TabsContent value="Calendar">
            <CalendarView selectedClient={selectedClient} />
          </TabsContent>

          <TabsContent value="Content Library">
            <ContentLibrary selectedClient={selectedClient} />
          </TabsContent>

          <TabsContent value="AI Tools">
            <AIContentTools />
          </TabsContent>

          <TabsContent value="Settings">
            <SettingsView />
          </TabsContent>

          {/* Hidden panel kept for back-compatibility (if any link still opens it) */}
          <TabsContent value="M3 Content System">
            <ContentManagement selectedClient={selectedClient} />
          </TabsContent>

          {/* Developer utility – create client form */}
          <TabsContent value="Create Client">
            <CreateClient />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
