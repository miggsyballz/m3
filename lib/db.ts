// Mock database for M3 - In-memory storage
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

interface Campaign {
  id: string
  client_id: string
  name: string
  description: string | null
  status: "draft" | "active" | "paused" | "completed"
  start_date: string | null
  end_date: string | null
  budget: number | null
  created_at: string
  updated_at: string
}

interface ScheduledPost {
  id: string
  client_id: string
  campaign_id: string | null
  platform: "instagram" | "facebook" | "twitter" | "linkedin" | "tiktok" | "youtube"
  content: string
  hashtags: string | null
  scheduled_for: string
  status: "draft" | "scheduled" | "published" | "failed"
  created_at: string
  updated_at: string
}

// In-memory storage
const clients: Client[] = [
  {
    id: "1",
    client_name: "MaxxBeats",
    ig_handle: "@maxxbeats",
    fb_page: "facebook.com/maxxbeats",
    linkedin_url: "linkedin.com/company/maxxbeats",
    contact_email: "mig@maxxbeats.com",
    notes:
      "Music producer and digital content creator specializing in instrumentals, plugins, and music production services.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const campaigns: Campaign[] = [
  {
    id: "1",
    client_id: "1",
    name: "Beat Drop Campaign",
    description: "Promote new instrumental releases and music production services",
    status: "active",
    start_date: new Date().toISOString(),
    end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    budget: 5000,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const scheduledPosts: ScheduledPost[] = [
  {
    id: "1",
    client_id: "1",
    campaign_id: "1",
    platform: "instagram",
    content: "New fire beats dropping this week! 🔥 Check out the latest instrumentals on maxxbeats.com",
    hashtags: "#beats #producer #instrumental #hiphop #trap #music",
    scheduled_for: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
    status: "scheduled",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    client_id: "1",
    campaign_id: "1",
    platform: "twitter",
    content: "Working on some new heat in the studio 🎵 What genre should I tackle next?",
    hashtags: "#musicproducer #beats #studio #music",
    scheduled_for: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // tomorrow
    status: "draft",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

// Database functions
export const db = {
  // Clients
  async getClients(): Promise<Client[]> {
    return clients
  },

  async getClientById(id: string): Promise<Client | null> {
    return clients.find((c) => c.id === id) || null
  },

  async createClient(data: Omit<Client, "id" | "created_at" | "updated_at">): Promise<Client> {
    const client: Client = {
      ...data,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    clients.push(client)
    return client
  },

  async updateClient(id: string, data: Partial<Omit<Client, "id" | "created_at">>): Promise<Client | null> {
    const index = clients.findIndex((c) => c.id === id)
    if (index === -1) return null

    clients[index] = {
      ...clients[index],
      ...data,
      updated_at: new Date().toISOString(),
    }
    return clients[index]
  },

  async deleteClient(id: string): Promise<boolean> {
    const index = clients.findIndex((c) => c.id === id)
    if (index === -1) return false

    clients.splice(index, 1)
    return true
  },

  // Campaigns
  async getCampaigns(clientId?: string): Promise<Campaign[]> {
    if (clientId) {
      return campaigns.filter((c) => c.client_id === clientId)
    }
    return campaigns
  },

  async getCampaignById(id: string): Promise<Campaign | null> {
    return campaigns.find((c) => c.id === id) || null
  },

  async createCampaign(data: Omit<Campaign, "id" | "created_at" | "updated_at">): Promise<Campaign> {
    const campaign: Campaign = {
      ...data,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    campaigns.push(campaign)
    return campaign
  },

  async updateCampaign(id: string, data: Partial<Omit<Campaign, "id" | "created_at">>): Promise<Campaign | null> {
    const index = campaigns.findIndex((c) => c.id === id)
    if (index === -1) return null

    campaigns[index] = {
      ...campaigns[index],
      ...data,
      updated_at: new Date().toISOString(),
    }
    return campaigns[index]
  },

  async deleteCampaign(id: string): Promise<boolean> {
    const index = campaigns.findIndex((c) => c.id === id)
    if (index === -1) return false

    campaigns.splice(index, 1)
    return true
  },

  // Scheduled Posts
  async getScheduledPosts(clientId?: string): Promise<ScheduledPost[]> {
    if (clientId) {
      return scheduledPosts.filter((p) => p.client_id === clientId)
    }
    return scheduledPosts
  },

  async getScheduledPostById(id: string): Promise<ScheduledPost | null> {
    return scheduledPosts.find((p) => p.id === id) || null
  },

  async createScheduledPost(data: Omit<ScheduledPost, "id" | "created_at" | "updated_at">): Promise<ScheduledPost> {
    const post: ScheduledPost = {
      ...data,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    scheduledPosts.push(post)
    return post
  },

  async updateScheduledPost(
    id: string,
    data: Partial<Omit<ScheduledPost, "id" | "created_at">>,
  ): Promise<ScheduledPost | null> {
    const index = scheduledPosts.findIndex((p) => p.id === id)
    if (index === -1) return null

    scheduledPosts[index] = {
      ...scheduledPosts[index],
      ...data,
      updated_at: new Date().toISOString(),
    }
    return scheduledPosts[index]
  },

  async deleteScheduledPost(id: string): Promise<boolean> {
    const index = scheduledPosts.findIndex((p) => p.id === id)
    if (index === -1) return false

    scheduledPosts.splice(index, 1)
    return true
  },

  // Stats
  async getClientStats(clientId: string): Promise<{
    totalCampaigns: number
    activeCampaigns: number
    scheduledPosts: number
    totalPosts: number
  }> {
    const clientCampaigns = campaigns.filter((c) => c.client_id === clientId)
    const clientPosts = scheduledPosts.filter((p) => p.client_id === clientId)
    const now = new Date()
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

    return {
      totalCampaigns: clientCampaigns.length,
      activeCampaigns: clientCampaigns.filter((c) => c.status === "active").length,
      scheduledPosts: clientPosts.filter(
        (p) => p.status === "scheduled" && new Date(p.scheduled_for) >= now && new Date(p.scheduled_for) <= nextWeek,
      ).length,
      totalPosts: clientPosts.length,
    }
  },
}
