"use client"

import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { 
  Server, 
  Ticket, 
  CreditCard, 
  ShoppingCart,
  ArrowUpRight,
  Plus,
  AlertCircle,
  Loader2,
  Bell
} from "lucide-react"
import Link from "next/link"
import { useUserData } from "@/lib/hooks/useUserData"
import { Skeleton, SkeletonCard } from "@/app/components/Skeleton"

export default function DashboardHome() {
  const { data: session, status } = useSession()
  const { data, isLoading, error } = useUserData()

  const orders = data?.orders || []

  const isAdmin = session?.user?.isAdmin || process.env.NEXT_PUBLIC_ADMIN_USER_IDS?.split(',').map(id => id.trim()).includes(session?.user?.id || "") || false

  const activeServices = orders.filter((o: any) => o.status === "Approved")
  const pendingServices = orders.filter((o: any) => o.status === "Pending")
  const alertServices = orders.filter((o: any) => o.status === "Suspended" || (o.expiryDate && new Date(o.expiryDate).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000))

  const getStatStyles = (color: string) => {
    switch(color) {
      case 'blue': return { bg: 'bg-blue-500/10', text: 'text-blue-500' }
      case 'amber': return { bg: 'bg-amber-500/10', text: 'text-amber-500' }
      case 'red': return { bg: 'bg-red-500/10', text: 'text-red-500' }
      case 'purple': return { bg: 'bg-purple-500/10', text: 'text-purple-500' }
      default: return { bg: 'bg-gray-500/10', text: 'text-gray-500' }
    }
  }

  const stats = [
    { name: "Active Services", value: activeServices.length.toString(), icon: Server, color: "blue" },
    { name: "Under Process", value: pendingServices.length.toString(), icon: Loader2, color: "amber" },
    { name: "Critical Alerts", value: alertServices.length.toString(), icon: AlertCircle, color: "red" },
    { name: "Total Paid", value: `₹${orders.filter((o: any) => o.status === "Approved").reduce((acc: number, o: any) => acc + parseInt(o.amount.replace(/[^0-9]/g, '')), 0)}`, icon: CreditCard, color: "purple" },
  ]

  if (status === "loading" || isLoading) return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
      <Skeleton className="h-10 w-48" />
      <Skeleton className="h-64 w-full" />
    </div>
  )

  if (error) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <p role="alert" className="text-red-500 text-sm">Failed to load dashboard data. Please try again.</p>
    </div>
  )

  return (
    <div className="space-y-8 pb-20">
      {/* Welcome Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-br from-blue-600/10 via-transparent to-transparent border border-white/5 rounded-[32px] p-8 md:p-12 overflow-hidden group"
      >
        <div className="relative z-10">
          <p className="text-blue-500 text-[10px] font-bold uppercase tracking-widest mb-2">VexaNode Dashboard</p>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 orbitron-font">
            Welcome, <span className="text-blue-500">{session?.user?.name || "User"}</span>
          </h1>
          <div className="flex flex-wrap gap-4">
            <Link 
              href="/dashboard/order"
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20"
            >
              Order New Services
              <Plus aria-hidden="true" className="w-4 h-4" />
            </Link>
            {isAdmin && (
              <Link 
                href="/dashboard/admin"
                className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-3.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-purple-500/20"
              >
                Admin Panel
                <ArrowUpRight aria-hidden="true" className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>

        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-64 h-64 bg-blue-500/10 blur-[120px] rounded-full group-hover:bg-blue-500/20 transition-all duration-700" />
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const styles = getStatStyles(stat.color)
          return (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 + 0.2 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2.5 ${styles.bg} rounded-xl`}>
                  <stat.icon className={`w-5 h-5 ${styles.text}`} />
                </div>
                <ArrowUpRight aria-hidden="true" className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-all" />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">{stat.name}</p>
                <span className="text-2xl font-bold orbitron-font">{stat.value}</span>
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active & Pending Services */}
        <div className="lg:col-span-2 space-y-6">
               <h2 className="text-xl font-bold orbitron-font px-2 flex items-center gap-3">
              <Server aria-hidden="true" className="w-5 h-5 text-blue-500" />
              My Services
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {orders.length === 0 && (
                <div className="col-span-full py-12 text-center bg-white/5 border border-dashed border-white/10 rounded-3xl">
                   <p className="text-sm text-gray-500 italic">No services ordered yet.</p>
                </div>
              )}

              {orders.map((service: any) => {
               const isEndingSoon = service.expiryDate && new Date(service.expiry_date).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000;
               const isSuspended = service.status === "Suspended";
               const isPending = service.status === "Pending";

               return (
                 <motion.div 
                   key={service.id}
                   whileHover={{ y: -5 }}
                   className={`relative bg-[#0a0b0f] border rounded-[28px] p-6 transition-all ${
                     isSuspended ? "border-red-500/40 bg-red-500/[0.02]" : 
                     isEndingSoon ? "border-amber-500/40 bg-amber-500/[0.02]" : 
                     isPending ? "border-blue-500/20 bg-blue-500/[0.01]" :
                     "border-white/10"
                   }`}
                 >
                    {/* Expiry Alert Bar */}
                    {(isSuspended || isEndingSoon) && (
                      <div aria-hidden="true" className={`absolute top-0 left-0 right-0 h-1 rounded-t-[28px] ${isSuspended ? "bg-red-500" : "bg-amber-500"}`} />
                    )}
                    {isSuspended && <span className="sr-only">Service suspended</span>}
                    {isEndingSoon && <span className="sr-only">Service ending soon</span>}

                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
                        <Server className={`w-6 h-6 ${isSuspended ? "text-red-500" : isEndingSoon ? "text-amber-500" : "text-blue-500"}`} />
                      </div>
                      <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        isPending ? "bg-blue-500/10 border-blue-500/20 text-blue-500" :
                        isSuspended ? "bg-red-500/10 border-red-500/20 text-red-500" :
                        isEndingSoon ? "bg-amber-500/10 border-amber-500/20 text-amber-500" :
                        "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                      }`}>
                        {isPending ? "Under Process" : service.status}
                      </div>
                    </div>

                    <h4 className="text-lg font-bold mb-1">{service.plan_name}</h4>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-6">ID: {service.id}</p>

                    <div className="space-y-3 mb-6">
                       <div className="flex justify-between text-xs">
                          <span className="text-gray-500">Amount Paid</span>
                          <span className="text-white font-bold">{service.amount}</span>
                       </div>
                       {service.expiry_date && (
                         <div className="flex justify-between text-xs">
                            <span className="text-gray-500">Expiry Date</span>
                            <span className={`font-bold ${isEndingSoon ? "text-amber-500" : "text-white"}`}>
                               {new Date(service.expiry_date).toLocaleDateString()}
                            </span>
                         </div>
                       )}
                    </div>

                    <div className="flex gap-3">
                       <button aria-label={isSuspended || isEndingSoon ? `Renew ${service.plan_name}` : `Manage ${service.plan_name}`} className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                         isSuspended || isEndingSoon ? "bg-blue-600 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"
                       }`}>
                         {isSuspended || isEndingSoon ? "Renew Now" : "Manage"}
                       </button>
                    </div>
                 </motion.div>
               )
             })}
           </div>
        </div>

        {/* Lifecycle Alerts */}
        <div className="space-y-6">
           <h2 className="text-xl font-bold orbitron-font px-2 flex items-center gap-3">
              <Bell aria-hidden="true" className="w-5 h-5 text-amber-500" />
              Alerts
            </h2>
           
           <div className="space-y-4">
              {alertServices.length === 0 && (
                <div className="p-10 text-center bg-white/5 border border-dashed border-white/10 rounded-3xl">
                   <p className="text-xs text-gray-500 font-medium italic">All systems normal.</p>
                </div>
              )}
              {alertServices.map((alert: any) => (
                <div key={alert.id} role="alert" className={`p-5 rounded-2xl border flex gap-4 ${alert.status === 'Suspended' ? 'bg-red-500/5 border-red-500/20' : 'bg-amber-500/5 border-amber-500/20'}`}>
                   <AlertCircle className={`w-5 h-5 shrink-0 ${alert.status === 'Suspended' ? 'text-red-500' : 'text-amber-500'}`} />
                   <div>
                      <p className="text-xs font-bold text-white mb-1">
                        {alert.status === 'Suspended' ? `Service Suspended: ${alert.plan_name}` : `Action Required: ${alert.plan_name}`}
                      </p>
                      <p className="text-[10px] text-gray-500 leading-relaxed font-medium">
                        {alert.status === 'Suspended' ? 'Payment verification failed or plan expired. Renew to restore access.' : 'Your service will expire in a few days. Renew now to avoid suspension.'}
                      </p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  )
}
