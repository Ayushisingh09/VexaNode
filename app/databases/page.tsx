"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Database, Zap, Shield, ChevronRight, Server, HardDrive, Cpu, CheckCircle2, LayoutGrid, Layers } from "lucide-react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { useCurrency } from "../contexts/CurrencyContext"

const dbPlans = [
  {
    id: "mongodb",
    name: "MongoDB",
    desc: "Globally available with multi-region support. Scalable, fast, and reliable built for all workloads. Ideal for developers, startups, and enterprises.",
    features: [
      "MongoDB 7 version",
      "Multi-region deployment",
      "High availability & replication",
      "Scales with any workload",
      "Suitable for modern app development"
    ],
    icon: "Database",
    color: "emerald"
  },
  {
    id: "sql",
    name: "SQL Hosting",
    desc: "Globally distributed SQL hosting with fast query performance. Designed to scale with your apps, ensuring reliability for any database size or use case.",
    features: [
      "Supports major SQL engines",
      "Multi-region availability",
      "Optimized query performance",
      "Scalable for all workloads",
      "Reliable for apps & websites"
    ],
    icon: "Layers",
    color: "blue"
  },
  {
    id: "redis",
    name: "Redis Hosting",
    desc: "High-speed Redis hosting with multi-region support. Ideal for caching, real-time systems, and performance-critical applications.",
    features: [
      "Redis key-value store",
      "Ultra-low latency",
      "Multi-region support",
      "Scalable for high throughput",
      "Perfect for real-time apps"
    ],
    icon: "Zap",
    color: "red"
  }
]

export default function DatabasePage() {
  const { formatPrice } = useCurrency()
  const [ram, setRam] = useState(1)
  const [ssd, setSsd] = useState(5)

  const calculateExtraPrice = () => {
    const basePrice = 40
    const extraRamPrice = (ram - 1) * 15
    const extraSsdPrice = (ssd - 5) / 5 * 10
    return basePrice + extraRamPrice + extraSsdPrice
  }

  return (
    <div className="min-h-screen bg-[#0a0b0f] text-white selection:bg-[#228dbd]/30">
      <Navbar />

      <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block bg-[#228dbd]/10 text-[#228dbd] text-xs font-bold px-4 py-1.5 rounded-full border border-[#228dbd]/20 mb-4 orbitron-font"
          >
            Managed Data Solutions
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black mb-6 orbitron-font uppercase tracking-tight"
          >
            Powerful Managed <br />
            <span className="text-[#228dbd] text-neon-glow-brand">Databases</span>
          </motion.h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg quicksand-font">
            High-performance, scalable, and fully managed database hosting. We handle the infrastructure so you can focus on building your app.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          {dbPlans.map((plan, idx) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 + 0.3 }}
              className="group bg-[#0b0c16]/30 backdrop-blur-md border border-white/10 rounded-[40px] p-8 hover:border-[#228dbd]/30 transition-all flex flex-col"
            >
              <div className={`w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform ${plan.id === 'sql' ? 'group-hover:border-[#228dbd]/30' : ''}`}>
                {plan.icon === "Database" ? <Database className="w-8 h-8 text-emerald-500" /> : 
                 plan.icon === "Layers" ? <Layers className="w-8 h-8 text-[#228dbd]" /> : 
                 <Zap className="w-8 h-8 text-red-500" />}
              </div>
              
              <h3 className="text-2xl font-black mb-4 orbitron-font uppercase tracking-tight group-hover:text-[#228dbd] transition-colors">{plan.name}</h3>
              <p className="text-gray-400 text-sm mb-8 leading-relaxed flex-1 quicksand-font">
                {plan.desc}
              </p>

              <div className="space-y-4 mb-10 border-t border-white/5 pt-6">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#228dbd]" />
                    <span className="text-xs text-gray-300 font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="pt-8 border-t border-white/5 mt-auto">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Starting at</div>
                    <div className="text-3xl font-black text-white orbitron-font">{formatPrice(40)}<span className="text-sm font-normal text-gray-500">/mo</span></div>
                  </div>
                </div>
                <a 
                  href="https://discord.vexanode.cloud"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#228dbd] hover:bg-[#1a6e94] text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 orbitron-font uppercase tracking-wider text-xs"
                >
                  Add to cart
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dynamic Pricing Calculator */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#0b0c16]/30 backdrop-blur-md border border-white/10 rounded-[40px] p-8 md:p-12 mb-32"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-black mb-6 orbitron-font uppercase tracking-tight">Scale Your <span className="text-[#228dbd] text-neon-glow-brand">Resources</span></h2>
              <p className="text-gray-400 mb-10 quicksand-font">Need more power? Instantly scale your database memory and storage as your application grows.</p>
              
              <div className="space-y-10">
                <div>
                  <div className="flex justify-between mb-4">
                    <span className="text-sm font-bold text-gray-300 uppercase tracking-widest">Memory (RAM)</span>
                    <span className="text-sm font-bold text-[#228dbd]">{ram} GB</span>
                  </div>
                  <input 
                    type="range" min="1" max="64" step="1" 
                    value={ram} onChange={(e) => setRam(parseInt(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#228dbd]" 
                  />
                  <div className="flex justify-between mt-2 text-[10px] text-gray-500 font-bold">
                    <span>1 GB</span>
                    <span>64 GB</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-4">
                    <span className="text-sm font-bold text-gray-300 uppercase tracking-widest">SSD Storage</span>
                    <span className="text-sm font-bold text-[#228dbd]">{ssd} GB</span>
                  </div>
                  <input 
                    type="range" min="5" max="500" step="5" 
                    value={ssd} onChange={(e) => setSsd(parseInt(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#228dbd]" 
                  />
                  <div className="flex justify-between mt-2 text-[10px] text-gray-500 font-bold">
                    <span>5 GB</span>
                    <span>500 GB</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#050507] border border-white/10 rounded-[32px] p-8 text-center flex flex-col justify-center items-center shadow-2xl">
              <div className="w-16 h-16 bg-[#228dbd]/20 rounded-full flex items-center justify-center mb-6">
                <LayoutGrid className="w-8 h-8 text-[#228dbd]" />
              </div>
              <h4 className="text-lg font-bold mb-2">Estimated Monthly Total</h4>
              <div className="text-5xl font-black text-white mb-4 orbitron-font">
                {formatPrice(calculateExtraPrice())}
              </div>
              <p className="text-xs text-gray-500 mb-8 quicksand-font">
                Billed monthly. Cancel anytime. <br /> Includes backup and 24/7 monitoring.
              </p>
              <a 
                href="https://discord.vexanode.cloud"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#228dbd] hover:bg-[#1a6e94] text-white font-bold py-4 rounded-2xl transition-all shadow-xl block orbitron-font uppercase tracking-wider text-xs"
              >
                Configure My Database
              </a>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}
