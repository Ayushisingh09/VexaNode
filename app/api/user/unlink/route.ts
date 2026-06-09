import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { createClient } from "@/lib/supabase"

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions) as any
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const provider = searchParams.get("provider")

  if (!provider || (provider !== "google" && provider !== "discord")) {
    return NextResponse.json({ error: "Invalid provider specified" }, { status: 400 })
  }

  try {
    const supabase = await createClient()

    // 1. Fetch user to check password status
    const { data: user, error: userErr } = await supabase
      .from("users")
      .select("password")
      .eq("id", session.user.id)
      .maybeSingle()

    if (userErr || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // 2. Fetch all linked accounts
    const { data: accounts, error: accErr } = await supabase
      .from("accounts")
      .select("provider")
      .eq("userId", session.user.id)

    if (accErr) throw accErr

    const hasPassword = !!user.password
    const linkedProviders = accounts?.map((a: any) => a.provider) || []

    // Security check: must have password OR at least one other provider left
    const otherProvidersCount = linkedProviders.filter((p: string) => p !== provider).length
    
    if (!hasPassword && otherProvidersCount === 0) {
      return NextResponse.json({ 
        error: "Cannot disconnect the only sign-in method. Please set a password in the Security tab first." 
      }, { status: 400 })
    }

    // 3. Delete the account connection
    const { error: deleteErr } = await supabase
      .from("accounts")
      .delete()
      .match({ userId: session.user.id, provider })

    if (deleteErr) throw deleteErr

    return NextResponse.json({ success: true, message: `${provider} successfully unlinked` })
  } catch (error: any) {
    console.error("Account unlink error:", error)
    return NextResponse.json({ error: error.message || "Failed to unlink account" }, { status: 500 })
  }
}
