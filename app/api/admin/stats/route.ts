import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient"

// Helper function to check if user is admin
async function isAdmin(userId: string): Promise<boolean> {
  const { data, error } = await supabase.from("users").select("role").eq("id", userId).single()

  if (error || !data) return false
  return data.role === "admin"
}

export async function GET(request: NextRequest) {
  try {
    // Get user ID from request (in a real app, this would come from an auth middleware)
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const admin = await isAdmin(userId)

    if (!admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get date range from query params
    const url = new URL(request.url)
    const startDate =
      url.searchParams.get("startDate") || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0] // Default to last 30 days
    const endDate = url.searchParams.get("endDate") || new Date().toISOString().split("T")[0] // Default to today

    // Get total users count
    const { count: totalUsers } = await supabase.from("users").select("*", { count: "exact", head: true })

    // Get tourist users count
    const { count: touristUsers } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("role", "tourist")

    // Get business users count
    const { count: businessUsers } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("role", "business")

    // Get new users in date range
    const { count: newUsers } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .gte("created_at", `${startDate}T00:00:00`)
      .lte("created_at", `${endDate}T23:59:59`)

    // Get total transactions count
    const { count: totalTransactions } = await supabase.from("transactions").select("*", { count: "exact", head: true })

    // Get transactions in date range
    const { data: recentTransactions } = await supabase
      .from("transactions")
      .select("*")
      .gte("created_at", `${startDate}T00:00:00`)
      .lte("created_at", `${endDate}T23:59:59`)
      .order("created_at", { ascending: false })

    // Calculate transaction volume
    let totalVolume = 0
    let topupVolume = 0
    let paymentVolume = 0
    let withdrawalVolume = 0

    if (recentTransactions) {
      recentTransactions.forEach((transaction) => {
        if (transaction.status === "completed") {
          totalVolume += transaction.amount

          if (transaction.type === "topup") {
            topupVolume += transaction.amount
          } else if (transaction.type === "payment") {
            paymentVolume += transaction.amount
          } else if (transaction.type === "withdrawal") {
            withdrawalVolume += transaction.amount
          }
        }
      })
    }

    // Get platform revenue (e.g., from transaction fees)
    // In a real app, you would calculate this based on your fee structure
    const platformRevenue = Math.round(paymentVolume * 0.02) // Example: 2% fee on payments

    return NextResponse.json({
      success: true,
      stats: {
        users: {
          total: totalUsers,
          tourists: touristUsers,
          businesses: businessUsers,
          new: newUsers,
        },
        transactions: {
          total: totalTransactions,
          recent: recentTransactions?.length || 0,
        },
        volume: {
          total: totalVolume,
          topup: topupVolume,
          payment: paymentVolume,
          withdrawal: withdrawalVolume,
        },
        revenue: platformRevenue,
        dateRange: {
          start: startDate,
          end: endDate,
        },
      },
    })
  } catch (error) {
    console.error("Error getting admin stats:", error)
    return NextResponse.json({ error: "Failed to get statistics" }, { status: 500 })
  }
}
