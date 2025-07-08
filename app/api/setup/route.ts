import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

/**
 * Lazily obtain a Neon SQL instance.
 * Tries several env-var names so the build doesn't crash
 * when one of them is missing.
 */
function getSql() {
  const connectionString =
    process.env.NEON_DATABASE_URL ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    ""

  if (!connectionString) {
    throw new Error("Database connection string not provided. Set NEON_DATABASE_URL or DATABASE_URL.")
  }
  return neon(connectionString)
}

export async function GET() {
  try {
    const sql = getSql()
    const result = await sql`SELECT NOW() as current_time`

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      timestamp: result[0].current_time,
    })
  } catch (error) {
    console.error("Database setup error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Database connection failed",
      },
      { status: 500 },
    )
  }
}

export async function POST() {
  try {
    const sql = getSql()

    // Create tables
    await sql`
      CREATE TABLE IF NOT EXISTS clients (
        id SERIAL PRIMARY KEY,
        client_name VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255),
        phone VARCHAR(50),
        company VARCHAR(255),
        industry VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS campaigns (
        id SERIAL PRIMARY KEY,
        client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
        campaign_name VARCHAR(255) NOT NULL,
        description TEXT,
        start_date DATE,
        end_date DATE,
        budget DECIMAL(10,2),
        status VARCHAR(50) DEFAULT 'draft',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    return NextResponse.json({
      success: true,
      message: "Database tables created successfully",
    })
  } catch (error) {
    console.error("Database setup error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create database tables",
      },
      { status: 500 },
    )
  }
}
