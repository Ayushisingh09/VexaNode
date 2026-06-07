import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getSetting } from "@/lib/settings"
import { updateOrderStatus } from "@/lib/db"

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const orderId = searchParams.get("order_id")

  if (!orderId) {
    return NextResponse.json({ error: "Missing order_id parameter" }, { status: 400 })
  }

  try {
    const cashfreeSettings = await getSetting("cashfree", {
      enabled: false,
      appId: "",
      secretKey: "",
      sandbox: true
    })

    const { appId, secretKey, sandbox } = cashfreeSettings
    if (!appId || !secretKey) {
      return NextResponse.json({ error: "Cashfree is not properly configured by administrator" }, { status: 500 })
    }

    // Determine GET order endpoint
    const url = sandbox 
      ? `https://sandbox.cashfree.com/pg/orders/${orderId}`
      : `https://api.cashfree.com/pg/orders/${orderId}`

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-client-id": appId,
        "x-client-secret": secretKey,
        "x-api-version": "2023-08-01"
      }
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("Cashfree Retrieve Order Error:", data)
      return NextResponse.json({ error: data.message || "Failed to retrieve order status from Cashfree" }, { status: response.status })
    }

    if (data.order_status === "PAID") {
      // Update local order status to Approved
      await updateOrderStatus(orderId, "Approved")
      return NextResponse.json({ success: true, status: "PAID" })
    }

    return NextResponse.json({ 
      success: false, 
      status: data.order_status, 
      message: `Order status is currently ${data.order_status}.` 
    })

  } catch (error: any) {
    console.error("Cashfree Verification API Exception:", error)
    return NextResponse.json({ error: error.message || "Internal verification server error" }, { status: 500 })
  }
}
