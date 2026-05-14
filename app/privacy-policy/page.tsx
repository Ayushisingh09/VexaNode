"use client"

import { motion } from "framer-motion"
import { Shield, Lock, Eye, FileText, Globe, Clock, ChevronRight } from "lucide-react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

const sections = [
  {
    title: "Information We Collect",
    content: "We collect information you provide directly to us, such as when you create or modify your account, request services, contact customer support, or otherwise communicate with us. This information may include name, email address, phone number, postal address, profile picture, payment method, and other information you choose to provide."
  },
  {
    title: "How We Use Information",
    content: "We use the information we collect to provide, maintain, and improve our services, such as to facilitate payments, send receipts, provide products and services you request, and develop new features. We also use it to personalize the services, including providing content and features that match your interests."
  },
  {
    title: "Data Security",
    content: "We take the security of your data seriously. VexaNode implements industry-standard technical and organizational measures to protect your information against unauthorized access, disclosure, alteration, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure."
  },
  {
    title: "Cookies and Tracking",
    content: "We use cookies and similar tracking technologies to track the activity on our service and hold certain information. Cookies are files with small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent."
  },
  {
    title: "Third-Party Services",
    content: "Our services may contain links to other websites that are not operated by us. If you click on a third-party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit. We have no control over and assume no responsibility for the content or practices of any third-party sites."
  }
]

export default function PrivacyPolicy() {
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
            <Shield className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Trust & Security</span>
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 orbitron-font">
            Privacy <span className="text-blue-500">Policy</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
            Your privacy is paramount. This policy outlines how we handle, protect, and utilize your personal information at VexaNode.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500 font-bold">
            <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> Last Updated: May 2026</span>
            <span className="flex items-center gap-2"><Globe className="w-4 h-4" /> Effective Globally</span>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="pb-32 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl">
             <div className="p-8 md:p-12 space-y-16">
               {sections.map((section, idx) => (
                 <motion.div 
                   key={idx}
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: idx * 0.1 }}
                   className="relative pl-8 md:pl-12 border-l border-white/5"
                 >
                   <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.5)] border-4 border-[#0a0b0f]" />
                   <h2 className="text-2xl font-bold mb-4 orbitron-font text-white">{idx + 1}. {section.title}</h2>
                   <div className="text-gray-400 leading-relaxed space-y-4">
                     <p>{section.content}</p>
                   </div>
                 </motion.div>
               ))}

               <div className="pt-12 border-t border-white/5 text-center">
                 <p className="text-sm text-gray-500 mb-6 italic">
                   If you have any questions about this Privacy Policy, please contact our legal team at <a href="mailto:legal@vexanode.cloud" className="text-blue-500 hover:underline">legal@vexanode.cloud</a>.
                 </p>
                 <button className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-xl flex items-center gap-2 mx-auto">
                   Download Full Policy <ChevronRight className="w-4 h-4" />
                 </button>
               </div>
             </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
