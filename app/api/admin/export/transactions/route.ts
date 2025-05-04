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
      url.searchParams.get("startDate") || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
    const endDate = url.searchParams.get("endDate") || new Date().toISOString().split("T")[0]

    // Fetch transactions
    const { data: transactions, error } = await supabase
      .from("transactions")
      .select(`
        id,
        from_user_id,
        to_user_id,
        amount,
        type,
        status,
        payment_method,
        reference,
        created_at,
        from_users:from_user_id(name, email),
        to_users:to_user_id(name, email)
      `)
      .gte("created_at", `${startDate}T00:00:00`)
      .lte("created_at", `${endDate}T23:59:59`)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching transactions:", error)
      return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 })
    }

    // Convert to CSV
    const headers = [
      "ID",
      "Type",
      "Amount",
      "Status",
      "From User",
      "From Email",
      "To User",
      "To Email",
      "Payment Method",
      "Reference",
      "Date",
    ]

    const rows = transactions.map((t) => [
      t.id,
      t.type,
      t.amount,
      t.status,
      t.from_users?.name || "",
      t.from_users?.email || "",
      t.to_users?.name || "",
      t.to_users?.email || "",
      t.payment_method || "",
      t.reference || "",
      new Date(t.created_at).toISOString(),
    ])

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")),
    ].join("\n")

    // Log admin action
    await supabase.from("admin_logs").insert({
      admin_id: userId,
      action: "export",
      entity_type: "transactions",
      details: { date_range: { start: startDate, end: endDate } },
    })

    // Return CSV file
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="transactions-${startDate}-to-${endDate}.csv"`,
      },
    })
  } catch (error) {
    console.error("Error exporting transactions:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
