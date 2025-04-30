"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ArrowDown,
  ArrowUp,
  BanknoteIcon,
  BarChart3,
  Download,
  Globe,
  History,
  LogOut,
  Menu,
  QrCode,
  Settings,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { UserGreeting } from "@/components/user-greeting"

export default function BusinessDashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<{ name: string } | null>(null)

  // Mock data
  const walletBalance = 85000
  const totalTransactions = 42
  const totalCustomers = 28

  const transactions = [
    { id: 1, type: "payment", amount: 2500, date: "2023-04-26", customerName: "John Doe", status: "completed" },
    { id: 2, type: "payment", amount: 1200, date: "2023-04-26", customerName: "Sarah Smith", status: "completed" },
    { id: 3, type: "payment", amount: 800, date: "2023-04-27", customerName: "Michael Johnson", status: "completed" },
    { id: 4, type: "payment", amount: 3500, date: "2023-04-27", customerName: "Emma Wilson", status: "completed" },
    { id: 5, type: "withdrawal", amount: 5000, date: "2023-04-28", customerName: "N/A", status: "pending" },
  ]

  useEffect(() => {
    // Get user from local storage
    const storedUser = localStorage.getItem("kenyapay_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const formatCurrency = (amount: number, currency = "KSH") => {
    return `${currency} ${amount.toLocaleString()}`
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:hidden">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2 font-bold">
            <Globe className="h-5 w-5 text-primary" />
            <span>KenyaPay</span>
          </div>
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <div className="flex flex-col gap-6 py-4">
                <div className="flex items-center gap-2 font-bold">
                  <Globe className="h-5 w-5 text-primary" />
                  <span>KenyaPay</span>
                </div>
                <nav className="flex flex-col gap-4">
                  <Link
                    href="/business/dashboard"
                    className="flex items-center gap-2 text-sm font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <BarChart3 className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <Link
                    href="/business/qrcode"
                    className="flex items-center gap-2 text-sm font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <QrCode className="h-4 w-4" />
                    My QR Code
                  </Link>
                  <Link
                    href="/business/withdraw"
                    className="flex items-center gap-2 text-sm font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <BanknoteIcon className="h-4 w-4" />
                    Withdraw Funds
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center gap-2 text-sm font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                  <Link
                    href="/login"
                    className="flex items-center gap-2 text-sm font-medium text-destructive"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Link>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <aside className="hidden w-64 flex-col border-r bg-muted/40 lg:flex">
          <div className="flex h-14 items-center border-b px-4">
            <Link href="/" className="flex items-center gap-2 font-bold">
              <Globe className="h-5 w-5 text-primary" />
              <span>KenyaPay</span>
            </Link>
          </div>
          <nav className="flex flex-col gap-2 p-4">
            <Link
              href="/business/dashboard"
              className="flex items-center gap-2 rounded-md bg-primary/10 px-3 py-2 text-sm font-medium text-primary"
            >
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/business/qrcode"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
            >
              <QrCode className="h-4 w-4" />
              My QR Code
            </Link>
            <Link
              href="/business/withdraw"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
            >
              <BanknoteIcon className="h-4 w-4" />
              Withdraw Funds
            </Link>
            <Link
              href="/settings"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </nav>
          <div className="mt-auto border-t p-4">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">{user?.name || "Savanna Restaurant"}</p>
                <p className="text-xs text-muted-foreground">Business</p>
              </div>
            </div>
            <Link href="/login">
              <Button variant="outline" size="sm" className="w-full gap-2">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="container py-6">
            <UserGreeting userName={user?.name} className="mb-6" />

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Available Balance</CardTitle>
                  <CardDescription>Your current balance in KSH</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{formatCurrency(walletBalance)}</div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full gap-2" asChild>
                    <Link href="/business/withdraw">
                      <ArrowDown className="h-4 w-4" />
                      Withdraw Funds
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Total Transactions</CardTitle>
                  <CardDescription>Number of payments received</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{totalTransactions}</div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full gap-2">
                    <History className="h-4 w-4" />
                    View History
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Total Customers</CardTitle>
                  <CardDescription>Unique tourists served</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{totalCustomers}</div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full gap-2">
                    <Download className="h-4 w-4" />
                    Export Data
                  </Button>
                </CardFooter>
              </Card>
            </div>

            {/* QR Code Card */}
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Your Payment QR Code</CardTitle>
                  <CardDescription>Display this to receive payments</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center">
                  <div className="flex h-48 w-48 items-center justify-center rounded-lg border-2 border-dashed p-4">
                    <QrCode className="h-32 w-32 text-muted-foreground" />
                  </div>
                  <p className="mt-4 text-center text-sm text-muted-foreground">
                    Tourists can scan this QR code to pay directly to your business account
                  </p>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button className="flex-1 gap-2" asChild>
                    <Link href="/business/qrcode">
                      <QrCode className="h-4 w-4" />
                      View Full QR
                    </Link>
                  </Button>
                  <Button variant="outline" className="flex-1 gap-2">
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </CardFooter>
              </Card>

              {/* Transactions */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>Your latest payments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {transactions.slice(0, 3).map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex items-center gap-4">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full ${
                              transaction.type === "payment"
                                ? "bg-green-100 text-green-600"
                                : "bg-blue-100 text-blue-600"
                            }`}
                          >
                            {transaction.type === "payment" ? (
                              <ArrowDown className="h-5 w-5" />
                            ) : (
                              <ArrowUp className="h-5 w-5" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">
                              {transaction.type === "payment" ? "Payment from" : "Withdrawal"}
                              {transaction.type === "payment" ? ` ${transaction.customerName}` : ""}
                            </p>
                            <p className="text-sm text-muted-foreground">{transaction.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={`font-medium ${
                              transaction.type === "payment" ? "text-green-600" : "text-blue-600"
                            }`}
                          >
                            {transaction.type === "payment" ? "+" : "-"} {formatCurrency(transaction.amount)}
                          </p>
                          <p
                            className={`text-xs ${
                              transaction.status === "completed" ? "text-green-600" : "text-amber-600"
                            }`}
                          >
                            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View All Transactions
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
