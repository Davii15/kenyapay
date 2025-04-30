import { createTransaction, updateWalletBalance, getWalletByUserId } from "./supabaseClient"

// Types
interface PayPalOrderResponse {
  id: string
  status: string
  links: Array<{
    href: string
    rel: string
    method: string
  }>
}

interface PayPalCaptureResponse {
  id: string
  status: string
  purchase_units: Array<{
    reference_id: string
    shipping: any
    payments: {
      captures: Array<{
        id: string
        status: string
        amount: {
          currency_code: string
          value: string
        }
      }>
    }
  }>
  payer: {
    name: {
      given_name: string
      surname: string
    }
    email_address: string
    payer_id: string
  }
}

// PayPal API configuration
const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET
const PAYPAL_API_URL =
  process.env.NODE_ENV === "production" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com"

// Get PayPal access token
async function getAccessToken(): Promise<string> {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString("base64")

  const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${auth}`,
    },
    body: "grant_type=client_credentials",
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(`PayPal error: ${data.error_description}`)
  }

  return data.access_token
}

// Create PayPal order
export async function createPayPalOrder(amount: number, currency = "USD"): Promise<PayPalOrderResponse> {
  const accessToken = await getAccessToken()

  const response = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: amount.toString(),
          },
        },
      ],
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(`PayPal error: ${data.message}`)
  }

  return data
}

// Capture PayPal payment
export async function capturePayPalPayment(orderId: string): Promise<PayPalCaptureResponse> {
  const accessToken = await getAccessToken()

  const response = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders/${orderId}/capture`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(`PayPal error: ${data.message}`)
  }

  return data
}

// Process PayPal payment and update wallet
export async function processPayPalPayment(
  userId: string,
  orderId: string,
  exchangeRate: number,
): Promise<{ success: boolean; transaction: any }> {
  try {
    // Capture the payment
    const captureData = await capturePayPalPayment(orderId)

    if (captureData.status !== "COMPLETED") {
      throw new Error("Payment not completed")
    }

    // Get payment details
    const paymentAmount = Number.parseFloat(captureData.purchase_units[0].payments.captures[0].amount.value)
    const paymentCurrency = captureData.purchase_units[0].payments.captures[0].amount.currency_code

    // Convert to KSH
    const amountInKSH = Math.round(paymentAmount * exchangeRate)

    // Get user wallet
    const wallet = await getWalletByUserId(userId)

    if (!wallet) {
      throw new Error("Wallet not found")
    }

    // Create transaction record
    const transaction = await createTransaction({
      to_user_id: userId,
      amount: amountInKSH,
      type: "topup",
      status: "completed",
      payment_method: "paypal",
      reference: captureData.id,
    })

    // Update wallet balance
    const newBalance = wallet.balance + amountInKSH
    await updateWalletBalance(wallet.id, newBalance)

    return {
      success: true,
      transaction,
    }
  } catch (error) {
    console.error("Error processing PayPal payment:", error)
    throw error
  }
}

// Verify PayPal webhook signature
export async function verifyPayPalWebhook(body: string, headers: { [key: string]: string }): Promise<boolean> {
  try {
    const accessToken = await getAccessToken()

    const response = await fetch(`${PAYPAL_API_URL}/v1/notifications/verify-webhook-signature`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        auth_algo: headers["paypal-auth-algo"],
        cert_url: headers["paypal-cert-url"],
        transmission_id: headers["paypal-transmission-id"],
        transmission_sig: headers["paypal-transmission-sig"],
        transmission_time: headers["paypal-transmission-time"],
        webhook_id: process.env.PAYPAL_WEBHOOK_ID,
        webhook_event: JSON.parse(body),
      }),
    })

    const data = await response.json()

    return data.verification_status === "SUCCESS"
  } catch (error) {
    console.error("Error verifying PayPal webhook:", error)
    return false
  }
}
