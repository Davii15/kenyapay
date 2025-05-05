// This file contains server-side authentication utilities
import { getServerSession as getNextAuthServerSession } from "next-auth/next"
import { authOptions } from "./auth"
import { createClient } from "@supabase/supabase-js"

// Get the server session
export async function getServerSession() {
  return await getNextAuthServerSession(authOptions)
}

// Create a Supabase client for server-side operations
export function createServerSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      "Missing environment variables for Supabase. Please check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    )
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// Get user by ID from the database
export async function getUserById(userId: string) {
  try {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error("Error fetching user by ID:", error)
    return null
  }
}

// Verify if a user has admin privileges
export async function verifyAdminAccess(userId: string) {
  try {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase.from("users").select("role").eq("id", userId).single()

    if (error || !data) {
      return false
    }

    return data.role === "admin"
  } catch (error) {
    console.error("Error verifying admin access:", error)
    return false
  }
}
