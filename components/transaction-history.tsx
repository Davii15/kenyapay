"use client"

import { useState } from "react"
import { ArrowDown, ArrowUp, Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatCurrency, formatDate } from "@/lib/utils"
import type { Transaction } from "@/lib/supabaseClient"

interface TransactionHistoryProps {
  transactions: Transaction[]
  isLoading?: boolean
  showSearch?: boolean
  showTabs?: boolean
  showViewAll?: boolean
  limit?: number
  className?: string
  onViewAll?: () => void
}

export function TransactionHistory({
  transactions,
  isLoading = false,
  showSearch = false,
  showTabs = true,
  showViewAll = true,
  limit = 5,
  className = "",
  onViewAll,
}: TransactionHistoryProps) {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Filter transactions based on active tab and search query
  const filteredTransactions = transactions
    .filter((transaction) => {
      if (activeTab === "all") return true
      return transaction.type === activeTab
    })
    .filter((transaction) => {
      if (!searchQuery) return true
      // Search by amount, type, status, or date
      return (
        transaction.amount.toString().includes(searchQuery) ||
        transaction.type.includes(searchQuery.toLowerCase()) ||
        transaction.status.includes(searchQuery.toLowerCase()) ||
        formatDate(transaction.created_at).includes(searchQuery)
      )
    })
    .slice(0, limit)

  // Get transaction icon based on type
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "topup":
        return <ArrowDown className="h-5 w-5" />
      case "payment":
        return <ArrowUp className="h-5 w-5" />
      case "withdrawal":
        return <ArrowUp className="h-5 w-5" />
      default:
        return <ArrowDown className="h-5 w-5" />
    }
  }

  // Get transaction color based on type
  const getTransactionColor = (type: string) => {
    switch (type) {
      case "topup":
        return "bg-green-100 text-green-600"
      case "payment":
        return "bg-blue-100 text-blue-600"
      case "withdrawal":
        return "bg-amber-100 text-amber-600"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  // Get transaction sign based on type
  const getTransactionSign = (type: string) => {
    switch (type) {
      case "topup":
        return "+"
      case "payment":
      case "withdrawal":
        return "-"
      default:
        return ""
    }
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>Your recent transactions</CardDescription>
          </div>
          {showSearch && (
            <div className="relative w-[200px]">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions"
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}
        </div>
        {showTabs && (
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="topup">Top-ups</TabsTrigger>
              <TabsTrigger value="payment">Payments</TabsTrigger>
              <TabsTrigger value="withdrawal">Withdrawals</TabsTrigger>
            </TabsList>
          </Tabs>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex animate-pulse items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-muted"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-32 rounded bg-muted"></div>
                    <div className="h-3 w-24 rounded bg-muted"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-20 rounded bg-muted"></div>
                  <div className="h-3 w-16 rounded bg-muted"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredTransactions.length > 0 ? (
          <div className="space-y-4">
            {filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${getTransactionColor(
                      transaction.type,
                    )}`}
                  >
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div>
                    <p className="font-medium capitalize">{transaction.type}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(transaction.created_at)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-medium ${transaction.type === "topup" ? "text-green-600" : "text-blue-600"}`}>
                    {getTransactionSign(transaction.type)} {formatCurrency(transaction.amount)}
                  </p>
                  <p className={`text-xs ${transaction.status === "completed" ? "text-green-600" : "text-amber-600"}`}>
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-32 flex-col items-center justify-center rounded-lg border border-dashed p-4">
            <p className="text-center text-muted-foreground">No transactions found</p>
            {searchQuery && (
              <Button variant="ghost" size="sm" className="mt-2" onClick={() => setSearchQuery("")}>
                Clear search
              </Button>
            )}
          </div>
        )}
      </CardContent>
      {showViewAll && transactions.length > limit && (
        <CardFooter>
          <Button variant="outline" className="w-full" onClick={onViewAll}>
            View All Transactions
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
