import { NextResponse } from "next/server"
import { getPteroUser, createPteroUser, createPteroServer } from "@/lib/pterodactyl"

export async function POST(req: Request) {
  try {
    const { email, username, planName, memory, disk, cpu } = await req.json()

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
