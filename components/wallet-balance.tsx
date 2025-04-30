"use client"

import { useState } from "react"
import { ArrowDown, ArrowUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { formatCurrency } from "@/lib/utils"

interface WalletBalanceProps {
  balance: number
  currency?: string
  showActions?: boolean
  showConversion?: boolean
  isLoading?: boolean
  className?: string
  userRole?: "tourist" | "business" | "admin"
}

export function WalletBalance({
  balance,
  currency = "KSH",
  showActions = true,
  showConversion = true,
  isLoading = false,
  className = "",
  userRole = "tourist",
}: WalletBalanceProps) {
  const [selectedCurrency, setSelectedCurrency] = useState("USD")

  // Mock exchange rates (in a real app, these would come from an API)
  const exchangeRates = {
    USD: 130.25,
    EUR: 142.5,
    GBP: 167.8,
    JPY: 0.88,
    AUD: 86.45,
  }

  const convertCurrency = (amount: number, to: string) => {
    const rate = exchangeRates[to as keyof typeof exchangeRates]
    return (amount / rate).toFixed(2)
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle>Wallet Balance</CardTitle>
        <CardDescription>Your current balance in {currency}</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-8 w-32 animate-pulse rounded-md bg-muted"></div>
        ) : (
          <div className="text-3xl font-bold">{formatCurrency(balance, currency)}</div>
        )}
        {showConversion && (
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
              ≈ {selectedCurrency} {convertCurrency(balance, selectedCurrency)}
            </span>
          </div>
        )}
      </CardContent>
      {showActions && (
        <CardFooter className="flex gap-2">
          {userRole === "tourist" && (
            <>
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
            </>
          )}
          {userRole === "business" && (
            <Button className="flex-1 gap-2" asChild>
              <Link href="/business/withdraw">
                <ArrowDown className="h-4 w-4" />
                Withdraw
              </Link>
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  )
}
