"use client"

import { ClientDashboard } from "@/components/client-dashboard"
import { CampaignBuilder } from "@/components/campaign-builder"
import { CalendarView } from "@/components/calendar-view"
import { ContentLibrary } from "@/components/content-library"
import { CampaignAssistant } from "@/components/campaign-assistant"
import { AIRewriterStandalone } from "@/components/ai-rewriter-standalone"
import { HashtagTools } from "@/components/hashtag-tools"
import { SettingsView } from "@/components/settings-view"
import { CreateClient } from "@/components/create-client"

interface MainContentProps {
  activeTab: string
  selectedClient: string | null
}

export function MainContent({ activeTab, selectedClient }: MainContentProps) {
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <ClientDashboard selectedClient={selectedClient} />
      case "campaigns":
        return <CampaignBuilder selectedClient={selectedClient} />
      case "calendar":
        return <CalendarView selectedClient={selectedClient} />
      case "content":
        return <ContentLibrary selectedClient={selectedClient} />
      case "campaign-assistant":
        return <CampaignAssistant selectedClient={selectedClient} />
      case "ai-rewriter":
        return <AIRewriterStandalone />
      case "hashtag-tools":
        return <HashtagTools />
      case "create-client":
        return <CreateClient />
      case "settings":
        return <SettingsView />
      default:
        return <ClientDashboard selectedClient={selectedClient} />
    }
  }

  return (
    <main className="flex-1 overflow-auto">
      <div className="container mx-auto p-6 max-w-7xl">{renderContent()}</div>
    </main>
  )
}
