import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export type UserRole = 'manager' | 'worker' | 'client'

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      clients: {
        Row: {
          company: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
          status: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          status?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          status?: string | null
        }
        Relationships: []
      }
      jobs: {
        Row: {
          address: string | null
          client_id: string | null
          created_at: string | null
          description: string | null
          id: string
          latitude: number | null
          longitude: number | null
          route_id: string | null
          route_order: number | null
          scheduled_date: string | null
          status: string | null
          title: string
          worker_id: string | null
        }
        Insert: {
          address?: string | null
          client_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          route_id?: string | null
          route_order?: number | null
          scheduled_date?: string | null
          status?: string | null
          title: string
          worker_id?: string | null
        }
        Update: {
          address?: string | null
          client_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          route_id?: string | null
          route_order?: number | null
          scheduled_date?: string | null
          status?: string | null
          title?: string
          worker_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jobs_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "routes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "workers"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          role?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      route_jobs: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          job_id: string
          job_order: number
          location_lat: number | null
          location_lng: number | null
          route_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          job_id: string
          job_order: number
          location_lat?: number | null
          location_lng?: number | null
          route_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          job_id?: string
          job_order?: number
          location_lat?: number | null
          location_lng?: number | null
          route_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "route_jobs_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "route_jobs_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "routes"
            referencedColumns: ["id"]
          },
        ]
      }
      routes: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          optimized_path: Json | null
          route_date: string
          status: string
          total_distance_meters: number | null
          total_duration_seconds: number | null
          updated_at: string
          worker_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          optimized_path?: Json | null
          route_date: string
          status?: string
          total_distance_meters?: number | null
          total_duration_seconds?: number | null
          updated_at?: string
          worker_id: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          optimized_path?: Json | null
          route_date?: string
          status?: string
          total_distance_meters?: number | null
          total_duration_seconds?: number | null
          updated_at?: string
          worker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "routes_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "workers"
            referencedColumns: ["id"]
          },
        ]
      }
      workers: {
        Row: {
          created_at: string | null
          depot_address: string | null
          depot_latitude: number | null
          depot_longitude: number | null
          email: string | null
          id: string
          name: string
          phone: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          depot_address?: string | null
          depot_latitude?: number | null
          depot_longitude?: number | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          depot_address?: string | null
          depot_latitude?: number | null
          depot_longitude?: number | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          status?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
