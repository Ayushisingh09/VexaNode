"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, Cpu, Zap, Shield, HardDrive, Gamepad2, Trophy, Users } from "lucide-react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { CustomIcons } from "../components/CustomIcons"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

const cycles = [
  { id: "monthly", name: "Monthly", discount: 0 },
  { id: "quarterly", name: "Quarterly", discount: 0 },
  { id: "semi-annually", name: "Semi-Annually", discount: 0.13 },
  { id: "annually", name: "Annually", discount: 0.24 }
]

const categories = [
  { id: "premium", name: "Premium Ryzen 9", icon: Trophy, desc: "AMD Ryzen 9 7950X / 9950X Performance" },
  { id: "budget", name: "Budget Extreme", icon: Zap, desc: "High-Performance Intel Xeon / Ryzen 5" }
]

const plans = {
  premium: [
    {
      id: "mc-4gb",
      name: "Iron Plan 4GB",
      cpu: "2 vCores (7950X)",
      ram: "4 GB DDR5",
      storage: "50 GB NVMe",
      basePrice: 399,
      href: "https://billing.vexanode.cloud/checkout/config/20"
    },
    {
      id: "mc-8gb",
      name: "Gold Plan 8GB",
      cpu: "4 vCores (7950X)",
      ram: "8 GB DDR5",
      storage: "100 GB NVMe",
      basePrice: 749,
      href: "https://billing.vexanode.cloud/checkout/config/21"
    },
    {
      id: "mc-16gb",
      name: "Diamond Plan 16GB",
      cpu: "6 vCores (7950X)",
      ram: "16 GB DDR5",
      storage: "200 GB NVMe",
      basePrice: 1399,
      href: "https://billing.vexanode.cloud/checkout/config/22"
    }
  ],
  budget: [
    {
      id: "mc-budget-4gb",
      name: "Dirt Plan 4GB",
      cpu: "2 vCores",
      ram: "4 GB DDR4",
      storage: "30 GB SSD",
      basePrice: 199,
      href: "https://billing.vexanode.cloud/checkout/config/23"
    },
    {
      id: "mc-budget-8gb",
      name: "Stone Plan 8GB",
      cpu: "3 vCores",
      ram: "8 GB DDR4",
      storage: "60 GB SSD",
      basePrice: 349,
      href: "https://billing.vexanode.cloud/checkout/config/24"
    }
  ]
}

export default function MinecraftPage() {
  const [selectedCategory, setSelectedCategory] = useState("premium")
  const [selectedCycle, setSelectedCycle] = useState("semi-annually")

  const router = useRouter()
  const { data: session } = useSession()

  const calculatePrice = (base: number) => {
    const cycle = cycles.find(c => c.id === selectedCycle)
    if (!cycle) return base
    const monthlyPrice = base * (1 - cycle.discount)
    return Math.floor(monthlyPrice)
  }

  const handleDeploy = (plan: any) => {
    const price = calculatePrice(plan.basePrice)
    localStorage.setItem('vexa_cart_total', price.toString())
    localStorage.setItem('vexa_cart_items', JSON.stringify([{
      name: `Minecraft - ${plan.name}`,
      description: `${plan.cpu} | ${plan.ram} | ${plan.storage}`,
      price: price
    }]))
    
    if (!session?.user) {
      router.push('/login')
    } else {
      router.push('/dashboard/checkout')
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0b0f] text-white selection:bg-[#228dbd]/30">
      <Navbar />

      <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Breadcrumb / Tag */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <span className="bg-[#228dbd]/10 text-[#228dbd] text-xs font-bold px-4 py-1.5 rounded-full border border-[#228dbd]/20">
            Minecraft Game Hosting
          </span>
        </motion.div>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 orbitron-font">
              Extreme <span className="relative inline-block text-[#228dbd] text-neon-glow-brand">
                Performance
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 0 100 5" stroke="#228dbd" strokeWidth="4" fill="none" />
                </svg>
              </span>
            </h1>
            <p className="text-gray-400 max-w-2xl">
              Dominate your players with zero lag. Our Minecraft servers run on 5.7GHz+ Ryzen processors and enterprise-grade NVMe storage.
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
                      ? "bg-[#228dbd] text-white shadow-[0_0_15px_rgba(34,141,189,0.3)]"
                      : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
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

        {/* Tier Selectors */}
        <div className="space-y-8 mb-12">
          <div>
            <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wider flex items-center gap-2">
              <span className="text-white">1.</span> Select Hardware Tier
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex flex-col items-start gap-3 p-6 rounded-2xl border transition-all duration-300 text-left ${
                    selectedCategory === cat.id
                      ? "bg-[#0b0c16]/50 border-[#228dbd] ring-1 ring-[#228dbd]/30 text-white shadow-[0_0_30px_rgba(34,141,189,0.25)]"
                      : "bg-[#0b0c16]/20 backdrop-blur-sm border-white/10 text-gray-400 hover:border-white/20 hover:bg-white/[0.02]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <cat.icon className={`w-6 h-6 ${selectedCategory === cat.id ? "text-white" : "text-[#228dbd]"}`} />
                    <span className="text-xl font-bold">{cat.name}</span>
                  </div>
                  <p className="text-sm opacity-80">{cat.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Plans List */}
        <div>
          <h3 className="text-sm font-bold text-gray-500 mb-6 uppercase tracking-wider flex items-center gap-2">
            <span className="text-white">2.</span> Choose Plan
          </h3>
          
          <div className="space-y-4">
            <AnimatePresence mode="wait">
              {plans[selectedCategory as keyof typeof plans].map((plan, idx) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group bg-[#0b0c16]/30 backdrop-blur-md border border-white/10 hover:border-[#228dbd]/30 rounded-2xl p-4 md:p-6 transition-all duration-300 flex flex-col lg:flex-row items-center gap-6"
                >
                  {/* Icon */}
                  <div className="flex-shrink-0 w-16 h-16 bg-[#228dbd]/10 rounded-xl flex items-center justify-center border border-[#228dbd]/20 group-hover:border-[#228dbd]/50 transition-colors">
                    {selectedCategory === "premium" ? (
                      <CustomIcons.AMD className="w-10 h-10 text-[#ED1C24] group-hover:scale-110 transition-transform" />
                    ) : (
                      <CustomIcons.Intel className="w-10 h-10 text-[#0071C5] group-hover:scale-110 transition-transform" />
                    )}
                  </div>

                  {/* Name */}
                  <div className="flex-1 text-center lg:text-left">
                    <h4 className="text-xl font-bold mb-1 group-hover:text-[#228dbd] transition-colors">{plan.name}</h4>
                    <div className="flex items-center justify-center lg:justify-start gap-2">
                      <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded uppercase font-bold tracking-wider">Bedrock + Java</span>
                      <span className="text-[10px] bg-[#228dbd]/20 text-[#228dbd] px-2 py-0.5 rounded uppercase font-bold tracking-wider">Unlimited Slots</span>
                    </div>
                  </div>

                  {/* Specs */}
                  <div className="flex flex-wrap justify-center gap-3">
                    <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/5 group-hover:border-[#228dbd]/20">
                      <Cpu className="w-4 h-4 text-[#228dbd]" />
                      <span className="text-xs font-bold text-gray-300">{plan.cpu}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/5 group-hover:border-[#228dbd]/20">
                      <Zap className="w-4 h-4 text-[#228dbd]" />
                      <span className="text-xs font-bold text-gray-300">{plan.ram}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/5 group-hover:border-[#228dbd]/20">
                      <HardDrive className="w-4 h-4 text-[#228dbd]" />
                      <span className="text-xs font-bold text-gray-300">{plan.storage}</span>
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="flex items-center gap-8 ml-auto">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">₹{calculatePrice(plan.basePrice)}<span className="text-sm font-normal text-gray-500">/mo</span></div>
                      {selectedCycle !== 'monthly' && (
                        <div className="text-[10px] text-[#228dbd] font-bold uppercase tracking-tighter text-right">Billed {selectedCycle}</div>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeploy(plan)}
                      className="bg-[#228dbd] hover:bg-[#1a6e94] text-white px-8 py-3 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(34,141,189,0.2)] hover:shadow-[0_0_30px_rgba(34,141,189,0.4)] flex items-center gap-2"
                    >
                      Build Server
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Features Row */}
        <div className="mt-24 flex flex-wrap justify-center gap-12 text-center opacity-70">
          <div className="flex flex-col items-center gap-3 group">
            <Shield className="w-8 h-8 text-[#228dbd] group-hover:scale-110 transition-transform" />
            <span className="text-sm font-bold orbitron-font text-gray-300 group-hover:text-white transition-colors">DDoS Protected</span>
          </div>
          <div className="flex flex-col items-center gap-3 group">
            <Users className="w-8 h-8 text-[#228dbd] group-hover:scale-110 transition-transform" />
            <span className="text-sm font-bold orbitron-font text-gray-300 group-hover:text-white transition-colors">100% Uptime</span>
          </div>
          <div className="flex flex-col items-center gap-3 group">
            <Zap className="w-8 h-8 text-[#228dbd] group-hover:scale-110 transition-transform" />
            <span className="text-sm font-bold orbitron-font text-gray-300 group-hover:text-white transition-colors">NVMe Gen4 Storage</span>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
