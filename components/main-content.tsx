"use client"

import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ClientDashboard } from "@/components/client-dashboard"
import { CampaignBuilder } from "@/components/campaign-builder"
import { CalendarView } from "@/components/calendar-view"
import { ContentLibrary } from "@/components/content-library"
import { ContentManagement } from "@/components/content-management"
import { HashtagTools } from "@/components/hashtag-tools"
import { SettingsView } from "@/components/settings-view"
import { CreateClient } from "@/components/create-client"
import { AIRewriterStandalone } from "@/components/ai-rewriter-standalone"

interface MainContentProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  selectedClient: string | null
}

export function MainContent({ activeTab, setActiveTab, selectedClient }: MainContentProps) {
  const tabs = [
    "Client Dashboard",
    "Campaign Builder",
    "Calendar",
    "Content Library",
    "M3 Content System",
    "AI Rewriter",
    "Hashtag Tools",
    "Settings",
  ]

  return (
    <SidebarInset>
      <header className="sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
        <SidebarTrigger className="-ml-1" />
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

      <div className="flex flex-1 flex-col gap-4 p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-8">
            {tabs.map((tab) => (
              <TabsTrigger key={tab} value={tab} className="text-xs">
                {tab === "M3 Content System" ? "M3 System" : tab}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="Client Dashboard" className="mt-4">
            <ClientDashboard selectedClient={selectedClient} />
          </TabsContent>

          <TabsContent value="Campaign Builder" className="mt-4">
            <CampaignBuilder selectedClient={selectedClient} />
          </TabsContent>

          <TabsContent value="Calendar" className="mt-4">
            <CalendarView selectedClient={selectedClient} />
          </TabsContent>

          <TabsContent value="Content Library" className="mt-4">
            <ContentLibrary selectedClient={selectedClient} />
          </TabsContent>

          <TabsContent value="M3 Content System" className="mt-4">
            <ContentManagement selectedClient={selectedClient} />
          </TabsContent>

          <TabsContent value="AI Rewriter" className="mt-4">
            <AIRewriterStandalone />
          </TabsContent>

          <TabsContent value="Hashtag Tools" className="mt-4">
            <HashtagTools />
          </TabsContent>

          <TabsContent value="Settings" className="mt-4">
            <SettingsView />
          </TabsContent>

          <TabsContent value="Create Client" className="mt-4">
            <CreateClient />
          </TabsContent>
        </Tabs>
      </div>
    </SidebarInset>
  )
}
