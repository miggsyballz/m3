// Mock database implementation since Neon was removed
// This provides fallback data until a new database is connected

export interface Client {
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

export interface Campaign {
  id: string
  client_id: string
  name: string
  type: string
  platforms: string[]
  hashtags: string[]
  start_date: string | null
  end_date: string | null
  status: "draft" | "active" | "scheduled" | "completed"
  created_at: string
  updated_at: string
}

export interface ContentItem {
  id: string
  client_id: string
  campaign_id: string | null
  name: string
  type: "image" | "video" | "audio" | "document"
  file_path: string
  file_size: number
  created_at: string
  updated_at: string
}

export interface ScheduledPost {
  id: string
  campaign_id: string | null
  client_id: string
  platform: string
  content: string
  media_urls: string[]
  hashtags: string[]
  scheduled_time: string
  status: "draft" | "scheduled" | "published" | "failed"
  created_at: string
  updated_at: string
}

export type ClientInsert = Omit<Client, "id" | "created_at" | "updated_at">
export type CampaignInsert = Omit<Campaign, "id" | "created_at" | "updated_at">
export type ContentItemInsert = Omit<ContentItem, "id" | "created_at" | "updated_at">
export type ScheduledPostInsert = Omit<ScheduledPost, "id" | "created_at" | "updated_at">

// In-memory storage (temporary until new database is connected)
let mockClients: Client[] = [
  {
    id: "1",
    client_name: "MaxxBeats",
    ig_handle: "@maxxbeats",
    fb_page: "facebook.com/maxxbeats",
    linkedin_url: "linkedin.com/company/maxxbeats",
    contact_email: "mig@maxxbeats.com",
    notes: "Music production and beat sales",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const mockCampaigns: Campaign[] = [
  {
    id: "1",
    client_id: "1",
    name: "Beat Drop Campaign",
    type: "product_launch",
    platforms: ["instagram", "facebook"],
    hashtags: ["#beats", "#music", "#producer"],
    start_date: new Date().toISOString(),
    end_date: null,
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const mockContent: ContentItem[] = []
const mockScheduledPosts: ScheduledPost[] = []

class MockDatabase {
  // Client operations
  async createClient(clientData: ClientInsert): Promise<Client> {
    try {
      console.log("Creating client with data:", clientData)
      const newClient: Client = {
        id: Date.now().toString(),
        ...clientData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      mockClients.push(newClient)
      console.log("Client created successfully:", newClient)
      return newClient
    } catch (error) {
      console.error("Error creating client:", error)
      throw new Error(`Failed to create client: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  async getClients(): Promise<Client[]> {
    try {
      return mockClients
    } catch (error) {
      console.error("Error fetching clients:", error)
      throw new Error(`Failed to fetch clients: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  async getClientById(id: string): Promise<Client | null> {
    try {
      return mockClients.find((client) => client.id === id) || null
    } catch (error) {
      console.error("Error fetching client:", error)
      throw new Error(`Failed to fetch client: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  async updateClient(id: string, updates: Partial<Client>): Promise<Client | null> {
    try {
      const clientIndex = mockClients.findIndex((client) => client.id === id)
      if (clientIndex === -1) return null

      mockClients[clientIndex] = {
        ...mockClients[clientIndex],
        ...updates,
        updated_at: new Date().toISOString(),
      }
      return mockClients[clientIndex]
    } catch (error) {
      console.error("Error updating client:", error)
      throw new Error(`Failed to update client: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  async deleteClient(id: string): Promise<boolean> {
    try {
      const initialLength = mockClients.length
      mockClients = mockClients.filter((client) => client.id !== id)
      return mockClients.length < initialLength
    } catch (error) {
      console.error("Error deleting client:", error)
      throw new Error(`Failed to delete client: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  // Campaign operations
  async createCampaign(campaignData: CampaignInsert): Promise<Campaign> {
    try {
      console.log("Creating campaign with data:", campaignData)
      const newCampaign: Campaign = {
        id: Date.now().toString(),
        ...campaignData,
        status: campaignData.status || "draft",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      mockCampaigns.push(newCampaign)
      console.log("Campaign created successfully:", newCampaign)
      return newCampaign
    } catch (error) {
      console.error("Error creating campaign:", error)
      throw new Error(`Failed to create campaign: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  async getCampaigns(): Promise<Campaign[]> {
    try {
      return mockCampaigns
    } catch (error) {
      console.error("Error fetching campaigns:", error)
      throw new Error(`Failed to fetch campaigns: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  async getCampaignsByClientId(clientId: string): Promise<Campaign[]> {
    try {
      return mockCampaigns.filter((campaign) => campaign.client_id === clientId)
    } catch (error) {
      console.error("Error fetching campaigns by client:", error)
      throw new Error(`Failed to fetch campaigns: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  async updateCampaign(id: string, updates: Partial<Campaign>): Promise<Campaign | null> {
    try {
      const campaignIndex = mockCampaigns.findIndex((campaign) => campaign.id === id)
      if (campaignIndex === -1) return null

      mockCampaigns[campaignIndex] = {
        ...mockCampaigns[campaignIndex],
        ...updates,
        updated_at: new Date().toISOString(),
      }
      return mockCampaigns[campaignIndex]
    } catch (error) {
      console.error("Error updating campaign:", error)
      throw new Error(`Failed to update campaign: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  // Content operations
  async createContentItem(contentData: ContentItemInsert): Promise<ContentItem> {
    try {
      console.log("Creating content item with data:", contentData)
      const newContent: ContentItem = {
        id: Date.now().toString(),
        ...contentData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      mockContent.push(newContent)
      console.log("Content item created successfully:", newContent)
      return newContent
    } catch (error) {
      console.error("Error creating content item:", error)
      throw new Error(`Failed to create content item: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  async getContentItems(): Promise<ContentItem[]> {
    try {
      return mockContent
    } catch (error) {
      console.error("Error fetching content items:", error)
      throw new Error(`Failed to fetch content items: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  async getContentByClientId(clientId: string): Promise<ContentItem[]> {
    try {
      return mockContent.filter((content) => content.client_id === clientId)
    } catch (error) {
      console.error("Error fetching content by client:", error)
      throw new Error(`Failed to fetch content: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  // Scheduled posts operations
  async createScheduledPost(postData: ScheduledPostInsert): Promise<ScheduledPost> {
    try {
      console.log("Creating scheduled post with data:", postData)
      const newPost: ScheduledPost = {
        id: Date.now().toString(),
        ...postData,
        status: postData.status || "draft",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      mockScheduledPosts.push(newPost)
      console.log("Scheduled post created successfully:", newPost)
      return newPost
    } catch (error) {
      console.error("Error creating scheduled post:", error)
      throw new Error(`Failed to create scheduled post: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  async getScheduledPosts(): Promise<ScheduledPost[]> {
    try {
      return mockScheduledPosts.filter((post) => post.status !== "deleted")
    } catch (error) {
      console.error("Error fetching scheduled posts:", error)
      throw new Error(`Failed to fetch scheduled posts: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  async getScheduledPostsByClientId(clientId: string): Promise<ScheduledPost[]> {
    try {
      return mockScheduledPosts.filter((post) => post.client_id === clientId && post.status !== "deleted")
    } catch (error) {
      console.error("Error fetching scheduled posts by client:", error)
      throw new Error(`Failed to fetch scheduled posts: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  async updateScheduledPost(id: string, updates: Partial<ScheduledPost>): Promise<ScheduledPost | null> {
    try {
      console.log("Updating scheduled post:", id, updates)
      const postIndex = mockScheduledPosts.findIndex((post) => post.id === id)
      if (postIndex === -1) return null

      mockScheduledPosts[postIndex] = {
        ...mockScheduledPosts[postIndex],
        ...updates,
        updated_at: new Date().toISOString(),
      }
      console.log("Scheduled post updated successfully:", mockScheduledPosts[postIndex])
      return mockScheduledPosts[postIndex]
    } catch (error) {
      console.error("Error updating scheduled post:", error)
      throw new Error(`Failed to update scheduled post: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  async deleteScheduledPost(id: string): Promise<boolean> {
    try {
      console.log("Deleting scheduled post:", id)
      const postIndex = mockScheduledPosts.findIndex((post) => post.id === id)
      if (postIndex === -1) return false

      mockScheduledPosts[postIndex].status = "deleted"
      mockScheduledPosts[postIndex].updated_at = new Date().toISOString()
      console.log("Scheduled post deleted successfully")
      return true
    } catch (error) {
      console.error("Error deleting scheduled post:", error)
      throw new Error(`Failed to delete scheduled post: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  // Analytics and dashboard queries
  async getDashboardStats(clientId?: string) {
    try {
      const clients = clientId ? [await this.getClientById(clientId)].filter(Boolean) : await this.getClients()
      const campaigns = clientId ? await this.getCampaignsByClientId(clientId) : await this.getCampaigns()
      const scheduledPosts = clientId
        ? await this.getScheduledPostsByClientId(clientId)
        : await this.getScheduledPosts()

      const activeCampaigns = campaigns.filter((c) => c.status === "active")
      const upcomingPosts = scheduledPosts.filter(
        (p) => p.status === "scheduled" && new Date(p.scheduled_time) > new Date(),
      )

      return {
        totalClients: clients.length,
        totalCampaigns: campaigns.length,
        activeCampaigns: activeCampaigns.length,
        scheduledPosts: upcomingPosts.length,
        campaigns,
        upcomingPosts: upcomingPosts.slice(0, 5),
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
      throw error
    }
  }

  // Test database connection
  async testConnection(): Promise<boolean> {
    try {
      return true // Mock database is always "connected"
    } catch (error) {
      console.error("Database connection test failed:", error)
      return false
    }
  }
}

export const db = new MockDatabase()
