import { createClient } from '@supabase/supabase-js'

// TODO: Replace with your actual Supabase credentials
// Get these from your Supabase project settings
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types (to be updated based on your actual schema)
export type Database = {
  public: {
    Tables: {
      jobs: {
        Row: {
          id: string
          title: string
          description: string
          status: 'pending' | 'in_progress' | 'completed' | 'overdue'
          client_id: string
          worker_id: string
          scheduled_date: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['jobs']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['jobs']['Insert']>
      }
      clients: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          company: string
          status: 'active' | 'inactive'
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['clients']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['clients']['Insert']>
      }
      workers: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          status: 'available' | 'on_route' | 'busy'
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['workers']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['workers']['Insert']>
      }
    }
  }
}

