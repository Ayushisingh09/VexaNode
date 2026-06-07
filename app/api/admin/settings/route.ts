import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getSetting, setSetting } from "@/lib/settings"

export async function GET() {
  const session = await getServerSession(authOptions) as any
  const isAdmin = process.env.NEXT_PUBLIC_ADMIN_USER_IDS?.split(',').includes(session?.user?.id || "")

  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const cashfreeSettings = await getSetting("cashfree", {
      enabled: false,
      appId: "",
      secretKey: "",
      sandbox: true
    })
    
    // Detect storage provider dynamically
    let storageType = "Database"
    try {
      const { createClient } = require("@/lib/supabase")
      const supabase = await createClient()
      const { error } = await supabase.from('settings').select('key').limit(1)
      if (error && (error.code === 'PGRST116' || error.message?.includes('does not exist'))) {
        storageType = "Local File Fallback"
      }
    } catch (e) {
      storageType = "Local File Fallback"
    }

    return NextResponse.json({ 
      cashfree: cashfreeSettings,
      storage: storageType 
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions) as any
  const isAdmin = process.env.NEXT_PUBLIC_ADMIN_USER_IDS?.split(',').includes(session?.user?.id || "")

  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { enabled, appId, secretKey, sandbox } = body

    if (typeof enabled !== "boolean" || typeof sandbox !== "boolean") {
      return NextResponse.json({ error: "Invalid configuration types" }, { status: 400 })
    }

    await setSetting("cashfree", {
      enabled,
      appId: appId || "",
      secretKey: secretKey || "",
      sandbox
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Admin Settings Save Error:", error)
    return NextResponse.json({ error: error.message || "Failed to save settings" }, { status: 500 })
  }
}
