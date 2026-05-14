"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, Cpu, Zap, Shield, Check, Server, HardDrive, LayoutGrid } from "lucide-react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Image from "next/image"
import { CustomIcons } from "../components/CustomIcons"

const cycles = [
  { id: "monthly", name: "Monthly", discount: 0 },
  { id: "quarterly", name: "Quarterly", discount: 0 },
  { id: "semi-annually", name: "Semi-Annually", discount: 0.13 },
  { id: "annually", name: "Annually", discount: 0.24 }
]

const locations = [
  { id: "india", name: "India", flag: "🇮🇳" },
  { id: "usa", name: "USA", flag: "🇺🇸" }
]

const cpuTypes = [
  { id: "ryzen", name: "AMD Ryzen 9 9950", icon: Cpu }
]

const plans = {
  india: [
    {
      id: "8gb",
      name: "Premium India 8GB",
      cores: "2 Dedicated",
      ram: "DDR5 8 GB",
      storage: "NVMe 80 GB",
      basePrice: 1700,
      href: "https://billing.vexanode.cloud/checkout/config/1"
    },
    {
      id: "16gb",
      name: "Premium India 16GB",
      cores: "4 Dedicated",
      ram: "DDR5 16 GB",
      storage: "NVMe 100 GB",
      basePrice: 3100,
      href: "https://billing.vexanode.cloud/checkout/config/2"
    },
    {
      id: "24gb",
      name: "Premium India 24GB",
      cores: "6 Dedicated",
      ram: "DDR5 24 GB",
      storage: "NVMe 150 GB",
      basePrice: 4100,
      href: "https://billing.vexanode.cloud/checkout/config/3"
    }
  ],
  usa: [
    {
      id: "8gb-usa",
      name: "Premium USA 8GB",
      cores: "2 Dedicated",
      ram: "DDR5 8 GB",
      storage: "NVMe 80 GB",
      basePrice: 1500,
      href: "https://billing.vexanode.cloud/checkout/config/4"
    },
    {
      id: "16gb-usa",
      name: "Premium USA 16GB",
      cores: "4 Dedicated",
      ram: "DDR5 16 GB",
      storage: "NVMe 100 GB",
      basePrice: 2800,
      href: "https://billing.vexanode.cloud/checkout/config/5"
    }
  ]
}

export default function VPSPage() {
  const [selectedLocation, setSelectedLocation] = useState("india")
  const [selectedCpu, setSelectedCpu] = useState("ryzen")
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
            Cloud VPS
          </span>
        </motion.div>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 orbitron-font">
              VPS Hosting <span className="relative inline-block">
                Solutions
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 0 100 5" stroke="#3b82f6" strokeWidth="4" fill="none" />
                </svg>
              </span>
            </h1>
            <p className="text-gray-400 max-w-2xl">
              High-performance virtual private servers with full root access, SSD storage, and 24/7 support. Perfect for developers and businesses.
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

        {/* Selectors */}
        <div className="space-y-8 mb-12">
          <div>
            <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wider flex items-center gap-2">
              <span className="text-white">1.</span> Location
            </h3>
            <div className="flex flex-wrap gap-4">
              {locations.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => setSelectedLocation(loc.id)}
                  className={`flex items-center gap-3 px-6 py-3 rounded-xl border transition-all duration-300 ${
                    selectedLocation === loc.id
                      ? "bg-blue-600 border-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                      : "bg-white/5 border-white/10 text-gray-400 hover:border-white/20"
                  }`}
                >
                  <span className="text-xl">{loc.flag}</span>
                  <span className="font-bold">{loc.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wider flex items-center gap-2">
              <span className="text-white">2.</span> CPU Type
            </h3>
            <div className="flex flex-wrap gap-4">
              {cpuTypes.map((cpu) => (
                <button
                  key={cpu.id}
                  onClick={() => setSelectedCpu(cpu.id)}
                  className={`flex items-center gap-3 px-6 py-3 rounded-xl border transition-all duration-300 ${
                    selectedCpu === cpu.id
                      ? "bg-blue-600 border-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                      : "bg-white/5 border-white/10 text-gray-400 hover:border-white/20"
                  }`}
                >
                  <cpu.icon className="w-5 h-5" />
                  <span className="font-bold">{cpu.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Plans List */}
        <div>
          <h3 className="text-sm font-bold text-gray-500 mb-6 uppercase tracking-wider flex items-center gap-2">
            <span className="text-white">3.</span> Choose Plan
          </h3>
          
          <div className="space-y-4">
            <AnimatePresence mode="wait">
              {plans[selectedLocation as keyof typeof plans].map((plan, idx) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group bg-white/5 hover:bg-white/[0.07] border border-white/10 hover:border-blue-500/30 rounded-2xl p-4 md:p-6 transition-all duration-300 flex flex-col lg:flex-row items-center gap-6"
                >
                  {/* Icon */}
                  <div className="flex-shrink-0 w-16 h-16 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 group-hover:border-blue-500/50 transition-colors">
                    <CustomIcons.AMD className="w-10 h-10 text-[#ED1C24] group-hover:scale-110 transition-transform" />
                  </div>

                  {/* Name */}
                  <div className="flex-1 text-center lg:text-left">
                    <h4 className="text-xl font-bold mb-1 group-hover:text-blue-400 transition-colors">{plan.name}</h4>
                  </div>

                  {/* Specs */}
                  <div className="flex flex-wrap justify-center gap-3">
                    <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/5 group-hover:border-blue-500/20">
                      <Cpu className="w-4 h-4 text-blue-500" />
                      <span className="text-xs font-bold text-gray-300">Cores <span className="text-white">{plan.cores}</span></span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/5 group-hover:border-blue-500/20">
                      <Zap className="w-4 h-4 text-blue-500" />
                      <span className="text-xs font-bold text-gray-300">{plan.ram}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/5 group-hover:border-blue-500/20">
                      <HardDrive className="w-4 h-4 text-blue-500" />
                      <span className="text-xs font-bold text-gray-300">{plan.storage}</span>
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="flex items-center gap-8 ml-auto">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">₹{calculatePrice(plan.basePrice)}<span className="text-sm font-normal text-gray-500">/mo</span></div>
                      {selectedCycle !== 'monthly' && (
                        <div className="text-[10px] text-blue-500 font-bold uppercase tracking-tighter text-right">Billed {selectedCycle}</div>
                      )}
                    </div>
                    <a
                      href={plan.href}
                      className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] flex items-center gap-2"
                    >
                      Order Now
                      <ChevronRight className="w-4 h-4" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-16 bg-blue-600/5 border border-blue-500/10 rounded-2xl p-6 text-center">
          <p className="text-sm text-gray-400">
            <span className="text-white font-bold">VexaNode</span> provides high-performance <span className="text-blue-500">Lavalink hosting</span>, <span className="text-blue-500">Discord bot hosting</span>, and developer <span className="text-blue-500">VPS infrastructure</span> with NVMe storage and DDoS protection.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
