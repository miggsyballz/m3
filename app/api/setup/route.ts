import { NextResponse } from "next/server"

/**
 * POST /api/setup
 * Create database tables if they don't exist
 */
export async function POST() {
  try {
    const { neon } = await import("@neondatabase/serverless")

    // Get connection string from environment
    const connectionString =
      process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL || ""

    if (!connectionString) {
      return NextResponse.json({ error: "No database connection string found" }, { status: 500 })
    }

    const sql = neon(connectionString)

    // Test connection first
    await sql`SELECT 1 as test`

    // Create clients table
    await sql`
      CREATE TABLE IF NOT EXISTS clients (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          client_name VARCHAR(255) NOT NULL,
          ig_handle VARCHAR(100),
          fb_page VARCHAR(255),
          linkedin_url VARCHAR(255),
          contact_email VARCHAR(255) NOT NULL,
          notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `

    // Create campaigns table
    await sql`
      CREATE TABLE IF NOT EXISTS campaigns (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
          name VARCHAR(255) NOT NULL,
          type VARCHAR(100) NOT NULL,
          platforms TEXT[] DEFAULT '{}',
          hashtags TEXT[] DEFAULT '{}',
          start_date DATE,
          end_date DATE,
          status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'scheduled', 'completed')),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `

    // Create content_items table
    await sql`
      CREATE TABLE IF NOT EXISTS content_items (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
          campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
          name VARCHAR(255) NOT NULL,
          type VARCHAR(20) NOT NULL CHECK (type IN ('image', 'video', 'audio', 'document')),
          file_path VARCHAR(500) NOT NULL,
          file_size BIGINT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `

    // Create scheduled_posts table
    await sql`
      CREATE TABLE IF NOT EXISTS scheduled_posts (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
          client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
          platform VARCHAR(50) NOT NULL,
          content TEXT NOT NULL,
          media_urls TEXT[] DEFAULT '{}',
          hashtags TEXT[] DEFAULT '{}',
          scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
          status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'failed')),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `

    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_campaigns_client_id ON campaigns(client_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_content_items_client_id ON content_items(client_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_scheduled_posts_client_id ON scheduled_posts(client_id)`

    // Create updated_at trigger function
    await sql`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
      END;
      $$ language 'plpgsql'
    `

    // Create triggers
    await sql`
      DROP TRIGGER IF EXISTS update_clients_updated_at ON clients;
      CREATE TRIGGER update_clients_updated_at 
          BEFORE UPDATE ON clients 
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    `

    await sql`
      DROP TRIGGER IF EXISTS update_campaigns_updated_at ON campaigns;
      CREATE TRIGGER update_campaigns_updated_at 
          BEFORE UPDATE ON campaigns 
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    `

    return NextResponse.json({
      message: "Database setup completed successfully! All tables created.",
      timestamp: new Date().toISOString(),
      tables: ["clients", "campaigns", "content_items", "scheduled_posts"],
    })
  } catch (error) {
    console.error("[POST /api/setup] Database setup error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Setup failed",
        details: "Failed to create database tables",
      },
      { status: 500 },
    )
  }
}

/**
 * GET /api/setup
 * Check database status
 */
export async function GET() {
  try {
    const { neon } = await import("@neondatabase/serverless")

    const connectionString =
      process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL || ""

    if (!connectionString) {
      return NextResponse.json({ error: "No database connection string found" }, { status: 500 })
    }

    const sql = neon(connectionString)

    // Test connection
    await sql`SELECT 1 as test`

    // Check if tables exist
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('clients', 'campaigns', 'content_items', 'scheduled_posts')
    `

    return NextResponse.json({
      status: "connected",
      tablesFound: tables.map((t: any) => t.table_name),
      needsSetup: tables.length < 4,
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        error: error instanceof Error ? error.message : "Connection failed",
      },
      { status: 500 },
    )
  }
}
