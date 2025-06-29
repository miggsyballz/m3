"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, TrendingUp, Users, Plus, Eye, AlertCircle, RefreshCw, Zap } from "lucide-react"
import { CampaignTimeline } from "@/components/campaign-timeline"
import { ContentLibraryTable } from "@/components/content-library-table"
import { ScheduledContentQueue } from "@/components/scheduled-content-queue"

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

  useEffect(() => {
    loadClients()
  }, [])

  useEffect(() => {
    // Load real stats when selected client changes
    loadClientStats()
  }, [selectedClient, clients])

  const loadClientStats = async () => {
    setStatsLoading(true)
    try {
      if (!selectedClient) {
        // Load aggregate stats for all clients
        const response = await fetch("/api/campaigns")
        const campaignsData = await response.json()
        const campaigns = Array.isArray(campaignsData) ? campaignsData : campaignsData.campaigns || []

        setClientStats({
          totalCampaigns: campaigns.length,
          activeCampaigns: campaigns.filter((c: any) => c.status === "active").length,
          scheduledPosts: 0, // TODO: Implement scheduled posts API
          totalPosts: 0, // TODO: Implement content API
        })
      } else {
        // Load stats for specific client
        const client = clients.find((c) => c.client_name === selectedClient)
        if (client) {
          const response = await fetch(`/api/clients/${client.id}/stats`)
          if (response.ok) {
            const stats = await response.json()
            setClientStats(stats)
          } else {
            // Fallback to zero stats if API fails
            setClientStats({
              totalCampaigns: 0,
              activeCampaigns: 0,
              scheduledPosts: 0,
              totalPosts: 0,
            })
          }
        }
      }
    } catch (error) {
      console.error("Error loading client stats:", error)
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
      let data: any = null

      try {
        data = await response.json()
      } catch {
        /* ignore — body might be empty */
      }

      if (!response.ok) {
        const errMsg = data?.error || data?.message || `Server error (${response.status} ${response.statusText})`
        setError(errMsg)
        setClients(Array.isArray(data?.clients) ? data.clients : [])
        return
      }

      if (Array.isArray(data)) {
        setClients(data)
        if (data.length === 0) {
          await initializeDatabase()
          return
        }
      } else if (data?.clients && Array.isArray(data.clients)) {
        setClients(data.clients)
        if (data.error) setError(data.message || data.error)
        if (data.clients.length === 0) {
          await initializeDatabase()
          return
        }
      } else {
        throw new Error("Invalid response format from server")
      }

      setLastRefresh(new Date())
    } catch (err) {
      console.error("Error loading clients:", err)
      setError(err instanceof Error ? err.message : "Failed to load clients")
      setClients([])
    } finally {
      setLoading(false)
    }
  }

  const initializeDatabase = async () => {
    setInitializing(true)
    try {
      const response = await fetch("/api/clients/init", {
        method: "POST",
      })

      let result: any = null
      try {
        result = await response.json()
      } catch {
        /* ignore */
      }

      if (!response.ok) {
        throw new Error(result?.error || "Failed to initialize database")
      }

      console.log("Database initialized:", result)
      await loadClients()
    } catch (error) {
      console.error("Error initializing database:", error)
      setError(error instanceof Error ? error.message : "Failed to initialize database")
    } finally {
      setInitializing(false)
    }
  }

  const getSelectedClientData = () => {
    if (!selectedClient) return null
    return clients.find((client) => client.client_name === selectedClient)
  }

  if (loading || initializing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">
              {initializing ? "Setting up default client..." : "Loading dashboard from Neon database..."}
            </p>
          </div>
        </div>
      </div>
    )
  }

  const selectedClientData = getSelectedClientData()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{selectedClient ? `${selectedClient} Dashboard` : "Client Dashboard"}</h1>
          <p className="text-muted-foreground">
            {selectedClient
              ? `Real-time data for ${selectedClient} from Neon database`
              : "Overview of all client activities from Neon database"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Last updated: {lastRefresh.toLocaleTimeString()} • Powered by Neon
          </p>
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

      {error && (
        <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20">
          <CardContent className="flex items-center gap-3 py-4">
            <AlertCircle className="h-5 w-5 text-orange-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-orange-800 dark:text-orange-200">Database Connection Issue</p>
              <p className="text-xs text-orange-600 dark:text-orange-300">{error}</p>
            </div>
            <Button variant="outline" size="sm" onClick={loadClients}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {clients.length === 0 && !error ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Setting Up Your First Client</h3>
            <p className="text-muted-foreground text-center mb-6">
              We'll create a default Mig Media client to get you started, or you can create your own.
            </p>
            <div className="flex gap-3">
              <Button onClick={initializeDatabase} disabled={initializing}>
                <Zap className="mr-2 h-4 w-4" />
                {initializing ? "Creating..." : "Create Mig Media Client"}
              </Button>
              <Button variant="outline" onClick={() => (window.location.href = "#create-client")}>
                <Plus className="mr-2 h-4 w-4" />
                Create Custom Client
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Real client-specific stats from database */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {selectedClient ? "Client Campaigns" : "Total Clients"}
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {statsLoading ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  ) : selectedClient ? (
                    clientStats.totalCampaigns
                  ) : (
                    clients.length
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{selectedClient ? "Total campaigns" : "Active clients"}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {statsLoading ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  ) : (
                    clientStats.activeCampaigns
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Currently running</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Scheduled Posts</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {statsLoading ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  ) : (
                    clientStats.scheduledPosts
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Next 7 days</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {statsLoading ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  ) : (
                    clientStats.totalPosts
                  )}
                </div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card>
          </div>

          {/* Show client details if one is selected */}
          {selectedClient && selectedClientData && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {selectedClient} Details
                </CardTitle>
                <CardDescription>Real client information from Neon database</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-medium mb-2">Contact Information</h4>
                    <div className="space-y-1 text-sm">
                      <p>
                        <strong>Email:</strong> {selectedClientData.contact_email}
                      </p>
                      <p>
                        <strong>Created:</strong> {new Date(selectedClientData.created_at).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>Database ID:</strong> {selectedClientData.id}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Social Media Accounts</h4>
                    <div className="flex gap-2">
                      {selectedClientData.ig_handle && (
                        <Badge variant="outline" className="text-xs">
                          IG: {selectedClientData.ig_handle}
                        </Badge>
                      )}
                      {selectedClientData.fb_page && (
                        <Badge variant="outline" className="text-xs">
                          FB
                        </Badge>
                      )}
                      {selectedClientData.linkedin_url && (
                        <Badge variant="outline" className="text-xs">
                          LI
                        </Badge>
                      )}
                      {!selectedClientData.ig_handle &&
                        !selectedClientData.fb_page &&
                        !selectedClientData.linkedin_url && (
                          <Badge variant="outline" className="text-xs text-muted-foreground">
                            No social accounts
                          </Badge>
                        )}
                    </div>
                  </div>
                </div>
                {selectedClientData.notes && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Notes</h4>
                    <p className="text-sm text-muted-foreground">{selectedClientData.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Real Dynamic Components - now with actual database queries */}
          <div className="grid gap-6 lg:grid-cols-2">
            <CampaignTimeline
              selectedClient={selectedClient}
              onClickItem={(campaign) => console.log("View campaign details:", campaign)}
            />
            <ScheduledContentQueue selectedClient={selectedClient} />
          </div>

          <ContentLibraryTable selectedClient={selectedClient} />

          {/* Show all clients only when no specific client is selected */}
          {!selectedClient && clients.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>All Clients</CardTitle>
                <CardDescription>Real client data from Neon database</CardDescription>
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
