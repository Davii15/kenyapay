"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  Download,
  Globe,
  History,
  LogOut,
  Menu,
  Settings,
  User,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { UserGreeting } from "@/components/user-greeting"

export default function AdminDashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [user, setUser] = useState<{ name: string } | null>(null)

  // Mock data
  const totalUsers = 156
  const totalBusinesses = 42
  const totalTransactions = 384
  const totalVolume = 1250000

  useEffect(() => {
    // Get user from local storage
    const storedUser = localStorage.getItem("kenyapay_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const recentTransactions = [
    { id: 1, type: "topup", amount: 10000, date: "2023-04-25", user: "John Doe", status: "completed" },
    {
      id: 2,
      type: "payment",
      amount: 2500,
      date: "2023-04-26",
      user: "John Doe",
      business: "Safari Adventure Tours",
      status: "completed",
    },
    {
      id: 3,
      type: "payment",
      amount: 1200,
      date: "2023-04-26",
      user: "Sarah Smith",
      business: "Savanna Restaurant",
      status: "completed",
    },
    {
      id: 4,
      type: "payment",
      amount: 800,
      date: "2023-04-27",
      user: "Michael Johnson",
      business: "Curio Shop",
      status: "completed",
    },
    {
      id: 5,
      type: "withdrawal",
      amount: 5000,
      date: "2023-04-28",
      business: "Safari Adventure Tours",
      status: "pending",
    },
    { id: 6, type: "topup", amount: 5000, date: "2023-04-28", user: "Emma Wilson", status: "pending" },
    {
      id: 7,
      type: "payment",
      amount: 3500,
      date: "2023-04-28",
      user: "Emma Wilson",
      business: "Savanna Restaurant",
      status: "completed",
    },
    {
      id: 8,
      type: "withdrawal",
      amount: 8000,
      date: "2023-04-29",
      business: "Savanna Restaurant",
      status: "completed",
    },
  ]

  const recentUsers = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      country: "United States",
      joined: "2023-04-20",
      type: "tourist",
    },
    {
      id: 2,
      name: "Sarah Smith",
      email: "sarah@example.com",
      country: "United Kingdom",
      joined: "2023-04-21",
      type: "tourist",
    },
    {
      id: 3,
      name: "Safari Adventure Tours",
      email: "safari@example.com",
      location: "Nairobi, Kenya",
      joined: "2023-04-15",
      type: "business",
    },
    {
      id: 4,
      name: "Michael Johnson",
      email: "michael@example.com",
      country: "Canada",
      joined: "2023-04-22",
      type: "tourist",
    },
    {
      id: 5,
      name: "Savanna Restaurant",
      email: "savanna@example.com",
      location: "Mombasa, Kenya",
      joined: "2023-04-18",
      type: "business",
    },
  ]

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
                    href="/admin"
                    className="flex items-center gap-2 text-sm font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <BarChart3 className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <Link
                    href="/admin/users"
                    className="flex items-center gap-2 text-sm font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Users className="h-4 w-4" />
                    Users
                  </Link>
                  <Link
                    href="/admin/transactions"
                    className="flex items-center gap-2 text-sm font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <History className="h-4 w-4" />
                    Transactions
                  </Link>
                  <Link
                    href="/admin/settings"
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
              href="/admin"
              className="flex items-center gap-2 rounded-md bg-primary/10 px-3 py-2 text-sm font-medium text-primary"
            >
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/admin/users"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
            >
              <Users className="h-4 w-4" />
              Users
            </Link>
            <Link
              href="/admin/transactions"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
            >
              <History className="h-4 w-4" />
              Transactions
            </Link>
            <Link
              href="/admin/settings"
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
                <p className="text-sm font-medium">{user?.name || "Admin User"}</p>
                <p className="text-xs text-muted-foreground">Administrator</p>
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
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Total Users</CardTitle>
                  <CardDescription>Tourists registered</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{totalUsers}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Total Businesses</CardTitle>
                  <CardDescription>Registered businesses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{totalBusinesses}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Transactions</CardTitle>
                  <CardDescription>Total transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{totalTransactions}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Transaction Volume</CardTitle>
                  <CardDescription>Total KSH processed</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{formatCurrency(totalVolume)}</div>
                </CardContent>
              </Card>
            </div>

            {/* Transactions Table */}
            <div className="mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Recent Transactions</CardTitle>
                      <CardDescription>Latest activity on the platform</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Search transactions"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-[200px]"
                      />
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                        Export
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>User/Business</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell className="font-medium">{transaction.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {transaction.type === "topup" && <ArrowDown className="h-4 w-4 text-green-600" />}
                              {transaction.type === "payment" && <ArrowUp className="h-4 w-4 text-blue-600" />}
                              {transaction.type === "withdrawal" && <ArrowUp className="h-4 w-4 text-amber-600" />}
                              <span className="capitalize">{transaction.type}</span>
                            </div>
                          </TableCell>
                          <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                          <TableCell>
                            {transaction.user && <span>{transaction.user}</span>}
                            {transaction.business && <span>{transaction.business}</span>}
                          </TableCell>
                          <TableCell>{transaction.date}</TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                transaction.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View All Transactions
                  </Button>
                </CardFooter>
              </Card>
            </div>

            {/* Users Table */}
            <div className="mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Recent Users</CardTitle>
                      <CardDescription>Latest registrations on the platform</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                        Export
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Joined</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.id}</TableCell>
                          <TableCell>{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                user.type === "tourist" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
                              }`}
                            >
                              {user.type.charAt(0).toUpperCase() + user.type.slice(1)}
                            </span>
                          </TableCell>
                          <TableCell>
                            {user.country && <span>{user.country}</span>}
                            {user.location && <span>{user.location}</span>}
                          </TableCell>
                          <TableCell>{user.joined}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View All Users
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
