"use client"

import { signIn, useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { Disc as Discord, ShieldCheck, Zap, Globe, ChevronRight, Lock } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function LoginPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

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

  return (
    <div className="min-h-screen bg-[#050507] text-white flex flex-col justify-center items-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 blur-[160px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 blur-[160px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 rounded-[40px] p-8 md:p-12 backdrop-blur-xl shadow-2xl"
        >
          <div className="text-center mb-10">
            <Link href="/" className="inline-flex items-center gap-3 mb-8 group">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                <span className="text-2xl font-bold italic">V</span>
              </div>
              <h1 className="text-2xl font-bold orbitron-font tracking-tighter">VexaNode</h1>
            </Link>
            <h2 className="text-2xl font-bold mb-2 orbitron-font">Welcome Back</h2>
            <p className="text-sm text-gray-500">Sign in to your VexaNode dashboard.</p>
          </div>

          <div className="space-y-4 mb-10">
            <button 
              onClick={() => signIn("discord")}
              className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-500/10"
            >
              <Discord className="w-5 h-5" />
              Sign in with Discord
            </button>
            <div className="flex items-center gap-4 py-2">
              <div className="h-px bg-white/5 flex-1" />
              <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Secure OAuth</span>
              <div className="h-px bg-white/5 flex-1" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-10">
             <div className="p-4 bg-white/5 border border-white/5 rounded-2xl text-center group hover:border-blue-500/30 transition-all">
                <ShieldCheck className="w-5 h-5 text-blue-500 mx-auto mb-2" />
                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Safe Login</p>
             </div>
             <div className="p-4 bg-white/5 border border-white/5 rounded-2xl text-center group hover:border-blue-500/30 transition-all">
                <Lock className="w-5 h-5 text-blue-500 mx-auto mb-2" />
                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Encrypted</p>
             </div>
          </div>

          <p className="text-[10px] text-center text-gray-600 font-medium leading-relaxed px-4">
            By signing in, you agree to our <Link href="/terms-of-services" className="text-blue-500 hover:underline">Terms of Service</Link> and <Link href="/privacy-policy" className="text-blue-500 hover:underline">Privacy Policy</Link>.
          </p>
        </motion.div>

        <Link 
          href="/" 
          className="mt-8 flex items-center justify-center gap-2 text-xs font-bold text-gray-500 hover:text-white transition-all group"
        >
          Back to Homepage
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  )
}
