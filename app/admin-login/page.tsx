"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ShieldAlert, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { supabase } from "@/lib/supabaseClient"

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Authenticate with Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) throw authError

      if (!authData.user) {
        throw new Error("Authentication failed")
      }

      // Check if user is an admin
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("role")
        .eq("id", authData.user.id)
        .single()

      if (userError) throw userError

      if (userData.role !== "admin") {
        // Log unauthorized access attempt
        await supabase.from("admin_logs").insert({
          admin_id: authData.user.id,
          action: "login_attempt",
          entity_type: "admin_panel",
          details: { status: "unauthorized", email },
          ip_address: "client-side", // In production, you'd get this from the server
        })

        throw new Error("Unauthorized access. Only admins can access this area.")
      }

      // Log successful login
      await supabase.from("admin_logs").insert({
        admin_id: authData.user.id,
        action: "login",
        entity_type: "admin_panel",
        details: { status: "success" },
        ip_address: "client-side", // In production, you'd get this from the server
      })

      // Redirect to admin dashboard
      router.push("/admin")
    } catch (err: any) {
      console.error("Admin login error:", err)
      setError(err.message || "Login failed. Please check your credentials.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8">
        <Button variant="ghost" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </Link>

      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <div className="flex justify-center">
            <ShieldAlert className="h-8 w-8 text-amber-600" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Admin Access</h1>
          <p className="text-sm text-muted-foreground">Enter your credentials to access the admin panel</p>
        </div>

        <Card>
          <CardHeader>
            <div className="bg-amber-50 text-amber-800 p-3 rounded-md text-sm">
              This is a secure area. Unauthorized access attempts will be logged and reported.
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Admin Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Verifying..." : "Access Admin Panel"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-xs text-muted-foreground">Need help? Contact the system administrator.</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
