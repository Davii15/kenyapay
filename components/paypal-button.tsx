"use client"

import { useState } from "react"
import Script from "next/script"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface PayPalButtonProps {
  amount: number
  currency?: string
  onSuccess: (details: any) => void
  onError?: (error: any) => void
  className?: string
}

export function PayPalButton({ amount, currency = "USD", onSuccess, onError, className = "" }: PayPalButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)
  const [paypalButtonRendered, setPaypalButtonRendered] = useState(false)

  // Function to initialize PayPal button
  const initializePayPalButton = () => {
    if (!window.paypal || paypalButtonRendered) return

    setIsLoading(true)

    // @ts-ignore - PayPal types are not available
    window.paypal
      .Buttons({
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  currency_code: currency,
                  value: amount.toString(),
                },
              },
            ],
          })
        },
        onApprove: async (data: any, actions: any) => {
          try {
            const details = await actions.order.capture()
            setIsLoading(false)
            onSuccess(details)
          } catch (error) {
            setIsLoading(false)
            if (onError) onError(error)
          }
        },
        onError: (error: any) => {
          setIsLoading(false)
          if (onError) onError(error)
        },
        onCancel: () => {
          setIsLoading(false)
        },
      })
      .render("#paypal-button-container")

    setPaypalButtonRendered(true)
  }

  // Handle script load
  const handleScriptLoad = () => {
    setIsScriptLoaded(true)
    initializePayPalButton()
  }

  return (
    <div className={className}>
      {/* PayPal Script */}
      <Script
        src={`https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "sb"}&currency=${currency}`}
        onLoad={handleScriptLoad}
        strategy="lazyOnload"
      />

      {/* PayPal Button Container */}
      {isScriptLoaded ? (
        <div id="paypal-button-container" className="w-full" />
      ) : (
        <Button disabled className="w-full flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading PayPal...
        </Button>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="mt-2 text-center text-sm text-muted-foreground">
          <Loader2 className="inline h-4 w-4 animate-spin mr-2" />
          Processing your payment...
        </div>
      )}

      {/* PayPal Info */}
      <p className="mt-4 text-center text-xs text-muted-foreground">
        By clicking the PayPal button, you agree to the terms of service and privacy policy.
      </p>
    </div>
  )
}
