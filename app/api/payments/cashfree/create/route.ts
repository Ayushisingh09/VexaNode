import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getSetting } from "@/lib/settings"
import { createOrder } from "@/lib/db"
import { createClient } from "@/lib/supabase"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions) as any
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { orderId, amount, phone, items } = await req.json()
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

    let orderIdToUse = orderId

    if (orderId) {
      // Validate order ownership
      const supabase = await createClient()
      const { data: existing, error: findError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .eq('user_id', session.user.id)
        .single()

      if (findError || !existing) {
        return NextResponse.json({ error: "Order not found or unauthorized access" }, { status: 404 })
      }

      if (existing.status === 'Approved') {
        return NextResponse.json({ error: "This invoice has already been paid and approved" }, { status: 400 })
      }

      // Update the proof_url to indicate initialized
      await supabase
        .from('orders')
        .update({ proof_url: "Cashfree PG Session Initialized" })
        .eq('id', orderId)

      orderIdToUse = existing.id
    } else {
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

      orderIdToUse = order.id
    }

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
        order_id: orderIdToUse,
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
      order_id: orderIdToUse,
      sandbox: sandbox
    })

  } catch (error: any) {
    console.error("Cashfree Create Order Endpoint Exception:", error)
    return NextResponse.json({ error: error.message || "Internal server error during order creation" }, { status: 500 })
  }
}
