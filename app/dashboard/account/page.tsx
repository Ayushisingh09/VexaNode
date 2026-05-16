"use client"

import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { 
  User, 
  Mail, 
  Fingerprint, 
  ShieldCheck,
  Disc as Discord,
  CheckCircle2
} from "lucide-react"
import Image from "next/image"

export default function AccountPage() {
  const { data: session } = useSession()

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1 bg-white/5 border border-white/10 rounded-[32px] p-8 text-center flex flex-col items-center justify-center relative overflow-hidden group"
        >
          <div className="relative mb-6">
            <div className="absolute -inset-4 bg-blue-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            <Image 
              src={session?.user?.image || "https://cdn.discordapp.com/embed/avatars/0.png"} 
              alt="Avatar" 
              width={120} 
              height={120} 
              className="rounded-full border-4 border-white/10 relative z-10"
            />
          </div>
          <h2 className="text-2xl font-bold mb-1 orbitron-font">{session?.user?.name}</h2>
          <p className="text-xs text-gray-500 mb-6">{session?.user?.email}</p>
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-600/10 text-blue-500 text-[10px] font-bold rounded-full border border-blue-500/20 uppercase tracking-widest">
            <Discord className="w-3 h-3" />
            Discord Connected
          </div>
        </motion.div>

        {/* Details Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 bg-white/5 border border-white/10 rounded-[32px] p-8 md:p-10"
        >
          <h3 className="text-2xl font-bold mb-2 orbitron-font">Discord Account Details</h3>
          <p className="text-sm text-gray-500 mb-10">These details are fetched from Discord, not from fake local placeholders.</p>

          <div className="space-y-6">
            {[
              { label: "Username", value: session?.user?.name, icon: User },
              { label: "Display Name", value: session?.user?.name, icon: ShieldCheck },
              { label: "Email", value: session?.user?.email, icon: Mail },
              { label: "Discord User ID", value: session?.user?.id, icon: Fingerprint },
            ].map((field) => (
              <div key={field.label} className="group">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                  <field.icon className="w-3 h-3 text-blue-500" />
                  {field.label}
                </p>
                <div className="bg-[#050507] border border-white/5 rounded-2xl px-6 py-4 flex items-center justify-between group-hover:border-blue-500/30 transition-all">
                  <span className="text-sm font-bold text-gray-300">{field.value}</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 opacity-50" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
