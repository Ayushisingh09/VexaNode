"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Ticket, Plus, MessageSquare, Upload, History,
  AlertCircle, Loader2, CheckCircle2, Clock,
  ChevronRight, Image as ImageIcon, X
} from "lucide-react"

export default function TicketsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("Support")
  const [tickets, setTickets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState("")
  const [subject, setSubject] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  
  const [statusMsg, setStatusMsg] = useState<{type: "error" | "success", text: string} | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setStatusMsg({ type: "error", text: "Image must be less than 5MB" })
        return
      }
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadToImgBB = async (file: File) => {
    const formData = new FormData()
    formData.append("image", file)
    // Public ImgBB key for attachments
    const API_KEY = "8a6c59cd0cc1a396e95c1840673f8485" 
    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${API_KEY}`, {
        method: "POST",
        body: formData
      })
      const data = await res.json()
      if (data && data.data && data.data.url) {
        return data.data.url
      }
      throw new Error(data.error?.message || "Failed to upload image")
    } catch (e) {
      console.error("ImgBB upload failed", e)
      throw e
    }
  }

  const handleSubmit = async () => {
    if (!message || !subject) return
    setSubmitting(true)
    setStatusMsg(null)
    try {
      let finalMessage = message

      // If there's an image, upload it and append as markdown
      if (image) {
        setStatusMsg({ type: "success", text: "Uploading attachment..." })
        const imageUrl = await uploadToImgBB(image)
        if (imageUrl) {
          finalMessage += `\n\n![Attachment](${imageUrl})`
        }
      }

      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          subject, 
          message: finalMessage, 
          type: activeTab,
          priority: "Normal"
        })
      })
      if (res.ok) {
        setSubject("")
        setMessage("")
        setImage(null)
        setImagePreview(null)
        setStatusMsg({ type: "success", text: "Ticket created successfully!" })
        fetchTickets()
        setTimeout(() => setStatusMsg(null), 3000)
      } else {
        const data = await res.json()
        let errorText = data.error || "Failed to submit ticket"
        if (data.details) {
            errorText = "Please ensure subject (min 2 chars) and description (min 5 chars) are valid."
        }
        setStatusMsg({ type: "error", text: errorText })
      }
    } catch (error) {
      setStatusMsg({ type: "error", text: "Network error occurred." })
    } finally {
      setSubmitting(false)
    }
  }

  const filteredTickets = tickets.filter(t => t.type === activeTab)

  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-gradient-to-r from-blue-900/20 to-transparent p-8 rounded-[32px] border border-blue-500/10">
        <div>
           <h2 className="text-4xl font-black tracking-tight text-white flex items-center gap-3">
             <Ticket className="w-8 h-8 text-blue-500" />
             Support <span className="text-blue-500">Center</span>
           </h2>
           <p className="text-sm text-gray-400 mt-2 max-w-xl">
             Experiencing an issue? Open a new thread or manage your active conversations. Our support team is available 24/7.
           </p>
        </div>
        
        <div className="flex gap-2 p-1.5 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xl shadow-black/50">
          {["Support", "Billing"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-3 rounded-xl text-xs font-bold transition-all uppercase tracking-widest relative ${
                activeTab === tab 
                  ? "text-white" 
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {activeTab === tab && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute inset-0 bg-blue-600 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                  initial={false}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{tab}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* New Ticket Form - Ultra Premium */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-5 bg-[#0a0b0f]/80 backdrop-blur-2xl border border-white/10 rounded-[32px] p-8 h-fit sticky top-32 shadow-2xl relative overflow-hidden group"
        >
          {/* Background Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

          <div className="flex items-center gap-4 mb-8 relative z-10">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
               <Plus className="w-6 h-6 text-white" />
            </div>
            <div>
               <h3 className="text-xl font-bold text-white">Create Thread</h3>
               <p className="text-xs text-blue-400 font-bold uppercase tracking-widest mt-1">{activeTab} Category</p>
            </div>
          </div>

          <div className="space-y-6 relative z-10">
            <div className="space-y-2">
              <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest px-1">Subject</label>
              <input 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Server won't start"
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white placeholder-gray-600 outline-none focus:border-blue-500/50 focus:bg-blue-500/5 transition-all shadow-inner"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest px-1">Detailed Description</label>
              <textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Please describe your issue in detail..." 
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white placeholder-gray-600 min-h-[160px] outline-none focus:border-blue-500/50 focus:bg-blue-500/5 transition-all resize-none shadow-inner"
              />
            </div>

            {/* Image Upload Zone */}
            <div className="space-y-2">
              <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest px-1">Attachment (Optional)</label>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                accept="image/*" 
                className="hidden" 
              />
              
              {!imagePreview ? (
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-white/10 hover:border-blue-500/50 bg-black/20 hover:bg-blue-500/5 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-all group"
                >
                  <div className="w-12 h-12 bg-white/5 group-hover:bg-blue-500/20 rounded-full flex items-center justify-center transition-colors">
                    <ImageIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-gray-300">Click to upload image</p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                  </div>
                </button>
              ) : (
                <div className="relative rounded-2xl overflow-hidden border border-white/10 group">
                  <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={() => { setImage(null); setImagePreview(null); }}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2"
                    >
                      <X className="w-4 h-4" /> Remove Image
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <AnimatePresence>
              {statusMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  className={`px-5 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest flex items-center gap-3 border shadow-lg ${
                    statusMsg.type === 'error' 
                      ? 'bg-red-500/10 text-red-500 border-red-500/20 shadow-red-500/10' 
                      : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-emerald-500/10'
                  }`}
                >
                  {statusMsg.type === 'error' ? <AlertCircle className="w-5 h-5 shrink-0" /> : <CheckCircle2 className="w-5 h-5 shrink-0" />}
                  {statusMsg.text}
                </motion.div>
              )}
            </AnimatePresence>
            
            <button 
              disabled={submitting || !subject || !message}
              onClick={handleSubmit}
              className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:opacity-50 disabled:grayscale text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:shadow-[0_0_40px_rgba(37,99,235,0.5)] active:scale-[0.98]"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Submit {activeTab} Ticket
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Existing Threads */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#0a0b0f]/80 backdrop-blur-2xl border border-white/10 rounded-[32px] overflow-hidden min-h-[600px] shadow-2xl flex flex-col">
            <div className="p-8 border-b border-white/5 bg-white/[0.02]">
              <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                <History className="w-6 h-6 text-gray-400" />
                Active <span className="text-blue-500">Threads</span>
              </h3>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-2">Manage your {activeTab.toLowerCase()} conversations</p>
            </div>
            
            <div className="flex-1 p-2">
              {loading ? (
                <div className="h-full flex items-center justify-center min-h-[400px]">
                   <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                </div>
              ) : filteredTickets.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center min-h-[400px] text-center px-6">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-white/5 to-white/10 border border-white/10 rounded-full mb-6 shadow-2xl">
                    <MessageSquare className="w-10 h-10 text-gray-500" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">No {activeTab} tickets</h4>
                  <p className="text-sm text-gray-400 max-w-sm">
                    You don't have any active {activeTab.toLowerCase()} tickets right now. If you need help, use the form to create a new thread.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 p-4">
                  {filteredTickets.map((ticket) => (
                    <motion.div 
                      key={ticket.id}
                      onClick={() => router.push(`/dashboard/tickets/${ticket.id}`)}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 bg-white/[0.02] hover:bg-blue-500/5 border border-white/5 hover:border-blue-500/30 rounded-[24px] transition-all flex items-center justify-between group cursor-pointer shadow-lg hover:shadow-blue-500/10"
                    >
                      <div className="flex items-center gap-6">
                         <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${
                           ticket.status === 'Open' 
                            ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' 
                            : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                         }`}>
                            {ticket.status === 'Open' ? <Clock className="w-7 h-7" /> : <CheckCircle2 className="w-7 h-7" />}
                         </div>
                         <div>
                            <div className="flex items-center gap-3 mb-2">
                               <h4 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">{ticket.subject}</h4>
                               <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border ${
                                 ticket.status === 'Open' 
                                  ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' 
                                  : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                               }`}>
                                 {ticket.status}
                               </span>
                            </div>
                            <p className="text-sm text-gray-500 truncate max-w-md line-clamp-1">{ticket.message.replace(/!\[Attachment\]\(.*?\)/g, '[Image Attached]')}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-6">
                         <div className="text-right hidden sm:block">
                            <p className="text-xs text-gray-400 font-bold">{new Date(ticket.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p>
                            <p className="text-[10px] text-gray-600 uppercase tracking-widest mt-1">
                              {new Date(ticket.created_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                            </p>
                         </div>
                         <div className="w-10 h-10 rounded-full bg-white/5 group-hover:bg-blue-500 flex items-center justify-center transition-colors">
                           <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                         </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
