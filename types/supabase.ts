export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: "tourist" | "business" | "admin"
          country: string | null
          business_name: string | null
          business_type: string | null
          passport_document_url: string | null
          business_license_url: string | null
          verification_status: "pending" | "verified" | "rejected"
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          role: "tourist" | "business" | "admin"
          country?: string | null
          business_name?: string | null
          business_type?: string | null
          passport_document_url?: string | null
          business_license_url?: string | null
          verification_status?: "pending" | "verified" | "rejected"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: "tourist" | "business" | "admin"
          country?: string | null
          business_name?: string | null
          business_type?: string | null
          passport_document_url?: string | null
          business_license_url?: string | null
          verification_status?: "pending" | "verified" | "rejected"
          created_at?: string
          updated_at?: string
        }
      }
      wallets: {
        Row: {
          id: string
          user_id: string
          balance: number
          currency: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          balance?: number
          currency?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          balance?: number
          currency?: string
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          from_user_id: string | null
          to_user_id: string | null
          amount: number
          type: "topup" | "payment" | "withdrawal"
          status: "pending" | "completed" | "failed"
          payment_method: "paypal" | "mpesa" | "bank" | null
          reference: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          from_user_id?: string | null
          to_user_id?: string | null
          amount: number
          type: "topup" | "payment" | "withdrawal"
          status: "pending" | "completed" | "failed"
          payment_method?: "paypal" | "mpesa" | "bank" | null
          reference?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          from_user_id?: string | null
          to_user_id?: string | null
          amount?: number
          type?: "topup" | "payment" | "withdrawal"
          status?: "pending" | "completed" | "failed"
          payment_method?: "paypal" | "mpesa" | "bank" | null
          reference?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      businesses: {
        Row: {
          id: string
          user_id: string
          name: string
          type: string
          location: string
          contact_phone: string | null
          contact_email: string | null
          verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          type: string
          location: string
          contact_phone?: string | null
          contact_email?: string | null
          verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          type?: string
          location?: string
          contact_phone?: string | null
          contact_email?: string | null
          verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      payout_requests: {
        Row: {
          id: string
          business_id: string
          amount: number
          status: "pending" | "processing" | "completed" | "failed"
          payment_method: "mpesa" | "bank"
          account_details: Json
          created_at: string
          processed_at: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          amount: number
          status: "pending" | "processing" | "completed" | "failed"
          payment_method: "mpesa" | "bank"
          account_details: Json
          created_at?: string
          processed_at?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          amount?: number
          status?: "pending" | "processing" | "completed" | "failed"
          payment_method?: "mpesa" | "bank"
          account_details?: Json
          created_at?: string
          processed_at?: string | null
          updated_at?: string
        }
      }
      exchange_rates: {
        Row: {
          id: string
          currency: string
          rate: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          currency: string
          rate: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          currency?: string
          rate?: number
          created_at?: string
          updated_at?: string
        }
      }
      platform_revenue: {
        Row: {
          id: string
          source: "topup_margin" | "withdrawal_fee"
          amount: number
          transaction_id: string | null
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          source: "topup_margin" | "withdrawal_fee"
          amount: number
          transaction_id?: string | null
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          source?: "topup_margin" | "withdrawal_fee"
          amount?: number
          transaction_id?: string | null
          description?: string | null
          created_at?: string
        }
      }
      admin_logs: {
        Row: {
          id: string
          admin_id: string
          action: string
          entity_type: "user" | "business" | "transaction" | "payout" | "system"
          entity_id: string | null
          details: Json | null
          ip_address: string | null
          created_at: string
        }
        Insert: {
          id?: string
          admin_id: string
          action: string
          entity_type: "user" | "business" | "transaction" | "payout" | "system"
          entity_id?: string | null
          details?: Json | null
          ip_address?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          admin_id?: string
          action?: string
          entity_type?: "user" | "business" | "transaction" | "payout" | "system"
          entity_id?: string | null
          details?: Json | null
          ip_address?: string | null
          created_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          transaction_id: string
          payment_provider: "paypal" | "mpesa" | "bank" | "wallet"
          provider_transaction_id: string | null
          amount: number
          currency: string
          status: "pending" | "completed" | "failed" | "refunded"
          payment_details: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          transaction_id: string
          payment_provider: "paypal" | "mpesa" | "bank" | "wallet"
          provider_transaction_id?: string | null
          amount: number
          currency: string
          status: "pending" | "completed" | "failed" | "refunded"
          payment_details?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          transaction_id?: string
          payment_provider?: "paypal" | "mpesa" | "bank" | "wallet"
          provider_transaction_id?: string | null
          amount?: number
          currency?: string
          status?: "pending" | "completed" | "failed" | "refunded"
          payment_details?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      qr_codes: {
        Row: {
          id: string
          business_id: string
          type: "static" | "dynamic"
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
          type: "static" | "dynamic"
          amount?: number | null
          is_fixed_amount?: boolean
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
          type?: "static" | "dynamic"
          amount?: number | null
          is_fixed_amount?: boolean
          title?: string | null
          description?: string | null
          times_scanned?: number
          active?: boolean
          created_at?: string
          updated_at?: string
        }
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
          payment_provider: "paypal" | "mpesa" | "bank"
          status: "pending" | "completed" | "failed"
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
          payment_provider: "paypal" | "mpesa" | "bank"
          status: "pending" | "completed" | "failed"
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
          payment_provider?: "paypal" | "mpesa" | "bank"
          status?: "pending" | "completed" | "failed"
          provider_reference?: string | null
          created_at?: string
          updated_at?: string
        }
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
  }
}
