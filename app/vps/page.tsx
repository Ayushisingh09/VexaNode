"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, Cpu, Zap, Shield, Check, Server, HardDrive, LayoutGrid, Globe, Rocket } from "lucide-react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Image from "next/image"
import { CustomIcons } from "../components/CustomIcons"
import { useCurrency } from "../contexts/CurrencyContext"

const cycles = [
  { id: "monthly", name: "Monthly", discount: 0 },
  { id: "quarterly", name: "Quarterly", discount: 0.06 },
  { id: "semi-annually", name: "Semi-Annually", discount: 0.17 },
  { id: "annually", name: "Annually", discount: 0.17 }
]

const locations = [
  { id: "india", name: "India", flag: "🇮🇳" },
  { id: "usa", name: "USA", flag: "🇺🇸" },
  { id: "germany", name: "Germany", flag: "🇩🇪" }
]

const cpuTypes = [
  { id: "intel", name: "Intel Xeon", icon: Cpu },
  { id: "ryzen", name: "AMD Ryzen 9", icon: Cpu },
  { id: "epyc", name: "AMD EPYC", icon: Cpu }
]

const plans = {
  india: {
    intel: [
      { id: "in-std-01", name: "Standard01", cores: "4 Cores", ram: "8 GB DDR4", storage: "120 GB SSD", basePrice: 699, href: "https://billing.vexanode.cloud/checkout/config/1" },
      { id: "in-std-02", name: "Standard02", cores: "5 Cores", ram: "12 GB DDR4", storage: "160 GB SSD", basePrice: 999, href: "https://billing.vexanode.cloud/checkout/config/2" },
      { id: "in-std-03", name: "Standard03", cores: "6 Cores", ram: "16 GB DDR4", storage: "210 GB SSD", basePrice: 1299, href: "https://billing.vexanode.cloud/checkout/config/3" },
      { id: "in-std-04", name: "Standard04", cores: "7 Cores", ram: "24 GB DDR4", storage: "250 GB SSD", basePrice: 1899, href: "https://billing.vexanode.cloud/checkout/config/4" },
      { id: "in-std-05", name: "Standard05", cores: "8 Cores", ram: "32 GB DDR4", storage: "300 GB SSD", basePrice: 2499, href: "https://billing.vexanode.cloud/checkout/config/5" }
    ],
    ryzen: [
      { id: "in-ryzen-01", name: "Ryzen Ultra 8GB", cores: "2 Dedicated", ram: "DDR5 8 GB", storage: "NVMe 80 GB", basePrice: 1700, href: "https://billing.vexanode.cloud/checkout/config/6" },
      { id: "in-ryzen-02", name: "Ryzen Ultra 16GB", cores: "4 Dedicated", ram: "DDR5 16 GB", storage: "NVMe 100 GB", basePrice: 3100, href: "https://billing.vexanode.cloud/checkout/config/7" }
    ],
    epyc: [
      { id: "in-epyc-01", name: "EPYC Scale 16GB", cores: "4 Dedicated", ram: "DDR4 16 GB", storage: "SSD 120 GB", basePrice: 1100, href: "https://billing.vexanode.cloud/checkout/config/8" }
    ]
  },
  usa: {
    intel: [
      { id: "us-std-01", name: "Standard01", cores: "2 Cores", ram: "2 GB DDR4", storage: "30 GB NVMe", basePrice: 249, href: "https://billing.vexanode.cloud/checkout/config/9" },
      { id: "us-std-02", name: "Standard02", cores: "3 Cores", ram: "4 GB DDR4", storage: "70 GB NVMe", basePrice: 399, href: "https://billing.vexanode.cloud/checkout/config/10" },
      { id: "us-std-03", name: "Standard03", cores: "4 Cores", ram: "8 GB DDR4", storage: "120 GB NVMe", basePrice: 749, href: "https://billing.vexanode.cloud/checkout/config/11" },
      { id: "us-std-04", name: "Standard04", cores: "5 Cores", ram: "12 GB DDR4", storage: "160 GB NVMe", basePrice: 1099, href: "https://billing.vexanode.cloud/checkout/config/12" },
      { id: "us-std-05", name: "Standard05", cores: "6 Cores", ram: "16 GB DDR4", storage: "210 GB NVMe", basePrice: 1399, href: "https://billing.vexanode.cloud/checkout/config/13" }
    ],
    ryzen: [],
    epyc: []
  },
  germany: {
    intel: [
      { id: "de-std-01", name: "Standard01", cores: "2 Cores", ram: "2 GB DDR4", storage: "30 GB NVMe", basePrice: 249, href: "https://billing.vexanode.cloud/checkout/config/17" },
      { id: "de-std-02", name: "Standard02", cores: "4 Cores", ram: "8 GB DDR4", storage: "120 GB NVMe", basePrice: 749, href: "https://billing.vexanode.cloud/checkout/config/18" }
    ],
    ryzen: [
      { id: "de-ryzen-01", name: "Ryzen Perf 8GB", cores: "4 vCores", ram: "8 GB DDR4", storage: "100 GB NVMe", basePrice: 499, href: "https://billing.vexanode.cloud/checkout/config/19" },
      { id: "de-ryzen-02", name: "Ryzen Perf 16GB", cores: "6 vCores", ram: "16 GB DDR4", storage: "200 GB NVMe", basePrice: 999, href: "https://billing.vexanode.cloud/checkout/config/20" }
    ],
    epyc: [
      { id: "de-epyc-01", name: "EPYC Global 16GB", cores: "6 Cores", ram: "16 GB DDR4", storage: "210 GB NVMe", basePrice: 1349, href: "https://billing.vexanode.cloud/checkout/config/21" }
    ]
  }
}

export default function VPSPage() {
  const [selectedLocation, setSelectedLocation] = useState("india")
  const [selectedCpu, setSelectedCpu] = useState("intel")
  const [selectedCycle, setSelectedCycle] = useState("monthly")
  const { formatPrice, currency } = useCurrency()

  const calculatePrice = (base: number) => {
    const cycle = cycles.find(c => c.id === selectedCycle)
    if (!cycle) return base
    const price = base * (1 - cycle.discount)
    return Math.floor(price)
  }

  const currentPlans = (plans[selectedLocation as keyof typeof plans] as any)[selectedCpu] || []

  return (
    <div className="min-h-screen bg-[#0a0b0f] text-white selection:bg-blue-500/30">
      <Navbar />

      <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-16">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-2xl"
          >
            <div className="inline-block bg-blue-600/10 text-blue-500 text-[10px] font-bold px-4 py-1 rounded-full border border-blue-500/20 mb-6 uppercase tracking-widest">
              Enterprise Cloud Infrastructure
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 orbitron-font leading-tight">
              Virtual Private <br />
              <span className="text-blue-500 relative">
                Servers
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="#3b82f6" strokeWidth="4" fill="none" />
                </svg>
              </span>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed">
              Deploy high-performance virtual instances in seconds. Experience full root access, dedicated resources, and enterprise-grade DDoS protection across our global network.
            </p>
          </motion.div>

          {/* Billing Cycle UI */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/5 border border-white/10 p-6 rounded-[32px] w-full lg:w-auto"
          >
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Billing Cycle</h4>
            <div className="flex flex-col gap-2">
              {cycles.map((cycle) => (
                <button
                  key={cycle.id}
                  onClick={() => setSelectedCycle(cycle.id)}
                  className={`flex items-center justify-between px-6 py-3 rounded-2xl transition-all ${
                    selectedCycle === cycle.id
                      ? "bg-blue-600 text-white shadow-xl"
                      : "bg-white/5 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  <span className="text-sm font-bold">{cycle.name}</span>
                  {cycle.discount > 0 && (
                    <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">Save {Math.round(cycle.discount * 100)}%</span>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Configuration Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white/5 border border-white/10 rounded-[40px] p-8">
            <h3 className="text-sm font-bold text-gray-400 mb-6 uppercase tracking-widest flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-500" />
              1. Deployment Location
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {locations.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => setSelectedLocation(loc.id)}
                  className={`flex flex-col items-center justify-center gap-2 p-4 rounded-3xl border transition-all ${
                    selectedLocation === loc.id
                      ? "bg-blue-600/10 border-blue-500 text-white"
                      : "bg-black/20 border-white/5 text-gray-500 hover:border-white/10"
                  }`}
                >
                  <span className="text-2xl">{loc.flag}</span>
                  <span className="text-[10px] font-bold uppercase">{loc.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[40px] p-8">
            <h3 className="text-sm font-bold text-gray-400 mb-6 uppercase tracking-widest flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-500" />
              2. Processor Architecture
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {cpuTypes.map((cpu) => (
                <button
                  key={cpu.id}
                  onClick={() => setSelectedCpu(cpu.id)}
                  className={`flex flex-col items-center justify-center gap-2 p-4 rounded-3xl border transition-all ${
                    selectedCpu === cpu.id
                      ? "bg-blue-600/10 border-blue-500 text-white"
                      : "bg-black/20 border-white/5 text-gray-500 hover:border-white/10"
                  }`}
                >
                  <cpu.icon className="w-5 h-5 mb-1" />
                  <span className="text-[10px] font-bold uppercase whitespace-nowrap">{cpu.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Plans List */}
        <div className="space-y-4 mb-24">
          <AnimatePresence mode="wait">
            {currentPlans.length > 0 ? (
              currentPlans.map((plan: any, idx: number) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group bg-white/5 hover:bg-white/[0.08] border border-white/10 hover:border-blue-500/30 rounded-[32px] p-6 flex flex-col lg:flex-row items-center gap-8 transition-all duration-300"
                >
                  <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center border border-blue-500/20 flex-shrink-0 group-hover:scale-110 transition-transform">
                    {selectedCpu === 'intel' ? <CustomIcons.Intel className="w-10 h-10 text-blue-500" /> : <CustomIcons.AMD className="w-10 h-10 text-red-500" />}
                  </div>
                  
                  <div className="flex-1 text-center lg:text-left">
                    <h4 className="text-xl font-bold mb-1 group-hover:text-blue-400 transition-colors">{plan.name}</h4>
                    <div className="flex flex-wrap justify-center lg:justify-start gap-4 mt-4">
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Cpu className="w-3.5 h-3.5 text-blue-500" /> {plan.cores}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Zap className="w-3.5 h-3.5 text-blue-500" /> {plan.ram}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <HardDrive className="w-3.5 h-3.5 text-blue-500" /> {plan.storage}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">{formatPrice(calculatePrice(plan.basePrice))}</div>
                      <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Per Month</div>
                    </div>
                    <a
                      href={plan.href}
                      className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-2xl font-bold transition-all shadow-[0_0_30px_rgba(59,130,246,0.2)] hover:shadow-[0_0_40px_rgba(59,130,246,0.4)] flex items-center gap-2"
                    >
                      Deploy
                      <ChevronRight className="w-4 h-4" />
                    </a>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-24 bg-white/5 rounded-[40px] border border-dashed border-white/10">
                <p className="text-gray-500 italic">No plans available for this specific configuration yet.</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Why VexaNode VPS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Pure NVMe Storage", desc: "Experience 10x faster I/O compared to traditional SSDs with our Gen4 NVMe arrays.", icon: HardDrive },
            { title: "DDoS Mitigation", desc: "12Tbps+ path-based mitigation included for free on all nodes worldwide.", icon: Shield },
            { title: "KVM Virtualization", desc: "True hardware isolation with KVM ensures your resources are always available.", icon: Server }
          ].map((f, i) => (
            <div key={i} className="p-8 rounded-[40px] bg-white/5 border border-white/10 group hover:border-blue-500/20 transition-all">
              <f.icon className="w-10 h-10 text-blue-500 mb-6 group-hover:scale-110 transition-transform" />
              <h4 className="text-xl font-bold mb-3 orbitron-font">{f.title}</h4>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}
