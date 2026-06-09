import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { createClient } from "@/lib/supabase"

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions) as any
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { name } = await req.json()
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "Display name cannot be empty" }, { status: 400 })
    }

    const trimmedName = name.trim()
    const supabase = await createClient()

    // 1. Update public.users table
    const { error: userErr } = await supabase
      .from("users")
      .update({ name: trimmedName })
      .eq("id", session.user.id)

    if (userErr) throw userErr

    // 2. Update public.profiles table
    const { error: profileErr } = await supabase
      .from("profiles")
      .update({ name: trimmedName })
      .eq("id", session.user.id)

    if (profileErr) throw profileErr

    return NextResponse.json({ success: true, name: trimmedName })
  } catch (error: any) {
    console.error("Profile update error:", error)
    return NextResponse.json({ error: error.message || "Failed to update profile" }, { status: 500 })
  }
}
