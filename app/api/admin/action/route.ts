import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { banUser, deleteOrder, updateOrderStatus } from "@/lib/db"

export async function POST(req: Request) {
  const session = await getServerSession() as any
  const isAdmin = process.env.NEXT_PUBLIC_ADMIN_USER_IDS?.split(',').includes(session?.user?.id || "")

  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { type, id, status } = await req.json()

    switch (type) {
      case "BAN_USER":
        await banUser(id)
        break
      case "DELETE_ORDER":
        await deleteOrder(id)
        break
      case "UPDATE_ORDER_STATUS":
        await updateOrderStatus(id, status)
        break
      default:
        return NextResponse.json({ error: "Invalid action type" }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Admin Action Error:", error)
    return NextResponse.json({ error: error.message || "Action failed" }, { status: 500 })
  }
}
