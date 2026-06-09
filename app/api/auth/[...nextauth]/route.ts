import NextAuth, { NextAuthOptions } from "next-auth"
import DiscordProvider from "next-auth/providers/discord"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { CustomSupabaseAdapter } from "@/lib/auth-adapter"
import bcrypt from "bcryptjs"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseSecret = process.env.SUPABASE_SERVICE_ROLE_KEY

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID || "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET || "",
      authorization: { params: { scope: 'identify email' } },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password")
        }

        if (!supabaseUrl || !supabaseSecret) {
          throw new Error("Supabase environment variables are not configured")
        }

        const supabase = createClient(supabaseUrl, supabaseSecret, {
          auth: { persistSession: false }
        })

        const { data: user, error } = await supabase
          .from("users")
          .select("*")
          .eq("email", credentials.email)
          .maybeSingle()

        if (error || !user) {
          throw new Error("Invalid email or password")
        }

        if (!user.password) {
          throw new Error("This account is registered with a social provider. Please sign in using Discord or Google.")
        }

        const isValid = await bcrypt.compare(credentials.password, user.password)
        if (!isValid) {
          throw new Error("Invalid email or password")
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        }
      }
    })
  ],
  // Only add adapter if keys exist, otherwise fallback to local/mock session
  ...(supabaseUrl && supabaseSecret ? {
    adapter: CustomSupabaseAdapter({
      url: supabaseUrl,
      secret: supabaseSecret,
    }),
  } : {}),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id
        // Fetch is_admin from profiles table in Supabase
        if (supabaseUrl && supabaseSecret) {
          try {
            const supabase = createClient(supabaseUrl, supabaseSecret, {
              auth: { persistSession: false }
            })
            const { data: profile, error } = await supabase
              .from("profiles")
              .select("is_admin")
              .eq("id", user.id)
              .maybeSingle()
            if (!error && profile) {
              token.isAdmin = profile.is_admin || false
            } else {
              token.isAdmin = false
            }
          } catch (err) {
            console.error("Error fetching user profile in jwt callback:", err)
            token.isAdmin = false
          }
        } else {
          token.isAdmin = false
        }
      }
      return token
    },
    async session({ session, token }: any) {
      if (session?.user && token) {
        session.user.id = token.id as string
        session.user.isAdmin = token.isAdmin as boolean
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
