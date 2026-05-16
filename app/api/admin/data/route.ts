import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { getAllData } from "@/lib/db"

export async function GET() {
  const session = await getServerSession() as any
  const isAdmin = process.env.NEXT_PUBLIC_ADMIN_USER_IDS?.split(',').includes(session?.user?.id || "")

  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { users, orders } = await getAllData()
    return NextResponse.json({ users, orders })
  } catch (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 })
  }
}
