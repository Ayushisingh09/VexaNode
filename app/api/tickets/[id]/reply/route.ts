import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getTicketById, addTicketReply } from "@/lib/db"
import { replySchema } from "@/lib/validate"

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions) as any
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { id } = await params
    const body = await req.json()
    const result = replySchema.safeParse(body)
    
    if (!result.success) {
      return NextResponse.json({ error: "Invalid request data", details: result.error.format() }, { status: 400 })
    }

    const { message } = result.data

    const ticket = await getTicketById(id)
    const isAdmin = process.env.NEXT_PUBLIC_ADMIN_USER_IDS?.split(',').includes(session.user.id)
    
    if (ticket.user_id !== session.user.id && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const reply = await addTicketReply({
      ticket_id: id,
      user_id: session.user.id,
      message,
      is_admin: isAdmin || false
    })
    
    return NextResponse.json({ reply })
  } catch (error) {
    return NextResponse.json({ error: "Failed to add reply" }, { status: 500 })
  }
}
