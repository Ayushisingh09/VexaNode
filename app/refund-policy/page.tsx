"use client"

import { motion } from "framer-motion"
import { CreditCard, RotateCcw, AlertCircle, CheckCircle2, ShieldCheck, Mail, MessageSquare, Clock, Landmark } from "lucide-react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

const refundRules = [
  {
    title: "1. 24-Hour Trial Period",
    content: "We offer a 24-hour money-back guarantee for first-time customers on select shared hosting services. If you are not satisfied with the performance, you can request a full refund within this window.",
    icon: Clock
  },
  {
    title: "2. Eligibility Criteria",
    content: "Refunds are only eligible for new service deployments. Renewals, dedicated servers, domain registrations, and licenses are strictly non-refundable due to the nature of resource allocation and third-party billing.",
    icon: CheckCircle2
  },
  {
    title: "3. Cryptopayments & Credits",
    content: "Payments made via Cryptocurrency (BTC, LTC, etc.) are non-refundable to the original payment method but may be eligible for credit to your VexaNode account balance at our discretion.",
    icon: Landmark
  },
  {
    title: "4. Abuse & Violations",
    content: "Services suspended or terminated due to violations of our Acceptable Use Policy (AUP) or Terms of Service are not eligible for any refund, regardless of the time remaining in the billing period.",
    icon: AlertCircle
  },
  {
    title: "5. Processing Time",
    content: "Eligible refund requests are processed within 3-5 business days. Depending on your bank or payment provider, it may take up to 10 days for the funds to appear in your account.",
    icon: RotateCcw
  },
  {
    title: "6. Host Closure & Long-Term Accounts",
    content: "If a hosting account is closed by VexaNode or a service experiences an irrecoverable issue, no refunds will be initiated. Additionally, accounts that have been using our services for more than six months ("permanent clients") are generally not eligible for refunds related to service disclosures, discontinuations, or similar changes. Exceptions may be made at VexaNode's sole discretion.",
    icon: ShieldCheck
  }
]

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-[#08090d] text-white selection:bg-blue-500/30">
      <Navbar />

      <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 text-[10px] font-bold px-3 py-1 rounded-full border border-blue-500/20 mb-6 tracking-widest uppercase"
          >
            <CreditCard className="w-3 h-3" />
            Billing Transparency
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black mb-6 tracking-tighter"
          >
            Refund <span className="text-blue-500">Policy</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 max-w-xl mx-auto text-lg leading-relaxed font-medium"
          >
            Our clear and fair guidelines for payment reversals, credits, and service cancellations.
          </motion.p>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-4 mb-24">
          {refundRules.map((rule, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="group bg-[#0c0d12] border border-[#1f2129] hover:border-[#2d303d] rounded-[2.5rem] p-8 md:p-12 transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center flex-shrink-0 border border-blue-500/20 group-hover:bg-blue-500 group-hover:border-blue-500 transition-colors duration-500">
                  <rule.icon className="w-7 h-7 text-blue-500 group-hover:text-white transition-colors duration-500" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-4 tracking-tight text-white">{rule.title}</h2>
                  <p className="text-gray-400 leading-relaxed text-base">
                    {rule.content}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Billing Support CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden group/cta"
        >
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black mb-8 text-black leading-tight tracking-tighter uppercase">
              Billing Question?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-12 text-lg md:text-xl leading-relaxed">
              If you have any questions regarding an invoice, payment, or potential refund, our billing specialists are here to help.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <a
                href="/contact"
                className="w-full sm:w-auto bg-black text-white px-10 py-5 rounded-2xl font-black hover:bg-gray-900 transition-all flex items-center justify-center gap-2 text-base shadow-2xl"
              >
                Contact Billing
                <MessageSquare className="w-5 h-5" />
              </a>
              <a
                href="https://discord.vexanode.cloud"
                className="w-full sm:w-auto bg-transparent text-black border-2 border-black/10 px-10 py-5 rounded-2xl font-bold hover:bg-black/5 transition-all flex items-center justify-center gap-2"
              >
                Discord Ticket
              </a>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}
