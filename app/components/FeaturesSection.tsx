"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Cpu, Zap, Shield, Activity, Sliders, TrendingUp, Globe } from "lucide-react"
import { useLanguage } from "../contexts/LanguageContext"

interface Feature {
  icon: React.ElementType;
  title: string;
  description: string;
}

export default function FeaturesSection() {
  const { t } = useLanguage()

  const features: Feature[] = [
    {
      icon: Cpu,
      title: "High Performance",
      description: "Experience blazing fast speeds powered by premium AMD Ryzen 9 9950X / 7950X3D nodes."
    },
    {
      icon: Zap,
      title: "Ultra-Low Latency",
      description: "Strategically located edge nodes for optimal routing and the lowest possible game ping."
    },
    {
      icon: Shield,
      title: "Advanced Security",
      description: "Enterprise-grade multi-terabit DDoS mitigation algorithms keeping your services online 24/7."
    },
    {
      icon: Activity,
      title: "99.9% Uptime SLA",
      description: "Redundant power supplies, network carriers, and hardware nodes guarantee absolute availability."
    },
    {
      icon: Sliders,
      title: "Complete Control",
      description: "Manage servers, schedule backups, and track metrics easily from our bespoke control panel."
    },
    {
      icon: TrendingUp,
      title: "Instant Scaling",
      description: "Dynamically allocate additional RAM, CPU cores, or NVMe storage capacity in real-time."
    },
    {
      icon: Globe,
      title: "Global Network",
      description: "Deploy workloads in seconds across premium data centers globally with premium network links."
    }
  ]

  const FeatureCard = ({ feature, index }: { feature: Feature; index: number }) => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-80px" })
    const Icon = feature.icon;
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.5, delay: index * 0.05 }}
        className="bg-[#0b0c16]/30 backdrop-blur-md rounded-2xl p-6 border-cyber-glow-brand group transition-all duration-300 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        
        <div className="flex justify-between items-start mb-6">
          <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-white/10 transition-colors">
            <Icon className="w-6 h-6 text-[#228dbd]" />
          </div>
          <span className="text-5xl font-black text-white/5 orbitron-font select-none">
            {(index + 1).toString().padStart(2, '0')}
          </span>
        </div>
        <h3 className="text-xl font-bold text-white mb-2 orbitron-font uppercase tracking-tight">{feature.title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
      </motion.div>
    );
  };

  return (
    <div className="bg-[#030408] relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background brand glow blobs - performance-optimized with will-change */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#228dbd]/5 rounded-full blur-[140px] pointer-events-none will-change-transform" />
      <div className="absolute top-10 -right-32 w-80 h-80 bg-[#228dbd]/5 rounded-full blur-[140px] pointer-events-none will-change-transform" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl sm:text-6xl font-black text-white mb-4 orbitron-font uppercase tracking-tight">
              Enterprise <span className="text-[#228dbd] text-neon-glow-brand">Infrastructure</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto quicksand-font">
              Engineered with premium hardware and low-latency network routes to host your workloads with absolute reliability.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </div>
  )
}
