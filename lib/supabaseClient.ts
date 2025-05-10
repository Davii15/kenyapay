import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Check if we're running on the client side
const isBrowser = typeof window !== "undefined"

// Initialize these variables outside any function to avoid initialization errors
let supabaseUrl = ""
let supabaseAnonKey = ""

// Only access environment variables if they exist
if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
  supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
}

if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
}

// Create a singleton instance
let supabaseInstance: ReturnType<typeof createClient<Database>> | null = null

// Function to get the Supabase client
export function getSupabase() {
  // If we're on the server and don't have the environment variables, return a mock client
  if (!isBrowser && (!supabaseUrl || !supabaseAnonKey)) {
    console.warn("Supabase URL or Anon Key not available on server")
    return createMockClient()
  }

  // If we're on the client and don't have the environment variables, throw an error
  if (isBrowser && (!supabaseUrl || !supabaseAnonKey)) {
    console.error("Supabase URL or Anon Key not available on client")
    throw new Error("Supabase configuration missing")
  }

  // If we already have an instance, return it
  if (supabaseInstance) {
    return supabaseInstance
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

// Create a mock client for server-side rendering
function createMockClient() {
  // Return a mock client that won't throw errors during SSR
  return {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      signUp: () => Promise.resolve({ data: null, error: new Error("Not available during SSR") }),
      signIn: () => Promise.resolve({ data: null, error: new Error("Not available during SSR") }),
      signOut: () => Promise.resolve({ error: null }),
    },
    from: () => ({
      select: () => ({ data: null, error: new Error("Not available during SSR") }),
      insert: () => ({ data: null, error: new Error("Not available during SSR") }),
      update: () => ({ data: null, error: new Error("Not available during SSR") }),
      delete: () => ({ data: null, error: new Error("Not available during SSR") }),
    }),
  } as any
}

// Export a direct instance for compatibility with existing code
// This is safe because it's using the function above which handles initialization properly
export const supabase = getSupabase()
