export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      admin_logs: {
        Row: {
          id: string
          admin_id: string
          action: string
          details: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          admin_id: string
          action: string
          details?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          admin_id?: string
          action?: string
          details?: Json | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_logs_admin_id_fkey"
            columns: ["admin_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          id: string
          user_id: string
          document_type: string
          document_url: string
          verification_status: string
          uploaded_at: string
          verified_at: string | null
          verified_by: string | null
          rejection_reason: string | null
        }
        Insert: {
          id?: string
          user_id: string
          document_type: string
          document_url: string
          verification_status?: string
          uploaded_at?: string
          verified_at?: string | null
          verified_by?: string | null
          rejection_reason?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          document_type?: string
          document_url?: string
          verification_status?: string
          uploaded_at?: string
          verified_at?: string | null
          verified_by?: string | null
          rejection_reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_verified_by_fkey"
            columns: ["verified_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          read?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          id: string
          sender_id: string | null
          receiver_id: string | null
          amount: number
          fee: number
          currency: string
          transaction_type: string
          status: string
          payment_method: string | null
          payment_reference: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          sender_id?: string | null
          receiver_id?: string | null
          amount: number
          fee?: number
          currency: string
          transaction_type: string
          status?: string
          payment_method?: string | null
          payment_reference?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          sender_id?: string | null
          receiver_id?: string | null
          amount?: number
          fee?: number
          currency?: string
          transaction_type?: string
          status?: string
          payment_method?: string | null
          payment_reference?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_receiver_id_fkey"
            columns: ["receiver_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_sender_id_fkey"
            columns: ["sender_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: string
          phone: string | null
          business_name: string | null
          business_type: string | null
          business_description: string | null
          verification_status: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id: string
          email: string
          name: string
          role: string
          phone?: string | null
          business_name?: string | null
          business_type?: string | null
          business_description?: string | null
          verification_status?: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: string
          phone?: string | null
          business_name?: string | null
          business_type?: string | null
          business_description?: string | null
          verification_status?: string
          created_at?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      wallets: {
        Row: {
          id: string
          user_id: string
          balance: number
          currency: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          balance?: number
          currency: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          balance?: number
          currency?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallets_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
