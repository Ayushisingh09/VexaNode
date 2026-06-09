import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { createClient } from "@/lib/supabase"

export async function GET(req: Request) {
  const session = await getServerSession(authOptions) as any
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("userId") || searchParams.get("id") || session.user.id

  const isAdmin = session?.user?.isAdmin || process.env.NEXT_PUBLIC_ADMIN_USER_IDS?.split(',').map(id => id.trim()).includes(session?.user?.id || "") || false

  // Only allow users to view their own avatar, or admins to view any avatar
  if (userId !== session.user.id && !isAdmin) {
    return new Response("Forbidden", { status: 403 })
  }

  try {
    const supabase = await createClient()
    const { data: user, error } = await supabase
      .from("users")
      .select("image")
      .eq("id", userId)
      .maybeSingle()

    if (error || !user || !user.image) {
      return Response.redirect("https://cdn.discordapp.com/embed/avatars/0.png", 307)
    }

    const imageStr = user.image
    if (imageStr.startsWith("data:image/")) {
      const matches = imageStr.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/)
      if (matches && matches.length === 3) {
        const contentType = matches[1]
        const buffer = Buffer.from(matches[2], "base64")
        return new Response(buffer, {
          headers: {
            "Content-Type": contentType,
            "Cache-Control": "public, max-age=86400",
          },
        })
      }
    }

    if (imageStr.startsWith("http")) {
      return Response.redirect(imageStr, 307)
    }

    return Response.redirect("https://cdn.discordapp.com/embed/avatars/0.png", 307)
  } catch (error) {
    console.error("Avatar image serve error:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}
