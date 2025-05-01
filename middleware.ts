import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { createClient } from '@supabase/supabase-js'

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If no session and trying to access protected routes, redirect to login
  if (!session) {
    const protectedRoutes = ["/tourist/", "/business/", "/admin/", "/topup", "/pay", "/settings"]
    const isProtectedRoute = protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))

    if (isProtectedRoute) {
      const redirectUrl = new URL("/login", request.url)
      redirectUrl.searchParams.set("redirect", request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    return res
  }

  // If session exists, check role-based access
  try {
    // Get user role from database
    const { data: userData, error } = await supabase.from("users").select("role").eq("id", session.user.id).single()

    if (error || !userData) {
      // If error fetching user data, clear session and redirect to login
      await supabase.auth.signOut()
      const redirectUrl = new URL("/login", request.url)
      return NextResponse.redirect(redirectUrl)
    }

    const { role } = userData

    // Check role-based access
    if (request.nextUrl.pathname.startsWith("/admin") && role !== "admin") {
      // Redirect non-admin users trying to access admin routes
      return NextResponse.redirect(new URL("/", request.url))
    }

    if (request.nextUrl.pathname.startsWith("/tourist") && role !== "tourist") {
      // Redirect non-tourists trying to access tourist routes
      return role === "business"
        ? NextResponse.redirect(new URL("/business/dashboard", request.url))
        : NextResponse.redirect(new URL("/admin", request.url))
    }

    if (request.nextUrl.pathname.startsWith("/business") && role !== "business") {
      // Redirect non-businesses trying to access business routes
      return role === "tourist"
        ? NextResponse.redirect(new URL("/tourist/dashboard", request.url))
        : NextResponse.redirect(new URL("/admin", request.url))
    }
  } catch (error) {
    console.error("Middleware error:", error)
  }

  return res
}

// Only run middleware on specific paths
export const config = {
  matcher: [
    "/tourist/:path*",
    "/business/:path*",
    "/admin/:path*",
    "/topup",
    "/pay/:path*",
    "/settings/:path*",
    "/api/admin/:path*",
  ],
}
