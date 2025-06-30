import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export class NeonDatabase {
  // Social tokens methods
  async saveSocialToken(data: {
    clientId: number
    platform: string
    accessToken: string
    refreshToken?: string | null
    expiresAt?: Date | null
    userInfo?: any
  }) {
    const { clientId, platform, accessToken, refreshToken, expiresAt, userInfo } = data

    const result = await sql`
      INSERT INTO client_social_tokens (
        client_id, 
        platform, 
        access_token, 
        refresh_token, 
        expires_at,
        platform_user_id,
        platform_username,
        permissions
      ) VALUES (
        ${clientId},
        ${platform},
        ${accessToken},
        ${refreshToken},
        ${expiresAt?.toISOString()},
        ${userInfo?.id || null},
        ${userInfo?.name || userInfo?.username || null},
        ${JSON.stringify(this.getPlatformPermissions(platform))}
      )
      ON CONFLICT (client_id, platform) 
      DO UPDATE SET
        access_token = EXCLUDED.access_token,
        refresh_token = EXCLUDED.refresh_token,
        expires_at = EXCLUDED.expires_at,
        platform_user_id = EXCLUDED.platform_user_id,
        platform_username = EXCLUDED.platform_username,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `

    return result[0]
  }

  async getSocialTokens(clientId: number) {
    const result = await sql`
      SELECT * FROM client_social_tokens 
      WHERE client_id = ${clientId}
      ORDER BY platform
    `
    return result
  }

  async getSocialToken(clientId: number, platform: string) {
    const result = await sql`
      SELECT * FROM client_social_tokens 
      WHERE client_id = ${clientId} AND platform = ${platform}
    `
    return result[0]
  }

  async deleteSocialToken(clientId: number, platform: string) {
    const result = await sql`
      DELETE FROM client_social_tokens 
      WHERE client_id = ${clientId} AND platform = ${platform}
      RETURNING *
    `
    return result[0]
  }

  async updateSocialToken(
    clientId: number,
    platform: string,
    updates: {
      accessToken?: string
      refreshToken?: string
      expiresAt?: Date
    },
  ) {
    const result = await sql`
      UPDATE client_social_tokens 
      SET 
        access_token = COALESCE(${updates.accessToken}, access_token),
        refresh_token = COALESCE(${updates.refreshToken}, refresh_token),
        expires_at = COALESCE(${updates.expiresAt?.toISOString()}, expires_at),
        updated_at = CURRENT_TIMESTAMP
      WHERE client_id = ${clientId} AND platform = ${platform}
      RETURNING *
    `
    return result[0]
  }

  private getPlatformPermissions(platform: string): string[] {
    const permissions: Record<string, string[]> = {
      instagram: ["publish_posts", "read_insights"],
      facebook: ["publish_posts", "manage_pages", "read_insights"],
      linkedin: ["publish_posts", "read_profile"],
      twitter: ["publish_tweets", "read_profile"],
      youtube: ["upload_videos", "manage_channel"],
      tiktok: ["upload_videos", "manage_content"],
    }
    return permissions[platform] || []
  }

  // Existing methods (clients, campaigns, content, etc.)
  async getClients() {
    const result = await sql`SELECT * FROM clients ORDER BY created_at DESC`
    return result
  }

  async getClientById(id: string) {
    const result = await sql`SELECT * FROM clients WHERE id = ${id}`
    return result[0]
  }

  async createClient(data: any) {
    const result = await sql`
      INSERT INTO clients (name, industry, description, brand_voice, target_audience, goals)
      VALUES (${data.name}, ${data.industry}, ${data.description}, ${data.brand_voice}, ${data.target_audience}, ${data.goals})
      RETURNING *
    `
    return result[0]
  }

  async getCampaignsByClientId(clientId: string) {
    const result = await sql`
      SELECT * FROM campaigns 
      WHERE client_id = ${clientId} 
      ORDER BY created_at DESC
    `
    return result
  }

  async getAllCampaigns() {
    const result = await sql`
      SELECT c.*, cl.name as client_name 
      FROM campaigns c
      LEFT JOIN clients cl ON c.client_id = cl.id
      ORDER BY c.created_at DESC
    `
    return result
  }

  async createCampaign(data: any) {
    const result = await sql`
      INSERT INTO campaigns (client_id, name, description, start_date, end_date, status, goals)
      VALUES (${data.client_id}, ${data.name}, ${data.description}, ${data.start_date}, ${data.end_date}, ${data.status}, ${data.goals})
      RETURNING *
    `
    return result[0]
  }

  async getContentByClientId(clientId: string) {
    const result = await sql`
      SELECT * FROM content 
      WHERE client_id = ${clientId} 
      ORDER BY created_at DESC
    `
    return result
  }

  async createContent(data: any) {
    const result = await sql`
      INSERT INTO content (client_id, campaign_id, type, title, caption, media_url, scheduled_for, status, platforms)
      VALUES (${data.client_id}, ${data.campaign_id}, ${data.type}, ${data.title}, ${data.caption}, ${data.media_url}, ${data.scheduled_for}, ${data.status}, ${JSON.stringify(data.platforms)})
      RETURNING *
    `
    return result[0]
  }

  async getScheduledContent(clientId?: string) {
    let query = `
      SELECT c.*, cl.name as client_name, cam.name as campaign_name
      FROM content c
      LEFT JOIN clients cl ON c.client_id = cl.id
      LEFT JOIN campaigns cam ON c.campaign_id = cam.id
      WHERE c.status = 'scheduled' AND c.scheduled_for > NOW()
    `

    if (clientId) {
      query += ` AND c.client_id = ${clientId}`
    }

    query += ` ORDER BY c.scheduled_for ASC`

    const result = await sql(query)
    return result
  }
}

export const db = new NeonDatabase()
