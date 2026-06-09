import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { createClient } from "@/lib/supabase"

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions) as any
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const supabase = await createClient()

    // Delete the user from public.users table (cascades to profiles, orders, accounts, etc.)
    const { error } = await supabase
      .from("users")
      .delete()
      .eq("id", session.user.id)

    if (error) throw error

    return NextResponse.json({ success: true, message: "Account deleted successfully" })
  } catch (error: any) {
    console.error("Delete account error:", error)
    return NextResponse.json({ error: error.message || "Failed to delete account" }, { status: 500 })
  }
}
