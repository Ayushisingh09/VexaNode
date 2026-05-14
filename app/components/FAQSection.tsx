"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { TbChevronUpRight, TbChevronDownRight } from "react-icons/tb"
import { useState } from "react"
import Image from "next/image"
import { useLanguage } from "../contexts/LanguageContext"

interface FAQItem {
  question: string
  answer: string
}

export default function FAQSection() {
  const { t } = useLanguage()
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs: FAQItem[] = [
    {
      question: t('faq.question1'),
      answer: t('faq.answer1')
    },
    {
      question: t('faq.question2'),
      answer: t('faq.answer2')
    },
    {
      question: t('faq.question3'),
      answer: t('faq.answer3')
    },
    {
      question: t('faq.question4'),
      answer: t('faq.answer4')
    },
    {
      question: t('faq.question5'),
      answer: t('faq.answer5')
    }
  ]

  return (
    <div className="bg-gray-50 dark:bg-[#0a0b0f] relative py-16 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-gray-50/90 to-gray-50 dark:from-[#0a0b0f] dark:via-[#0a0b0f]/90 dark:to-[#0a0b0f]" />

      <div className="absolute top-20 -left-32 w-64 h-64 blob-primary rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
          <div className="hidden md:block">
            <div className="sticky top-24">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
              >
                <div className="relative h-[300px] md:h-[500px] w-full">
                  <Image
                    src="/feature-9.webp"
                    alt="Server Features"
                    fill
                    style={{ objectFit: "contain" }}
                    className="rounded-lg"
                  />
                </div>
              </motion.div>
            </div>
          </div>

          <div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-4 orbitron-font">
                {t('faq.title').split(' ').slice(0, -1).join(' ')} <span className="icon-text-primary relative">
                  {t('faq.title').split(' ').slice(-1)[0]}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1729 149"
                    className="absolute left-0 w-full text-icon-text-primary"
                  >
                    <path
                      d="M1689.89 26.59a4479.17 4479.17 0 0 0-89.64-7.41C1354.1.45 1106.56-5.76 859.92 5.93c-227.31-4.25-454.79 8.96-681.36 27.95C121.94 38.9 65.1 40.2 8.38 42.12c-16.57 2.86-5.23 26.39 5.6 14.46 160.76-1.27 331.82-27.38 620.54-34.8A4574.9 4574.9 0 0 0 498.9 36.57C376.43 52.24 253.01 65.21 132.88 94.51c-36.16 8.94-71.67 20.31-106.69 32.95-7.14 4.4-27.74 3.63-24.98 15.62 1.99 7.19 13.63 7.05 18.04 2.59 143.67-54.58 297.49-70.64 448.88-90.24 129.01-16.82 258.61-28.01 388.46-34.27 285.02 6.07 570.13 38.15 848.22 100.65 3.84 1.09 8.24-1.32 9.23-5.24 1.98-7.31-5.66-9.96-11.42-10.6-48.05-10.76-96.18-21.26-144.56-30.43-160.68-28.2-322.86-46.78-485.4-60.19l-2.34-.16c161.55-1.33 323.21 4.35 484.31 15.71 37.11 2.65 125.06 8.85 164.97 13.96a7.58 7.58 0 0 0 8.45-6.41c.94-13.18-23.48-8.77-38.14-11.86Z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300">
                {t('faq.subtitle')}
              </p>
            </motion.div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="bg-white dark:bg-gray-900/5 backdrop-blur-sm border border-secondary rounded-md overflow-hidden hover:bg-gray-50 dark:hover:bg-transparent hover:border-secondary dark:hover:border-secondary hover:hover-gradient dark:hover:hover-gradient hover:text-icon-text-primary dark:hover:text-icon-text-primary transition-all duration-300"
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full px-4 sm:px-3 py-3 sm:py-3 flex items-center text-left gap-2 sm:gap-4"
                  >
                    <span className="orbitron-font flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-md card-primary dark:card-primary flex items-center justify-center icon-text-primary text-sm sm:text-base">
                      {(index + 1).toString().padStart(2, '0')}
                    </span>
                    <span className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white group-hover:text-icon-text-primary dark:group-hover:text-icon-text-primary">{faq.question}</span>
                    {openIndex === index ? (
                      <TbChevronDownRight className="w-5 h-5 icon-text-primary dark:icon-text-primary ml-auto" />
                    ) : (
                      <TbChevronUpRight className="w-5 h-5 icon-text-primary dark:icon-text-primary ml-auto" />
                    )}
                  </button>
                  <div
                    className={`px-4 sm:px-6 transition-all duration-300 overflow-hidden ${openIndex === index ? "pb-3 sm:pb-4 pl-[52px] sm:pl-[72px]" : "h-0"
                      }`}
                  >
                    <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">{faq.answer}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
