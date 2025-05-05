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
import { supabase } from "@/lib/supabaseClient"
import { format } from "date-fns"
import { Skeleton } from "@/components/ui/skeleton"
import { DatePickerWithRange as DateRangePicker } from "@/components/ui/date-range-picker"
import { addDays } from "date-fns"

export default function AdminDashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [user, setUser] = useState<{ name: string; id: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Stats state
  const [stats, setStats] = useState({
    users: {
      total: 0,
      tourists: 0,
      businesses: 0,
      new: 0,
    },
    transactions: {
      total: 0,
      recent: 0,
    },
    volume: {
      total: 0,
      topup: 0,
      payment: 0,
      withdrawal: 0,
    },
    revenue: 0,
  })

  // Data state
  const [recentTransactions, setRecentTransactions] = useState<any[]>([])
  const [recentUsers, setRecentUsers] = useState<any[]>([])

  // Date range for filtering
  const [date, setDate] = useState({
    from: addDays(new Date(), -30),
    to: new Date(),
  })

  useEffect(() => {
    // Get user from local storage or session
    const fetchUserSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        const { data: userData, error } = await supabase.from("users").select("*").eq("id", session.user.id).single()

        if (userData && userData.role === "admin") {
          setUser({
            id: userData.id,
            name: userData.name,
          })
        } else {
          // Redirect non-admin users
          window.location.href = "/login"
        }
      } else {
        // Redirect if no session
        window.location.href = "/login"
      }
    }

    fetchUserSession()
  }, [])

  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      setLoading(true)
      setError(null)

      try {
        // Format dates for API
        const startDate = format(date.from, "yyyy-MM-dd")
        const endDate = format(date.to, "yyyy-MM-dd")

        // Log admin action
        await supabase.from("admin_logs").insert({
          admin_id: user.id,
          action: "view",
          entity_type: "dashboard",
          details: { date_range: { start: startDate, end: endDate } },
        })

        // Fetch stats
        const statsResponse = await fetch(`/api/admin/stats?startDate=${startDate}&endDate=${endDate}`, {
          headers: {
            "x-user-id": user.id,
          },
        })

        if (!statsResponse.ok) {
          throw new Error("Failed to fetch statistics")
        }

        const statsData = await statsResponse.json()
        setStats(statsData.stats)

        // Fetch recent transactions
        const { data: transactions, error: transactionsError } = await supabase
          .from("transactions")
          .select(`
            id,
            amount,
            type,
            status,
            created_at,
            from_user_id,
            to_user_id,
            from_users:from_user_id(name),
            to_users:to_user_id(name)
          `)
          .order("created_at", { ascending: false })
          .limit(8)

        if (transactionsError) throw transactionsError

        setRecentTransactions(transactions)

        // Fetch recent users
        const { data: users, error: usersError } = await supabase
          .from("users")
          .select("id, name, email, role, country, business_name, created_at")
          .order("created_at", { ascending: false })
          .limit(5)

        if (usersError) throw usersError

        setRecentUsers(users)
      } catch (err: any) {
        console.error("Error fetching admin data:", err)
        setError(err.message || "Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user, date])

  const formatCurrency = (amount: number, currency = "KSH") => {
    return `${currency} ${amount.toLocaleString()}`
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = "/login"
  }

  useEffect(() => {
    if (date?.from && date?.to) {
      // Your existing date range change logic here
      // This will run whenever the date state changes
    }
  }, [date, user])

  const handleExportTransactions = async () => {
    try {
      // Format dates for API
      const startDate = format(date.from, "yyyy-MM-dd")
      const endDate = format(date.to, "yyyy-MM-dd")

      const response = await fetch(`/api/admin/export/transactions?startDate=${startDate}&endDate=${endDate}`, {
        headers: {
          "x-user-id": user?.id || "",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to export transactions")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `transactions-${startDate}-to-${endDate}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error("Error exporting transactions:", err)
      alert("Failed to export transactions")
    }
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
                  <button
                    className="flex items-center gap-2 text-sm font-medium text-destructive"
                    onClick={() => {
                      handleLogout()
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
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
            <Button variant="outline" size="sm" className="w-full gap-2" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="container py-6">
            <UserGreeting userName={user?.name} className="mb-6" />

            {error && (
              <div className="mb-6 rounded-md bg-destructive/10 p-4 text-destructive">
                <p>{error}</p>
              </div>
            )}

            {/* Date Range Picker */}
            <div className="mb-6">
              <DateRangePicker date={date} setDate={setDate} className="w-auto" />
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Total Users</CardTitle>
                  <CardDescription>Tourists registered</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-8 w-20" />
                  ) : (
                    <div className="text-3xl font-bold">{stats.users.total}</div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Total Businesses</CardTitle>
                  <CardDescription>Registered businesses</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-8 w-20" />
                  ) : (
                    <div className="text-3xl font-bold">{stats.users.businesses}</div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Transactions</CardTitle>
                  <CardDescription>Total transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-8 w-20" />
                  ) : (
                    <div className="text-3xl font-bold">{stats.transactions.total}</div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Transaction Volume</CardTitle>
                  <CardDescription>Total KSH processed</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-8 w-32" />
                  ) : (
                    <div className="text-3xl font-bold">{formatCurrency(stats.volume.total)}</div>
                  )}
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
                      <Button variant="outline" size="sm" onClick={handleExportTransactions}>
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-2">
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <Skeleton key={i} className="h-12 w-full" />
                        ))}
                    </div>
                  ) : (
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
                        {recentTransactions.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                              No transactions found
                            </TableCell>
                          </TableRow>
                        ) : (
                          recentTransactions
                            .filter(
                              (transaction) =>
                                searchQuery === "" ||
                                transaction.id.toString().includes(searchQuery) ||
                                transaction.type.includes(searchQuery) ||
                                (transaction.from_users?.name &&
                                  transaction.from_users.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                                (transaction.to_users?.name &&
                                  transaction.to_users.name.toLowerCase().includes(searchQuery.toLowerCase())),
                            )
                            .map((transaction) => (
                              <TableRow key={transaction.id}>
                                <TableCell className="font-medium">{transaction.id}</TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    {transaction.type === "topup" && <ArrowDown className="h-4 w-4 text-green-600" />}
                                    {transaction.type === "payment" && <ArrowUp className="h-4 w-4 text-blue-600" />}
                                    {transaction.type === "withdrawal" && (
                                      <ArrowUp className="h-4 w-4 text-amber-600" />
                                    )}
                                    <span className="capitalize">{transaction.type}</span>
                                  </div>
                                </TableCell>
                                <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                                <TableCell>
                                  {transaction.from_users && <span>{transaction.from_users.name}</span>}
                                  {transaction.to_users && <span>{transaction.to_users.name}</span>}
                                </TableCell>
                                <TableCell>{new Date(transaction.created_at).toLocaleDateString()}</TableCell>
                                <TableCell>
                                  <span
                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                      transaction.status === "completed"
                                        ? "bg-green-100 text-green-800"
                                        : transaction.status === "failed"
                                          ? "bg-red-100 text-red-800"
                                          : "bg-amber-100 text-amber-800"
                                    }`}
                                  >
                                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                                  </span>
                                </TableCell>
                              </TableRow>
                            ))
                        )}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
                <CardFooter>
                  <Link href="/admin/transactions" className="w-full">
                    <Button variant="outline" className="w-full">
                      View All Transactions
                    </Button>
                  </Link>
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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Export users logic would go here
                        }}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-2">
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <Skeleton key={i} className="h-12 w-full" />
                        ))}
                    </div>
                  ) : (
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
                        {recentUsers.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                              No users found
                            </TableCell>
                          </TableRow>
                        ) : (
                          recentUsers.map((user) => (
                            <TableRow key={user.id}>
                              <TableCell className="font-medium">{user.id.substring(0, 8)}...</TableCell>
                              <TableCell>{user.name}</TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>
                                <span
                                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                    user.role === "tourist"
                                      ? "bg-blue-100 text-blue-800"
                                      : user.role === "admin"
                                        ? "bg-purple-100 text-purple-800"
                                        : "bg-green-100 text-green-800"
                                  }`}
                                >
                                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                </span>
                              </TableCell>
                              <TableCell>
                                {user.country && <span>{user.country}</span>}
                                {user.business_name && <span>{user.business_name}</span>}
                              </TableCell>
                              <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
                <CardFooter>
                  <Link href="/admin/users" className="w-full">
                    <Button variant="outline" className="w-full">
                      View All Users
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
