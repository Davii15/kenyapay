import { type NextRequest, NextResponse } from "next/server"
import { processMpesaCallback } from "@/lib/mpesa"
import { updateTransactionStatus, getWalletByUserId, updateWalletBalance } from "@/lib/supabaseClient"
import { supabase } from "@/lib/supabaseClient"

export async function POST(request: NextRequest) {
  try {
    const callbackData = await request.json()

    // Process the callback
    const success = await processMpesaCallback(callbackData)

    if (!success) {
      return NextResponse.json({ error: "Failed to process M-Pesa callback" }, { status: 400 })
    }

    // Extract transaction details
    const { Body } = callbackData
    const { CallbackMetadata } = Body.stkCallback

    // Get transaction ID (CheckoutRequestID)
    const transactionId = Body.stkCallback.CheckoutRequestID

    // Get transaction details from database
    const { data: transaction, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("reference", transactionId)
      .single()

    if (error || !transaction) {
      console.error("Transaction not found:", transactionId)
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    // Update transaction status
    await updateTransactionStatus(transaction.id, "completed")

    // If it's a top-up, update the user's wallet
    if (transaction.type === "topup" && transaction.to_user_id) {
      const wallet = await getWalletByUserId(transaction.to_user_id)

      if (wallet) {
        const newBalance = wallet.balance + transaction.amount
        await updateWalletBalance(wallet.id, newBalance)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error processing M-Pesa callback:", error)
    return NextResponse.json({ error: "Failed to process callback" }, { status: 500 })
  }
}
