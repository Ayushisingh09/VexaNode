"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronRight, Check, Zap, Cpu, HardDrive } from "lucide-react"
import Link from "next/link"
import { CustomIcons } from "./CustomIcons"
import { useCurrency } from "../contexts/CurrencyContext"

export default function PricingSection() {
  const { formatPrice } = useCurrency()
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly")
  
  const plans = [
    {
      id: 'database',
      title: "Database Hosting",
      description: "High-performance managed database hosting for MySQL, PostgreSQL, MongoDB & Redis.",
      price: 99,
      icon: CustomIcons.Database,
      iconBg: "bg-[#228dbd]/10",
      buttonText: "Get Database Hosting",
      href: "/databases",
      color: "blue",
      glowClass: "border-cyber-glow-brand",
      features: [
        "MySQL, PostgreSQL, MongoDB, Redis",
        "Gen4 NVMe Solid State Storage",
        "Automated Daily Backups",
        "Instant Control Panel Access",
        "Enterprise DDoS Protection"
      ],
      specs: { cpu: "Ryzen 9 9950X", ram: "Shared/Dedicated", storage: "PCIe 4.0 NVMe" }
    },
    {
      id: 'vps',
      title: "VPS Hosting",
      description: "Scalable virtual private servers with full root access, SSD storage, and 24/7 support.",
      price: 225,
      icon: CustomIcons.VPS,
      iconBg: "bg-[#228dbd]/10",
      buttonText: "Get VPS Hosting",
      href: "/vps",
      popular: true,
      color: "blue",
      glowClass: "border-cyber-glow-brand",
      features: [
        "Full Root/SSH Access",
        "Guaranteed Ryzen vCPU allocation",
        "Dedicated IPv4 Address",
        "Choice of Linux OS / Custom ISO",
        "Premium Low-Latency Transit"
      ],
      specs: { cpu: "Ryzen 9 7950X3D", ram: "DDR5 RAM Blocks", storage: "Enterprise NVMe SSD" }
    },
    {
      id: 'lavalink',
      title: "Lavalink Hosting",
      description: "High performance Lavalink hosting for Discord music bots with low latency and 24/7 uptime.",
      price: 49,
      icon: CustomIcons.Lavalink,
      iconBg: "bg-[#228dbd]/10",
      buttonText: "Get Lavalink Hosting",
      href: "/lavalink",
      color: "blue",
      glowClass: "border-cyber-glow-brand",
      features: [
        "Optimal Discord Voice Link",
        "Multi-region Node Deployment",
        "Up to 24/7 Music Playback Uptime",
        "Detailed JDA & Java monitoring",
        "Unlimited Audio Stream Tracks"
      ],
      specs: { cpu: "High Speed CPU Core", ram: "Dedicated Memory", storage: "Rapid Cache Storage" }
    },
    {
      id: 'discord',
      title: "Discord Bot Hosting",
      description: "Reliable and affordable Discord bot hosting with 24/7 uptime, Node.js support, and easy deployment.",
      price: 52,
      icon: CustomIcons.Bot,
      iconBg: "bg-[#228dbd]/10",
      buttonText: "Get Discord Bot Hosting",
      href: "/discord",
      color: "blue",
      glowClass: "border-cyber-glow-brand",
      features: [
        "Node.js, Python, Java, Go, C#",
        "Git Integration & Auto Deploy",
        "Real-time Console & File Manager",
        "Unlimited Bot Process Threads",
        "99.9% Online Uptime Guarantee"
      ],
      specs: { cpu: "Dedicated Bot vCore", ram: "Custom RAM Limits", storage: "Persistent Storage Block" }
    }
  ]

  const getPrice = (price: number) => {
    if (billingCycle === "annual") {
      return Math.round(price * 0.9) // 10% off
    }
    return price
  }

  return (
    <section id="pricing" className="py-32 bg-[#030408] relative overflow-hidden">
      {/* Glow shapes */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#228dbd]/5 rounded-full blur-[130px] pointer-events-none will-change-transform" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[800px] h-[800px] bg-[#228dbd]/5 rounded-full blur-[130px] pointer-events-none will-change-transform" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div className="text-left max-w-2xl">
            <h2 className="text-4xl sm:text-6xl font-black text-white mb-4 orbitron-font uppercase tracking-tight">
              Flexible <span className="text-[#228dbd] text-neon-glow-brand">Pricing Plans</span>
            </h2>
            <p className="text-gray-400 text-lg quicksand-font">
              Select the hosting type that matches your requirements. Toggle billing frequency below to save up to 10%.
            </p>
          </div>

          {/* Toggle Switch */}
          <div className="relative z-20 flex items-center gap-4 bg-white/5 border border-white/10 p-1.5 rounded-2xl backdrop-blur-md self-start md:self-auto">
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                billingCycle === "monthly"
                  ? "bg-[#228dbd] text-white shadow-[0_0_15px_rgba(34,141,189,0.3)]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle("annual")}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                billingCycle === "annual"
                  ? "bg-[#228dbd] text-white shadow-[0_0_15px_rgba(34,141,189,0.3)]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Annually
              <span className="bg-green-500 text-black text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase pointer-events-none">
                Save 10%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className={`bg-[#0b0c16]/30 backdrop-blur-md border rounded-3xl p-8 flex flex-col md:flex-row gap-8 relative overflow-hidden group ${plan.glowClass} ${
                plan.popular ? "ring-1 ring-[#228dbd]/30" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0">
                  <div className="bg-[#228dbd] text-white text-[9px] font-black px-4 py-1.5 rounded-bl-xl uppercase tracking-widest orbitron-font shadow-[0_0_15px_rgba(34,141,189,0.4)]">
                    Popular
                  </div>
                </div>
              )}

              {/* Left Column: Icon & Price */}
              <div className="flex flex-col items-center md:items-start md:w-48 flex-shrink-0 text-center md:text-left">
                <div className="w-16 h-16 rounded-2xl bg-[#228dbd]/10 border border-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <plan.icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-2xl font-black text-white mb-2 orbitron-font uppercase tracking-tight">{plan.title}</h3>
                
                <div className="mt-auto pt-6 flex flex-col items-center md:items-start">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Starting at</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-4xl font-black text-white orbitron-font tracking-tight">
                      {formatPrice(getPrice(plan.price))}
                    </span>
                    <span className="text-gray-500 text-sm font-semibold">/mo</span>
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1.5 font-medium italic">
                    {billingCycle === "annual" ? "Billed annually" : "Billed monthly"}
                  </span>
                </div>
              </div>

              {/* Right Column: Spec Highlights & Button */}
              <div className="flex-1 flex flex-col justify-between border-t md:border-t-0 md:border-l border-white/5 pt-6 md:pt-0 md:pl-8">
                {/* Tech Specs Block */}
                <div className="grid grid-cols-3 gap-2 mb-6">
                  {[
                    { label: "CPU", val: plan.specs.cpu, icon: Cpu },
                    { label: "RAM", val: plan.specs.ram, icon: Zap },
                    { label: "Disk", val: plan.specs.storage, icon: HardDrive },
                  ].map((s, idx) => (
                    <div key={idx} className="bg-white/5 border border-white/5 rounded-xl p-2.5 flex flex-col items-center text-center">
                      <s.icon className="w-3.5 h-3.5 text-gray-400 mb-1" />
                      <span className="text-[8px] text-gray-500 font-bold uppercase tracking-wider">{s.label}</span>
                      <span className="text-[10px] text-white font-semibold mt-0.5 truncate w-full">{s.val}</span>
                    </div>
                  ))}
                </div>

                {/* Features List */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5 text-sm">
                      <div className="w-4 h-4 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 text-green-400" />
                      </div>
                      <span className="text-gray-300 leading-tight">{feat}</span>
                    </li>
                  ))}
                </ul>

                {/* Order Button */}
                <Link
                  href={plan.href}
                  className={`flex items-center gap-2 px-6 py-4 rounded-2xl font-bold text-sm transition-all duration-300 w-full justify-center group/btn orbitron-font uppercase tracking-wider
                    ${plan.popular 
                      ? 'bg-[#228dbd] hover:bg-[#1a6e94] text-white shadow-[0_0_20px_rgba(34,141,189,0.3)]' 
                      : 'bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-[#228dbd]/30'
                    }`}
                >
                  {plan.buttonText}
                  <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
