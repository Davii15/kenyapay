"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, BanknoteIcon, Check, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function BusinessWithdrawPage() {
  const router = useRouter()
  const [amount, setAmount] = useState("")
  const [withdrawMethod, setWithdrawMethod] = useState("bank")
  const [isLoading, setIsLoading] = useState(false)
  const [withdrawStatus, setWithdrawStatus] = useState<"idle" | "processing" | "success" | "error">("idle")

  // Mock wallet balance
  const walletBalance = 85000

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and decimal point
    const value = e.target.value.replace(/[^0-9.]/g, "")
    setAmount(value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setWithdrawStatus("processing")

    // Simulate withdrawal processing
    setTimeout(() => {
      setIsLoading(false)

      // Check if amount is valid and less than wallet balance
      if (Number.parseFloat(amount) > 0 && Number.parseFloat(amount) <= walletBalance) {
        setWithdrawStatus("success")
      } else {
        setWithdrawStatus("error")
      }
    }, 2000)
  }

  return (
    <div className="container flex min-h-screen flex-col items-center justify-center py-8">
      <Link href="/business/dashboard" className="absolute left-4 top-4 md:left-8 md:top-8">
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
          <h1 className="text-2xl font-semibold tracking-tight">Withdraw Funds</h1>
          <p className="text-sm text-muted-foreground">Transfer your earnings to your bank account</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Withdrawal Details</CardTitle>
            <CardDescription>Enter the amount to withdraw</CardDescription>
          </CardHeader>
          <CardContent>
            {withdrawStatus === "idle" || withdrawStatus === "processing" || withdrawStatus === "error" ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="rounded-lg border bg-muted/50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Available Balance:</span>
                    <span className="text-lg font-bold">KSH {walletBalance.toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (KSH)</Label>
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
                  <Label>Withdrawal Method</Label>
                  <RadioGroup
                    defaultValue="bank"
                    value={withdrawMethod}
                    onValueChange={setWithdrawMethod}
                    className="grid grid-cols-2 gap-4"
                  >
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
                    <div>
                      <RadioGroupItem value="mobile" id="mobile" className="peer sr-only" />
                      <Label
                        htmlFor="mobile"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <BanknoteIcon className="mb-3 h-6 w-6" />
                        Mobile Money
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {withdrawMethod === "bank" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="bankName">Bank Name</Label>
                      <Select defaultValue="equity">
                        <SelectTrigger id="bankName">
                          <SelectValue placeholder="Select bank" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="equity">Equity Bank</SelectItem>
                          <SelectItem value="kcb">Kenya Commercial Bank</SelectItem>
                          <SelectItem value="coop">Cooperative Bank</SelectItem>
                          <SelectItem value="standard">Standard Chartered</SelectItem>
                          <SelectItem value="barclays">ABSA Bank</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accountName">Account Name</Label>
                      <Input id="accountName" placeholder="John Doe" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accountNumber">Account Number</Label>
                      <Input id="accountNumber" placeholder="1234567890" required />
                    </div>
                  </div>
                )}

                {withdrawMethod === "mobile" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="mobileProvider">Mobile Provider</Label>
                      <Select defaultValue="mpesa">
                        <SelectTrigger id="mobileProvider">
                          <SelectValue placeholder="Select provider" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mpesa">M-Pesa</SelectItem>
                          <SelectItem value="airtel">Airtel Money</SelectItem>
                          <SelectItem value="telkom">T-Kash</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input id="phoneNumber" placeholder="07XX XXX XXX" required />
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={
                    isLoading || !amount || Number.parseFloat(amount) <= 0 || Number.parseFloat(amount) > walletBalance
                  }
                >
                  {isLoading ? "Processing..." : "Withdraw Funds"}
                </Button>
              </form>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-4 py-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-medium">Withdrawal Initiated!</h3>
                <p className="text-center text-muted-foreground">
                  Your withdrawal request for KSH {Number.parseFloat(amount).toLocaleString()} has been initiated. It
                  will be processed within 24-48 hours.
                </p>
                <Button className="mt-4" onClick={() => router.push("/business/dashboard")}>
                  Return to Dashboard
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
