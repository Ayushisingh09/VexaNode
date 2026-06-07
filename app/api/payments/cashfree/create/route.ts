import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getSetting } from "@/lib/settings"
import { createOrder } from "@/lib/db"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions) as any
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { amount, phone, items } = await req.json()
    const expectedAmount = parseFloat(amount)

    if (isNaN(expectedAmount) || expectedAmount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    const cashfreeSettings = await getSetting("cashfree", {
      enabled: false,
      appId: "",
      secretKey: "",
      sandbox: true
    })

    if (!cashfreeSettings.enabled) {
      return NextResponse.json({ error: "Cashfree gateway is disabled" }, { status: 400 })
    }

    const { appId, secretKey, sandbox } = cashfreeSettings
    if (!appId || !secretKey) {
      return NextResponse.json({ error: "Cashfree is not properly configured by administrator" }, { status: 500 })
    }

    // 1. Create a Pending Order in the Database first to get a UUID
    const planName = items && Array.isArray(items) 
      ? items.map((i: any) => `${i.name} (Qty: ${i.quantity || 1})`).join(", ")
      : "Hosting Service"

    const order = await createOrder({
      user_id: session.user.id,
      user_name: session.user.name || "Client",
      plan_name: planName,
      amount: `₹${expectedAmount.toFixed(2)}`,
      status: "Pending",
      proof_url: "Cashfree PG Session Initialized",
      created_at: new Date().toISOString()
    })

    const orderId = order.id // UUID from Database

    // 2. Call Cashfree Orders API with this UUID as order_id
    const url = sandbox 
      ? "https://sandbox.cashfree.com/pg/orders"
      : "https://api.cashfree.com/pg/orders"

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "x-client-id": appId,
        "x-client-secret": secretKey,
        "x-api-version": "2023-08-01",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        order_id: orderId,
        order_amount: expectedAmount,
        order_currency: "INR",
        customer_details: {
          customer_id: session.user.id,
          customer_name: session.user.name || "VexaNode Customer",
          customer_email: session.user.email || "customer@vexanode.com",
          customer_phone: phone || "9999999999"
        },
        order_meta: {
          return_url: `${baseUrl}/dashboard/checkout?gateway=cashfree&order_id={order_id}`
        }
      })
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("Cashfree Order API Error Response:", data)
      return NextResponse.json({ error: data.message || "Failed to create Cashfree order session" }, { status: response.status })
    }

    return NextResponse.json({
      payment_session_id: data.payment_session_id,
      order_id: orderId,
      sandbox: sandbox
    })

  } catch (error: any) {
    console.error("Cashfree Create Order Endpoint Exception:", error)
    return NextResponse.json({ error: error.message || "Internal server error during order creation" }, { status: 500 })
  }
}
