"use client"

import { useState, useEffect } from "react"
import { getSupabase } from "./supabaseClient"
import { useRouter } from "next/navigation"

// Check if we're running on the client side
const isBrowser = typeof window !== "undefined"

// Create a safe auth object that won't cause initialization errors
const createSafeAuth = () => {
  // Only initialize auth functions if we're on the client
  if (!isBrowser) {
    return {
      signUp: async () => ({ error: new Error("Auth not available during SSR") }),
      signIn: async () => ({ error: new Error("Auth not available during SSR") }),
      signOut: async () => ({ error: new Error("Auth not available during SSR") }),
      resetPassword: async () => ({ error: new Error("Auth not available during SSR") }),
      updatePassword: async () => ({ error: new Error("Auth not available during SSR") }),
      getSession: async () => ({ data: { session: null }, error: null }),
      getUser: async () => ({ data: { user: null }, error: null }),
    }
  }

  // Get the Supabase client
  const supabase = getSupabase()

  // Create a server action or API route
export async function serverSignUp(email, password, userData) {
  // Use service role client that bypasses RLS
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
  
  // 1. Create auth user
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  });
  
  if (authError) return { error: authError };
  
  // 2. Create user profile with the same client
  const { error: profileError } = await supabaseAdmin
    .from('users')
    .insert({
      id: authData.user.id,
      email,
      name: userData.name,
      role: userData.role,
      // other fields...
    });
    
  if (profileError) return { error: profileError };
  
  return { user: authData.user, error: null };
}
      // Create a wallet for the user
      const { error: walletError } = await supabase.from("wallets").insert([
        {
          user_id: data.user.id,
          balance: 0,
          currency: "KSH",
          updated_at: new Date().toISOString(),
        },
      ])

      if (walletError) {
        console.error("Wallet creation error:", walletError)
        return { error: walletError }
      }

      console.log("User wallet created successfully")

      return { data, error: null }
    } catch (err) {
      console.error("Unexpected error during signup:", err)
      return { error: err as Error }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { error }
      }

      return { data, error: null }
    } catch (err) {
      return { error: err as Error }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      return { error }
    } catch (err) {
      return { error: err as Error }
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      return { error }
    } catch (err) {
      return { error: err as Error }
    }
  }

  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      })
      return { error }
    } catch (err) {
      return { error: err as Error }
    }
  }

  const getSession = async () => {
    try {
      const { data, error } = await supabase.auth.getSession()
      return { data, error }
    } catch (err) {
      return { data: { session: null }, error: err as Error }
    }
  }

  const getUser = async () => {
    try {
      const { data, error } = await supabase.auth.getUser()
      return { data, error }
    } catch (err) {
      return { data: { user: null }, error: err as Error }
    }
  }

  return {
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    getSession,
    getUser,
  }
}

// Create the auth object safely
const auth = createSafeAuth()

// Export individual functions to avoid initialization issues
export const { signUp, signIn, signOut, resetPassword, updatePassword, getSession, getUser } = auth

// Hook for checking authentication status
export function useAuth() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Only run this effect on the client
    if (!isBrowser) return

    const checkUser = async () => {
      try {
        setLoading(true)
        const { data } = await getSession()

        if (data.session?.user) {
          setUser(data.session.user)
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error("Error checking user:", error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    // Check user on mount
    checkUser()

    // Set up auth state listener
    if (isBrowser) {
      const supabase = getSupabase()

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          setUser(session.user)
        } else {
          setUser(null)
        }
        setLoading(false)
      })

      // Clean up subscription
      return () => {
        subscription.unsubscribe()
      }
    }
  }, [router])

  return { user, loading }
}
