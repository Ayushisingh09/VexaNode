"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Ticket, 
  Plus, 
  MessageSquare, 
  Upload, 
  History,
  AlertCircle
} from "lucide-react"

export default function TicketsPage() {
  const [activeTab, setActiveTab] = useState("support")

  return (
    <div className="space-y-8">
      {/* Tabs */}
      <div className="flex gap-4 p-1.5 bg-white/5 rounded-2xl w-fit border border-white/5">
        {["support", "paid"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-2.5 rounded-xl text-xs font-bold transition-all uppercase tracking-widest ${
              activeTab === tab 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" 
                : "text-gray-500 hover:text-white"
            }`}
          >
            {tab} Tickets
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* New Ticket Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 rounded-[32px] p-8 md:p-10"
        >
          <h3 className="text-2xl font-bold mb-1 orbitron-font">Open {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Ticket</h3>
          <p className="text-xs text-gray-500 mb-8">This creates a {activeTab} thread. Only users open it from here.</p>

          <div className="space-y-6">
            <div className="bg-[#050507] border border-white/5 rounded-2xl p-6 focus-within:border-blue-500/50 transition-all">
              <textarea 
                placeholder="Describe your issue" 
                className="w-full bg-transparent border-none focus:ring-0 text-sm min-h-[150px] outline-none"
              />
            </div>
            
            <div className="flex flex-wrap gap-4">
              <button className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold transition-all">
                <Upload className="w-4 h-4" />
                Upload Image
              </button>
              <button className="flex items-center gap-2 px-10 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-500/20">
                Open Support Ticket
              </button>
            </div>
          </div>
        </motion.div>

        {/* Existing Threads */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden"
        >
          <div className="p-8 border-b border-white/5">
            <h3 className="text-2xl font-bold mb-1 orbitron-font">Support Threads</h3>
            <p className="text-xs text-gray-500">Latest support conversations.</p>
          </div>
          
          <div className="p-20 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-white/5 rounded-full mb-4 text-gray-600">
              <MessageSquare className="w-6 h-6" />
            </div>
            <p className="text-sm text-gray-500 italic font-medium">No threads yet.</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
