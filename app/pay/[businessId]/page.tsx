"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Check, Globe, QrCode, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function PayBusinessPage({ params }: { params: { businessId: string } }) {
  const router = useRouter()
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "error">("idle")

  // Mock business data
  const businessData = {
    id: params.businessId,
    name: "Savanna Restaurant",
    type: "Restaurant/Café",
    location: "Nairobi, Kenya",
  }

  // Mock wallet balance
  const walletBalance = 15000

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and decimal point
    const value = e.target.value.replace(/[^0-9.]/g, "")
    setAmount(value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setPaymentStatus("processing")

    // Simulate payment processing
    setTimeout(() => {
      setIsLoading(false)

      // Check if amount is valid and less than wallet balance
      if (Number.parseFloat(amount) > 0 && Number.parseFloat(amount) <= walletBalance) {
        setPaymentStatus("success")
      } else {
        setPaymentStatus("error")
      }
    }, 2000)
  }

  // Redirect to dashboard after successful payment
  useEffect(() => {
    if (paymentStatus === "success") {
      const timer = setTimeout(() => {
        router.push("/tourist/dashboard")
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [paymentStatus, router])

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
          <h1 className="text-2xl font-semibold tracking-tight">Pay Business</h1>
          <p className="text-sm text-muted-foreground">Make a payment to {businessData.name}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
            <CardDescription>Enter the amount to pay</CardDescription>
          </CardHeader>
          <CardContent>
            {paymentStatus === "idle" || paymentStatus === "processing" || paymentStatus === "error" ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="rounded-lg border bg-muted/50 p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <QrCode className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{businessData.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {businessData.type} • {businessData.location}
                      </p>
                    </div>
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
                  <p className="text-xs text-muted-foreground">
                    Available balance: KSH {walletBalance.toLocaleString()}
                  </p>
                </div>

                {paymentStatus === "error" && (
                  <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
                    <div className="flex items-center gap-2">
                      <X className="h-4 w-4" />
                      <p className="text-sm font-medium">Payment failed. Please check your balance and try again.</p>
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
                  {isLoading ? "Processing..." : "Pay Now"}
                </Button>
              </form>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-4 py-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-medium">Payment Successful!</h3>
                <p className="text-center text-muted-foreground">
                  You have successfully paid KSH {Number.parseFloat(amount).toLocaleString()} to {businessData.name}.
                </p>
                <p className="text-sm text-muted-foreground">Redirecting to dashboard...</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
