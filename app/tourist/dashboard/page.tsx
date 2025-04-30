"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ArrowDown,
  ArrowUp,
  CreditCard,
  Globe,
  History,
  LogOut,
  Menu,
  QrCode,
  Settings,
  User,
  Wallet,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserGreeting } from "@/components/user-greeting"

export default function TouristDashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [selectedCurrency, setSelectedCurrency] = useState("USD")
  const [user, setUser] = useState<{ name: string } | null>(null)

  // Mock data
  const walletBalance = 15000
  const exchangeRates = {
    USD: 130.25,
    EUR: 142.5,
    GBP: 167.8,
    JPY: 0.88,
    AUD: 86.45,
  }

  const transactions = [
    { id: 1, type: "topup", amount: 10000, date: "2023-04-25", description: "Wallet Top-up", status: "completed" },
    {
      id: 2,
      type: "payment",
      amount: 2500,
      date: "2023-04-26",
      description: "Safari Adventure Tours",
      status: "completed",
    },
    {
      id: 3,
      type: "payment",
      amount: 1200,
      date: "2023-04-26",
      description: "Savanna Restaurant",
      status: "completed",
    },
    { id: 4, type: "payment", amount: 800, date: "2023-04-27", description: "Curio Shop", status: "completed" },
    { id: 5, type: "topup", amount: 5000, date: "2023-04-28", description: "Wallet Top-up", status: "pending" },
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

  const convertCurrency = (amount: number, from: string) => {
    return (amount / exchangeRates[from as keyof typeof exchangeRates]).toFixed(2)
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
                    href="/tourist/dashboard"
                    className="flex items-center gap-2 text-sm font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Wallet className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <Link
                    href="/topup"
                    className="flex items-center gap-2 text-sm font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <CreditCard className="h-4 w-4" />
                    Top Up Wallet
                  </Link>
                  <Link
                    href="/pay"
                    className="flex items-center gap-2 text-sm font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <QrCode className="h-4 w-4" />
                    Pay Business
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
              href="/tourist/dashboard"
              className="flex items-center gap-2 rounded-md bg-primary/10 px-3 py-2 text-sm font-medium text-primary"
            >
              <Wallet className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/topup"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
            >
              <CreditCard className="h-4 w-4" />
              Top Up Wallet
            </Link>
            <Link
              href="/pay"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
            >
              <QrCode className="h-4 w-4" />
              Pay Business
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
                <p className="text-sm font-medium">{user?.name || "John Doe"}</p>
                <p className="text-xs text-muted-foreground">Tourist</p>
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

            {/* Wallet Card */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="col-span-full md:col-span-1">
                <CardHeader className="pb-2">
                  <CardTitle>Wallet Balance</CardTitle>
                  <CardDescription>Your current balance in KSH</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{formatCurrency(walletBalance)}</div>
                  <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <Select defaultValue={selectedCurrency} onValueChange={setSelectedCurrency}>
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                        <SelectItem value="JPY">JPY</SelectItem>
                        <SelectItem value="AUD">AUD</SelectItem>
                      </SelectContent>
                    </Select>
                    <span>
                      ≈ {selectedCurrency} {convertCurrency(walletBalance, selectedCurrency)}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button className="flex-1 gap-2" asChild>
                    <Link href="/topup">
                      <ArrowDown className="h-4 w-4" />
                      Top Up
                    </Link>
                  </Button>
                  <Button variant="outline" className="flex-1 gap-2" asChild>
                    <Link href="/pay">
                      <ArrowUp className="h-4 w-4" />
                      Pay
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              {/* Exchange Rates Card */}
              <Card className="col-span-full md:col-span-1">
                <CardHeader>
                  <CardTitle>Exchange Rates</CardTitle>
                  <CardDescription>Current rates to KSH</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(exchangeRates).map(([currency, rate]) => (
                      <div key={currency} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                            <span className="text-xs font-medium">{currency}</span>
                          </div>
                          <span>{currency}</span>
                        </div>
                        <div className="font-medium">
                          1 {currency} = {rate.toFixed(2)} KSH
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions Card */}
              <Card className="col-span-full md:col-span-1">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common operations</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="flex h-24 flex-col items-center justify-center gap-2" asChild>
                    <Link href="/topup">
                      <CreditCard className="h-6 w-6" />
                      <span>Top Up</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="flex h-24 flex-col items-center justify-center gap-2" asChild>
                    <Link href="/pay">
                      <QrCode className="h-6 w-6" />
                      <span>Pay</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="flex h-24 flex-col items-center justify-center gap-2" asChild>
                    <Link href="/settings">
                      <Settings className="h-6 w-6" />
                      <span>Settings</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="flex h-24 flex-col items-center justify-center gap-2">
                    <History className="h-6 w-6" />
                    <span>History</span>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Transactions */}
            <div className="mt-6">
              <h2 className="mb-4 text-xl font-bold">Recent Transactions</h2>
              <Card>
                <CardHeader className="pb-2">
                  <Tabs defaultValue="all">
                    <TabsList>
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="topup">Top-ups</TabsTrigger>
                      <TabsTrigger value="payment">Payments</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {transactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex items-center gap-4">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full ${
                              transaction.type === "topup" ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"
                            }`}
                          >
                            {transaction.type === "topup" ? (
                              <ArrowDown className="h-5 w-5" />
                            ) : (
                              <ArrowUp className="h-5 w-5" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{transaction.description}</p>
                            <p className="text-sm text-muted-foreground">{transaction.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={`font-medium ${
                              transaction.type === "topup" ? "text-green-600" : "text-blue-600"
                            }`}
                          >
                            {transaction.type === "topup" ? "+" : "-"} {formatCurrency(transaction.amount)}
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
