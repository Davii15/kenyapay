"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Globe, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

type User = {
  id: string
  name: string
  email: string
  role: "tourist" | "business" | "admin"
} | null

export function Navbar() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<User>(null)

  // Check if user is logged in
  useEffect(() => {
    // This would be replaced with your actual auth check
    const checkAuth = () => {
      const storedUser = localStorage.getItem("kenyapay_user")
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    }

    checkAuth()
  }, [])

  // Handle scroll event to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = () => {
    // This would be replaced with your actual logout logic
    localStorage.removeItem("kenyapay_user")
    setUser(null)
    setIsMobileMenuOpen(false)
    // Redirect to home page
    window.location.href = "/"
  }

  const getDashboardLink = () => {
    if (!user) return "/"

    switch (user.role) {
      case "tourist":
        return "/tourist/dashboard"
      case "business":
        return "/business/dashboard"
      default:
        return "/"
    }
  }

  // Don't show navbar on login and signup pages
  if (pathname === "/login" || pathname === "/signup") {
    return null
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-all duration-200 ${
        isScrolled ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" : "bg-background"
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-xl">
          <Link href="/" className="flex items-center gap-2">
            <Globe className="h-6 w-6 text-primary" />
            <span>KenyaPay</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {!user ? (
            <>
              <Link href="/#features" className="text-sm font-medium hover:underline underline-offset-4">
                Features
              </Link>
              <Link href="/#how-it-works" className="text-sm font-medium hover:underline underline-offset-4">
                How It Works
              </Link>
              <Link href="/#testimonials" className="text-sm font-medium hover:underline underline-offset-4">
                Testimonials
              </Link>
            </>
          ) : (
            <>
              <Link href={getDashboardLink()} className="text-sm font-medium hover:underline underline-offset-4">
                Dashboard
              </Link>
              {user.role === "tourist" && (
                <>
                  <Link href="/topup" className="text-sm font-medium hover:underline underline-offset-4">
                    Top Up
                  </Link>
                  <Link href="/pay" className="text-sm font-medium hover:underline underline-offset-4">
                    Pay
                  </Link>
                </>
              )}
              {user.role === "business" && (
                <>
                  <Link href="/business/qrcode" className="text-sm font-medium hover:underline underline-offset-4">
                    My QR Code
                  </Link>
                  <Link href="/business/withdraw" className="text-sm font-medium hover:underline underline-offset-4">
                    Withdraw
                  </Link>
                </>
              )}
            </>
          )}
        </nav>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {!user ? (
            <>
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Sign Up</Button>
              </Link>
            </>
          ) : (
            <>
              <span className="text-sm font-medium">{user.name}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[240px] sm:w-[300px]">
            <div className="flex flex-col gap-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold">
                  <Globe className="h-5 w-5 text-primary" />
                  <span>KenyaPay</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <nav className="flex flex-col gap-4">
                {!user ? (
                  <>
                    <Link
                      href="/#features"
                      className="flex items-center gap-2 text-sm font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Features
                    </Link>
                    <Link
                      href="/#how-it-works"
                      className="flex items-center gap-2 text-sm font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      How It Works
                    </Link>
                    <Link
                      href="/#testimonials"
                      className="flex items-center gap-2 text-sm font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Testimonials
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href={getDashboardLink()}
                      className="flex items-center gap-2 text-sm font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    {user.role === "tourist" && (
                      <>
                        <Link
                          href="/topup"
                          className="flex items-center gap-2 text-sm font-medium"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Top Up
                        </Link>
                        <Link
                          href="/pay"
                          className="flex items-center gap-2 text-sm font-medium"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Pay
                        </Link>
                      </>
                    )}
                    {user.role === "business" && (
                      <>
                        <Link
                          href="/business/qrcode"
                          className="flex items-center gap-2 text-sm font-medium"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          My QR Code
                        </Link>
                        <Link
                          href="/business/withdraw"
                          className="flex items-center gap-2 text-sm font-medium"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Withdraw
                        </Link>
                      </>
                    )}
                  </>
                )}
              </nav>
              <div className="mt-auto flex flex-col gap-2">
                {!user ? (
                  <>
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full">
                        Login
                      </Button>
                    </Link>
                    <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full">Sign Up</Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <div className="mb-2 text-sm font-medium">Signed in as {user.name}</div>
                    <Button variant="outline" className="w-full" onClick={handleLogout}>
                      Logout
                    </Button>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
