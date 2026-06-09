import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { createClient } from "@/lib/supabase"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions) as any
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { currentPassword, newPassword } = await req.json()

    if (!newPassword || typeof newPassword !== "string" || newPassword.length < 6) {
      return NextResponse.json({ error: "New password must be at least 6 characters long" }, { status: 400 })
    }

    const supabase = await createClient()

    // Retrieve user record to check current password
    const { data: user, error: userErr } = await supabase
      .from("users")
      .select("password")
      .eq("id", session.user.id)
      .maybeSingle()

    if (userErr || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // If a password already exists, require the correct current password
    if (user.password) {
      if (!currentPassword) {
        return NextResponse.json({ error: "Current password is required" }, { status: 400 })
      }
      const isValid = await bcrypt.compare(currentPassword, user.password)
      if (!isValid) {
        return NextResponse.json({ error: "Incorrect current password" }, { status: 400 })
      }
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Save the new password
    const { error: updateErr } = await supabase
      .from("users")
      .update({ password: hashedPassword })
      .eq("id", session.user.id)

    if (updateErr) throw updateErr

    return NextResponse.json({ success: true, message: "Password updated successfully" })
  } catch (error: any) {
    console.error("Change password error:", error)
    return NextResponse.json({ error: error.message || "Failed to update password" }, { status: 500 })
  }
}
