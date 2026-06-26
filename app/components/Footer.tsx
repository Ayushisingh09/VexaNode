"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { ArrowRight, Github, Twitter, Instagram } from "lucide-react"
import { FaDiscord } from "react-icons/fa"
import { useLanguage } from "../contexts/LanguageContext"
import Link from "next/link"

export default function Footer() {
  const { t } = useLanguage()

  const sections = [
    {
      title: "Hosting Solutions",
      links: [
        { name: "Global Cloud VPS", href: "/vps" },
        { name: "Dedicated Servers", href: "/dedicated" },
        { name: "Minecraft Hosting", href: "/games?game=minecraft" },
        { name: "Bot Hosting", href: "/discord" },
        { name: "Lavalink Hosting", href: "/lavalink" },
      ]
    },
    {
      title: "Company",
      links: [
        { name: "Team & Management", href: "/team" },
        { name: "Our Partners", href: "/partners" },
        { name: "Company Blog", href: "/blogs" },
        { name: "Status Page", href: "https://status.vexanode.cloud" },
        { name: "Contact Us", href: "/contact" },
      ]
    },
    {
      title: "Agreements",
      links: [
        { name: "Terms of Service", href: "/terms-of-services" },
        { name: "Privacy Policy", href: "/privacy-policy" },
        { name: "Refund Policy", href: "/refund-policy" },
        { name: "Service Level Agreement", href: "/sla" },
        { name: "Acceptable Use (AUP)", href: "/aup" },
        { name: "Fair Usage (FUP)", href: "/fup" },
      ]
    }
  ]

  const socialLinks = [
    { icon: FaDiscord, href: "#", color: "hover:text-[#5865F2] hover:bg-[#5865F2]/10 hover:border-[#5865F2]/50" },
    { icon: Twitter, href: "#", color: "hover:text-[#1DA1F2] hover:bg-[#1DA1F2]/10 hover:border-[#1DA1F2]/50" },
    { icon: Github, href: "#", color: "hover:text-white hover:bg-white/10 hover:border-white/50" },
    { icon: Instagram, href: "#", color: "hover:text-[#E4405F] hover:bg-[#E4405F]/10 hover:border-[#E4405F]/50" },
  ]

  return (
    <footer className="relative bg-[#030408] pt-32 pb-12 overflow-hidden border-t border-white/5">
      {/* Background brand glow blob */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#00a3ff]/5 rounded-full blur-[120px] pointer-events-none will-change-transform" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-20">

          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <div className="flex items-center gap-3">
                <Image src="/logo.png" alt="VexaNode" width={40} height={40} className="h-10 w-auto" />
                <span className="text-2xl font-black text-white orbitron-font tracking-tight uppercase">
                  Vexa<span className="text-[#00a3ff]">Node</span>
                </span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-sm">
              Deploy your infrastructure in seconds on our high-performance cloud nodes. 
              Engineered for speed, reliability, and ultimate scalability.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, idx) => (
                <a 
                  key={idx} 
                  href={social.href} 
                  className={`w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 ${social.color} transition-all duration-300`}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {sections.map((section, idx) => (
            <div key={idx}>
              <h4 className="text-white font-bold mb-6 orbitron-font text-xs uppercase tracking-widest">{section.title}</h4>
              <ul className="space-y-4">
                {section.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <Link href={link.href} className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-2 group">
                      <div className="w-1 h-1 bg-[#00a3ff] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-gray-500 text-xs">
            Â© {new Date().getFullYear()} VexaNode. Built for the hosting community.
          </div>
          
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)] animate-pulse" />
              <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">All Systems Operational</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <Link href="/terms-of-services" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Support</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
