"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Mail, Phone, Globe, Shield, MessageSquare, ArrowRight, Github, Twitter, Instagram } from "lucide-react"
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
        { name: "About VexaNode", href: "/about" },
        { name: "Company Blog", href: "/blogs" },
        { name: "Status Page", href: "https://status.vexanode.cloud" },
        { name: "Contact Us", href: "/contact" },
      ]
    },
    {
      title: "Legal & Support",
      links: [
        { name: "Terms of Service", href: "/terms-of-services" },
        { name: "Privacy Policy", href: "/privacy-policy" },
        { name: "Knowledge Base", href: "/docs" },
        { name: "Affiliate Program", href: "/affiliates" },
      ]
    }
  ]

  const socialLinks = [
    { icon: FaDiscord, href: "#", color: "hover:text-[#5865F2]" },
    { icon: Twitter, href: "#", color: "hover:text-[#1DA1F2]" },
    { icon: Github, href: "#", color: "hover:text-white" },
    { icon: Instagram, href: "#", color: "hover:text-[#E4405F]" },
  ]

  return (
    <footer className="relative bg-[#0a0b0f] pt-24 pb-12 overflow-hidden border-t border-white/5">
      {/* Background Decor */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Newsletter / CTA Section */}
        <div className="bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border border-white/10 rounded-3xl p-8 md:p-12 mb-20 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 orbitron-font">Ready to experience speed?</h3>
            <p className="text-gray-400">Join 1000+ customers who trust VexaNode for their hosting needs.</p>
          </div>
          <div className="flex w-full md:w-auto gap-3">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="bg-white/5 border border-white/10 rounded-xl px-6 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors flex-1 md:w-64"
            />
            <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 group whitespace-nowrap">
              Subscribe
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-20">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <div className="flex items-center gap-3">
                <Image src="/logo.png" alt="VexaNode" width={40} height={40} className="h-10 w-auto" />
                <span className="text-2xl font-bold text-white orbitron-font tracking-tight">
                  Vexa<span className="text-blue-500">Node</span>
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
                  className={`w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 ${social.color} transition-all hover:border-blue-500/50 hover:bg-blue-500/10`}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {sections.map((section, idx) => (
            <div key={idx}>
              <h4 className="text-white font-bold mb-6 orbitron-font text-sm uppercase tracking-wider">{section.title}</h4>
              <ul className="space-y-4">
                {section.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <Link href={link.href} className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-2 group">
                      <div className="w-1 h-1 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
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
            © {new Date().getFullYear()} VexaNode. Built with ❤️ for the hosting community.
          </div>
          
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
              <span className="text-gray-400 text-xs font-medium">All systems operational</span>
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
