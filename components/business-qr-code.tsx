"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Download, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface BusinessQRCodeProps {
  businessId: string
  businessName: string
  amount?: number
  allowCustomAmount?: boolean
  size?: number
  showDownload?: boolean
  showShare?: boolean
  className?: string
}

export function BusinessQRCode({
  businessId,
  businessName,
  amount,
  allowCustomAmount = true,
  size = 300,
  showDownload = true,
  showShare = true,
  className = "",
}: BusinessQRCodeProps) {
  const [qrValue, setQrValue] = useState("")
  const [qrImage, setQrImage] = useState<string | null>(null)
  const [customAmount, setCustomAmount] = useState<number | undefined>(amount)
  const [fixedAmount, setFixedAmount] = useState(!allowCustomAmount && amount !== undefined)
  const qrRef = useRef<HTMLDivElement>(null)

  // Generate QR code data
  useEffect(() => {
    // Create QR code data with business ID and optional amount
    const data = {
      businessId,
      businessName,
      ...(fixedAmount && customAmount && { amount: customAmount }),
    }

    // Convert to URL-friendly string
    const qrData = `kenyapay://pay?data=${encodeURIComponent(JSON.stringify(data))}`
    setQrValue(qrData)
  }, [businessId, businessName, customAmount, fixedAmount])

  // Generate QR code image
  useEffect(() => {
    const generateQRCode = async () => {
      if (!qrValue) return

      try {
        // Import QR code library dynamically
        const QRCode = (await import("qrcode")).default

        // Generate QR code as data URL
        const dataUrl = await QRCode.toDataURL(qrValue, {
          width: size,
          margin: 1,
          color: {
            dark: "#000000",
            light: "#FFFFFF",
          },
        })

        setQrImage(dataUrl)
      } catch (error) {
        console.error("Error generating QR code:", error)
      }
    }

    generateQRCode()
  }, [qrValue, size])

  // Handle amount change
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Allow only numbers and decimal point
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setCustomAmount(value === "" ? undefined : Number(value))
    }
  }

  // Handle fixed amount toggle
  const handleFixedAmountToggle = (checked: boolean) => {
    setFixedAmount(checked)
  }

  // Download QR code as image
  const downloadQRCode = () => {
    if (!qrImage) return

    const link = document.createElement("a")
    link.href = qrImage
    link.download = `kenyapay-${businessName.toLowerCase().replace(/\s+/g, "-")}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Share QR code
  const shareQRCode = async () => {
    if (!qrImage || !navigator.share) return

    try {
      // Convert data URL to Blob
      const response = await fetch(qrImage)
      const blob = await response.blob()
      const file = new File([blob], `kenyapay-${businessName}.png`, { type: "image/png" })

      // Share QR code
      await navigator.share({
        title: `${businessName} Payment QR Code`,
        text: "Scan this QR code to pay with KenyaPay",
        files: [file],
      })
    } catch (error) {
      console.error("Error sharing QR code:", error)
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Payment QR Code</CardTitle>
        <CardDescription>Customers can scan this to pay {businessName}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        {allowCustomAmount && (
          <div className="mb-4 w-full space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="fixed-amount">Fixed Amount</Label>
              <Switch id="fixed-amount" checked={fixedAmount} onCheckedChange={handleFixedAmountToggle} />
            </div>
            {(fixedAmount || !allowCustomAmount) && (
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (KSH)</Label>
                <Input
                  id="amount"
                  type="text"
                  placeholder="0.00"
                  value={customAmount || ""}
                  onChange={handleAmountChange}
                />
              </div>
            )}
          </div>
        )}

        <div ref={qrRef} className="flex flex-col items-center justify-center rounded-lg border bg-white p-4">
          {qrImage ? (
            <>
              <img src={qrImage || "/placeholder.svg"} alt="Business QR Code" className="h-auto w-full max-w-[250px]" />
              <div className="mt-2 text-center">
                <p className="font-medium">{businessName}</p>
                {fixedAmount && customAmount && (
                  <p className="text-sm text-muted-foreground">KSH {customAmount.toLocaleString()}</p>
                )}
              </div>
            </>
          ) : (
            <div className="flex h-[250px] w-[250px] items-center justify-center bg-muted">
              <p className="text-sm text-muted-foreground">Generating QR code...</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        {showDownload && (
          <Button variant="outline" className="flex-1" onClick={downloadQRCode} disabled={!qrImage}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        )}
        {showShare && navigator.share && (
          <Button variant="outline" className="flex-1" onClick={shareQRCode} disabled={!qrImage}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
