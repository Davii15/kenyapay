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

  // Define auth functions
  const signUp = async (email: string, password: string, userData: any) => {
    try {
      console.log("Starting signup process...")

      // First, create the auth user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        console.error("Signup error:", error)
        return { error }
      }

      if (!data.user) {
        console.error("No user returned from signUp")
        return { error: new Error("No user returned from signUp") }
      }

      console.log("Auth user created successfully:", data.user.id)

      // Then, insert the user data into the users table
      const { error: profileError } = await supabase.from("users").insert([
        {
          id: data.user.id,
          email: email,
          name: userData.name,
          role: userData.role,
         // verification_status: "pending",
          created_at: new Date().toISOString(),
        },
      ])

      if (profileError) {
        console.error("Profile creation error:", profileError)
        return { error: profileError }
      }

      console.log("User profile created successfully")

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
