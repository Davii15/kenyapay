import { createClient } from "@supabase/supabase-js"

// Types for our database tables
export type User = {
  id: string
  email: string
  name: string
  role: "tourist" | "business" | "admin"
  country?: string
  business_name?: string
  business_type?: string
  passport_document_url?: string
  business_license_url?: string
  verification_status: "pending" | "verified" | "rejected"
  created_at: string
}

export type Wallet = {
  id: string
  user_id: string
  balance: number
  currency: string
  updated_at: string
}

export type Transaction = {
  id: string
  from_user_id?: string
  to_user_id?: string
  amount: number
  type: "topup" | "payment" | "withdrawal"
  status: "pending" | "completed" | "failed"
  payment_method?: "paypal" | "mpesa" | "bank"
  reference?: string
  created_at: string
}

export type PlatformRevenue = {
  id: string
  source: "topup_margin" | "withdrawal_fee"
  amount: number
  transaction_id?: string
  description?: string
  created_at: string
}

export type AdminLog = {
  id: string
  admin_id: string
  action: string
  entity_type: "user" | "business" | "transaction" | "payout" | "system"
  entity_id?: string
  details?: any
  ip_address?: string
  created_at: string
}

export type Payment = {
  id: string
  transaction_id: string
  payment_provider: "paypal" | "mpesa" | "bank" | "wallet"
  provider_transaction_id?: string
  amount: number
  currency: string
  status: "pending" | "completed" | "failed" | "refunded"
  payment_details?: any
  created_at: string
  updated_at: string
}

export type QRCode = {
  id: string
  business_id: string
  type: "static" | "dynamic"
  amount?: number
  is_fixed_amount: boolean
  title?: string
  description?: string
  times_scanned: number
  active: boolean
  created_at: string
  updated_at: string
}

export type Topup = {
  id: string
  user_id: string
  transaction_id: string
  amount: number
  source_currency: string
  exchange_rate: number
  ksh_amount: number
  payment_provider: "paypal" | "mpesa" | "bank"
  status: "pending" | "completed" | "failed"
  provider_reference?: string
  created_at: string
  updated_at: string
}

// Simple initialization
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create the Supabase client
export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "")

// Export a function to get the Supabase client
export function getSupabase() {
  return supabase
}

// Helper functions for common database operations

// User operations
export async function getUserById(userId: string) {
  const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()

  if (error) throw error
  return data as User
}

export async function getUserByEmail(email: string) {
  const { data, error } = await supabase.from("users").select("*").eq("email", email).single()

  if (error) throw error
  return data as User
}

// Wallet operations
export async function getWalletByUserId(userId: string) {
  const { data, error } = await supabase.from("wallets").select("*").eq("user_id", userId).single()

  if (error) throw error
  return data as Wallet
}

export async function updateWalletBalance(walletId: string, amount: number) {
  const { data, error } = await supabase
    .from("wallets")
    .update({ balance: amount, updated_at: new Date().toISOString() })
    .eq("id", walletId)
    .select()
    .single()

  if (error) throw error
  return data as Wallet
}

// Transaction operations
export async function createTransaction(transaction: Omit<Transaction, "id" | "created_at">) {
  const { data, error } = await supabase
    .from("transactions")
    .insert({
      ...transaction,
      created_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) throw error
  return data as Transaction
}

export async function getTransactionsByUserId(userId: string, limit = 10) {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .or(`from_user_id.eq.${userId},to_user_id.eq.${userId}`)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) throw error
  return data as Transaction[]
}

export async function getTransactionById(transactionId: string) {
  const { data, error } = await supabase.from("transactions").select("*").eq("id", transactionId).single()

  if (error) throw error
  return data as Transaction
}

export async function updateTransactionStatus(transactionId: string, status: Transaction["status"]) {
  const { data, error } = await supabase
    .from("transactions")
    .update({ status })
    .eq("id", transactionId)
    .select()
    .single()

  if (error) throw error
  return data as Transaction
}

// Platform Revenue operations
export async function recordPlatformRevenue(revenue: Omit<PlatformRevenue, "id" | "created_at">) {
  const { data, error } = await supabase
    .from("platform_revenue")
    .insert({
      ...revenue,
      created_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) throw error
  return data as PlatformRevenue
}

// Admin Logs operations
export async function createAdminLog(log: Omit<AdminLog, "id" | "created_at">) {
  const { data, error } = await supabase
    .from("admin_logs")
    .insert({
      ...log,
      created_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) throw error
  return data as AdminLog
}

export async function getAdminLogs(
  options: {
    adminId?: string
    entityType?: AdminLog["entity_type"]
    entityId?: string
    startDate?: string
    endDate?: string
    limit?: number
  } = {},
) {
  const { data, error } = await supabase
    .from("admin_logs")
    .select("*")
    .eq("admin_id", options.adminId)
    .eq("entity_type", options.entityType)
    .eq("entity_id", options.entityId)
    .gte("created_at", options.startDate)
    .lte("created_at", options.endDate)
    .limit(options.limit)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data as AdminLog[]
}

// Payment operations
export async function createPayment(payment: Omit<Payment, "id" | "created_at" | "updated_at">) {
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
  return data as Payment
}

export async function updatePaymentStatus(paymentId: string, status: Payment["status"]) {
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
  return data as Payment
}

export async function getPaymentByTransactionId(transactionId: string) {
  const { data, error } = await supabase.from("payments").select("*").eq("transaction_id", transactionId).single()

  if (error) throw error
  return data as Payment
}

// QR Code operations
export async function createQRCode(qrCode: Omit<QRCode, "id" | "created_at" | "updated_at" | "times_scanned">) {
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
  return data as QRCode
}

export async function getQRCodesByBusinessId(businessId: string) {
  const { data, error } = await supabase
    .from("qr_codes")
    .select("*")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data as QRCode[]
}

export async function incrementQRCodeScan(qrCodeId: string) {
  const { data, error } = await supabase.rpc("increment_qr_scan", { qr_id: qrCodeId })

  if (error) throw error
  return data
}

// Topup operations
export async function createTopup(topup: Omit<Topup, "id" | "created_at" | "updated_at">) {
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
  return data as Topup
}

export async function updateTopupStatus(topupId: string, status: Topup["status"], providerReference?: string) {
  const updates: Partial<Topup> = {
    status,
    updated_at: new Date().toISOString(),
  }

  if (providerReference) {
    updates.provider_reference = providerReference
  }

  const { data, error } = await supabase.from("topups").update(updates).eq("id", topupId).select().single()

  if (error) throw error
  return data as Topup
}

export async function getTopupsByUserId(userId: string, limit = 10) {
  const { data, error } = await supabase
    .from("topups")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) throw error
  return data as Topup[]
}
