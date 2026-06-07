"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import Image from "next/image"
import {
  Zap,
  Shield,
  Cpu,
  Archive,
  Plug,
  HeartPulse
} from "lucide-react"
import showcaseConfig from "@/app/config/sections/showcase.json"
import { useLanguage } from '../contexts/LanguageContext';

interface ShowcaseCard {
  id: number;
  icon: React.ElementType;
  title: string;
  description: string;
  imageDark: string;
  imageLight: string;
}

const iconMap = {
  Zap,
  Shield,
  Cpu,
  Archive,
  Plug,
  HeartPulse
}

export default function PanelShowcase() {
  const { t } = useLanguage();
  const [activeCard, setActiveCard] = useState(0)
  const [progress, setProgress] = useState(0)
  const showcaseCards: ShowcaseCard[] = showcaseConfig.showcase.cards.map(card => ({
    id: card.id,
    icon: iconMap[card.icon as keyof typeof iconMap],
    title: card.title,
    description: card.description,
    imageDark: card.imageDark,
    imageLight: card.imageLight
  }))

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 2 
        return newProgress >= 100 ? 100 : newProgress
      })
    }, 100)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (progress >= 100) {
      setActiveCard(current => (current + 1) % showcaseCards.length)
      setProgress(0)
    }
  }, [progress, showcaseCards.length])

  const handleCardClick = (index: number) => {
    setActiveCard(index)
    setProgress(0)
  }

  return (
    <div className="bg-[#030408] relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden border-t border-b border-white/5">
      {/* Background glow blobs */}
      <div className="absolute top-20 -left-32 w-64 h-64 bg-[#228dbd]/5 rounded-full blur-3xl pointer-events-none will-change-transform" />
      <div className="absolute bottom-20 -right-32 w-72 h-72 bg-[#228dbd]/5 rounded-full blur-3xl pointer-events-none will-change-transform" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-left mb-8"
        >
          <div className="inline-flex items-center gap-2 card-primary px-4 py-2 rounded-tl-2xl rounded-br-2xl mb-4 border border-secondary">
            <span className="icon-text-primary orbitron-font text-sm">{t('panelShowcase.badge')}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3 orbitron-font sm:mb-4 uppercase tracking-tight">
            {t('panelShowcase.title').split(' ').slice(0, -1).join(' ')} <span className="text-[#228dbd] text-neon-glow-brand">{t('panelShowcase.title').split(' ').slice(-1)[0]}</span>
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('panelShowcase.subtitle')}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 lg:items-stretch">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col h-full"
          >
            <div className="flex flex-col flex-1 gap-4">
              {showcaseCards.map((card, index) => {
                const Icon = card.icon
                const isActive = index === activeCard

                return (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    onClick={() => handleCardClick(index)}
                    className={`relative cursor-pointer transition-all duration-300 bg-[#0c0e1a]/30 backdrop-blur-md border rounded-xl overflow-hidden ${isActive
                        ? 'border-[#228dbd]/50 shadow-lg shadow-[#228dbd]/10'
                        : 'border-white/5 hover:border-[#228dbd]/30'
                      } flex-1 group`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br from-[#228dbd]/5 to-transparent transition-opacity ${isActive ? 'opacity-100' : 'opacity-0'}`} />
                    <div className="flex justify-between items-start">
                      <div className="flex-1 p-4 sm:p-6">
                        <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 text-white">
                          {card.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-400">
                          {card.description}
                        </p>
                      </div>
                      <div className="bg-white dark:bg-white/3 w-10 h-10 sm:w-12 sm:h-12 border-l border-b border-gray-200 dark:border-white/3 rounded-tr-md flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#228dbd]" />
                      </div>
                    </div>

                    {isActive && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 ">
                        <motion.div
                          className="h-full rounded-full bg-[#228dbd]"
                          initial={{ width: "0%" }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.1, ease: "linear" }}
                        />
                      </div>
                    )}

                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative flex h-full"
          >
            <div className="relative w-full bg-[#0c0e1a]/40 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden flex flex-col h-full">
              <div className="flex-1 pb-0">
                <div className="relative w-full h-full min-h-[200px] sm:min-h-[300px] md:min-h-[400px] rounded-lg overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeCard}
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0"
                    >
                      <div className="hidden dark:block w-full h-full">
                        <Image
                          src={showcaseCards[activeCard].imageDark}
                          alt={showcaseCards[activeCard].title}
                          fill
                          className="object-cover object-top"
                          quality={85}
                          priority={activeCard === 0}
                        />
                      </div>
                      <div className="block dark:hidden w-full h-full">
                        <Image
                          src={showcaseCards[activeCard].imageLight}
                          alt={showcaseCards[activeCard].title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
                          className="object-cover object-top"
                          quality={85}
                          priority={activeCard === 0}
                        />
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              <div className="p-3 sm:p-6">
                <motion.div
                  key={activeCard}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 }}
                >
                  <h3 className="text-white text-lg sm:text-xl font-semibold mb-2">
                    {showcaseCards[activeCard].title}
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-sm">
                    {showcaseCards[activeCard].description}
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
