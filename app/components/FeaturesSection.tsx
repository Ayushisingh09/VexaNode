"use client"

import { motion, useScroll, useInView } from "framer-motion"
import { useRef } from "react"
import { 
  FaMicrochip, 
  FaBolt, 
  FaShieldAlt, 
  FaHeartbeat, 
  FaCogs, 
  FaChartLine, 
  FaCloud
} from "react-icons/fa"
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
      icon: FaMicrochip,
      title: "High Performance",
      description: "Experience the fastest speeds with our premium hardware nodes."
    },
    {
      icon: FaBolt,
      title: "Ultra-Low Latency",
      description: "Strategically located nodes for the best possible ping."
    },
    {
      icon: FaShieldAlt,
      title: "Advanced Security",
      description: "State-of-the-art DDoS protection to keep your services safe."
    },
    {
      icon: FaHeartbeat,
      title: "99.9% Uptime",
      description: "Our infrastructure is designed for maximum availability."
    },
    {
      icon: FaCogs,
      title: "Full Control",
      description: "Manage your services with our easy-to-use control panel."
    },
    {
      icon: FaChartLine,
      title: "Instant Scaling",
      description: "Upgrade your resources on the fly with just a few clicks."
    },
    {
      icon: FaCloud,
      title: "Global Network",
      description: "Deploy your services across multiple locations worldwide."
    }
  ]

  const FeatureCard = ({ feature, index }: { feature: Feature; index: number }) => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-100px" })
    const Icon = feature.icon;
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        className="bg-white/40 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300 group"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <Icon className="w-6 h-6 text-blue-500" />
          </div>
          <span className="text-4xl font-bold text-white/5 orbitron-font">{index + 1}</span>
        </div>
        <h3 className="text-xl font-bold text-white mb-2 orbitron-font">{feature.title}</h3>
        <p className="text-gray-400 text-sm">{feature.description}</p>
      </motion.div>
    );
  };

  return (
    <div className="bg-[#0a0b0f] relative py-24 px-4 sm:px-6 lg:px-8">
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4 orbitron-font">
            What Do We <span className="text-blue-500">Offer?</span>
          </h2>
          <p className="text-gray-400 text-lg">Everything you need to host your projects with confidence.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </div>
  )
}
