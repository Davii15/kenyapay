import { type NextRequest, NextResponse } from "next/server"
import { createAdminLog, getAdminLogs } from "@/lib/supabaseClient"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    // Get the admin session
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // Validate request
    if (!body.action || !body.entityType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { action, entityType, entityId, details } = body

    // Get IP address from request
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"

    // Create admin log
    const log = await createAdminLog({
      admin_id: session.user.id,
      action,
      entity_type: entityType,
      entity_id: entityId,
      details,
      ip_address: ip as string,
    })

    return NextResponse.json({
      success: true,
      log,
    })
  } catch (error) {
    console.error("Error creating admin log:", error)
    return NextResponse.json({ error: "Failed to create admin log" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get the admin session
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const adminId = searchParams.get("adminId")
    const entityType = searchParams.get("entityType") as any
    const entityId = searchParams.get("entityId")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : undefined

    // Get admin logs
    const logs = await getAdminLogs({
      adminId: adminId || undefined,
      entityType: entityType || undefined,
      entityId: entityId || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      limit,
    })

    return NextResponse.json({
      success: true,
      logs,
    })
  } catch (error) {
    console.error("Error fetching admin logs:", error)
    return NextResponse.json({ error: "Failed to fetch admin logs" }, { status: 500 })
  }
}
