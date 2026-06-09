import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { createClient } from "@/lib/supabase"
import { getUserOrders } from "@/lib/db"

export async function GET() {
  const session = await getServerSession(authOptions) as any
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const supabase = await createClient()

    // 1. Fetch user data
    const { data: user, error: userErr } = await supabase
      .from("users")
      .select("id, name, email, image, password")
      .eq("id", session.user.id)
      .maybeSingle()

    if (userErr || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // 2. Fetch profile data
    const { data: profile, error: profileErr } = await supabase
      .from("profiles")
      .select("joined_at, status")
      .eq("id", session.user.id)
      .maybeSingle()

    // 3. Fetch linked accounts
    const { data: accounts, error: accErr } = await supabase
      .from("accounts")
      .select("provider")
      .eq("userId", session.user.id)

    // 4. Fetch orders
    const orders = await getUserOrders(session.user.id)

    // Calculate stats
    const approvedOrders = orders.filter((o: any) => o.status === "Approved")
    const orderCount = orders.length
    
    // Calculate total spent in INR (parse standard amounts)
    let totalSpent = 0
    approvedOrders.forEach((o: any) => {
      const parsedAmount = parseFloat(o.amount.replace(/[^0-9.]/g, ''))
      if (!isNaN(parsedAmount)) {
        if (o.amount.includes("$")) {
          totalSpent += Math.ceil(parsedAmount * 83)
        } else if (o.amount.includes("€")) {
          totalSpent += Math.ceil(parsedAmount * 90)
        } else if (o.amount.includes("£")) {
          totalSpent += Math.ceil(parsedAmount * 105)
        } else {
          totalSpent += parsedAmount
        }
      }
    })

    const joinedAt = profile?.joined_at || new Date().toISOString()

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image ? `/api/user/avatar-img?id=${user.id}&v=${Date.now()}` : null,
        hasPassword: !!user.password,
      },
      profile: {
        joined_at: joinedAt,
        status: profile?.status || "Active",
      },
      orders,
      linkedAccounts: accounts?.map((a: any) => a.provider) || [],
      stats: {
        totalSpent,
        orderCount,
        joinDate: joinedAt,
        lastLogin: new Date().toISOString(),
      }
    })
  } catch (error) {
    console.error("User data API error:", error)
    return NextResponse.json({ error: "Database error" }, { status: 500 })
  }
}
