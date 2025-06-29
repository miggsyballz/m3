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

  async testConnection(): Promise<boolean> {
    return false
  }
}

// Export the appropriate database instance
export const db = connectionString ? new NeonDatabase() : new MockDatabase()
