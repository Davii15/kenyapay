import { cookies } from "next/headers"
import { createClient } from "@supabase/supabase-js"

// Check for environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Server-side Supabase client that uses cookies
export function createServerClient<Database = any>() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase credentials not found. Please make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your environment variables.",
    )
  }

  const cookieStore = cookies()
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
    },
  })
}
