"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { supabase } from "@/lib/supabaseClient"
import type { User } from "@/lib/supabaseClient"
import { login as authLogin, logout as authLogout, signUp as authSignUp } from "@/lib/auth"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  error: Error | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  signUp: (userData: any) => Promise<{ success: boolean; error?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Fetch user data on initial load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Get current session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

        if (sessionError) {
          throw sessionError
        }

        if (!sessionData.session) {
          // No session, user is not logged in
          setUser(null)
          setIsLoading(false)
          return
        }

        // Get user data from database
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", sessionData.session.user.id)
          .single()

        if (userError) {
          throw userError
        }

        // Set user data
        setUser(userData as User)
      } catch (err) {
        console.error("Error fetching user:", err)
        setError(err as Error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        // Fetch user data when signed in or token refreshed
        fetchUser()
      } else if (event === "SIGNED_OUT") {
        setUser(null)
      }
    })

    // Clean up listener
    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      setError(null)

      const result = await authLogin({ email, password })
      setUser(result.user as User)

      return { success: true }
    } catch (err) {
      console.error("Login error:", err)
      setError(err as Error)
      return { success: false, error: (err as Error).message }
    } finally {
      setIsLoading(false)
    }
  }

  // Logout function
  const logout = async () => {
    try {
      setIsLoading(true)
      setError(null)

      await authLogout()
      setUser(null)
    } catch (err) {
      console.error("Logout error:", err)
      setError(err as Error)
    } finally {
      setIsLoading(false)
    }
  }

  // Sign up function
  const signUp = async (userData: any) => {
    try {
      setIsLoading(true)
      setError(null)

      const result = await authSignUp(userData)
      setUser(result.user as User)

      return { success: true }
    } catch (err) {
      console.error("Sign up error:", err)
      setError(err as Error)
      return { success: false, error: (err as Error).message }
    } finally {
      setIsLoading(false)
    }
  }

  const value = {
    user,
    isLoading,
    error,
    login,
    logout,
    signUp,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
