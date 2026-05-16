import NextAuth from "next-auth"
import DiscordProvider from "next-auth/providers/discord"
import { CustomSupabaseAdapter } from "@/lib/auth-adapter"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseSecret = process.env.SUPABASE_SERVICE_ROLE_KEY

const handler = NextAuth({
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID || "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET || "",
      authorization: { params: { scope: 'identify email' } },
    }),
  ],
  // Only add adapter if keys exist, otherwise fallback to local/mock session
  ...(supabaseUrl && supabaseSecret ? {
    adapter: CustomSupabaseAdapter({
      url: supabaseUrl,
      secret: supabaseSecret,
    }),
  } : {}),
  session: {
    strategy: "database", // Force database sessions since we have an adapter
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async session({ session, user }: any) {
      if (session?.user) {
        session.user.id = user.id
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }
