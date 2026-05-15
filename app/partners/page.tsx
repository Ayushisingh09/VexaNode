"use client"

import { motion } from "framer-motion"
import { ShieldCheck, Users, Server, ExternalLink, Sparkles, ChevronRight, Handshake } from "lucide-react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Image from "next/image"

const partners = [
  {
    id: "1234592539324059709",
    name: "Nothing",
    stats: "5.3k+ Servers",
    type: "Music Bot",
    desc: "A high-quality Discord music bot powered by VexaNode's premium Lavalink infrastructure.",
    color: "blue"
  },
  {
    id: "1124681788070055967",
    name: "Nazha",
    stats: "1.3m+ Users",
    type: "Multi-purpose",
    desc: "A massive multi-purpose Discord bot serving over a million users with 99.9% uptime on VexaNode nodes.",
    color: "purple"
  },
  {
    id: "1380994881731952741",
    name: "Flixo",
    stats: "1.8k+ Servers",
    type: "Gaming Bot",
    desc: "Enhancing the gaming experience for thousands of communities with low-latency response times.",
    color: "blue"
  },
  {
    id: "1386199766907748403",
    name: "Fyrex",
    stats: "1.3k+ Servers",
    type: "Utility Bot",
    desc: "Powerful utility and moderation tools for modern Discord servers, hosted on our enterprise VPS.",
    color: "emerald"
  }
]

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-[#0a0b0f] text-white selection:bg-blue-500/30">
      <Navbar />

      <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block bg-blue-600/10 text-blue-500 text-xs font-bold px-4 py-1.5 rounded-full border border-blue-500/20 mb-4"
          >
            VexaNode Ecosystem
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold mb-6 orbitron-font"
          >
            Our Trusted <span className="text-blue-500">Partners</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto text-lg"
          >
            We are proud to power some of the largest and most innovative projects on Discord. Join our ecosystem of high-performance partners.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
          {partners.map((partner, idx) => (
            <motion.div
              key={partner.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 + 0.3 }}
              whileHover={{ y: -5 }}
              className="relative group bg-white/5 border border-white/10 rounded-[40px] p-8 overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Handshake className="w-32 h-32 text-white" />
              </div>

              <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                <div className="w-24 h-24 rounded-3xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  {/* Using a placeholder since we don't have the avatar hash, but ID is visible */}
                  <Users className="w-10 h-10 text-blue-500" />
                </div>

                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                    <h3 className="text-2xl font-bold">{partner.name}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded bg-${partner.color}-600/20 text-${partner.color}-400 border border-${partner.color}-500/20 uppercase`}>
                      {partner.type}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-4 leading-relaxed max-w-md">
                    {partner.desc}
                  </p>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
                    <div className="flex items-center gap-2">
                      <Server className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-bold text-white">{partner.stats}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      <span className="text-xs font-bold text-gray-500 uppercase">Verified Partner</span>
                    </div>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <a 
                    href={`https://discord.com/users/${partner.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-blue-600 hover:border-blue-500 transition-all block group/btn"
                  >
                    <ExternalLink className="w-5 h-5 text-gray-400 group-hover/btn:text-white" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Partnership CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-[40px] p-12 text-center shadow-2xl shadow-blue-500/20"
        >
          <Sparkles className="w-12 h-12 text-white mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4 orbitron-font text-white">Become a Partner</h2>
          <p className="text-blue-100 max-w-xl mx-auto mb-10">
            Do you run a large project or bot that needs high-performance hosting? We offer special discounts and enterprise support for our partners.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="https://discord.vexanode.cloud"
              className="bg-white text-blue-600 px-10 py-4 rounded-2xl font-bold hover:bg-blue-50 transition-all flex items-center gap-2"
            >
              Apply via Discord
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}
