"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Server, 
  Search, 
  ExternalLink,
  Plus,
  Loader2,
  Cpu,
  Shield,
  Zap
} from "lucide-react"
import Link from "next/link"

export default function ServicesPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      const res = await fetch("/api/user/data")
      const data = await res.json()
      if (data.orders) setOrders(data.orders)
    } catch (error) {
      console.error("Failed to fetch services")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const activeServices = orders.filter(o => o.status === "Approved")

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
       <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
    </div>
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white/5 border border-white/10 rounded-[32px] p-8">
        <div>
          <h2 className="text-3xl font-bold mb-1 orbitron-font">My Products & <span className="text-blue-500">Services</span></h2>
          <p className="text-xs text-gray-500">Manage and monitor your active high-performance nodes.</p>
        </div>
        <Link 
          href="/dashboard/order"
          className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20"
        >
          Deploy New
          <Plus className="w-4 h-4" />
        </Link>
      </div>

      {/* Services Grid */}
      {activeServices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeServices.map((service) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#0a0b0f] border border-white/10 rounded-[32px] p-8 group hover:border-blue-500/30 transition-all"
            >
              <div className="flex justify-between items-start mb-8">
                 <div className="w-14 h-14 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <Server className="w-7 h-7" />
                 </div>
                 <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[9px] font-black uppercase tracking-widest text-emerald-500">Active</div>
              </div>

              <h4 className="text-xl font-bold mb-1">{service.plan_name}</h4>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-6">ID: {service.id}</p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                 <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <p className="text-[9px] text-gray-500 font-black uppercase mb-1">Status</p>
                    <p className="text-xs font-bold text-white">Online</p>
                 </div>
                 <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <p className="text-[9px] text-gray-500 font-black uppercase mb-1">Renewal</p>
                    <p className="text-xs font-bold text-white">{service.expiry_date ? new Date(service.expiry_date).toLocaleDateString() : 'N/A'}</p>
                 </div>
              </div>

              <div className="flex gap-3">
                 <button className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/5 flex items-center justify-center gap-2">
                    <ExternalLink className="w-3.5 h-3.5" />
                    Panel Access
                 </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 border-dashed rounded-[32px] p-24 text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/5 rounded-full mb-6">
            <Server className="w-8 h-8 text-gray-600" />
          </div>
          <h4 className="text-lg font-bold text-gray-400 mb-2">No active services.</h4>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            You don't have any active services at the moment. 
            New services will appear here after your order is approved.
          </p>
        </motion.div>
      )}
    </div>
  )
}
