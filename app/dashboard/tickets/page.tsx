"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Ticket, 
  Plus, 
  MessageSquare, 
  Upload, 
  History,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Clock,
  ChevronRight
} from "lucide-react"

export default function TicketsPage() {
  const [activeTab, setActiveTab] = useState("Support")
  const [tickets, setTickets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState("")
  const [subject, setSubject] = useState("")

  const fetchTickets = async () => {
    try {
      const res = await fetch("/api/tickets")
      const data = await res.json()
      if (data.tickets) setTickets(data.tickets)
    } catch (error) {
      console.error("Failed to fetch tickets")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTickets()
  }, [])

  const handleSubmit = async () => {
    if (!message || !subject) return
    setSubmitting(true)
    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          subject, 
          message, 
          type: activeTab,
          priority: "Normal"
        })
      })
      if (res.ok) {
        setSubject("")
        setMessage("")
        fetchTickets()
      }
    } catch (error) {
      console.error("Failed to submit ticket")
    } finally {
      setSubmitting(false)
    }
  }

  const filteredTickets = tickets.filter(t => t.type === activeTab)

  return (
    <div className="space-y-8 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
           <h2 className="text-3xl font-bold orbitron-font">Support <span className="text-blue-500">Center</span></h2>
           <p className="text-xs text-gray-500 mt-1">Get technical assistance or resolve payment issues.</p>
        </div>
        
        <div className="flex gap-4 p-1.5 bg-white/5 rounded-2xl border border-white/5">
          {["Support", "Billing"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-2.5 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest ${
                activeTab === tab 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" 
                  : "text-gray-500 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* New Ticket Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="xl:col-span-1 bg-[#0a0b0f] border border-white/10 rounded-[32px] p-8 h-fit sticky top-32"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center">
               <Plus className="w-5 h-5 text-blue-500" />
            </div>
            <div>
               <h3 className="text-lg font-bold">Open New Thread</h3>
               <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{activeTab} Category</p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2 px-1">Subject</p>
              <input 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief summary of issue"
                className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm outline-none focus:border-blue-500/50 transition-all"
              />
            </div>

            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2 px-1">Detailed Description</p>
              <textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Please describe your issue in detail..." 
                className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm min-h-[150px] outline-none focus:border-blue-500/50 transition-all resize-none"
              />
            </div>
            
            <button 
              disabled={submitting || !subject || !message}
              onClick={handleSubmit}
              className="w-full flex items-center justify-center gap-2 px-10 py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-500/20"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <MessageSquare className="w-4 h-4" />
                  Submit Ticket
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Existing Threads */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-[#0a0b0f] border border-white/10 rounded-[32px] overflow-hidden min-h-[400px]">
            <div className="p-8 border-b border-white/5">
              <h3 className="text-xl font-bold orbitron-font">Active <span className="text-blue-500">Threads</span></h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Manage your support conversations</p>
            </div>
            
            {loading ? (
              <div className="py-20 flex justify-center">
                 <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              </div>
            ) : filteredTickets.length === 0 ? (
              <div className="py-32 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white/5 rounded-full mb-6 text-gray-700">
                  <MessageSquare className="w-10 h-10" />
                </div>
                <h4 className="text-lg font-bold text-gray-400 mb-1">No {activeTab} tickets yet</h4>
                <p className="text-sm text-gray-500 max-w-xs mx-auto italic font-medium">Any {activeTab.toLowerCase()} related issues you report will appear here.</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {filteredTickets.map((ticket) => (
                  <motion.div 
                    key={ticket.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-8 hover:bg-white/[0.02] transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-6">
                       <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                         ticket.status === 'Open' ? 'bg-blue-500/10 text-blue-500' : 'bg-emerald-500/10 text-emerald-500'
                       }`}>
                          {ticket.status === 'Open' ? <Clock className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
                       </div>
                       <div>
                          <div className="flex items-center gap-3 mb-1">
                             <h4 className="font-bold text-white">{ticket.subject}</h4>
                             <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${
                               ticket.status === 'Open' ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                             }`}>
                               {ticket.status}
                             </span>
                          </div>
                          <p className="text-xs text-gray-500 truncate max-w-md">{ticket.message}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-6">
                       <div className="text-right hidden sm:block">
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{new Date(ticket.created_at).toLocaleDateString()}</p>
                          <p className="text-[10px] text-blue-500 font-bold">1 New Reply</p>
                       </div>
                       <ChevronRight className="w-5 h-5 text-gray-700 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
