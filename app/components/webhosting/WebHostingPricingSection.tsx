"use client"

import { motion } from "framer-motion"
import { Server, Cpu, MemoryStick, HardDrive, Wifi, HeartPulse } from "lucide-react"
import { useState } from "react"
import Image from "next/image"
import webhostingConfig from "../../config/sections/webhosting.json"
import type { WebHostingConfig } from "../../types/webhosting"
import { CurrencySelector, useCurrency } from "../ui/CurrencySelector"
import { useLanguage } from "../../contexts/LanguageContext"

const config = webhostingConfig as WebHostingConfig

export default function WebHostingPricingSection() {
  const { selectedCurrency, setSelectedCurrency, convertPrice } = useCurrency()
  const { t } = useLanguage()
  const [selectedPlanType, setSelectedPlanType] = useState(config.planTypes[0].id)

  const currentPlans = config.plans[selectedPlanType] || config.plans[config.planTypes[0].id]

  return (
    <div className="bg-gray-50 dark:bg-[#0a0b0f] relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('/banners/webhosting.png')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-gray-50/40 to-transparent dark:from-[#0a0b0f] dark:via-[#0a0b0f]/30 dark:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-gray-50/80 to-gray-50/40 dark:from-[#0a0b0f] dark:via-[#0a0b0f]/45 dark:to-[#0a0b0f]/60" />
      </div>

      <div className="relative z-10 mt-16 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-left mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
            <div className="flex-1">
              <div className="inline-flex items-left gap-2 card-primary px-4 py-2 rounded-tl-2xl rounded-br-2xl mb-4 border border-secondary">
                <span className="icon-text-primary text-sm">{t('webHostingPricing.badge')}</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 orbitron-font">
                {t('webHostingPricing.title').split(" ").slice(0, -1).join(" ")}{" "}
                <span className="icon-text-primary relative">
                  {t('webHostingPricing.title').split(" ").slice(-1)[0]}
                  <motion.svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1418 125"
                    className="absolute left-0 w-full text-icon-text-primary"
                    initial={{ opacity: 0, pathLength: 0 }}
                    animate={{ opacity: 1, pathLength: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                  >
                    <path
                      d="M1412.29 72.17c-11.04-5.78-20.07-14.33-85.46-25.24-22.37-3.63-44.69-7.56-67.07-11.04-167.11-22.06-181.65-21.24-304.94-30.56C888.78 1.39 822.57 1.1 756.44 0c-46.63-.11-93.27 1.56-139.89 2.5C365.5 13.55 452.86 7.68 277.94 23.15 202.57 33.32 127.38 45.01 52.07 55.69c-11.23 2.41-22.63 4.17-33.71 7.22C6.1 66.33 5.64 66.19 3.89 67.79c-7.99 5.78-2.98 20.14 8.72 17.5 33.99-9.47 32.28-8.57 178.06-29.66 4.26 4.48 7.29 3.38 18.42 3.11 13.19-.32 26.38-.53 39.56-1.12 53.51-3.81 106.88-9.62 160.36-13.95 18.41-1.3 36.8-3.12 55.21-4.7 23.21-1.16 46.43-2.29 69.65-3.4 120.28-2.16 85.46-3.13 234.65-1.52 23.42.99 1.57-.18 125.72 6.9 96.61 8.88 200.92 27.94 295.42 46.12 40.87 7.91 116.67 23.2 156.31 36.78 3.81 1.05 8.28-.27 10.51-3.58 3.17-3.72 2.66-9.7-.78-13.13-3.25-3.12-8.14-3.44-12.18-5.08-17.89-5.85-44.19-12.09-63.67-16.56l26.16 3.28c23.02 3.13 46.28 3.92 69.34 6.75 10.8.96 25.43 1.81 34.34-4.39 2.26-1.54 4.86-2.75 6.21-5.27 2.76-4.59 1.13-11.06-3.59-13.68ZM925.4 23.77c37.64 1.4 153.99 10.85 196.64 14.94 45.95 5.51 91.89 11.03 137.76 17.19 24.25 4.77 74.13 11.21 101.72 18.14-11.87-1.15-23.77-1.97-35.65-3.06-133.46-15.9-266.8-33.02-400.47-47.21Z"
                      fill="currentColor"
                    />
                  </motion.svg>
                </span>
              </h2>
              <p className="text-md text-gray-600 max-w-3xl dark:text-gray-300">{t('webHostingPricing.description')}</p>
            </div>
            <CurrencySelector
              selectedCurrency={selectedCurrency}
              onCurrencyChange={setSelectedCurrency}
              className="w-full sm:w-64 mt-4 sm:mt-0"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-4"
        >
          <div className="flex flex-col items-left">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{t('webHostingPricing.step1')}</h3>
            <div className="flex flex-wrap gap-2">
              {config.planTypes.map((planType) => (
                <button
                  key={planType.id}
                  onClick={() => setSelectedPlanType(planType.id)}
                  className={`flex items-center gap-3 px-4 backdrop-blur-sm py-2 rounded-tl-2xl rounded-br-2xl font-medium transition-all duration-300 ${selectedPlanType === planType.id
                      ? "button-primary border-primary text-button-primary shadow-lg"
                      : "bg-gray-200 dark:bg-gray-800/20 border border-secondary text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700/30 hover:border-secondary"
                    }`}
                >
                  <Image
                    src={planType.image || "/placeholder.svg"}
                    alt={planType.name}
                    width={32}
                    height={32}
                    className="rounded-md object-contain bg-transparent"
                  />
                  <span className="text-sm font-semibold">{planType.displayName}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{t('webHostingPricing.step2')}</h3>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                className="relative bg-white dark:bg-gray-950/20 backdrop-blur-xl rounded-md overflow-hidden border border-secondary hover:border-secondary dark:hover:border-secondary transition-all duration-300"
              >
                {plan.badge && (
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 text-xs font-medium text-white button-primary rounded-tl-2xl rounded-br-2xl">
                      {plan.badge}
                    </span>
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{t('webHostingPricing.webHosting')}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Cpu className="w-4 h-4 icon-primary" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{plan.cpuDetail}</span>
                      </div>
                      <span className="text-lg font-medium text-gray-900 dark:text-white">{plan.cpu}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <MemoryStick className="w-4 h-4 icon-primary" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{plan.ramDetail}</span>
                      </div>
                      <span className="text-lg font-medium text-gray-900 dark:text-white">{plan.ram}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <HardDrive className="w-4 h-4 icon-primary" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{plan.storageDetail}</span>
                      </div>
                      <span className="text-lg font-medium text-gray-900 dark:text-white">{plan.storage}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Wifi className="w-4 h-4 icon-primary" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{plan.bandwidthDetail}</span>
                      </div>
                      <span className="text-lg font-medium text-gray-900 dark:text-white">{plan.bandwidth}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-6">
                    <HeartPulse className="w-4 h-4 icon-primary" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{plan.uptime}</span>
                  </div>
                  <div className="mt-6">
                    <div className="flex items-baseline justify-center mb-4">
                      <span className="text-3xl font-bold orbitron-font text-gray-900 dark:text-white">
                        {convertPrice(plan.price)}
                      </span>
                      <span className="ml-1 text-gray-500 dark:text-gray-400">{plan.period}</span>
                    </div>
                    <a
                      href={plan.orderLink}
                      className="orbitron-font w-full button-primary text-button-primary px-6 py-3 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center gap-2 border border-transparent hover:bg-[var(--hover-gradient)] hover:text-[var(--icon-text-primary)] hover:border-[var(--border-secondary)]"
                    >
                      {t('webHostingPricing.orderNow')}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
