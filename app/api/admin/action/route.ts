import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { banUser, deleteOrder, updateOrderStatus, updateTicketStatus } from "@/lib/db"
import { adminActionSchema } from "@/lib/validate"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions) as any
  const isAdmin = process.env.NEXT_PUBLIC_ADMIN_USER_IDS?.split(',').includes(session?.user?.id || "")

  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const result = adminActionSchema.safeParse(body)
    
    if (!result.success) {
      return NextResponse.json({ error: "Invalid request data", details: result.error.format() }, { status: 400 })
    }

    const { type, id, status } = result.data

    switch (type) {
      case "BAN_USER":
        await banUser(id)
        break
      case "DELETE_ORDER":
        await deleteOrder(id)
        break
      case "UPDATE_ORDER_STATUS":
        if (status) await updateOrderStatus(id, status)
        break
      case "UPDATE_TICKET_STATUS":
        if (status) await updateTicketStatus(id, status)
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
