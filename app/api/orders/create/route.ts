import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { createOrder } from "@/lib/db"
import { createClient } from "@/lib/supabase"
import { orderSchema } from "@/lib/validate"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions) as any
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const result = orderSchema.safeParse(body)
    
    if (!result.success) {
      return NextResponse.json({ error: "Invalid request data", details: result.error.format() }, { status: 400 })
    }

    const { orderId, planName, amount, proofUrl, items } = result.data

    if (orderId) {
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

      const { data: updated, error: updateError } = await supabase
        .from('orders')
        .update({
          proof_url: proofUrl || existing.proof_url,
          status: 'Pending',
          created_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .select()
        .single()

      if (updateError) throw updateError
      return NextResponse.json({ success: true, order: updated })
    }

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
