import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { getUserOrders } from "@/lib/db"

export async function GET() {
  const session = await getServerSession() as any
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const orders = await getUserOrders(session.user.id)
    return NextResponse.json({ orders })
  } catch (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 })
  }
}
