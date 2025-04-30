import { type NextRequest, NextResponse } from "next/server"
import { createQRCode, getQRCodesByBusinessId, incrementQRCodeScan } from "@/lib/supabaseClient"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    // Get the session
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "business") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // Validate request
    if (!body.businessId || !body.type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Ensure the business ID matches the logged-in user's business
    if (body.businessId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { businessId, type, amount, isFixedAmount, title, description } = body

    // Create QR code
    const qrCode = await createQRCode({
      business_id: businessId,
      type,
      amount: amount || null,
      is_fixed_amount: isFixedAmount || false,
      title: title || null,
      description: description || null,
      active: true,
    })

    return NextResponse.json({
      success: true,
      qrCode,
    })
  } catch (error) {
    console.error("Error creating QR code:", error)
    return NextResponse.json({ error: "Failed to create QR code" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get the session
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const businessId = searchParams.get("businessId")

    if (!businessId) {
      return NextResponse.json({ error: "Missing business ID" }, { status: 400 })
    }

    // If not admin and not the business owner, deny access
    if (session.user.role !== "admin" && session.user.id !== businessId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get QR codes
    const qrCodes = await getQRCodesByBusinessId(businessId)

    return NextResponse.json({
      success: true,
      qrCodes,
    })
  } catch (error) {
    console.error("Error fetching QR codes:", error)
    return NextResponse.json({ error: "Failed to fetch QR codes" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request
    if (!body.qrCodeId) {
      return NextResponse.json({ error: "Missing QR code ID" }, { status: 400 })
    }

    // Increment scan count
    await incrementQRCodeScan(body.qrCodeId)

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error("Error updating QR code scan count:", error)
    return NextResponse.json({ error: "Failed to update QR code" }, { status: 500 })
  }
}
