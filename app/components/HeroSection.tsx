'use client'

import { motion } from "framer-motion"
import { ArrowRight, Sparkles, Server, Activity, Users, Star } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "../contexts/LanguageContext"
import navigationConfig from "../config/sections/navigation.json"

export default function HeroSection() {
  const { t } = useLanguage()
  const banner = navigationConfig.banner

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#030408] overflow-hidden pt-32 pb-20">
      {/* Background brand glow blobs - optimized with will-change for lag-free animation */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#228dbd]/5 rounded-full blur-[130px] pointer-events-none will-change-transform animate-pulse" style={{ animationDuration: '6s' }} />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[700px] h-[700px] bg-[#228dbd]/5 rounded-full blur-[130px] pointer-events-none will-change-transform animate-pulse" style={{ animationDuration: '8s' }} />
      
      {/* Cyberpunk grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
        {/* Trustpilot Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 hover:border-[#228dbd]/40 transition-all duration-300"
        >
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-green-500 text-green-500" />
            ))}
          </div>
          <span className="text-xs text-gray-300 font-semibold tracking-wide flex items-center gap-1.5">
            Rated 4.8/5 on Trustpilot <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
          </span>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mb-8"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 tracking-tight orbitron-font leading-[1.1] uppercase">
            Experience the <br />
            <span className="text-[#228dbd] text-neon-glow-brand">
              universe of speed
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed mb-12 quicksand-font">
            <span className="font-bold text-white">VexaNode</span> provides cutting-edge game, bot, and cloud hosting server architectures. Built for developers, communities, and enterprises demanding instant scalability and zero downtime.
          </p>

          {/* Action buttons - Gradient removed, using solid brand color */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
            <Link
              href="#pricing"
              className="bg-[#228dbd] hover:bg-[#1a6e94] text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-[0_0_20px_rgba(34,141,189,0.3)] hover:shadow-[0_0_35px_rgba(34,141,189,0.5)] flex items-center gap-3 group"
            >
              Get Your Server Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              href="/about"
              className="bg-white/5 border border-white/10 hover:border-[#228dbd]/50 hover:bg-[#228dbd]/10 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 backdrop-blur-md flex items-center gap-2"
            >
              Why VexaNode?
            </Link>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mb-20"
        >
          {[
            { icon: Server, num: "750+", label: "Servers Provisioned" },
            { icon: Activity, num: "99.99%", label: "Uptime Guarantee SLA" },
            { icon: Users, num: "250+", label: "Active Communities" },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-[#0b0c16]/40 backdrop-blur-md border border-white/5 p-6 rounded-2xl hover:border-[#228dbd]/30 hover:bg-[#0b0c16]/60 transition-all duration-300 text-center flex flex-col items-center group"
            >
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <stat.icon className="w-5 h-5 text-[#228dbd]" />
              </div>
              <div className="text-3xl font-black text-white mb-1 orbitron-font tracking-tight">{stat.num}</div>
              <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Promo Pill Banner */}
        {banner.show && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative inline-block"
          >
            <div className="text-[10px] font-bold text-[#228dbd] tracking-[0.2em] mb-4 uppercase">
              Limited Time Offer!
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-[#228dbd] rounded-2xl blur opacity-20 group-hover:opacity-35 transition-opacity" />
              <div className="relative bg-[#0c0e1a]/90 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-3 flex items-center gap-3 text-sm text-gray-300">
                <Sparkles className="w-4 h-4 text-[#228dbd]" />
                <p>
                  Use code <span className="text-white font-bold tracking-wider">{banner.couponCode}</span> for 10% off your first month!
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Decorative Border line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#228dbd]/25 to-transparent" />
    </div>
  )
}
