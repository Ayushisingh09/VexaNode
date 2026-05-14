"use client"

import { motion } from "framer-motion"
import { FileText, Scale, AlertCircle, CheckCircle2, UserCheck, Gavel, Clock, Globe } from "lucide-react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

const terms = [
  {
    title: "Acceptance of Terms",
    content: "By accessing or using VexaNode's hosting services, you agree to be bound by these Terms of Service. If you do not agree to all terms and conditions, you must not access the website or use our services. These terms apply to all visitors, users, and others who access or use the Service."
  },
  {
    title: "User Responsibilities",
    content: "You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer. You agree to accept responsibility for all activities that occur under your account or password. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account."
  },
  {
    title: "Service Availability",
    content: "While we strive for 100% uptime, VexaNode does not guarantee that our services will be available at all times. We reserve the right to modify, suspend, or discontinue any part of the service with or without notice. We are not liable for any service interruptions or data loss resulting from maintenance or technical issues."
  },
  {
    title: "Acceptable Use Policy",
    content: "Our services must not be used for any illegal purposes or to distribute malware, spam, or copyrighted material without authorization. We reserve the right to terminate accounts that violate our Acceptable Use Policy (AUP) without refund."
  },
  {
    title: "Payments and Refunds",
    content: "Subscription fees are billed in advance on a recurring basis. All payments are non-refundable unless otherwise specified in our dedicated Refund Policy. Failure to pay on time may result in immediate suspension or termination of your services."
  },
  {
    title: "Limitation of Liability",
    content: "In no event shall VexaNode, nor its directors, employees, partners, or agents, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, or other intangible losses."
  }
]

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#0a0b0f] text-white selection:bg-blue-500/30">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-40 pb-20 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_70%)] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-500/20 px-4 py-2 rounded-full mb-8"
          >
            <Scale className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Legal Agreement</span>
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 orbitron-font">
            Terms of <span className="text-blue-500">Service</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
            These terms govern your use of the VexaNode platform. By using our services, you agree to abide by these guidelines.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500 font-bold">
            <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> Last Revised: May 2026</span>
            <span className="flex items-center gap-2"><Gavel className="w-4 h-4" /> Binding Agreement</span>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="pb-32 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
             <div className="p-6 rounded-2xl bg-blue-600/5 border border-blue-500/20 flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-blue-500 mt-1" />
                <div>
                   <h3 className="font-bold mb-1">Our Commitment</h3>
                   <p className="text-sm text-gray-400">To provide stable, high-performance hosting with expert technical support.</p>
                </div>
             </div>
             <div className="p-6 rounded-2xl bg-red-600/5 border border-red-500/20 flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-red-500 mt-1" />
                <div>
                   <h3 className="font-bold mb-1">Your Responsibility</h3>
                   <p className="text-sm text-gray-400">To use our resources legally and keep your account information secure.</p>
                </div>
             </div>
          </div>

          <div className="space-y-8">
            {terms.map((term, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:border-blue-500/30 transition-all group"
              >
                <div className="flex items-center gap-4 mb-4">
                   <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all font-bold orbitron-font">
                      {idx + 1}
                   </div>
                   <h2 className="text-xl font-bold orbitron-font">{term.title}</h2>
                </div>
                <p className="text-gray-400 leading-relaxed pl-14">
                  {term.content}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="mt-20 p-12 rounded-3xl bg-gradient-to-br from-blue-600/20 to-transparent border border-blue-500/20 text-center">
             <h3 className="text-2xl font-bold mb-4 orbitron-font">Questions?</h3>
             <p className="text-gray-400 mb-8 max-w-xl mx-auto">
               Our legal and support teams are here to help you understand our service agreements. Feel free to reach out anytime.
             </p>
             <button className="bg-white text-black hover:bg-blue-50 px-10 py-4 rounded-xl font-bold transition-all shadow-xl">
               Contact Support
             </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
