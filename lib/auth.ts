"use client"

import { useState, useEffect } from "react"
import { getSupabase } from "./supabaseClient"
import { useRouter } from "next/navigation"

const isBrowser = typeof window !== "undefined"

const createSafeAuth = () => {
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

  const supabase = getSupabase()

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      console.log("Starting signup process...")

      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (signUpError) {
        console.error("Signup error:", signUpError)
        return { error: signUpError }
      }

      const user = signUpData.user
      if (!user) {
        console.error("No user returned from signUp")
        return { error: new Error("No user returned from signUp") }
      }

      console.log("Auth user created successfully:", user.id)

      // Wait briefly to allow session hydration (optional but helpful)
      await new Promise((res) => setTimeout(res, 500))

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (!session || sessionError) {
        console.error("Session not available after signUp:", sessionError)
        return { error: new Error("User session is not established yet.") }
      }

      // Insert into the users table with proper RLS match
      const { error: profileError } = await supabase.from("users").insert([
        {
          id: user.id,
          email,
          name: userData.name,
          role: userData.role,
          created_at: new Date().toISOString(),
        },
      ])

      if (profileError) {
        console.error("Profile creation error:", profileError)
        return { error: profileError }
      }

      console.log("User profile created successfully")

      // Create wallet
      const { error: walletError } = await supabase.from("wallets").insert([
        {
          user_id: user.id,
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
      return { data: signUpData, error: null }

    } catch (err) {
      console.error("Unexpected error during signup:", err)
      return { error: err as Error }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      return { data, error }
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
      const { error } = await supabase.auth.updateUser({ password })
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

const auth = createSafeAuth()

export const {
  signUp,
  signIn,
  signOut,
  resetPassword,
  updatePassword,
  getSession,
  getUser,
} = auth

export function useAuth() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!isBrowser) return

    const checkUser = async () => {
      setLoading(true)
      const { data } = await getSession()
      setUser(data.session?.user || null)
      setLoading(false)
    }

    checkUser()

    const supabase = getSupabase()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [router])

  return { user, loading }
}
