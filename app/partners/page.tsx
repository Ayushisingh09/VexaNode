"use client"

import { motion } from "framer-motion"
import { ShieldCheck, Server, ExternalLink, Music2, Radio, Waves, ChevronRight, Mic2 } from "lucide-react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Image from "next/image"
import { useState } from "react"

const partners = [
  {
    id: "1234592539324059709",
    name: "Nothing",
    stats: "5.3k+ Servers",
    type: "Music Bot",
    desc: "Crystal-clear audio streaming powered by VexaNode's premium Lavalink infrastructure. Zero buffering, maximum vibe.",
    accent: "#3b82f6",
    accentClass: "blue",
  },
  {
    id: "1124681788070055967",
    name: "Nazha",
    stats: "1.3m+ Users",
    type: "Music Bot",
    desc: "Serving over a million listeners with studio-quality playback and 99.9% uptime across VexaNode nodes.",
    accent: "#a855f7",
    accentClass: "purple",
  },
  {
    id: "1380994881731952741",
    name: "Flixo",
    stats: "1.8k+ Servers",
    type: "Music Bot",
    desc: "Low-latency music delivery engineered for gaming communities. Drop the beat, not the connection.",
    accent: "#06b6d4",
    accentClass: "cyan",
  }
]

function BotAvatar({ id, name, accent }: { id: string; name: string; accent: string }) {
  const [errored, setErrored] = useState(false)
  const src = `https://cdn.discordapp.com/avatars/${id}/avatar.webp?size=128`

  if (errored) {
    return (
      <div
        className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-black flex-shrink-0"
        style={{ background: `${accent}22`, border: `1.5px solid ${accent}44`, color: accent }}
      >
        {name[0]}
      </div>
    )
  }

  return (
    <div className="relative w-20 h-20 flex-shrink-0">
      <Image
        src={src}
        alt={name}
        width={80}
        height={80}
        className="rounded-2xl object-cover"
        onError={() => setErrored(true)}
        unoptimized
      />
      <div
        className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-[#0a0b0f] flex items-center justify-center"
        style={{ background: accent }}
      >
        <Music2 className="w-2.5 h-2.5 text-white" />
      </div>
    </div>
  )
}

// Animated equalizer bars
function EqBars({ accent }: { accent: string }) {
  return (
    <div className="flex items-end gap-[3px] h-6">
      {[0.4, 0.9, 0.6, 1, 0.7, 0.5, 0.85].map((h, i) => (
        <motion.div
          key={i}
          className="w-[3px] rounded-full"
          style={{ background: accent, opacity: 0.7 }}
          animate={{ scaleY: [h, h * 0.4, h * 1.1, h * 0.6, h] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.12,
            ease: "easeInOut",
          }}
          initial={{ scaleY: h }}
        />
      ))}
    </div>
  )
}

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-[#080910] text-white selection:bg-blue-500/30 overflow-x-hidden">
      <Navbar />

      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-blue-600/5 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-purple-600/5 blur-[120px]" />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <main className="relative z-10 pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-blue-600/10 text-blue-400 text-xs font-bold px-4 py-1.5 rounded-full border border-blue-500/20 mb-5 tracking-widest uppercase"
          >
            <Radio className="w-3 h-3" />
            VexaNode Ecosystem
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black mb-5 orbitron-font leading-none tracking-tight"
          >
            Trusted{" "}
            <span
              className="relative inline-block"
              style={{
                background: "linear-gradient(135deg, #3b82f6 0%, #a855f7 50%, #06b6d4 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Partners
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 max-w-xl mx-auto text-base leading-relaxed"
          >
            The best music bots on Discord run on VexaNode. Premium Lavalink nodes, zero downtime, perfect audio — every time.
          </motion.p>

          {/* Live waveform decoration */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-2 mt-8"
          >
            <div className="h-px w-24 bg-gradient-to-r from-transparent to-blue-500/40" />
            <EqBars accent="#3b82f6" />
            <div className="h-px w-24 bg-gradient-to-l from-transparent to-blue-500/40" />
          </motion.div>
        </div>

        {/* Partner Cards */}
        <div className="flex flex-col gap-5 mb-28">
          {partners.map((partner, idx) => (
            <motion.div
              key={partner.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.12 + 0.3, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ x: 6 }}
              className="group relative flex items-center gap-6 rounded-2xl px-7 py-6 overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${partner.accent}08 0%, transparent 60%)`,
                border: `1px solid ${partner.accent}20`,
              }}
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(ellipse at left center, ${partner.accent}0d 0%, transparent 60%)` }}
              />

              {/* Left accent bar */}
              <div
                className="absolute left-0 top-6 bottom-6 w-[3px] rounded-r-full"
                style={{ background: `linear-gradient(to bottom, ${partner.accent}, ${partner.accent}44)` }}
              />

              {/* Avatar */}
              <BotAvatar id={partner.id} name={partner.name} accent={partner.accent} />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-xl font-bold tracking-tight">{partner.name}</h3>
                  <span
                    className="text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest"
                    style={{
                      background: `${partner.accent}18`,
                      color: partner.accent,
                      border: `1px solid ${partner.accent}30`,
                    }}
                  >
                    {partner.type}
                  </span>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 max-w-lg">
                  {partner.desc}
                </p>
              </div>

              {/* Stats */}
              <div className="hidden sm:flex flex-col items-center gap-1 flex-shrink-0 px-6">
                <EqBars accent={partner.accent} />
                <div className="flex items-center gap-1.5 mt-2">
                  <Server className="w-3.5 h-3.5" style={{ color: partner.accent }} />
                  <span className="text-sm font-bold text-white">{partner.stats}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Verified</span>
                </div>
              </div>

              {/* CTA */}
              <a
                href={`https://discord.com/application-directory/${partner.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 p-3 rounded-xl transition-all duration-200"
                style={{
                  background: `${partner.accent}15`,
                  border: `1px solid ${partner.accent}25`,
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = partner.accent
                  el.style.borderColor = partner.accent
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = `${partner.accent}15`
                  el.style.borderColor = `${partner.accent}25`
                }}
              >
                <ExternalLink className="w-4 h-4 text-gray-300" />
              </a>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="relative rounded-3xl p-12 text-center overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 40%, #0f172a 100%)",
            border: "1px solid rgba(59,130,246,0.25)",
          }}
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 80% 20%, #a855f7 0%, transparent 40%)`,
            }}
          />

          <div className="relative z-10">
            <div className="flex items-center justify-center gap-2 mb-5">
              <Mic2 className="w-6 h-6 text-blue-300" />
              <span className="text-blue-300 text-sm font-bold tracking-widest uppercase">Partner Program</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black mb-4 orbitron-font text-white leading-tight">
              Power Your Bot with<br />Premium Lavalink
            </h2>
            <p className="text-blue-200/70 max-w-lg mx-auto mb-8 text-sm leading-relaxed">
              Running a music bot? Get enterprise Lavalink nodes, dedicated bandwidth, and priority support. Partner with VexaNode and deliver flawless audio at scale.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="https://discord.vexanode.cloud"
                className="bg-white text-blue-700 px-8 py-3.5 rounded-xl font-bold hover:bg-blue-50 transition-all flex items-center gap-2 text-sm"
              >
                Apply via Discord
                <ChevronRight className="w-4 h-4" />
              </a>
              <a
                href="https://vexanode.cloud"
                className="bg-white/10 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-white/20 transition-all flex items-center gap-2 text-sm border border-white/10"
              >
                <Waves className="w-4 h-4" />
                View Nodes
              </a>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}
