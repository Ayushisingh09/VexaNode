import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getTicketById, getTicketReplies } from "@/lib/db"

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions) as any
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { id } = await params
    const ticket = await getTicketById(id)
    
    // Check ownership or admin
    const isAdmin = session?.user?.isAdmin || process.env.NEXT_PUBLIC_ADMIN_USER_IDS?.split(',').map(id => id.trim()).includes(session?.user?.id || "")
    if (ticket.user_id !== session.user.id && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const replies = await getTicketReplies(id)
    return NextResponse.json({ ticket, replies })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch ticket" }, { status: 500 })
  }
}
