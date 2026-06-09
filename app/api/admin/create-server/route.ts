import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getPteroUser, createPteroUser, createPteroServer } from "@/lib/pterodactyl"
import { adminCreateServerSchema } from "@/lib/validate"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions) as any
  const isAdmin = session?.user?.isAdmin || process.env.NEXT_PUBLIC_ADMIN_USER_IDS?.split(',').map(id => id.trim()).includes(session?.user?.id || "")

  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const result = adminCreateServerSchema.safeParse(body)
    
    if (!result.success) {
      return NextResponse.json({ error: "Invalid request data", details: result.error.format() }, { status: 400 })
    }

    const { email, username, planName, memory, disk, cpu } = result.data

    // 1. Check if user exists in Pterodactyl
    let pteroUser = await getPteroUser(email)

    if (!pteroUser) {
      // 2. Create user if doesn't exist
      const names = username.split(" ")
      pteroUser = await createPteroUser(
        email, 
        username.toLowerCase().replace(/\s/g, "_"), 
        names[0] || "User", 
        names[1] || "Vexa"
      )
    }

    // 3. Create server
    // Note: You need to map planName to specific Egg/Nest IDs
    // For demonstration, we use Nest 1, Egg 1 (Minecraft)
    const server = await createPteroServer(
      pteroUser.id,
      1, // Egg ID
      1, // Nest ID
      `${planName} - ${username}`,
      memory,
      disk,
      cpu
    )

    return NextResponse.json({ success: true, server })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
