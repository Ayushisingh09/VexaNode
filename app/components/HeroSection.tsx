'use client'

import { motion } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "../contexts/LanguageContext"
import navigationConfig from "../config/sections/navigation.json"

export default function HeroSection() {
  const { t } = useLanguage()
  const banner = navigationConfig.banner

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#0a0b0f] overflow-hidden pt-20">
      {/* Blue Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 tracking-tight orbitron-font leading-[1.1]">
            Experience the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">universe of speed</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-12">
            <span className="font-bold text-white">VexaNode</span> provides high-performance hosting infrastructure with infinite scalability. Experience the universe of speed and reliability.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="/games?game=minecraft"
              className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:shadow-[0_0_50px_rgba(59,130,246,0.5)] flex items-center gap-3 group"
            >
              Get Your Server Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>

        {/* Promo Pill Banner */}
        {banner.show && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-20 relative inline-block"
          >
            <div className="text-[10px] font-bold text-gray-500 tracking-[0.2em] mb-4 uppercase">
              Limited Time Offer!
            </div>
            
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="relative bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-3 flex items-center gap-3 text-sm text-gray-300">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <p>
                  Use code <span className="text-white font-bold tracking-wider">{banner.couponCode}</span> for 10% off your first month!
                </p>
              </div>

              {/* Decorative "Clouds" from original design */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-white rounded-full blur-md opacity-20 animate-pulse" />
              <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-white rounded-full blur-sm opacity-10 animate-bounce" style={{ animationDuration: '3s' }} />
            </div>
          </motion.div>
        )}
      </div>

      {/* Background patterns */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  )
}
