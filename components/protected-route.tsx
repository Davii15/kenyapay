"use client"

import { type ReactNode, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Loader2 } from "lucide-react"

type User = {
  id: string
  name: string
  email: string
  role: "tourist" | "business" | "admin"
} | null

interface ProtectedRouteProps {
  children: ReactNode
  allowedRoles?: ("tourist" | "business" | "admin")[]
}

export function ProtectedRoute({ children, allowedRoles = ["tourist", "business", "admin"] }: ProtectedRouteProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<User>(null)

  useEffect(() => {
    // This would be replaced with your actual auth check
    const checkAuth = () => {
      const storedUser = localStorage.getItem("kenyapay_user")

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)

        // Check if user has the required role
        if (!allowedRoles.includes(parsedUser.role)) {
          // Redirect to appropriate dashboard based on role
          switch (parsedUser.role) {
            case "tourist":
              router.push("/tourist/dashboard")
              break
            case "business":
              router.push("/business/dashboard")
              break
            case "admin":
              router.push("/admin")
              break
            default:
              router.push("/login")
          }
        }
      } else {
        // Not logged in, redirect to login
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`)
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [router, pathname, allowedRoles])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="sr-only">Loading</span>
      </div>
    )
  }

  // If user is authenticated and has the required role, render children
  if (user && allowedRoles.includes(user.role)) {
    return <>{children}</>
  }

  // This should not be reached due to the redirect in useEffect
  return null
}
