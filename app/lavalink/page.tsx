"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, Cpu, Zap, Shield, HardDrive, Music, Check, Headphones, Globe, Sparkles, MessageSquare, Database } from "lucide-react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { CustomIcons } from "../components/CustomIcons"
import { useCurrency } from "../contexts/CurrencyContext"
import LavalinkTest from "../components/LavalinkTest"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

const cycles = [
  { id: "monthly", name: "Monthly", discount: 0 },
  { id: "quarterly", name: "Quarterly", discount: 0 },
  { id: "semi-annually", name: "Semi-Annually", discount: 0.13 },
  { id: "annually", name: "Annually", discount: 0.24 }
]

const categories = [
  { id: "self-managed", name: "Self Managed", icon: Headphones, desc: "Direct node access for developers" },
  { id: "managed", name: "Managed Hosting", icon: Sparkles, desc: "Managed Lavalink hosting, fully handled by our team. Setup, config, and uptime included." }
]

const plans = {
  "self-managed": [
    {
      id: "self-starter",
      name: "Starter",
      basePrice: 35,
      ram: "512 MB",
      cpu: "50% CPU",
      storage: "1 GB Disk",
      region: "All 4",
      popular: false
    },
    {
      id: "self-basic",
      name: "Basic",
      basePrice: 99,
      ram: "1 GB",
      cpu: "100% CPU",
      storage: "2 GB Disk",
      region: "All 4",
      popular: false
    },
    {
      id: "self-silver",
      name: "Silver",
      basePrice: 129,
      ram: "2 GB",
      cpu: "150% CPU",
      storage: "4 GB Disk",
      region: "All 4",
      popular: true
    },
    {
      id: "self-gold",
      name: "Gold",
      basePrice: 199,
      ram: "4 GB",
      cpu: "200% CPU",
      storage: "8 GB Disk",
      region: "All 4",
      popular: false
    },
    {
      id: "self-platinum",
      name: "Platinum",
      basePrice: 279,
      ram: "6 GB",
      cpu: "250% CPU",
      storage: "12 GB Disk",
      region: "All 4",
      popular: false
    },
    {
      id: "self-diamond",
      name: "Diamond",
      basePrice: 349,
      ram: "8 GB",
      cpu: "300% CPU",
      storage: "16 GB Disk",
      region: "All 4",
      popular: false
    },
    {
      id: "self-netherite",
      name: "Netherite",
      basePrice: 429,
      ram: "8 GB",
      cpu: "300% CPU",
      storage: "16 GB Disk",
      region: "All 4",
      popular: false
    },
    {
      id: "self-obsidian",
      name: "Obsidian",
      basePrice: 550,
      ram: "12 GB",
      cpu: "400% CPU",
      storage: "24 GB Disk",
      region: "All 4",
      popular: false
    }
  ],
  "managed": [
    {
      id: "managed-basic",
      name: "Basic",
      basePrice: 140,
      ram: "2GB DDR4",
      cpu: "1 Core",
      storage: "5GB NVMe",
      network: "1Gbps",
      hardware: "Intel"
    },
    {
      id: "managed-starter",
      name: "Starter",
      basePrice: 190,
      ram: "4GB DDR4",
      cpu: "2 Cores",
      storage: "8GB NVMe",
      network: "1Gbps",
      hardware: "Intel"
    },
    {
      id: "managed-gold",
      name: "Gold",
      basePrice: 280,
      ram: "6GB DDR4",
      cpu: "6 Cores",
      storage: "15GB NVMe",
      network: "1Gbps",
      popular: true,
      hardware: "AMD"
    },
    {
      id: "managed-pro",
      name: "Pro",
      basePrice: 500,
      ram: "High-end specs",
      cpu: "Priority Support",
      storage: "Custom Audio APIs",
      network: "Custom Plugins",
      hardware: "AMD"
    }
  ]
}

export default function LavalinkPage() {
  const [selectedCategory, setSelectedCategory] = useState("self-managed")
  const [selectedCycle, setSelectedCycle] = useState("monthly")
  const { formatPrice } = useCurrency()
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
      name: `Lavalink Node - ${plan.name} (${selectedCategory === 'managed' ? 'Managed' : 'Self-Managed'})`,
      description: `${plan.ram} | ${plan.cpu} | ${plan.storage}`,
      price: price
    }]))
    
    if (!session?.user) {
      router.push('/login')
    } else {
      router.push('/dashboard/checkout')
    }
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
            Lavalink Node Hosting
          </span>
        </motion.div>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 orbitron-font leading-tight">
              Lavalink VPS <br />
              <span className="relative inline-block text-blue-500 pb-2">
                On Pterodactyl
                <svg className="absolute bottom-0 left-0 w-full h-2" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="#3b82f6" strokeWidth="2" fill="none" />
                </svg>
              </span>
            </h1>
            <p className="text-gray-400 max-w-2xl">
              High-performance nodes optimized for the lowest latency audio streaming. Managed and self-managed options available.
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
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-gray-300">
              <span>₹ INR</span>
              <ChevronRight className="w-4 h-4 rotate-90" />
            </div>
          </div>
        </div>

        {/* Category Selectors */}
        <div className="space-y-8 mb-12">
          <div>
            <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wider flex items-center gap-2">
              <span className="text-white">1.</span> Select Hosting Tier
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex flex-col items-start gap-3 p-6 rounded-2xl border transition-all duration-300 text-left ${
                    selectedCategory === cat.id
                      ? "bg-blue-600 border-blue-500 text-white shadow-[0_0_30px_rgba(59,130,246,0.2)]"
                      : "bg-white/5 border-white/10 text-gray-400 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <cat.icon className={`w-6 h-6 ${selectedCategory === cat.id ? "text-white" : "text-blue-500"}`} />
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
              {plans[selectedCategory as keyof typeof plans].map((plan: any, idx: number) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`group relative bg-white/5 hover:bg-white/[0.07] border ${plan.popular ? 'border-blue-500/50' : 'border-white/10'} hover:border-blue-500/30 rounded-2xl p-4 md:p-6 transition-all duration-300 flex flex-col lg:flex-row items-center gap-6`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-6 bg-blue-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                      Popular Choice
                    </div>
                  )}

                  {/* Icon */}
                  <div className="flex-shrink-0 w-16 h-16 bg-blue-600/10 rounded-xl flex items-center justify-center border border-blue-500/20 group-hover:border-blue-500/50 transition-colors">
                    {selectedCategory === 'managed' ? (
                      plan.hardware === 'AMD' ? (
                        <CustomIcons.AMD className="w-10 h-10 text-[#ED1C24]" />
                      ) : (
                        <CustomIcons.Intel className="w-10 h-10 text-[#0071C5]" />
                      )
                    ) : (
                      <Music className="w-8 h-8 text-blue-500" />
                    )}
                  </div>

                  {/* Name */}
                  <div className="flex-1 text-center lg:text-left">
                    <h4 className="text-xl font-bold mb-1 group-hover:text-blue-400 transition-colors">{plan.name}</h4>
                    <p className="text-xs text-gray-500 font-medium tracking-wide uppercase">
                      {selectedCategory === 'managed' ? 'Managed by VexaNode Team' : 'Self-Managed Audio Node'}
                    </p>
                  </div>

                  {/* Specs */}
                  <div className="flex flex-wrap justify-center gap-3">
                    {selectedCategory === 'self-managed' ? (
                      <>
                        <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/5">
                          <Zap className="w-4 h-4 text-blue-500" />
                          <span className="text-xs font-bold text-gray-300">{plan.ram} RAM</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/5">
                          <Music className="w-4 h-4 text-blue-500" />
                          <span className="text-xs font-bold text-gray-300">{plan.players}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/5">
                          <Globe className="w-4 h-4 text-blue-500" />
                          <span className="text-xs font-bold text-gray-300">{plan.region}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/5">
                          <Zap className="w-4 h-4 text-blue-500" />
                          <span className="text-xs font-bold text-gray-300">{plan.ram}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/5">
                          <Cpu className="w-4 h-4 text-blue-500" />
                          <span className="text-xs font-bold text-gray-300 line-clamp-1 max-w-[150px]">{plan.cpu}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/5">
                          <HardDrive className="w-4 h-4 text-blue-500" />
                          <span className="text-xs font-bold text-gray-300">{plan.storage}</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Price & Action */}
                  <div className="flex items-center gap-8 ml-auto">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">{formatPrice(calculatePrice(plan.basePrice))}<span className="text-sm font-normal text-gray-500">/mo</span></div>
                      {selectedCycle !== 'monthly' && (
                        <div className="text-[10px] text-blue-500 font-bold uppercase tracking-tighter">Billed {selectedCycle}</div>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeploy(plan)}
                      className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] flex items-center gap-2"
                    >
                      Deploy Node
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <p className="text-center text-gray-500 text-sm mt-6 italic">
            * All managed plans are fully handled by our team. Open a ticket or DM us to order.
          </p>
        </div>

        {/* Info Grid */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { title: "3.50 GHz Base", desc: "High clock speeds for real-time audio encoding.", icon: Cpu },
            { title: "30+ Sources", desc: "YouTube, Spotify, Soundcloud, and more supported.", icon: Music },
            { title: "50Gbps Network", desc: "Massive network backbone for zero audio buffering.", icon: Shield },
            { title: "Full Management", desc: "Let our experts handle the setup and maintenance.", icon: Sparkles }
          ].map((feature, idx) => (
            <div key={idx} className="p-8 rounded-3xl bg-white/5 border border-white/10">
              <feature.icon className="w-10 h-10 text-blue-500 mb-6" />
              <h4 className="text-lg font-bold mb-2 orbitron-font">{feature.title}</h4>
              <p className="text-sm text-gray-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
        
        <LavalinkTest />
      </main>

      <Footer />
    </div>
  )
}
