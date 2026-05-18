import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getTickets, createTicket } from "@/lib/db"
import { ticketSchema } from "@/lib/validate"

export async function GET() {
  const session = await getServerSession(authOptions) as any
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const tickets = await getTickets(session.user.id)
    return NextResponse.json({ tickets })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions) as any
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await req.json()
    const result = ticketSchema.safeParse(body)
    
    if (!result.success) {
      return NextResponse.json({ error: "Invalid request data", details: result.error.format() }, { status: 400 })
    }

    const { subject, message, type, priority } = result.data
    const ticket = await createTicket({
      user_id: session.user.id,
      subject,
      message,
      type,
      priority: priority || 'Normal',
      status: 'Open'
    })
    return NextResponse.json({ ticket })
  } catch (error: any) {
    console.error("Ticket creation error:", error);
    return NextResponse.json({ error: error.message || "Failed to create ticket", dbError: error }, { status: 500 })
  }
}
