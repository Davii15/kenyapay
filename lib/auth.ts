"use client"

import { getSupabase } from "./supabaseClient"

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
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (signUpError || !signUpData.user) {
        return { error: signUpError || new Error("No user returned from signUp") }
      }

      const user = signUpData.user

      // Insert into users table
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
        return { error: profileError }
      }

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
        return { error: walletError }
      }

      return { data: signUpData, error: null }
    } catch (err) {
      return { error: err as Error }
    }
  }

  const login = async ({ email, password }: { email: string; password: string }) => {
    try {
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError || !signInData.session) {
        return { user: null, error: signInError || new Error("Login failed") }
      }

      const userId = signInData.session.user.id

      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single()

      if (profileError || !profile) {
        return { user: null, error: profileError || new Error("User profile not found") }
      }

      return {
        user: profile,
        error: null,
      }
    } catch (err) {
      return { user: null, error: err as Error }
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
    signIn: login,
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
