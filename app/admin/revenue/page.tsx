"use client"

import { useState, useEffect } from "react"
import { BarChart3, Download, Globe, LogOut, Menu, Settings, User, Users, History } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { UserGreeting } from "@/components/user-greeting"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { addDays } from "date-fns"

export default function AdminRevenuePage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<{ name: string } | null>(null)
  const [date, setDate] = useState({
    from: addDays(new Date(), -30),
    to: new Date(),
  })

  // Mock data for platform revenue
  const totalRevenue = 25000
  const withdrawalFeeRevenue = 15000
  const topupMarginRevenue = 10000

  const recentRevenue = [
    {
      id: 1,
      source: "withdrawal_fee",
      amount: 500,
      transaction_id: "tx_123456",
      description: "1% fee from Safari Adventure Tours's withdrawal of KSH 50000",
      created_at: "2023-04-28",
    },
    {
      id: 2,
      source: "withdrawal_fee",
      amount: 300,
      transaction_id: "tx_123457",
      description: "1% fee from Savanna Restaurant's withdrawal of KSH 30000",
      created_at: "2023-04-27",
    },
    {
      id: 3,
      source: "topup_margin",
      amount: 200,
      transaction_id: "tx_123458",
      description: "2% margin from John Doe's topup of KSH 10000",
      created_at: "2023-04-26",
    },
    {
      id: 4,
      source: "withdrawal_fee",
      amount: 150,
      transaction_id: "tx_123459",
      description: "1% fee from Curio Shop's withdrawal of KSH 15000",
      created_at: "2023-04-25",
    },
    {
      id: 5,
      source: "topup_margin",
      amount: 100,
      transaction_id: "tx_123460",
      description: "2% margin from Sarah Smith's topup of KSH 5000",
      created_at: "2023-04-24",
    },
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
                    href="/admin/revenue"
                    className="flex items-center gap-2 text-sm font-medium bg-primary/10 rounded-md px-2 py-1 text-primary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <BarChart3 className="h-4 w-4" />
                    Revenue
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
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
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
              href="/admin/revenue"
              className="flex items-center gap-2 rounded-md bg-primary/10 px-3 py-2 text-sm font-medium text-primary"
            >
              <BarChart3 className="h-4 w-4" />
              Revenue
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

            <div className="mb-6">
              <h1 className="text-2xl font-bold tracking-tight">Platform Revenue</h1>
              <p className="text-muted-foreground">Monitor and analyze platform revenue streams</p>
            </div>

            <div className="mb-6">
              <DatePickerWithRange date={date} setDate={setDate} />
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Total Revenue</CardTitle>
                  <CardDescription>All revenue sources</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{formatCurrency(totalRevenue)}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Withdrawal Fees</CardTitle>
                  <CardDescription>1% from business withdrawals</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{formatCurrency(withdrawalFeeRevenue)}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Topup Margins</CardTitle>
                  <CardDescription>Margins from currency exchange</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{formatCurrency(topupMarginRevenue)}</div>
                </CardContent>
              </Card>
            </div>

            {/* Revenue Table */}
            <div className="mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Revenue Transactions</CardTitle>
                      <CardDescription>Detailed breakdown of platform earnings</CardDescription>
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
                  <Tabs defaultValue="all">
                    <TabsList className="mb-4">
                      <TabsTrigger value="all">All Revenue</TabsTrigger>
                      <TabsTrigger value="withdrawal">Withdrawal Fees</TabsTrigger>
                      <TabsTrigger value="topup">Topup Margins</TabsTrigger>
                    </TabsList>
                    <TabsContent value="all">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Source</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {recentRevenue.map((revenue) => (
                            <TableRow key={revenue.id}>
                              <TableCell className="font-medium">{revenue.id}</TableCell>
                              <TableCell>
                                <span className="capitalize">
                                  {revenue.source === "withdrawal_fee" ? "Withdrawal Fee" : "Topup Margin"}
                                </span>
                              </TableCell>
                              <TableCell>{formatCurrency(revenue.amount)}</TableCell>
                              <TableCell className="max-w-xs truncate">{revenue.description}</TableCell>
                              <TableCell>{revenue.created_at}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TabsContent>
                    <TabsContent value="withdrawal">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {recentRevenue
                            .filter((revenue) => revenue.source === "withdrawal_fee")
                            .map((revenue) => (
                              <TableRow key={revenue.id}>
                                <TableCell className="font-medium">{revenue.id}</TableCell>
                                <TableCell>{formatCurrency(revenue.amount)}</TableCell>
                                <TableCell className="max-w-xs truncate">{revenue.description}</TableCell>
                                <TableCell>{revenue.created_at}</TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </TabsContent>
                    <TabsContent value="topup">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {recentRevenue
                            .filter((revenue) => revenue.source === "topup_margin")
                            .map((revenue) => (
                              <TableRow key={revenue.id}>
                                <TableCell className="font-medium">{revenue.id}</TableCell>
                                <TableCell>{formatCurrency(revenue.amount)}</TableCell>
                                <TableCell className="max-w-xs truncate">{revenue.description}</TableCell>
                                <TableCell>{revenue.created_at}</TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </TabsContent>
                  </Tabs>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View All Revenue
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
