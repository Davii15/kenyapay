import { type NextRequest, NextResponse } from "next/server"
import { processPayPalPayment, verifyPayPalWebhook } from "@/lib/paypal"

// Exchange rates (in a real app, these would come from an API)
const exchangeRates = {
  USD: 130.25,
  EUR: 142.5,
  GBP: 167.8,
  JPY: 0.88,
  AUD: 86.45,
}

// Handle PayPal payment completion
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request
    if (!body.userId || !body.orderId || !body.currency) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get exchange rate for the currency
    const currency = body.currency.toUpperCase()
    const exchangeRate = exchangeRates[currency as keyof typeof exchangeRates]

    if (!exchangeRate) {
      return NextResponse.json({ error: "Unsupported currency" }, { status: 400 })
    }

    // Process the payment
    const result = await processPayPalPayment(body.userId, body.orderId, exchangeRate)

    return NextResponse.json({
      success: true,
      transaction: result.transaction,
    })
  } catch (error) {
    console.error("Error processing top-up:", error)
    return NextResponse.json({ error: "Failed to process payment" }, { status: 500 })
  }
}

// Handle PayPal webhook
export async function PUT(request: NextRequest) {
  try {
    const body = await request.text()
    const headers = Object.fromEntries(request.headers.entries())

    // Verify webhook signature
    const isValid = await verifyPayPalWebhook(body, headers)

    if (!isValid) {
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 })
    }

    const webhookEvent = JSON.parse(body)

    // Handle different event types
    switch (webhookEvent.event_type) {
      case "PAYMENT.CAPTURE.COMPLETED":
        // Payment completed successfully
        // In a real app, you would update the transaction status
        // and credit the user's wallet
        break

      case "PAYMENT.CAPTURE.DENIED":
      case "PAYMENT.CAPTURE.REFUNDED":
        // Payment was denied or refunded
        // Update transaction status accordingly
        break
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error handling PayPal webhook:", error)
    return NextResponse.json({ error: "Failed to process webhook" }, { status: 500 })
  }
}
