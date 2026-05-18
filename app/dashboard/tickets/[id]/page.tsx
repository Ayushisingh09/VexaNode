"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { 
  ArrowLeft, 
  MessageSquare, 
  Send,
  Loader2,
  CheckCircle2,
  Clock,
  ShieldCheck,
  User,
  Image as ImageIcon,
  X
} from "lucide-react"

export default function TicketViewPage() {
  const { id } = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  
  const [ticket, setTicket] = useState<any>(null)
  const [replies, setReplies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [replyMessage, setReplyMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchTicketData = async () => {
    try {
      const res = await fetch(`/api/tickets/${id}`)
      if (!res.ok) {
        if (res.status === 403) router.push("/dashboard/tickets")
        return
      }
      const data = await res.json()
      setTicket(data.ticket)
      setReplies(data.replies)
    } catch (error) {
      console.error("Failed to fetch ticket")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) fetchTicketData()
  }, [id])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) return alert("Image must be less than 5MB")
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

  const handleReply = async () => {
    if (!replyMessage.trim() && !image) return
    setSubmitting(true)
    
    try {
      let finalMessage = replyMessage
      if (image) {
        const imageUrl = await uploadToImgBB(image)
        if (imageUrl) {
          finalMessage += (finalMessage ? `\n\n` : '') + `![Attachment](${imageUrl})`
        }
      }

      const res = await fetch(`/api/tickets/${id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: finalMessage || "Attached Image" })
      })
      
      if (res.ok) {
        setReplyMessage("")
        setImage(null)
        setImagePreview(null)
        fetchTicketData()
      } else {
        const data = await res.json()
        alert(data.error || "Failed to submit reply")
      }
    } catch (error: any) {
      console.error("Failed to add reply", error)
      alert(error.message || "An unexpected error occurred while replying")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (!ticket) return null

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/dashboard/tickets')}
            className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center border border-white/10 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold orbitron-font">{ticket.subject}</h2>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs text-gray-500">Ticket #{ticket.id.split('-')[0]}</span>
              <span className="text-gray-700">•</span>
              <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${
                ticket.status === 'Open' ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
              }`}>
                {ticket.status}
              </span>
            </div>
          </div>
        </div>
        
        {ticket.status === 'Open' && (
          <button 
            onClick={async () => {
              await fetch("/api/admin/action", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: "UPDATE_TICKET_STATUS", id: ticket.id, status: "Closed" })
              })
              fetchTicketData()
            }}
            className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 rounded-xl text-xs font-bold transition-all uppercase tracking-widest"
          >
            Close Ticket
          </button>
        )}
      </div>

      {/* Conversation Thread */}
      <div className="space-y-6">
        {/* Original Message */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 rounded-3xl p-6"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center overflow-hidden">
              {ticket.users?.image ? (
                <img src={ticket.users.image} alt="" className="w-full h-full object-cover" />
              ) : (
                <User className="w-5 h-5 text-blue-500" />
              )}
            </div>
            <div>
              <p className="font-bold text-sm text-white">{ticket.users?.name || "User"}</p>
              <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">
                {new Date(ticket.created_at).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
            {ticket.message.split(/(!\[Attachment\]\(.*?\))/g).map((part: string, i: number) => {
              if (part.startsWith('![Attachment](')) {
                const url = part.slice(14, -1);
                return <img key={i} src={url} alt="Attachment" className="max-w-sm rounded-xl mt-4 border border-white/10 shadow-lg block" />;
              }
              return <span key={i}>{part}</span>;
            })}
          </div>
        </motion.div>

        {/* Replies */}
        {replies.map((reply, idx) => (
          <motion.div 
            key={reply.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`flex flex-col ${reply.is_admin ? 'items-end' : 'items-start'}`}
          >
            <div className={`max-w-[80%] bg-white/5 border border-white/10 rounded-3xl p-6 ${
              reply.is_admin ? 'bg-purple-500/10 border-purple-500/20' : ''
            }`}>
              <div className={`flex items-center gap-4 mb-4 ${reply.is_admin ? 'flex-row-reverse' : ''}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center overflow-hidden ${
                  reply.is_admin ? 'bg-purple-500/20' : 'bg-blue-500/20'
                }`}>
                  {reply.is_admin ? (
                    <ShieldCheck className="w-5 h-5 text-purple-500" />
                  ) : reply.users?.image ? (
                    <img src={reply.users.image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-5 h-5 text-blue-500" />
                  )}
                </div>
                <div className={reply.is_admin ? 'text-right' : 'text-left'}>
                  <p className={`font-bold text-sm ${reply.is_admin ? 'text-purple-400' : 'text-white'}`}>
                    {reply.is_admin ? "Support Team" : (reply.users?.name || "User")}
                  </p>
                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">
                    {new Date(reply.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className={`text-sm leading-relaxed whitespace-pre-wrap ${reply.is_admin ? 'text-purple-100 text-right' : 'text-gray-300'}`}>
                {reply.message.split(/(!\[Attachment\]\(.*?\))/g).map((part: string, i: number) => {
                  if (part.startsWith('![Attachment](')) {
                    const url = part.slice(14, -1);
                    return <img key={i} src={url} alt="Attachment" className={`max-w-sm rounded-xl mt-4 border border-white/10 shadow-lg block ${reply.is_admin ? 'ml-auto' : ''}`} />;
                  }
                  return <span key={i}>{part}</span>;
                })}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Reply Box */}
      {ticket.status !== 'Closed' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0a0b0f] border border-white/10 rounded-3xl p-6 sticky bottom-6 shadow-2xl shadow-black"
        >
          <textarea
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
            placeholder="Type your reply here..."
            className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm outline-none focus:border-blue-500/50 transition-all resize-none min-h-[120px] mb-4"
          />
          
          {imagePreview && (
            <div className="relative w-32 h-32 mb-4 rounded-xl overflow-hidden border border-white/10 group">
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button 
                  onClick={() => { setImage(null); setImagePreview(null); }}
                  className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <div>
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-blue-500/10 border border-white/10 hover:border-blue-500/30 flex items-center justify-center transition-all group"
                title="Attach Image"
              >
                <ImageIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
              </button>
            </div>
            <button 
              disabled={submitting || (!replyMessage.trim() && !image)}
              onClick={handleReply}
              className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-500/20"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Reply
                </>
              )}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
