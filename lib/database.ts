import { neon } from "@neondatabase/serverless"

// 1. Block DB code on the client
if (typeof window !== "undefined") {
  throw new Error("Database operations cannot run on the client side")
}

// 2. Figure out the connection string (server-side only)
const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.NEON_DATABASE_URL ||
  ""

// Database types
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
  campaign_id: string
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

class NeonDatabase {
  private sql: any

  constructor() {
    if (!connectionString) {
      throw new Error("DATABASE_URL is required but not provided")
    }
    this.sql = neon(connectionString)
  }

  // Client operations
  async createClient(clientData: ClientInsert): Promise<Client> {
    try {
      const result = await this.sql`
        INSERT INTO clients (client_name, ig_handle, fb_page, linkedin_url, contact_email, notes)
        VALUES (${clientData.client_name}, ${clientData.ig_handle}, ${clientData.fb_page}, 
                ${clientData.linkedin_url}, ${clientData.contact_email}, ${clientData.notes})
        RETURNING *
      `
      return result[0] as Client
    } catch (error) {
      console.error("Error creating client:", error)
      throw new Error(`Failed to create client: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  async getClients(): Promise<Client[]> {
    try {
      const result = await this.sql`
        SELECT * FROM clients 
        ORDER BY created_at DESC
      `
      return result as Client[]
    } catch (error) {
      console.error("Error fetching clients:", error)
      throw new Error(`Failed to fetch clients: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  async getClientById(id: string): Promise<Client | null> {
    try {
      const result = await this.sql`
        SELECT * FROM clients 
        WHERE id = ${id}
      `
      return result.length > 0 ? (result[0] as Client) : null
    } catch (error) {
      console.error("Error fetching client:", error)
      throw new Error(`Failed to fetch client: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  async updateClient(id: string, updates: Partial<Client>): Promise<Client | null> {
    try {
      const result = await this.sql`
        UPDATE clients 
        SET ${this.sql(updates)}, updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `
      return result.length > 0 ? (result[0] as Client) : null
    } catch (error) {
      console.error("Error updating client:", error)
      throw new Error(`Failed to update client: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  async deleteClient(id: string): Promise<boolean> {
    try {
      const result = await this.sql`
        DELETE FROM clients 
        WHERE id = ${id}
      `
      return result.count > 0
    } catch (error) {
      console.error("Error deleting client:", error)
      throw new Error(`Failed to delete client: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  // Campaign operations
  async createCampaign(campaignData: CampaignInsert): Promise<Campaign> {
    try {
      const result = await this.sql`
        INSERT INTO campaigns (client_id, name, type, platforms, hashtags, start_date, end_date, status)
        VALUES (${campaignData.client_id}, ${campaignData.name}, ${campaignData.type}, 
                ${campaignData.platforms}, ${campaignData.hashtags}, ${campaignData.start_date}, 
                ${campaignData.end_date}, ${campaignData.status || "draft"})
        RETURNING *
      `
      return result[0] as Campaign
    } catch (error) {
      console.error("Error creating campaign:", error)
      throw new Error(`Failed to create campaign: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  async getCampaigns(): Promise<Campaign[]> {
    try {
      const result = await this.sql`
        SELECT * FROM campaigns 
        ORDER BY created_at DESC
      `
      return result as Campaign[]
    } catch (error) {
      console.error("Error fetching campaigns:", error)
      throw new Error(`Failed to fetch campaigns: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  async getCampaignById(id: string): Promise<Campaign | null> {
    try {
      const result = await this.sql`
        SELECT * FROM campaigns 
        WHERE id = ${id}
      `
      return result.length > 0 ? (result[0] as Campaign) : null
    } catch (error) {
      console.error("Error fetching campaign:", error)
      throw new Error(`Failed to fetch campaign: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  async getCampaignsByClientId(clientId: string): Promise<Campaign[]> {
    try {
      const result = await this.sql`
        SELECT * FROM campaigns 
        WHERE client_id = ${clientId}
        ORDER BY created_at DESC
      `
      return result as Campaign[]
    } catch (error) {
      console.error("Error fetching campaigns by client:", error)
      throw new Error(`Failed to fetch campaigns: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  async updateCampaign(id: string, updates: Partial<Campaign>): Promise<Campaign | null> {
    try {
      const result = await this.sql`
        UPDATE campaigns 
        SET ${this.sql(updates)}, updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `
      return result.length > 0 ? (result[0] as Campaign) : null
    } catch (error) {
      console.error("Error updating campaign:", error)
      throw new Error(`Failed to update campaign: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  async deleteCampaign(id: string): Promise<boolean> {
    try {
      const result = await this.sql`
        DELETE FROM campaigns 
        WHERE id = ${id}
      `
      return result.count > 0
    } catch (error) {
      console.error("Error deleting campaign:", error)
      throw new Error(`Failed to delete campaign: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  // Content operations
  async createContentItem(contentData: ContentItemInsert): Promise<ContentItem> {
    try {
      const result = await this.sql`
        INSERT INTO content_items (client_id, campaign_id, name, type, file_path, file_size)
        VALUES (${contentData.client_id}, ${contentData.campaign_id}, ${contentData.name}, 
                ${contentData.type}, ${contentData.file_path}, ${contentData.file_size})
        RETURNING *
      `
      return result[0] as ContentItem
    } catch (error) {
      console.error("Error creating content item:", error)
      throw new Error(`Failed to create content item: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  async getContentItems(): Promise<ContentItem[]> {
    try {
      const result = await this.sql`
        SELECT * FROM content_items 
        ORDER BY created_at DESC
      `
      return result as ContentItem[]
    } catch (error) {
      console.error("Error fetching content items:", error)
      throw new Error(`Failed to fetch content items: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  async getContentByClientId(clientId: string): Promise<ContentItem[]> {
    try {
      const result = await this.sql`
        SELECT * FROM content_items 
        WHERE client_id = ${clientId}
        ORDER BY created_at DESC
      `
      return result as ContentItem[]
    } catch (error) {
      console.error("Error fetching content by client:", error)
      throw new Error(`Failed to fetch content: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  // Scheduled posts operations
  async createScheduledPost(postData: ScheduledPostInsert): Promise<ScheduledPost> {
    try {
      const result = await this.sql`
        INSERT INTO scheduled_posts (campaign_id, client_id, platform, content, media_urls, hashtags, scheduled_time, status)
        VALUES (${postData.campaign_id}, ${postData.client_id}, ${postData.platform}, 
                ${postData.content}, ${postData.media_urls}, ${postData.hashtags}, 
                ${postData.scheduled_time}, ${postData.status || "draft"})
        RETURNING *
      `
      return result[0] as ScheduledPost
    } catch (error) {
      console.error("Error creating scheduled post:", error)
      throw new Error(`Failed to create scheduled post: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  async getScheduledPosts(): Promise<ScheduledPost[]> {
    try {
      const result = await this.sql`
        SELECT * FROM scheduled_posts 
        ORDER BY scheduled_time ASC
      `
      return result as ScheduledPost[]
    } catch (error) {
      console.error("Error fetching scheduled posts:", error)
      throw new Error(`Failed to fetch scheduled posts: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  async getScheduledPostsByClientId(clientId: string): Promise<ScheduledPost[]> {
    try {
      const result = await this.sql`
        SELECT * FROM scheduled_posts 
        WHERE client_id = ${clientId}
        ORDER BY scheduled_time ASC
      `
      return result as ScheduledPost[]
    } catch (error) {
      console.error("Error fetching scheduled posts by client:", error)
      throw new Error(`Failed to fetch scheduled posts: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  async updateScheduledPost(id: string, updates: Partial<ScheduledPost>): Promise<ScheduledPost | null> {
    try {
      const result = await this.sql`
        UPDATE scheduled_posts 
        SET ${this.sql(updates)}, updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `
      return result.length > 0 ? (result[0] as ScheduledPost) : null
    } catch (error) {
      console.error("Error updating scheduled post:", error)
      throw new Error(`Failed to update scheduled post: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  // Analytics and dashboard queries
  async getDashboardStats(clientId?: string) {
    try {
      const [clients, campaigns, scheduledPosts] = await Promise.all([
        clientId ? [await this.getClientById(clientId)] : this.getClients(),
        clientId ? this.getCampaignsByClientId(clientId) : this.getCampaigns(),
        clientId ? this.getScheduledPostsByClientId(clientId) : this.getScheduledPosts(),
      ])

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
      await this.sql`SELECT 1 as test`
      return true
    } catch (error) {
      console.error("Database connection test failed:", error)
      return false
    }
  }
}

// Mock database for when DATABASE_URL is missing
class MockDatabase {
  async getClients(): Promise<Client[]> {
    console.warn("MockDatabase: Returning empty clients array (DATABASE_URL not configured)")
    return []
  }

  async createClient(clientData: ClientInsert): Promise<Client> {
    throw new Error("Database not configured. Please add DATABASE_URL environment variable.")
  }

  async getClientById(id: string): Promise<Client | null> {
    return null
  }

  async updateClient(id: string, updates: Partial<Client>): Promise<Client | null> {
    return null
  }

  async deleteClient(id: string): Promise<boolean> {
    return false
  }

  async createCampaign(campaignData: CampaignInsert): Promise<Campaign> {
    throw new Error("Database not configured. Please add DATABASE_URL environment variable.")
  }

  async getCampaigns(): Promise<Campaign[]> {
    return []
  }

  async getCampaignById(id: string): Promise<Campaign | null> {
    return null
  }

  async getCampaignsByClientId(clientId: string): Promise<Campaign[]> {
    return []
  }

  async updateCampaign(id: string, updates: Partial<Campaign>): Promise<Campaign | null> {
    return null
  }

  async deleteCampaign(id: string): Promise<boolean> {
    return false
  }

  async createContentItem(contentData: ContentItemInsert): Promise<ContentItem> {
    throw new Error("Database not configured. Please add DATABASE_URL environment variable.")
  }

  async getContentItems(): Promise<ContentItem[]> {
    return []
  }

  async getContentByClientId(clientId: string): Promise<ContentItem[]> {
    return []
  }

  async createScheduledPost(postData: ScheduledPostInsert): Promise<ScheduledPost> {
    throw new Error("Database not configured. Please add DATABASE_URL environment variable.")
  }

  async getScheduledPosts(): Promise<ScheduledPost[]> {
    return []
  }

  async getScheduledPostsByClientId(clientId: string): Promise<ScheduledPost[]> {
    return []
  }

  async updateScheduledPost(id: string, updates: Partial<ScheduledPost>): Promise<ScheduledPost | null> {
    return null
  }

  async testConnection(): Promise<boolean> {
    return false
  }
}

// Export the appropriate database instance
export const db = connectionString ? new NeonDatabase() : new MockDatabase()
