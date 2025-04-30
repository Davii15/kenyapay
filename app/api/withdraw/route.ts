import { type NextRequest, NextResponse } from "next/server"
import {
  getUserById,
  getWalletByUserId,
  updateWalletBalance,
  createTransaction,
  recordPlatformRevenue,
} from "@/lib/supabaseClient"
import { initiateB2CPayment } from "@/lib/mpesa"

// Platform fee percentage (1%)
const PLATFORM_FEE_PERCENTAGE = 0.01

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request
    if (!body.userId || !body.amount || !body.method) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { userId, amount, method, accountDetails } = body

    // Get user
    const user = await getUserById(userId)

    if (!user || user.role !== "business") {
      return NextResponse.json({ error: "Invalid business account" }, { status: 400 })
    }

    // Get wallet
    const wallet = await getWalletByUserId(userId)

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 400 })
    }

    // Check if business has enough balance
    if (wallet.balance < amount) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 })
    }

    // Calculate platform fee (1% of withdrawal amount)
    const platformFee = amount * PLATFORM_FEE_PERCENTAGE

    // Calculate actual amount to be sent to the business (after deducting fee)
    const actualWithdrawalAmount = amount - platformFee

    // Create transaction
    const transaction = await createTransaction({
      from_user_id: userId,
      amount,
      type: "withdrawal",
      status: "pending",
      payment_method: method,
      reference: `WD-${Date.now()}`,
    })

    // Record platform revenue from the withdrawal fee
    await recordPlatformRevenue({
      source: "withdrawal_fee",
      amount: platformFee,
      transaction_id: transaction.id,
      description: `1% fee from ${user.name}'s withdrawal of KSH ${amount}`,
    })

    // Process withdrawal based on method
    if (method === "mpesa" && accountDetails?.phoneNumber) {
      try {
        // Initiate M-Pesa B2C payment with the actual amount (after fee)
        const mpesaResponse = await initiateB2CPayment(
          accountDetails.phoneNumber,
          actualWithdrawalAmount,
          `Withdrawal to ${user.name} (Fee: KSH ${platformFee.toFixed(2)})`,
        )

        // Update transaction with M-Pesa reference
        // In a real app, you would update the transaction when you receive the callback

        // Update wallet balance
        const newBalance = wallet.balance - amount
        await updateWalletBalance(wallet.id, newBalance)

        return NextResponse.json({
          success: true,
          transaction,
          platformFee,
          actualWithdrawalAmount,
          mpesaResponse,
        })
      } catch (mpesaError) {
        console.error("M-Pesa error:", mpesaError)

        // Update transaction status to failed
        await createTransaction({
          ...transaction,
          status: "failed",
        })

        return NextResponse.json({ error: "Failed to process M-Pesa withdrawal" }, { status: 500 })
      }
    } else if (method === "bank" && accountDetails?.bankName && accountDetails?.accountNumber) {
      // For bank transfers, we would typically process this manually or through a separate system
      // Here we'll just mark it as pending for admin approval

      // Update wallet balance
      const newBalance = wallet.balance - amount
      await updateWalletBalance(wallet.id, newBalance)

      return NextResponse.json({
        success: true,
        transaction,
        platformFee,
        actualWithdrawalAmount,
        message: "Bank withdrawal request submitted for processing",
      })
    } else {
      return NextResponse.json({ error: "Invalid withdrawal method or missing account details" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error processing withdrawal:", error)
    return NextResponse.json({ error: "Failed to process withdrawal" }, { status: 500 })
  }
}
