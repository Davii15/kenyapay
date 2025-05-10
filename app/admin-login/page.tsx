"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, ShieldAlert } from "lucide-react"
import { getSupabase } from "@/lib/supabaseClient"

// Check if we're running on the client side
const isBrowser = typeof window !== "undefined"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)

  const router = useRouter()

  // Set isClient to true once the component mounts
  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    // Clear previous errors
    setError(null)

    // Validate form
    if (!email || !password) {
      setError("Email and password are required")
      return
    }

    try {
      setLoading(true)

      // Call the signIn function from auth.ts
      const { error: signInError } = await signIn(email, password)

      if (signInError) {
        console.error("Login error:", signInError)
        setError(signInError.message)
        return
      }

      // Check if the user has admin role
      const supabase = getSupabase()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setError("Authentication failed")
        return
      }

      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single()

      if (userError || !userData) {
        console.error("Error fetching user role:", userError)
        setError("Failed to verify admin privileges")
        return
      }

      if (userData.role !== "admin") {
        setError("You do not have admin privileges")

        // Log unauthorized access attempt
        await supabase.from("admin_logs").insert({
          admin_id: user.id,
          action: "UNAUTHORIZED_ACCESS_ATTEMPT",
          details: { email: user.email },
          created_at: new Date().toISOString(),
        })

        return
      }

      // Log successful login
      await supabase.from("admin_logs").insert({
        admin_id: user.id,
        action: "LOGIN",
        details: { timestamp: new Date().toISOString() },
        created_at: new Date().toISOString(),
      })

      // Redirect to admin dashboard
      router.push("/admin")
    } catch (err: any) {
      console.error("Unexpected error during login:", err)
      setError(err.message || "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  // If we're not on the client yet, show a loading state
  if (!isClient) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading...</span>
      </div>
    )
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <ShieldAlert className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Admin Access</CardTitle>
          <CardDescription className="text-center">Sign in to access the admin dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Access Admin Panel"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">This area is restricted to authorized personnel only</p>
        </CardFooter>
      </Card>
    </div>
  )
}
