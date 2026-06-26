"use client"

import { signIn, useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { ShieldCheck, Lock, Mail, Loader2, ChevronRight, AlertTriangle, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import Navbar from "../components/Navbar"

const GoogleIcon = () => (
  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      fill="#EA4335"
    />
  </svg>
)

const DiscordIcon = () => (
  <svg className="w-4 h-4 mr-2 fill-current" viewBox="0 0 127.14 96.36">
    <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.86,54.65,1,77.53A105.73,105.73,0,0,0,32,96.36a77.7,77.7,0,0,0,6.63-10.85,68.43,68.43,0,0,1-10.5-5c.9-.66,1.8-1.34,2.66-2a75.58,75.58,0,0,0,72.48,0c.86.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.5,5,77.89,77.89,0,0,0,6.63,10.85,105.73,105.73,0,0,0,31-18.83C129.87,50.22,123.63,27.35,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.83,46,53.83,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.07,46,96.07,53,91,65.69,84.69,65.69Z" />
  </svg>
)

function LoginFormContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [successMsg, setSuccessMsg] = useState("")
  const [loading, setLoading] = useState(false)
  const [authType, setAuthType] = useState<"discord" | "google" | "credentials" | null>(null)

  useEffect(() => {
    const errorParam = searchParams.get("error")
    const registeredParam = searchParams.get("registered")
    if (errorParam) {
      if (errorParam === "OAuthAccountNotLinked") {
        setErrorMsg("This email is registered with another login provider. Please sign in with Google or Discord.")
      } else {
        setErrorMsg("Authentication failed. Please check your credentials.")
      }
    }
    if (registeredParam) {
      setSuccessMsg("Account created! Please sign in below.")
    }
  }, [searchParams])

  useEffect(() => {
    if (status === "authenticated") {
      const cart = localStorage.getItem('vexa_cart_items')
      if (cart && JSON.parse(cart).length > 0) {
        router.push("/dashboard/checkout")
      } else {
        router.push("/dashboard")
      }
    }
  }, [status, router])

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setErrorMsg("Please fill in all fields")
      return
    }

    setLoading(true)
    setAuthType("credentials")
    setErrorMsg("")
    setSuccessMsg("")

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (res?.error) {
        setErrorMsg(res.error || "Invalid email or password")
        setLoading(false)
        setAuthType(null)
      } else {
        router.refresh()
      }
    } catch (err) {
      setErrorMsg("Something went wrong. Please try again.")
      setLoading(false)
      setAuthType(null)
    }
  }

  const handleOAuthSignIn = (provider: "discord" | "google") => {
    setLoading(true)
    setAuthType(provider)
    setErrorMsg("")
    setSuccessMsg("")
    signIn(provider)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full bg-[#0d0e14]/40 border border-white/[0.06] rounded-3xl p-6 md:p-8 backdrop-blur-2xl shadow-[0_30px_70px_rgba(0,0,0,0.8),0_0_50px_rgba(0,163,255,0.03)] relative overflow-hidden"
    >
      {/* Light border beam running along the top */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#00a3ff]/40 to-transparent" />

      <div className="text-center mb-6 relative z-10 flex flex-col items-center">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-4 group/logo">
          <Image
            src="/logo.png"
            alt="VexaNode Logo"
            width={36}
            height={36}
            className="w-9 h-9 drop-shadow-[0_0_12px_rgba(0,163,255,0.4)] group-hover/logo:scale-105 transition-transform duration-300"
          />
          <span className="text-xl font-black orbitron-font tracking-tighter text-white uppercase transition-colors">
            Vexa<span className="text-[#00a3ff]">Node</span>
          </span>
        </Link>
        <h2 className="text-lg font-bold orbitron-font text-white mb-1">Welcome Back</h2>
        <p className="text-[11px] text-gray-400">Access your high-performance hosting console</p>
      </div>

      {errorMsg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2.5 text-red-400 text-xs leading-relaxed"
        >
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{errorMsg}</span>
        </motion.div>
      )}

      {successMsg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start gap-2.5 text-emerald-400 text-xs leading-relaxed"
        >
          <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{successMsg}</span>
        </motion.div>
      )}

      {/* Email & Password Form */}
      <form onSubmit={handleCredentialsSubmit} className="space-y-3 mb-4 relative z-10">
        <div className="relative group/input">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within/input:text-[#00a3ff] transition-colors" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl py-3 pl-11 pr-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00a3ff]/40 focus:ring-1 focus:ring-[#00a3ff]/20 hover:bg-white/[0.05] transition-all duration-200"
            placeholder="Email Address"
            disabled={loading}
            required
          />
        </div>

        <div className="relative group/input">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within/input:text-[#00a3ff] transition-colors" />
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl py-3 pl-11 pr-11 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00a3ff]/40 focus:ring-1 focus:ring-[#00a3ff]/20 hover:bg-white/[0.05] transition-all duration-200"
            placeholder="Password"
            disabled={loading}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors focus:outline-none cursor-pointer"
          >
            {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Remember me & Forgot link */}
        <div className="flex items-center justify-between text-[11px] px-1 pb-1">
          <button
            type="button"
            onClick={() => setRememberMe(!rememberMe)}
            className="flex items-center gap-2 text-gray-400 hover:text-gray-300 transition-colors focus:outline-none cursor-pointer"
          >
            {rememberMe ? (
              <span className="w-3.5 h-3.5 rounded bg-[#00a3ff] text-white flex items-center justify-center text-[9px] font-bold">âœ“</span>
            ) : (
              <span className="w-3.5 h-3.5 rounded border border-white/20 bg-white/5" />
            )}
            Remember me
          </button>
          <Link href="/contact" className="text-[#00a3ff] hover:underline font-medium">
            Forgot?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#00a3ff] hover:bg-[#1c78a2] disabled:opacity-50 text-white py-3 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(0,163,255,0.25)] hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
        >
          {loading && authType === "credentials" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      <div className="flex items-center gap-3 py-1 mb-4 relative z-10">
        <div className="h-px bg-white/5 flex-1" />
        <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Or</span>
        <div className="h-px bg-white/5 flex-1" />
      </div>

      {/* Social Logins */}
      <div className="grid grid-cols-2 gap-3 mb-5 relative z-10">
        <button
          onClick={() => handleOAuthSignIn("google")}
          disabled={loading}
          className="bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.08] text-white py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center hover:border-white/20 disabled:opacity-50 cursor-pointer"
        >
          {loading && authType === "google" ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <GoogleIcon />
          )}
          Google
        </button>

        <button
          onClick={() => handleOAuthSignIn("discord")}
          disabled={loading}
          className="bg-[#5865F2] hover:bg-[#4d59d6] text-white py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center hover:shadow-[0_0_15px_rgba(88,101,242,0.15)] disabled:opacity-50 cursor-pointer"
        >
          {loading && authType === "discord" ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <DiscordIcon />
          )}
          Discord
        </button>
      </div>

      <div className="text-center text-[11px] text-gray-400 relative z-10">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-[#00a3ff] font-semibold hover:underline">
          Register
        </Link>
      </div>
    </motion.div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#050507] text-white flex flex-col relative overflow-hidden">
      <Navbar />

      {/* Dynamic Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 40, -20, 0],
            y: [0, -40, 20, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-[#00a3ff]/5 blur-[150px] rounded-full"
        />
        <motion.div
          animate={{
            x: [0, -40, 30, 0],
            y: [0, 50, -30, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-purple-600/5 blur-[150px] rounded-full"
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.06] mix-blend-overlay" />
      </div>

      <div className="flex-1 flex flex-col justify-center items-center p-6 pt-32 pb-12 relative z-10 w-full max-w-[370px] mx-auto">
        <Suspense
          fallback={
            <div className="bg-[#0d0e14]/50 border border-white/10 rounded-[32px] p-8 backdrop-blur-xl flex flex-col items-center justify-center min-h-[350px] w-full">
              <Loader2 className="w-8 h-8 text-[#00a3ff] animate-spin" />
            </div>
          }
        >
          <LoginFormContent />
        </Suspense>

        <p className="text-[10px] text-center text-gray-600 font-medium leading-relaxed px-4 mt-6">
          By signing in, you agree to our <Link href="/terms-of-services" className="text-[#00a3ff]/80 hover:underline">Terms of Service</Link> &amp; <Link href="/privacy-policy" className="text-[#00a3ff]/80 hover:underline">Privacy Policy</Link>
        </p>

        <Link
          href="/"
          className="mt-6 flex items-center justify-center gap-2 text-xs font-bold text-gray-500 hover:text-white transition-all group"
        >
          Back to Homepage
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  )
}
