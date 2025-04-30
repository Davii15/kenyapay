import axios from "axios"
import { updateTransactionStatus } from "./supabaseClient"

// Types
interface STKPushRequest {
  phoneNumber: string
  amount: number
  accountReference: string
  transactionDesc: string
}

interface STKPushResponse {
  MerchantRequestID: string
  CheckoutRequestID: string
  ResponseCode: string
  ResponseDescription: string
  CustomerMessage: string
}

interface STKPushQueryResponse {
  ResponseCode: string
  ResponseDescription: string
  MerchantRequestID: string
  CheckoutRequestID: string
  ResultCode: string
  ResultDesc: string
}

// M-Pesa API configuration
const MPESA_CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY
const MPESA_CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET
const MPESA_PASSKEY = process.env.MPESA_PASSKEY
const MPESA_SHORTCODE = process.env.MPESA_SHORTCODE
const MPESA_API_URL =
  process.env.NODE_ENV === "production" ? "https://api.safaricom.co.ke" : "https://sandbox.safaricom.co.ke"
const CALLBACK_URL = process.env.MPESA_CALLBACK_URL || `${process.env.NEXT_PUBLIC_APP_URL}/api/mpesa-callback`

// Get M-Pesa access token
async function getAccessToken(): Promise<string> {
  try {
    const auth = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString("base64")

    const response = await axios({
      method: "get",
      url: `${MPESA_API_URL}/oauth/v1/generate?grant_type=client_credentials`,
      headers: {
        Authorization: `Basic ${auth}`,
      },
    })

    return response.data.access_token
  } catch (error) {
    console.error("Error getting M-Pesa access token:", error)
    throw new Error("Failed to get M-Pesa access token")
  }
}

// Generate timestamp for M-Pesa API
function getTimestamp(): string {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  const hour = String(date.getHours()).padStart(2, "0")
  const minute = String(date.getMinutes()).padStart(2, "0")
  const second = String(date.getSeconds()).padStart(2, "0")

  return `${year}${month}${day}${hour}${minute}${second}`
}

// Generate password for M-Pesa API
function generatePassword(timestamp: string): string {
  const passString = `${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`
  return Buffer.from(passString).toString("base64")
}

// Initiate STK Push
export async function initiateSTKPush({
  phoneNumber,
  amount,
  accountReference,
  transactionDesc,
}: STKPushRequest): Promise<STKPushResponse> {
  try {
    const accessToken = await getAccessToken()
    const timestamp = getTimestamp()
    const password = generatePassword(timestamp)

    // Format phone number (remove leading 0 or +254)
    const formattedPhone = phoneNumber.replace(/^(0|\+254)/, "254")

    const response = await axios({
      method: "post",
      url: `${MPESA_API_URL}/mpesa/stkpush/v1/processrequest`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      data: {
        BusinessShortCode: MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: Math.round(amount),
        PartyA: formattedPhone,
        PartyB: MPESA_SHORTCODE,
        PhoneNumber: formattedPhone,
        CallBackURL: CALLBACK_URL,
        AccountReference: accountReference,
        TransactionDesc: transactionDesc,
      },
    })

    return response.data
  } catch (error) {
    console.error("Error initiating STK Push:", error)
    throw new Error("Failed to initiate M-Pesa payment")
  }
}

// Query STK Push status
export async function querySTKPushStatus(checkoutRequestId: string): Promise<STKPushQueryResponse> {
  try {
    const accessToken = await getAccessToken()
    const timestamp = getTimestamp()
    const password = generatePassword(timestamp)

    const response = await axios({
      method: "post",
      url: `${MPESA_API_URL}/mpesa/stkpushquery/v1/query`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      data: {
        BusinessShortCode: MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId,
      },
    })

    return response.data
  } catch (error) {
    console.error("Error querying STK Push status:", error)
    throw new Error("Failed to query M-Pesa payment status")
  }
}

// Process M-Pesa callback
export async function processMpesaCallback(callbackData: any): Promise<boolean> {
  try {
    const { Body } = callbackData

    if (Body.stkCallback.ResultCode !== 0) {
      // Payment failed
      console.error("M-Pesa payment failed:", Body.stkCallback.ResultDesc)

      // Update transaction status if we have a reference
      const transactionId = Body.stkCallback.CheckoutRequestID
      if (transactionId) {
        await updateTransactionStatus(transactionId, "failed")
      }

      return false
    }

    // Payment successful
    const { CallbackMetadata } = Body.stkCallback

    // Extract payment details
    const amount = CallbackMetadata.Item.find((item: any) => item.Name === "Amount")?.Value
    const mpesaReceiptNumber = CallbackMetadata.Item.find((item: any) => item.Name === "MpesaReceiptNumber")?.Value
    const phoneNumber = CallbackMetadata.Item.find((item: any) => item.Name === "PhoneNumber")?.Value

    // Update transaction status
    const transactionId = Body.stkCallback.CheckoutRequestID
    await updateTransactionStatus(transactionId, "completed")

    return true
  } catch (error) {
    console.error("Error processing M-Pesa callback:", error)
    return false
  }
}

// Initiate M-Pesa B2C payment (for business withdrawals)
export async function initiateB2CPayment(phoneNumber: string, amount: number, remarks: string): Promise<any> {
  try {
    const accessToken = await getAccessToken()

    // Format phone number (remove leading 0 or +254)
    const formattedPhone = phoneNumber.replace(/^(0|\+254)/, "254")

    const response = await axios({
      method: "post",
      url: `${MPESA_API_URL}/mpesa/b2c/v1/paymentrequest`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      data: {
        InitiatorName: process.env.MPESA_INITIATOR_NAME,
        SecurityCredential: process.env.MPESA_SECURITY_CREDENTIAL,
        CommandID: "BusinessPayment",
        Amount: Math.round(amount),
        PartyA: MPESA_SHORTCODE,
        PartyB: formattedPhone,
        Remarks: remarks,
        QueueTimeOutURL: `${process.env.NEXT_PUBLIC_APP_URL}/api/mpesa-b2c-timeout`,
        ResultURL: `${process.env.NEXT_PUBLIC_APP_URL}/api/mpesa-b2c-result`,
        Occasion: "",
      },
    })

    return response.data
  } catch (error) {
    console.error("Error initiating B2C payment:", error)
    throw new Error("Failed to initiate M-Pesa withdrawal")
  }
}
