"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, TrendingUp, Users, Eye, AlertCircle, RefreshCw, Zap } from "lucide-react"
import { CampaignTimeline } from "@/components/campaign-timeline"
import { ContentLibraryTable } from "@/components/content-library-table"
import { ScheduledContentQueue } from "@/components/scheduled-content-queue"

/* ---------- Types ---------- */
interface Client {
  id: string
  client_name: string
  ig_handle: string | null
  fb_page: string | null
  linkedin_url: string | null
  contact_email: string
  notes: string | null
  created_at: string
  updated_at: string
}

interface ClientStats {
  totalCampaigns: number
  activeCampaigns: number
  scheduledPosts: number
  totalPosts: number
  campaigns?: any[]
  upcomingPosts?: any[]
}

interface ClientDashboardProps {
  selectedClient: string | null
}

/* ---------- Component ---------- */
export function ClientDashboard({ selectedClient }: ClientDashboardProps) {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [initializing, setInitializing] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())
  const [clientStats, setClientStats] = useState<ClientStats>({
    totalCampaigns: 0,
    activeCampaigns: 0,
    scheduledPosts: 0,
    totalPosts: 0,
  })
  const [statsLoading, setStatsLoading] = useState(false)

  /* ---------- Data loaders ---------- */
  useEffect(() => {
    loadClients()
  }, [])

  useEffect(() => {
    loadClientStats()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClient, clients])

  const loadClientStats = async () => {
    setStatsLoading(true)
    try {
      if (!selectedClient) {
        // Aggregate stats
        const response = await fetch("/api/campaigns")
        if (!response.ok) {
          throw new Error(`Server error (${response.status})`)
        }
        const campaigns: any[] = await response.json().catch(() => [])
        setClientStats({
          totalCampaigns: campaigns.length,
          activeCampaigns: campaigns.filter((c) => c.status === "active").length,
          scheduledPosts: 0, // TODO
          totalPosts: 0, // TODO
        })
      } else {
        const client = clients.find((c) => c.client_name === selectedClient)
        if (client) {
          const response = await fetch(`/api/clients/${client.id}/stats`)
          if (!response.ok) {
            throw new Error(`Server error (${response.status})`)
          }
          const stats = await response.json()
          setClientStats(stats)
        }
      }
    } catch (err) {
      console.error("Error loading client stats:", err)
      setClientStats({
        totalCampaigns: 0,
        activeCampaigns: 0,
        scheduledPosts: 0,
        totalPosts: 0,
      })
    } finally {
      setStatsLoading(false)
    }
  }

  const loadClients = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/clients")
      if (!response.ok) {
        throw new Error(`Server error (${response.status})`)
      }
      const data = await response.json().catch(() => [])
      if (Array.isArray(data)) {
        setClients(data)
        if (data.length === 0) await initializeDatabase()
      } else if (data?.clients && Array.isArray(data.clients)) {
        setClients(data.clients)
        if (data.clients.length === 0) await initializeDatabase()
      } else {
        throw new Error("Invalid response format")
      }
      setLastRefresh(new Date())
    } catch (err) {
      console.error("Error loading clients:", err)
      setError(err instanceof Error ? err.message : "Failed to load clients from DB")
      setClients([])
    } finally {
      setLoading(false)
    }
  }

  const initializeDatabase = async () => {
    setInitializing(true)
    try {
      const response = await fetch("/api/clients/init", { method: "POST" })
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        throw new Error(payload?.error || "Failed to initialize database")
      }
      await loadClients()
    } catch (err) {
      console.error("Error initializing database:", err)
      setError(err instanceof Error ? err.message : "Failed to initialize database")
    } finally {
      setInitializing(false)
    }
  }

  /* ---------- Helpers ---------- */
  const getSelectedClientData = () => clients.find((c) => c.client_name === selectedClient) || null

  /* ---------- UI ---------- */
  if (loading || initializing) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">
            {initializing ? "Setting up default client..." : "Loading dashboard..."}
          </p>
        </div>
      </div>
    )
  }

  const selClient = getSelectedClientData()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{selectedClient ? `${selectedClient} Dashboard` : "Client Dashboard"}</h1>
          <p className="text-muted-foreground">
            {selectedClient ? `Real-time data for ${selectedClient}` : "Overview of all client activities"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Last updated: {lastRefresh.toLocaleTimeString()}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={loadClients}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Badge variant="outline" className="text-sm">
            {selectedClient || "All Clients"}
          </Badge>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20">
          <CardContent className="flex items-center gap-3 py-4">
            <AlertCircle className="h-5 w-5 text-orange-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-orange-800">Database Connection Issue</p>
              <p className="text-xs text-orange-600">{error}</p>
            </div>
            <Button variant="outline" size="sm" onClick={loadClients}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {/* No clients */}
      {clients.length === 0 && !error ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Setting Up Your First Client</h3>
            <p className="text-muted-foreground text-center mb-6">
              We'll create a default Mig Media client to get you started.
            </p>
            <Button onClick={initializeDatabase} disabled={initializing}>
              <Zap className="mr-2 h-4 w-4" />
              {initializing ? "Creating..." : "Create Mig Media Client"}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title={selectedClient ? "Client Campaigns" : "Total Clients"}
              value={statsLoading ? undefined : selectedClient ? clientStats.totalCampaigns : clients.length}
              icon={<Users className="h-4 w-4 text-muted-foreground" />}
            />
            <StatCard
              title="Active Campaigns"
              value={statsLoading ? undefined : clientStats.activeCampaigns}
              icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
            />
            <StatCard
              title="Scheduled Posts"
              value={statsLoading ? undefined : clientStats.scheduledPosts}
              icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
            />
            <StatCard
              title="Total Posts"
              value={statsLoading ? undefined : clientStats.totalPosts}
              icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
            />
          </div>

          {/* Selected client details */}
          {selectedClient && selClient && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {selectedClient} Details
                </CardTitle>
                <CardDescription>Real client information from database</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-medium mb-2">Contact Information</h4>
                    <div className="space-y-1 text-sm">
                      <p>
                        <strong>Email:</strong> {selClient.contact_email}
                      </p>
                      <p>
                        <strong>Created:</strong> {new Date(selClient.created_at).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>ID:</strong> {selClient.id}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Social Media Accounts</h4>
                    <div className="flex gap-2">
                      {selClient.ig_handle && (
                        <Badge variant="outline" className="text-xs">
                          IG: {selClient.ig_handle}
                        </Badge>
                      )}
                      {selClient.fb_page && (
                        <Badge variant="outline" className="text-xs">
                          FB
                        </Badge>
                      )}
                      {selClient.linkedin_url && (
                        <Badge variant="outline" className="text-xs">
                          LI
                        </Badge>
                      )}
                      {!selClient.ig_handle && !selClient.fb_page && !selClient.linkedin_url && (
                        <Badge variant="outline" className="text-xs text-muted-foreground">
                          No accounts
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {selClient.notes && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Notes</h4>
                    <p className="text-sm text-muted-foreground">{selClient.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Dynamic widgets */}
          <div className="grid gap-6 lg:grid-cols-2">
            <CampaignTimeline selectedClient={selectedClient} onClickItem={(c) => console.log("View campaign", c)} />
            <ScheduledContentQueue selectedClient={selectedClient} />
          </div>

          <ContentLibraryTable selectedClient={selectedClient} />

          {/* All clients list (when no client selected) */}
          {!selectedClient && clients.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>All Clients</CardTitle>
                <CardDescription>Real client data from database</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {clients.map((client) => (
                    <div key={client.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{client.client_name}</p>
                        <p className="text-sm text-muted-foreground">{client.contact_email}</p>
                        <p className="text-xs text-muted-foreground">ID: {client.id}</p>
                        <div className="flex gap-2 mt-1">
                          {client.ig_handle && (
                            <Badge variant="outline" className="text-xs">
                              IG
                            </Badge>
                          )}
                          {client.fb_page && (
                            <Badge variant="outline" className="text-xs">
                              FB
                            </Badge>
                          )}
                          {client.linkedin_url && (
                            <Badge variant="outline" className="text-xs">
                              LI
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Loading campaigns...</p>
                        <Button variant="outline" size="sm" className="mt-1 bg-transparent">
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}

/* ---------- Re-usable StatCard ---------- */
function StatCard({
  title,
  value,
  icon,
}: {
  title: string
  value: number | undefined
  icon: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value === undefined ? (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
          ) : (
            value
          )}
        </div>
        <p className="text-xs text-muted-foreground">&nbsp;</p>
      </CardContent>
    </Card>
  )
}
