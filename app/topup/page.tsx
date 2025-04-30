"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, CreditCard, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function TopupPage() {
  const router = useRouter()
  const [amount, setAmount] = useState("")
  const [currency, setCurrency] = useState("USD")
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [isLoading, setIsLoading] = useState(false)

  // Mock exchange rates
  const exchangeRates = {
    USD: 130.25,
    EUR: 142.5,
    GBP: 167.8,
    JPY: 0.88,
    AUD: 86.45,
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and decimal point
    const value = e.target.value.replace(/[^0-9.]/g, "")
    setAmount(value)
  }

  const calculateKshAmount = () => {
    if (!amount) return "0"
    const rate = exchangeRates[currency as keyof typeof exchangeRates]
    return (Number.parseFloat(amount) * rate).toFixed(2)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate payment processing
    setTimeout(() => {
      setIsLoading(false)
      router.push("/tourist/dashboard")
    }, 2000)
  }

  return (
    <div className="container flex min-h-screen flex-col items-center justify-center py-8">
      <Link href="/tourist/dashboard" className="absolute left-4 top-4 md:left-8 md:top-8">
        <Button variant="ghost" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </Link>

      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
        <div className="flex flex-col space-y-2 text-center">
          <div className="flex justify-center">
            <Globe className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Top Up Your Wallet</h1>
          <p className="text-sm text-muted-foreground">Add funds to your KenyaPay wallet</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Add Funds</CardTitle>
            <CardDescription>Convert your currency to Kenyan Shillings</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-3 space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="text"
                      placeholder="0.00"
                      value={amount}
                      onChange={handleAmountChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger id="currency">
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
                  </div>
                </div>

                <div className="rounded-lg border bg-muted/50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Exchange Rate:</span>
                    <span className="text-sm font-medium">
                      1 {currency} = {exchangeRates[currency as keyof typeof exchangeRates]} KSH
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm">You will receive:</span>
                    <span className="text-lg font-bold">KSH {calculateKshAmount()}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <RadioGroup
                    defaultValue="card"
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div>
                      <RadioGroupItem value="card" id="card" className="peer sr-only" />
                      <Label
                        htmlFor="card"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <CreditCard className="mb-3 h-6 w-6" />
                        Credit Card
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="bank" id="bank" className="peer sr-only" />
                      <Label
                        htmlFor="bank"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <Globe className="mb-3 h-6 w-6" />
                        Bank Transfer
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {paymentMethod === "card" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardName">Name on Card</Label>
                      <Input id="cardName" placeholder="John Doe" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input id="cardNumber" placeholder="1234 5678 9012 3456" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvc">CVC</Label>
                        <Input id="cvc" placeholder="123" required />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "bank" && (
                  <div className="space-y-4">
                    <div className="rounded-lg border bg-muted/50 p-4">
                      <h3 className="mb-2 font-medium">Bank Transfer Instructions</h3>
                      <p className="text-sm text-muted-foreground">
                        Please transfer the exact amount to the following account. Your wallet will be credited once the
                        payment is confirmed.
                      </p>
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Bank:</span>
                          <span className="text-sm font-medium">Kenya National Bank</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Account Name:</span>
                          <span className="text-sm font-medium">KenyaPay Ltd</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Account Number:</span>
                          <span className="text-sm font-medium">1234567890</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Reference:</span>
                          <span className="text-sm font-medium">TOP-UP-12345</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Processing..." : "Top Up Wallet"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
