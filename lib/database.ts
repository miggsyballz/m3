import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export interface Client {
  id: number
  name: string
  email: string
  phone?: string
  company?: string
  industry?: string
  website?: string
  notes?: string
  status: "active" | "inactive" | "pending"
  created_at: string
  updated_at: string
}

export interface Campaign {
  id: number
  client_id: number
  name: string
  description?: string
  status: "draft" | "active" | "paused" | "completed"
  start_date?: string
  end_date?: string
  budget?: number
  goals?: string[]
  target_audience?: string
  created_at: string
  updated_at: string
}

export interface Content {
  id: number
  client_id: number
  campaign_id?: number
  title: string
  content: string
  media_urls?: string[]
  hashtags?: string[]
  platforms?: string[]
  status: "draft" | "scheduled" | "published" | "failed"
  scheduled_for?: string
  published_at?: string
  created_at: string
  updated_at: string
}

export interface SocialToken {
  id: number
  client_id: number
  platform: string
  access_token: string
  refresh_token?: string
  expires_at?: string
  permissions: string[]
  platform_user_id?: string
  platform_username?: string
  last_synced?: string
  created_at: string
  updated_at: string
}

export const db = {
  // Client operations
  async getClients(): Promise<Client[]> {
    const result = await sql`SELECT * FROM clients ORDER BY created_at DESC`
    return result as Client[]
  },

  async getClient(id: number): Promise<Client | null> {
    const result = await sql`SELECT * FROM clients WHERE id = ${id}`
    return (result[0] as Client) || null
  },

  async createClient(client: Omit<Client, "id" | "created_at" | "updated_at">): Promise<Client> {
    const result = await sql`
      INSERT INTO clients (name, email, phone, company, industry, website, notes, status)
      VALUES (${client.name}, ${client.email}, ${client.phone}, ${client.company}, 
              ${client.industry}, ${client.website}, ${client.notes}, ${client.status})
      RETURNING *
    `
    return result[0] as Client
  },

  async updateClient(id: number, updates: Partial<Client>): Promise<Client> {
    const setClause = Object.keys(updates)
      .filter((key) => key !== "id" && key !== "created_at" && key !== "updated_at")
      .map((key) => `${key} = $${key}`)
      .join(", ")

    const result = await sql`
      UPDATE clients 
      SET ${sql.unsafe(setClause)}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `
    return result[0] as Client
  },

  async deleteClient(id: number): Promise<void> {
    await sql`DELETE FROM clients WHERE id = ${id}`
  },

  // Campaign operations
  async getCampaigns(clientId?: number): Promise<Campaign[]> {
    if (clientId) {
      const result = await sql`SELECT * FROM campaigns WHERE client_id = ${clientId} ORDER BY created_at DESC`
      return result as Campaign[]
    }
    const result = await sql`SELECT * FROM campaigns ORDER BY created_at DESC`
    return result as Campaign[]
  },

  async getCampaign(id: number): Promise<Campaign | null> {
    const result = await sql`SELECT * FROM campaigns WHERE id = ${id}`
    return (result[0] as Campaign) || null
  },

  async createCampaign(campaign: Omit<Campaign, "id" | "created_at" | "updated_at">): Promise<Campaign> {
    const result = await sql`
      INSERT INTO campaigns (client_id, name, description, status, start_date, end_date, budget, goals, target_audience)
      VALUES (${campaign.client_id}, ${campaign.name}, ${campaign.description}, ${campaign.status},
              ${campaign.start_date}, ${campaign.end_date}, ${campaign.budget}, 
              ${JSON.stringify(campaign.goals)}, ${campaign.target_audience})
      RETURNING *
    `
    return result[0] as Campaign
  },

  async updateCampaign(id: number, updates: Partial<Campaign>): Promise<Campaign> {
    const result = await sql`
      UPDATE campaigns 
      SET name = COALESCE(${updates.name}, name),
          description = COALESCE(${updates.description}, description),
          status = COALESCE(${updates.status}, status),
          start_date = COALESCE(${updates.start_date}, start_date),
          end_date = COALESCE(${updates.end_date}, end_date),
          budget = COALESCE(${updates.budget}, budget),
          goals = COALESCE(${JSON.stringify(updates.goals)}, goals),
          target_audience = COALESCE(${updates.target_audience}, target_audience),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `
    return result[0] as Campaign
  },

  async deleteCampaign(id: number): Promise<void> {
    await sql`DELETE FROM campaigns WHERE id = ${id}`
  },

  // Content operations
  async getContent(clientId?: number, campaignId?: number): Promise<Content[]> {
    let query = `SELECT * FROM content WHERE 1=1`
    const params: any[] = []

    if (clientId) {
      query += ` AND client_id = $${params.length + 1}`
      params.push(clientId)
    }

    if (campaignId) {
      query += ` AND campaign_id = $${params.length + 1}`
      params.push(campaignId)
    }

    query += ` ORDER BY created_at DESC`

    const result = await sql.unsafe(query, params)
    return result as Content[]
  },

  async getContentItem(id: number): Promise<Content | null> {
    const result = await sql`SELECT * FROM content WHERE id = ${id}`
    return (result[0] as Content) || null
  },

  async createContent(content: Omit<Content, "id" | "created_at" | "updated_at">): Promise<Content> {
    const result = await sql`
      INSERT INTO content (client_id, campaign_id, title, content, media_urls, hashtags, platforms, status, scheduled_for)
      VALUES (${content.client_id}, ${content.campaign_id}, ${content.title}, ${content.content},
              ${JSON.stringify(content.media_urls)}, ${JSON.stringify(content.hashtags)}, 
              ${JSON.stringify(content.platforms)}, ${content.status}, ${content.scheduled_for})
      RETURNING *
    `
    return result[0] as Content
  },

  async updateContent(id: number, updates: Partial<Content>): Promise<Content> {
    const result = await sql`
      UPDATE content 
      SET title = COALESCE(${updates.title}, title),
          content = COALESCE(${updates.content}, content),
          media_urls = COALESCE(${JSON.stringify(updates.media_urls)}, media_urls),
          hashtags = COALESCE(${JSON.stringify(updates.hashtags)}, hashtags),
          platforms = COALESCE(${JSON.stringify(updates.platforms)}, platforms),
          status = COALESCE(${updates.status}, status),
          scheduled_for = COALESCE(${updates.scheduled_for}, scheduled_for),
          published_at = COALESCE(${updates.published_at}, published_at),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `
    return result[0] as Content
  },

  async deleteContent(id: number): Promise<void> {
    await sql`DELETE FROM content WHERE id = ${id}`
  },

  // Social Token operations
  async getSocialTokensByClient(clientId: number): Promise<SocialToken[]> {
    const result = await sql`
      SELECT * FROM client_social_tokens 
      WHERE client_id = ${clientId} 
      ORDER BY platform
    `
    return result as SocialToken[]
  },

  async getSocialToken(clientId: number, platform: string): Promise<SocialToken | null> {
    const result = await sql`
      SELECT * FROM client_social_tokens 
      WHERE client_id = ${clientId} AND platform = ${platform}
    `
    return (result[0] as SocialToken) || null
  },

  async createSocialToken(token: Omit<SocialToken, "id" | "created_at" | "updated_at">): Promise<SocialToken> {
    const result = await sql`
      INSERT INTO client_social_tokens 
      (client_id, platform, access_token, refresh_token, expires_at, permissions, platform_user_id, platform_username, last_synced)
      VALUES (${token.client_id}, ${token.platform}, ${token.access_token}, ${token.refresh_token}, 
              ${token.expires_at}, ${JSON.stringify(token.permissions)}, ${token.platform_user_id}, 
              ${token.platform_username}, ${token.last_synced})
      ON CONFLICT (client_id, platform) 
      DO UPDATE SET 
        access_token = EXCLUDED.access_token,
        refresh_token = EXCLUDED.refresh_token,
        expires_at = EXCLUDED.expires_at,
        permissions = EXCLUDED.permissions,
        platform_user_id = EXCLUDED.platform_user_id,
        platform_username = EXCLUDED.platform_username,
        last_synced = EXCLUDED.last_synced,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `
    return result[0] as SocialToken
  },

  async updateSocialToken(clientId: number, platform: string, updates: Partial<SocialToken>): Promise<SocialToken> {
    const result = await sql`
      UPDATE client_social_tokens 
      SET access_token = COALESCE(${updates.access_token}, access_token),
          refresh_token = COALESCE(${updates.refresh_token}, refresh_token),
          expires_at = COALESCE(${updates.expires_at}, expires_at),
          permissions = COALESCE(${JSON.stringify(updates.permissions)}, permissions),
          platform_user_id = COALESCE(${updates.platform_user_id}, platform_user_id),
          platform_username = COALESCE(${updates.platform_username}, platform_username),
          last_synced = COALESCE(${updates.last_synced}, last_synced),
          updated_at = CURRENT_TIMESTAMP
      WHERE client_id = ${clientId} AND platform = ${platform}
      RETURNING *
    `
    return result[0] as SocialToken
  },

  async deleteSocialToken(clientId: number, platform: string): Promise<void> {
    await sql`DELETE FROM client_social_tokens WHERE client_id = ${clientId} AND platform = ${platform}`
  },

  // Stats operations
  async getClientStats(clientId: number) {
    const [campaigns, content, scheduledContent] = await Promise.all([
      sql`SELECT COUNT(*) as count FROM campaigns WHERE client_id = ${clientId}`,
      sql`SELECT COUNT(*) as count FROM content WHERE client_id = ${clientId}`,
      sql`SELECT COUNT(*) as count FROM content WHERE client_id = ${clientId} AND status = 'scheduled'`,
    ])

    return {
      totalCampaigns: Number.parseInt(campaigns[0].count),
      totalContent: Number.parseInt(content[0].count),
      scheduledPosts: Number.parseInt(scheduledContent[0].count),
    }
  },
}
