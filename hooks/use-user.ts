"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import type { User } from "@/lib/supabaseClient"

interface UseUserOptions {
  redirectTo?: string
  redirectIfFound?: boolean
}

export function useUser(options: UseUserOptions = {}) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const { redirectTo, redirectIfFound } = options

    // Function to fetch user data
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

          // Redirect if specified
          if (redirectTo && !redirectIfFound) {
            window.location.href = `${redirectTo}?redirect=${encodeURIComponent(window.location.pathname)}`
          }
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

        // Redirect if user is found and redirectIfFound is true
        if (redirectTo && redirectIfFound && userData) {
          window.location.href = redirectTo
        }
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
        // Redirect if specified
        if (redirectTo && !redirectIfFound) {
          window.location.href = redirectTo
        }
      }
    })

    // Clean up listener
    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [options])

  return { user, isLoading, error }
}
