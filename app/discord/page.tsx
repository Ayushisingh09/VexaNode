"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, Cpu, Zap, Shield, HardDrive, MessageSquare, Sparkles, Terminal, Database, RotateCcw } from "lucide-react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { CustomIcons } from "../components/CustomIcons"

const cycles = [
  { id: "monthly", name: "Monthly", discount: 0 },
  { id: "quarterly", name: "Quarterly", discount: 0 },
  { id: "semi-annually", name: "Semi-Annually", discount: 0.13 },
  { id: "annually", name: "Annually", discount: 0.24 }
]

const botPlans = [
  {
    id: "starter",
    name: "Starter",
    basePrice: 35,
    ram: "512 MB",
    cpu: "50%",
    disk: "1 GB",
    backups: "0",
    databases: "0",
    href: "https://billing.vexanode.cloud/checkout/config/1"
  },
  {
    id: "basic",
    name: "Basic",
    basePrice: 99,
    ram: "1 GB",
    cpu: "100%",
    disk: "2 GB",
    backups: "1",
    databases: "1",
    href: "https://billing.vexanode.cloud/checkout/config/2"
  },
  {
    id: "silver",
    name: "Silver",
    basePrice: 129,
    ram: "2 GB",
    cpu: "150%",
    disk: "4 GB",
    backups: "1",
    databases: "1",
    href: "https://billing.vexanode.cloud/checkout/config/3"
  },
  {
    id: "gold",
    name: "Gold",
    basePrice: 199,
    ram: "4 GB",
    cpu: "200%",
    disk: "8 GB",
    backups: "2",
    databases: "1",
    href: "https://billing.vexanode.cloud/checkout/config/4"
  },
  {
    id: "platinum",
    name: "Platinum",
    basePrice: 279,
    ram: "6 GB",
    cpu: "250%",
    disk: "12 GB",
    backups: "3",
    databases: "1",
    href: "https://billing.vexanode.cloud/checkout/config/5"
  },
  {
    id: "diamond",
    name: "Diamond",
    basePrice: 349,
    ram: "8 GB",
    cpu: "300%",
    disk: "16 GB",
    backups: "4",
    databases: "1",
    href: "https://billing.vexanode.cloud/checkout/config/6"
  },
  {
    id: "netherite",
    name: "Netherite",
    basePrice: 429,
    ram: "8 GB",
    cpu: "300%",
    disk: "16 GB",
    backups: "4",
    databases: "1",
    href: "https://billing.vexanode.cloud/checkout/config/7"
  },
  {
    id: "obsidian",
    name: "Obsidian",
    basePrice: 550,
    ram: "12 GB",
    cpu: "400%",
    disk: "24 GB",
    backups: "5",
    databases: "1",
    href: "https://billing.vexanode.cloud/checkout/config/8"
  }
]

export default function DiscordBotPage() {
  const [selectedCycle, setSelectedCycle] = useState("semi-annually")

  const calculatePrice = (base: number) => {
    const cycle = cycles.find(c => c.id === selectedCycle)
    if (!cycle) return base
    const monthlyPrice = base * (1 - cycle.discount)
    return Math.floor(monthlyPrice)
  }

  return (
    <div className="min-h-screen bg-[#0a0b0f] text-white selection:bg-blue-500/30">
      <Navbar />

      <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Breadcrumb / Tag */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <span className="bg-blue-600/10 text-blue-500 text-xs font-bold px-4 py-1.5 rounded-full border border-blue-500/20">
            Discord Bot Hosting
          </span>
        </motion.div>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 orbitron-font">
              Scalable Bot <span className="relative inline-block text-blue-500">
                Infrastructure
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="#3b82f6" strokeWidth="4" fill="none" />
                </svg>
              </span>
            </h1>
            <p className="text-gray-400 max-w-2xl">
              Engineered for 24/7 uptime. Deploy your Node.js, Python, or Java bots on our high-performance Pterodactyl-powered nodes.
            </p>
          </div>

          <div className="flex flex-col items-end gap-4">
             {/* Billing Cycle Toggle */}
            <div className="bg-white/5 border border-white/10 p-1 rounded-xl flex gap-1">
              {cycles.map((cycle) => (
                <button
                  key={cycle.id}
                  onClick={() => setSelectedCycle(cycle.id)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    selectedCycle === cycle.id
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {cycle.name}
                  {cycle.discount > 0 && (
                    <span className="ml-1 text-[8px] opacity-70">-{Math.round(cycle.discount * 100)}%</span>
                  )}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-gray-300">
              <span>₹ INR</span>
              <ChevronRight className="w-4 h-4 rotate-90" />
            </div>
          </div>
        </div>

        {/* Plans List */}
        <div>
          <h3 className="text-sm font-bold text-gray-500 mb-8 uppercase tracking-wider flex items-center gap-2">
            <span className="text-white">1.</span> Choose Your Plan
          </h3>
          
          <div className="space-y-4">
            {botPlans.map((plan, idx) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group bg-white/5 hover:bg-white/[0.07] border border-white/10 hover:border-blue-500/30 rounded-2xl p-4 md:p-6 transition-all duration-300 flex flex-col lg:flex-row items-center gap-6"
              >
                {/* Icon */}
                <div className="flex-shrink-0 w-16 h-16 bg-blue-600/10 rounded-xl flex items-center justify-center border border-blue-500/20 group-hover:border-blue-500/50 transition-colors">
                  <CustomIcons.Bot className="w-10 h-10 text-blue-500 group-hover:scale-110 transition-transform" />
                </div>

                {/* Name */}
                <div className="flex-1 text-center lg:text-left">
                  <h4 className="text-xl font-bold mb-1 group-hover:text-blue-400 transition-colors">{plan.name}</h4>
                  <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">High Performance Node</p>
                </div>

                {/* Specs */}
                <div className="flex flex-wrap justify-center gap-2">
                  <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 group-hover:border-blue-500/20">
                    <Zap className="w-3.5 h-3.5 text-blue-500" />
                    <span className="text-[11px] font-bold text-gray-300">{plan.ram} RAM</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 group-hover:border-blue-500/20">
                    <Cpu className="w-3.5 h-3.5 text-blue-500" />
                    <span className="text-[11px] font-bold text-gray-300">{plan.cpu} CPU</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 group-hover:border-blue-500/20">
                    <HardDrive className="w-3.5 h-3.5 text-blue-500" />
                    <span className="text-[11px] font-bold text-gray-300">{plan.disk} Disk</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 group-hover:border-blue-500/20">
                    <RotateCcw className="w-3.5 h-3.5 text-blue-500" />
                    <span className="text-[11px] font-bold text-gray-300">{plan.backups} Backups</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 group-hover:border-blue-500/20">
                    <Database className="w-3.5 h-3.5 text-blue-500" />
                    <span className="text-[11px] font-bold text-gray-300">{plan.databases} DBs</span>
                  </div>
                </div>

                {/* Price & Action */}
                <div className="flex items-center gap-8 ml-auto">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">₹{calculatePrice(plan.basePrice)}</div>
                    {selectedCycle !== 'monthly' && (
                      <div className="text-[10px] text-blue-500 font-bold uppercase tracking-tighter text-right">Billed {selectedCycle}</div>
                    )}
                  </div>
                  <a
                    href={plan.href}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] flex items-center gap-2"
                  >
                    Deploy
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Instant Deployment", desc: "Your bot environment is ready in less than 60 seconds after payment.", icon: Zap },
            { title: "24/7 Support", desc: "Expert technical assistance available whenever you need it.", icon: MessageSquare },
            { title: "DDoS Protection", desc: "Enterprise-grade mitigation to keep your bot online during attacks.", icon: Shield }
          ].map((feature, idx) => (
            <div key={idx} className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-blue-500/20 transition-colors">
              <feature.icon className="w-10 h-10 text-blue-500 mb-6" />
              <h4 className="text-lg font-bold mb-2 orbitron-font">{feature.title}</h4>
              <p className="text-sm text-gray-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}
