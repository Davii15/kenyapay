export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      admin_logs: {
        Row: {
          id: string
          admin_id: string
          action: string
          entity_type: string
          entity_id: string | null
          details: Json | null
          ip_address: string | null
          created_at: string
        }
        Insert: {
          id?: string
          admin_id: string
          action: string
          entity_type: string
          entity_id?: string | null
          details?: Json | null
          ip_address?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          admin_id?: string
          action?: string
          entity_type?: string
          entity_id?: string | null
          details?: Json | null
          ip_address?: string | null
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
      payments: {
        Row: {
          id: string
          transaction_id: string
          payment_provider: string
          provider_transaction_id: string | null
          amount: number
          currency: string
          status: string
          payment_details: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          transaction_id: string
          payment_provider: string
          provider_transaction_id?: string | null
          amount: number
          currency: string
          status: string
          payment_details?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          transaction_id?: string
          payment_provider?: string
          provider_transaction_id?: string | null
          amount?: number
          currency?: string
          status?: string
          payment_details?: Json | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_transaction_id_fkey"
            columns: ["transaction_id"]
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_revenue: {
        Row: {
          id: string
          source: string
          amount: number
          transaction_id: string | null
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          source: string
          amount: number
          transaction_id?: string | null
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          source?: string
          amount?: number
          transaction_id?: string | null
          description?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "platform_revenue_transaction_id_fkey"
            columns: ["transaction_id"]
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      qr_codes: {
        Row: {
          id: string
          business_id: string
          type: string
          amount: number | null
          is_fixed_amount: boolean
          title: string | null
          description: string | null
          times_scanned: number
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          type: string
          amount?: number | null
          is_fixed_amount: boolean
          title?: string | null
          description?: string | null
          times_scanned?: number
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          type?: string
          amount?: number | null
          is_fixed_amount?: boolean
          title?: string | null
          description?: string | null
          times_scanned?: number
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "qr_codes_business_id_fkey"
            columns: ["business_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      topups: {
        Row: {
          id: string
          user_id: string
          transaction_id: string
          amount: number
          source_currency: string
          exchange_rate: number
          ksh_amount: number
          payment_provider: string
          status: string
          provider_reference: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          transaction_id: string
          amount: number
          source_currency: string
          exchange_rate: number
          ksh_amount: number
          payment_provider: string
          status: string
          provider_reference?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          transaction_id?: string
          amount?: number
          source_currency?: string
          exchange_rate?: number
          ksh_amount?: number
          payment_provider?: string
          status?: string
          provider_reference?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "topups_transaction_id_fkey"
            columns: ["transaction_id"]
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "topups_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          id: string
          from_user_id: string | null
          to_user_id: string | null
          amount: number
          type: string
          status: string
          payment_method: string | null
          reference: string | null
          created_at: string
        }
        Insert: {
          id?: string
          from_user_id?: string | null
          to_user_id?: string | null
          amount: number
          type: string
          status: string
          payment_method?: string | null
          reference?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          from_user_id?: string | null
          to_user_id?: string | null
          amount?: number
          type?: string
          status?: string
          payment_method?: string | null
          reference?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_from_user_id_fkey"
            columns: ["from_user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_to_user_id_fkey"
            columns: ["to_user_id"]
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
          country: string | null
          business_name: string | null
          business_type: string | null
          passport_document_url: string | null
          business_license_url: string | null
          verification_status: string
          created_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          role: string
          country?: string | null
          business_name?: string | null
          business_type?: string | null
          passport_document_url?: string | null
          business_license_url?: string | null
          verification_status?: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: string
          country?: string | null
          business_name?: string | null
          business_type?: string | null
          passport_document_url?: string | null
          business_license_url?: string | null
          verification_status?: string
          created_at?: string
        }
        Relationships: []
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
          balance: number
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
      increment_qr_scan: {
        Args: {
          qr_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
