import { type NextRequest, NextResponse } from "next/server"
import { getUserById, getWalletByUserId, updateWalletBalance, createTransaction } from "@/lib/supabaseClient"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request
    if (!body.touristId || !body.businessId || !body.amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { touristId, businessId, amount } = body

    // Get tourist and business users
    const tourist = await getUserById(touristId)
    const business = await getUserById(businessId)

    if (!tourist || tourist.role !== "tourist") {
      return NextResponse.json({ error: "Invalid tourist account" }, { status: 400 })
    }

    if (!business || business.role !== "business") {
      return NextResponse.json({ error: "Invalid business account" }, { status: 400 })
    }

    // Get wallets
    const touristWallet = await getWalletByUserId(touristId)
    const businessWallet = await getWalletByUserId(businessId)

    if (!touristWallet || !businessWallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 400 })
    }

    // Check if tourist has enough balance
    if (touristWallet.balance < amount) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 })
    }

    // Create transaction
    const transaction = await createTransaction({
      from_user_id: touristId,
      to_user_id: businessId,
      amount,
      type: "payment",
      status: "completed",
    })

    // Update wallets
    const newTouristBalance = touristWallet.balance - amount
    const newBusinessBalance = businessWallet.balance + amount

    await updateWalletBalance(touristWallet.id, newTouristBalance)
    await updateWalletBalance(businessWallet.id, newBusinessBalance)

    return NextResponse.json({
      success: true,
      transaction,
    })
  } catch (error) {
    console.error("Error processing payment:", error)
    return NextResponse.json({ error: "Failed to process payment" }, { status: 500 })
  }
}
