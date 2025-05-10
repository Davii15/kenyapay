import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"

// Create a server-side Supabase client
export async function createServerSupabaseClient() {
  const cookieStore = cookies()
  return createServerComponentClient<Database>({ cookies: () => cookieStore })
}

// Get the current session on the server
export async function getServerSession() {
  try {
    const supabase = await createServerSupabaseClient()
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    if (error) {
      console.error("Error getting session on server:", error)
      return { session: null, error }
    }

    return { session, error: null }
  } catch (error) {
    console.error("Unexpected error getting session on server:", error)
    return { session: null, error: error as Error }
  }
}

// Get the current user on the server
export async function getServerUser() {
  try {
    const { session, error } = await getServerSession()

    if (error || !session) {
      return { user: null, error: error || new Error("No session found") }
    }

    return { user: session.user, error: null }
  } catch (error) {
    console.error("Unexpected error getting user on server:", error)
    return { user: null, error: error as Error }
  }
}

// Get user profile data from the database
export async function getUserProfile(userId: string) {
  try {
    const supabase = await createServerSupabaseClient()

    const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()

    if (error) {
      console.error("Error getting user profile:", error)
      return { profile: null, error }
    }

    return { profile: data, error: null }
  } catch (error) {
    console.error("Unexpected error getting user profile:", error)
    return { profile: null, error: error as Error }
  }
}

// Check if the current user has admin role
export async function isAdmin() {
  try {
    const { user, error } = await getServerUser()

    if (error || !user) {
      return false
    }

    const supabase = await createServerSupabaseClient()

    const { data, error: profileError } = await supabase.from("users").select("role").eq("id", user.id).single()

    if (profileError || !data) {
      console.error("Error checking admin role:", profileError)
      return false
    }

    return data.role === "admin"
  } catch (error) {
    console.error("Unexpected error checking admin role:", error)
    return false
  }
}

// Log admin actions
export async function logAdminAction(adminId: string, action: string, details: any = null) {
  try {
    const supabase = await createServerSupabaseClient()

    const { error } = await supabase.from("admin_logs").insert({
      admin_id: adminId,
      action,
      details,
      created_at: new Date().toISOString(),
    })

    if (error) {
      console.error("Error logging admin action:", error)
      return { success: false, error }
    }

    return { success: true, error: null }
  } catch (error) {
    console.error("Unexpected error logging admin action:", error)
    return { success: false, error: error as Error }
  }
}
