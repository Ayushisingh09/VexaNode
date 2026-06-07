'use client'

import { motion } from 'framer-motion'
import { Check, X, Shield, Zap, Clock, Cpu, HeartHandshake } from 'lucide-react'

const features = [
  {
    name: "Enterprise Hardware",
    vexa: "Latest Ryzen/Intel CPUs",
    others: "Aging Xeon E5 Series",
    icon: Cpu
  },
  {
    name: "Storage Technology",
    vexa: "NVMe Gen4 SSDs",
    others: "SATA or Older SSDs",
    icon: Zap
  },
  {
    name: "DDoS Mitigation",
    vexa: "Advanced Path/Cosmic",
    others: "Basic Null-Route Only",
    icon: Shield
  },
  {
    name: "Support Response",
    vexa: "Under 15 Minutes",
    others: "Up to 24-48 Hours",
    icon: Clock
  },
  {
    name: "Uptime Guarantee",
    vexa: "99.9% Service Level",
    others: "Best Effort Only",
    icon: HeartHandshake
  }
]

export default function ComparisonSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold px-3 py-1 rounded border border-emerald-500/20 mb-6 tracking-widest uppercase"
        >
          <Zap className="w-3 h-3 fill-current" />
          The Vexa Advantage
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-5xl font-black mb-6 tracking-tight leading-tight"
        >
          Why Choose <span className="text-blue-500">VexaNode?</span>
        </motion.h2>
      </div>

      <div className="bg-[#0c0d12] border border-[#1f2129] rounded-[3rem] overflow-hidden shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-3 bg-[#111218] border-b border-[#1f2129] py-8 px-8">
          <div className="hidden md:block text-gray-500 font-bold uppercase tracking-widest text-xs self-center">Feature</div>
          <div className="text-center text-blue-500 font-black tracking-widest uppercase text-sm">VexaNode</div>
          <div className="hidden md:block text-center text-gray-500 font-bold tracking-widest uppercase text-sm">Standard Hosts</div>
        </div>

        <div className="divide-y divide-[#1f2129]">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="grid grid-cols-1 md:grid-cols-3 py-8 px-8 gap-6 md:gap-0 group hover:bg-white/[0.02] transition-colors"
              >
                {/* Feature Name */}
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-blue-500 group-hover:bg-blue-500/10 transition-all">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-gray-300">{feature.name}</span>
                </div>

                {/* Vexa Value */}
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="md:hidden text-[10px] font-bold text-blue-500/50 uppercase tracking-widest mb-2">VexaNode</div>
                  <div className="flex items-center gap-3 bg-blue-500/10 text-blue-400 px-4 py-2 rounded-xl border border-blue-500/20 font-bold text-sm">
                    <Check className="w-4 h-4" />
                    {feature.vexa}
                  </div>
                </div>

                {/* Others Value */}
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="md:hidden text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-2">Others</div>
                  <div className="flex items-center gap-3 bg-white/5 text-gray-500 px-4 py-2 rounded-xl border border-white/5 font-medium text-sm">
                    <X className="w-4 h-4 opacity-50" />
                    {feature.others}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
