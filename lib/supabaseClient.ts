import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Check if we're running on the client side
const isBrowser = typeof window !== "undefined"

// Initialize these variables outside any function to avoid initialization errors
// Use empty strings as fallbacks for development/preview
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Create a singleton instance
let supabaseInstance: ReturnType<typeof createClient<Database>> | null = null

// Function to get the Supabase client
export function getSupabase() {
  // If we already have an instance, return it
  if (supabaseInstance) {
    return supabaseInstance
  }

  // For preview/development environments, use a mock client if credentials are missing
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase credentials missing. Using mock client for preview/development.")
    return createMockClient()
  }

  // Otherwise, create a new instance
  try {
    supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: isBrowser, // Only persist the session on the client
        autoRefreshToken: isBrowser, // Only auto refresh the token on the client
      },
    })
    return supabaseInstance
  } catch (error) {
    console.error("Error creating Supabase client:", error)
    return createMockClient()
  }
}

// Create a mock client for development/preview or server-side rendering
function createMockClient() {
  console.log("Using mock Supabase client")

  // Return a mock client that won't throw errors
  return {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      signUp: () =>
        Promise.resolve({
          data: { user: { id: "mock-user-id", email: "mock@example.com" } },
          error: null,
        }),
      signIn: () =>
        Promise.resolve({
          data: { user: { id: "mock-user-id", email: "mock@example.com" } },
          error: null,
        }),
      signOut: () => Promise.resolve({ error: null }),
    },
    from: (table: string) => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: null }),
          limit: () => Promise.resolve({ data: [], error: null }),
        }),
        limit: () => Promise.resolve({ data: [], error: null }),
      }),
      insert: () => ({
        select: () => ({
          single: () => Promise.resolve({ data: { id: "mock-id" }, error: null }),
        }),
      }),
      update: () => ({
        eq: () => ({
          select: () => ({
            single: () => Promise.resolve({ data: { id: "mock-id" }, error: null }),
          }),
        }),
      }),
      delete: () => ({
        eq: () => Promise.resolve({ data: null, error: null }),
      }),
    }),
    storage: {
      from: () => ({
        upload: () => Promise.resolve({ data: { path: "mock-path" }, error: null }),
        getPublicUrl: () => ({ data: { publicUrl: "https://mock-url.com/image.jpg" } }),
      }),
    },
    rpc: () => Promise.resolve({ data: null, error: null }),
  } as any
}

// Export a direct instance for compatibility with existing code
export const supabase = getSupabase()

// Helper functions for common database operations

// User operations
export async function getUserById(userId: string) {
  try {
    const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()
    if (error) throw error
    return data
  } catch (error) {
    console.error("Error getting user by ID:", error)
    return null
  }
}

export async function getUserByEmail(email: string) {
  try {
    const { data, error } = await supabase.from("users").select("*").eq("email", email).single()
    if (error && error.code !== "PGRST116") throw error // PGRST116 is "no rows returned"
    return data
  } catch (error) {
    console.error("Error getting user by email:", error)
    return null
  }
}

// File upload helpers
export async function uploadUserDocument(file: File, userId: string, documentType: "passport" | "business_license") {
  try {
    // For preview/development without Supabase credentials, return a mock URL
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn("Using mock document upload in preview/development mode")
      return `https://mock-storage.com/${userId}/${documentType}_${Date.now()}.jpg`
    }

    const fileExt = file.name.split(".").pop()
    const fileName = `${userId}/${documentType}_${Date.now()}.${fileExt}`
    const filePath = `documents/${fileName}`

    const { data, error } = await supabase.storage.from("user_documents").upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) throw error

    // Get public URL
    const { data: publicUrlData } = supabase.storage.from("user_documents").getPublicUrl(filePath)

    return publicUrlData.publicUrl
  } catch (error) {
    console.error("Error uploading user document:", error)
    // Return a fallback URL for development/preview
    return `https://placeholder.com/${userId}/${documentType}_error.jpg`
  }
}

// Update user verification document URLs
export async function updateUserDocuments(
  userId: string,
  updates: {
    passport_document_url?: string
    business_license_url?: string
  },
) {
  try {
    const { data, error } = await supabase
      .from("users")
      .update({
        ...updates,
        verification_status: "pending", // Set to pending when documents are uploaded
      })
      .eq("id", userId)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error updating user documents:", error)
    return null
  }
}

// Wallet operations
export async function getWalletByUserId(userId: string) {
  try {
    const { data, error } = await supabase.from("wallets").select("*").eq("user_id", userId).single()
    if (error && error.code !== "PGRST116") throw error
    return data
  } catch (error) {
    console.error("Error getting wallet by user ID:", error)
    return null
  }
}

export async function updateWalletBalance(walletId: string, amount: number) {
  try {
    const { data, error } = await supabase
      .from("wallets")
      .update({ balance: amount, updated_at: new Date().toISOString() })
      .eq("id", walletId)
      .select()
      .single()
    if (error) throw error
    return data
  } catch (error) {
    console.error("Error updating wallet balance:", error)
    return null
  }
}

// Transaction operations
export async function createTransaction(transaction: any) {
  try {
    const { data, error } = await supabase
      .from("transactions")
      .insert({
        ...transaction,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()
    if (error) throw error
    return data
  } catch (error) {
    console.error("Error creating transaction:", error)
    return null
  }
}

export async function getTransactionsByUserId(userId: string, limit = 10) {
  try {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .or(`from_user_id.eq.${userId},to_user_id.eq.${userId}`)
      .order("created_at", { ascending: false })
      .limit(limit)
    if (error) throw error
    return data
  } catch (error) {
    console.error("Error getting transactions by user ID:", error)
    return []
  }
}

export async function getTransactionById(transactionId: string) {
  try {
    const { data, error } = await supabase.from("transactions").select("*").eq("id", transactionId).single()
    if (error) throw error
    return data
  } catch (error) {
    console.error("Error getting transaction by ID:", error)
    return null
  }
}

export async function updateTransactionStatus(transactionId: string, status: string) {
  try {
    const { data, error } = await supabase
      .from("transactions")
      .update({ status })
      .eq("id", transactionId)
      .select()
      .single()
    if (error) throw error
    return data
  } catch (error) {
    console.error("Error updating transaction status:", error)
    return null
  }
}

// Platform Revenue operations
export async function recordPlatformRevenue(revenue: any) {
  try {
    const { data, error } = await supabase
      .from("platform_revenue")
      .insert({
        ...revenue,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()
    if (error) throw error
    return data
  } catch (error) {
    console.error("Error recording platform revenue:", error)
    return null
  }
}

// Admin Logs operations
export async function createAdminLog(log: any) {
  try {
    const { data, error } = await supabase
      .from("admin_logs")
      .insert({
        ...log,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()
    if (error) throw error
    return data
  } catch (error) {
    console.error("Error creating admin log:", error)
    return null
  }
}

export async function getAdminLogs(options: any = {}) {
  try {
    let query = supabase.from("admin_logs").select("*")

    if (options.adminId) {
      query = query.eq("admin_id", options.adminId)
    }

    if (options.entityType) {
      query = query.eq("entity_type", options.entityType)
    }

    if (options.entityId) {
      query = query.eq("entity_id", options.entityId)
    }

    if (options.startDate) {
      query = query.gte("created_at", options.startDate)
    }

    if (options.endDate) {
      query = query.lte("created_at", options.endDate)
    }

    if (options.limit) {
      query = query.limit(options.limit)
    }

    query = query.order("created_at", { ascending: false })

    const { data, error } = await query
    if (error) throw error
    return data
  } catch (error) {
    console.error("Error getting admin logs:", error)
    return []
  }
}

// Payment operations
export async function createPayment(payment: any) {
  try {
    const now = new Date().toISOString()
    const { data, error } = await supabase
      .from("payments")
      .insert({
        ...payment,
        created_at: now,
        updated_at: now,
      })
      .select()
      .single()
    if (error) throw error
    return data
  } catch (error) {
    console.error("Error creating payment:", error)
    return null
  }
}

export async function updatePaymentStatus(paymentId: string, status: string) {
  try {
    const { data, error } = await supabase
      .from("payments")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", paymentId)
      .select()
      .single()
    if (error) throw error
    return data
  } catch (error) {
    console.error("Error updating payment status:", error)
    return null
  }
}

export async function getPaymentByTransactionId(transactionId: string) {
  try {
    const { data, error } = await supabase.from("payments").select("*").eq("transaction_id", transactionId).single()
    if (error) throw error
    return data
  } catch (error) {
    console.error("Error getting payment by transaction ID:", error)
    return null
  }
}

// QR Code operations
export async function createQRCode(qrCode: any) {
  try {
    const now = new Date().toISOString()
    const { data, error } = await supabase
      .from("qr_codes")
      .insert({
        ...qrCode,
        times_scanned: 0,
        created_at: now,
        updated_at: now,
      })
      .select()
      .single()
    if (error) throw error
    return data
  } catch (error) {
    console.error("Error creating QR code:", error)
    return null
  }
}

export async function getQRCodesByBusinessId(businessId: string) {
  try {
    const { data, error } = await supabase
      .from("qr_codes")
      .select("*")
      .eq("business_id", businessId)
      .order("created_at", { ascending: false })
    if (error) throw error
    return data
  } catch (error) {
    console.error("Error getting QR codes by business ID:", error)
    return []
  }
}

export async function incrementQRCodeScan(qrCodeId: string) {
  try {
    const { data, error } = await supabase.rpc("increment_qr_scan", { qr_id: qrCodeId })
    if (error) throw error
    return data
  } catch (error) {
    console.error("Error incrementing QR code scan:", error)
    return null
  }
}

// Topup operations
export async function createTopup(topup: any) {
  try {
    const now = new Date().toISOString()
    const { data, error } = await supabase
      .from("topups")
      .insert({
        ...topup,
        created_at: now,
        updated_at: now,
      })
      .select()
      .single()
    if (error) throw error
    return data
  } catch (error) {
    console.error("Error creating topup:", error)
    return null
  }
}

export async function updateTopupStatus(topupId: string, status: string, providerReference?: string) {
  try {
    const updates: any = {
      status,
      updated_at: new Date().toISOString(),
    }

    if (providerReference) {
      updates.provider_reference = providerReference
    }

    const { data, error } = await supabase.from("topups").update(updates).eq("id", topupId).select().single()
    if (error) throw error
    return data
  } catch (error) {
    console.error("Error updating topup status:", error)
    return null
  }
}

export async function getTopupsByUserId(userId: string, limit = 10) {
  try {
    const { data, error } = await supabase
      .from("topups")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit)
    if (error) throw error
    return data
  } catch (error) {
    console.error("Error getting topups by user ID:", error)
    return []
  }
}
