import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { createOrder } from "@/lib/db"

export async function POST(req: Request) {
  const session = await getServerSession() as any
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { planName, amount, proofUrl, items } = body

    const order = await createOrder({
      user_id: session.user.id,
      user_name: session.user.name || "Unknown",
      plan_name: planName || (items && items.map((i: any) => i.name).join(", ")),
      amount: amount,
      status: 'Pending',
      proof_url: proofUrl,
      created_at: new Date().toISOString()
    })

    return NextResponse.json({ success: true, order })
  } catch (error: any) {
    console.error("Order Creation Error:", error)
    return NextResponse.json({ error: error.message || "Failed to create order" }, { status: 500 })
  }
}
