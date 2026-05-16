import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { getTickets, createTicket } from "@/lib/db"

export async function GET() {
  const session = await getServerSession() as any
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const tickets = await getTickets(session.user.id)
    return NextResponse.json({ tickets })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await getServerSession() as any
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { subject, message, type, priority } = await req.json()
    const ticket = await createTicket({
      user_id: session.user.id,
      subject,
      message,
      type,
      priority: priority || 'Normal',
      status: 'Open'
    })
    return NextResponse.json({ ticket })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create ticket" }, { status: 500 })
  }
}
