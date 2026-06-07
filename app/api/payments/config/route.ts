import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getSetting } from "@/lib/settings"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const cashfreeSettings = await getSetting("cashfree", {
      enabled: false,
      appId: "",
      secretKey: "",
      sandbox: true
    })

    // Return ONLY public configuration properties
    return NextResponse.json({
      cashfree: {
        enabled: cashfreeSettings.enabled,
        appId: cashfreeSettings.appId,
        sandbox: cashfreeSettings.sandbox
      }
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to load payment configuration" }, { status: 500 })
  }
}
