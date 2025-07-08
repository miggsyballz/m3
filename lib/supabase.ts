import { createClient } from "@supabase/supabase-js"

// With Supabase integration at team level, these should be automatically available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client
export const createServerClient = () => {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

// Database types matching Supabase schema
export interface Database {
  public: {
    Tables: {
      clients: {
        Row: {
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
        Insert: {
          id?: string
          client_name: string
          ig_handle?: string | null
          fb_page?: string | null
          linkedin_url?: string | null
          contact_email: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_name?: string
          ig_handle?: string | null
          fb_page?: string | null
          linkedin_url?: string | null
          contact_email?: string
          notes?: string | null
          updated_at?: string
        }
      }
      campaigns: {
        Row: {
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
        Insert: {
          id?: string
          client_id: string
          name: string
          type: string
          platforms?: string[]
          hashtags?: string[]
          start_date?: string | null
          end_date?: string | null
          status?: "draft" | "active" | "scheduled" | "completed"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          name?: string
          type?: string
          platforms?: string[]
          hashtags?: string[]
          start_date?: string | null
          end_date?: string | null
          status?: "draft" | "active" | "scheduled" | "completed"
          updated_at?: string
        }
      }
      content_items: {
        Row: {
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
        Insert: {
          id?: string
          client_id: string
          campaign_id?: string | null
          name: string
          type: "image" | "video" | "audio" | "document"
          file_path: string
          file_size: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          campaign_id?: string | null
          name?: string
          type?: "image" | "video" | "audio" | "document"
          file_path?: string
          file_size?: number
          updated_at?: string
        }
      }
      scheduled_posts: {
        Row: {
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
        Insert: {
          id?: string
          campaign_id: string
          client_id: string
          platform: string
          content: string
          media_urls?: string[]
          hashtags?: string[]
          scheduled_time: string
          status?: "draft" | "scheduled" | "published" | "failed"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          campaign_id?: string
          client_id?: string
          platform?: string
          content?: string
          media_urls?: string[]
          hashtags?: string[]
          scheduled_time?: string
          status?: "draft" | "scheduled" | "published" | "failed"
          updated_at?: string
        }
      }
    }
  }
}
