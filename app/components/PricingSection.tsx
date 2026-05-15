"use client"

import { motion } from "framer-motion"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { CustomIcons } from "./CustomIcons"
import { useCurrency } from "../contexts/CurrencyContext"

export default function PricingSection() {
  const { formatPrice } = useCurrency()
  
  const plans = [
    {
      id: 'database',
      title: "Database Hosting",
      description: "High-performance managed database hosting for MySQL, PostgreSQL, MongoDB & more.",
      price: 99,
      icon: CustomIcons.Database,
      iconBg: "bg-[#0a2e2a]",
      buttonText: "Get Database Hosting",
      href: "/databases",
      color: "blue"
    },
    {
      id: 'vps',
      title: "VPS Hosting",
      description: "Scalable virtual private servers with full root access, SSD storage, and 24/7 support.",
      price: 225,
      icon: CustomIcons.VPS,
      iconBg: "bg-[#0a2e1d]",
      buttonText: "Get VPS Hosting",
      href: "/vps",
      popular: true,
      color: "green"
    },
    {
      id: 'lavalink',
      title: "Lavalink Hosting",
      description: "High performance Lavalink hosting for Discord music bots with low latency and 24/7 uptime.",
      price: 49,
      icon: CustomIcons.Lavalink,
      iconBg: "bg-[#2e0a24]",
      buttonText: "Get Lavalink Hosting",
      href: "/lavalink",
      color: "purple"
    },
    {
      id: 'discord',
      title: "Discord Bot Hosting",
      description: "Reliable and affordable Discord bot hosting with 24/7 uptime, Node.js support, and easy deployment.",
      price: 52,
      icon: CustomIcons.Bot,
      iconBg: "bg-[#132e0a]",
      buttonText: "Get Discord Bot Hosting",
      href: "/discord",
      color: "green"
    }
  ]

  return (
    <section className="py-24 bg-[#0a0b0f] relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-left mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 orbitron-font">
            Simple Pricing <span className="text-blue-500">Plans</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl">
            Choose the perfect plan for your needs. All plans include our core features with no hidden fees.
          </p>
        </div>

        <div className="space-y-4">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative flex flex-col md:flex-row items-center bg-[#111218] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all duration-300 group`}
            >
              {plan.popular && (
                <div className="absolute top-4 left-4 z-20">
                  <span className="bg-[#22c55e] text-white text-[10px] font-bold px-2 py-1 rounded orbitron-font tracking-widest uppercase">
                    Popular
                  </span>
                </div>
              )}

              {/* Icon Section */}
              <div className={`${plan.iconBg} w-full md:w-48 h-48 flex items-center justify-center flex-shrink-0 relative`}>
                <plan.icon className="w-16 h-16 text-white/80 group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50" />
              </div>

              {/* Content Section */}
              <div className="flex-1 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 w-full">
                <div className="text-center md:text-left flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2 orbitron-font">{plan.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed max-w-md">
                    {plan.description}
                  </p>
                </div>

                <div className="flex flex-col items-center md:items-end gap-4 min-w-[200px]">
                  <div className="flex flex-col items-center md:items-end">
                    <span className="text-xs text-gray-500 uppercase tracking-wider">Starting at</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-white">{formatPrice(plan.price)}</span>
                      <span className="text-gray-500 text-sm">/mo</span>
                    </div>
                  </div>

                  <Link
                    href={plan.href}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm transition-all duration-300 w-full md:w-auto justify-center
                      ${plan.popular 
                        ? 'bg-[#22c55e] hover:bg-[#1eb052] text-white shadow-[0_0_20px_rgba(34,197,94,0.2)]' 
                        : 'bg-[#1a1c26] hover:bg-[#252836] text-white border border-white/10'
                      }`}
                  >
                    {plan.buttonText}
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
