import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { createClient } from "@/lib/supabase"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions) as any
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { image } = await req.json()
    if (!image || typeof image !== "string") {
      return NextResponse.json({ error: "Avatar image content is required" }, { status: 400 })
    }

    // Validate size to prevent database overload (e.g. limit to 2.5MB base64)
    if (image.length > 3.5 * 1024 * 1024) {
      return NextResponse.json({ error: "Image size too large. Max size is 2.5MB." }, { status: 400 })
    }

    const supabase = await createClient()

    const { error: userErr } = await supabase
      .from("users")
      .update({ image: image })
      .eq("id", session.user.id)

    if (userErr) throw userErr

    return NextResponse.json({ success: true, message: "Avatar updated successfully" })
  } catch (error: any) {
    console.error("Avatar update error:", error)
    return NextResponse.json({ error: error.message || "Failed to update avatar" }, { status: 500 })
  }
}
