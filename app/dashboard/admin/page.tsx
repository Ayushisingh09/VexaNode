"use client"

import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import {
  Users,
  Server,
  Ticket,
  CreditCard,
  ShieldAlert,
  ArrowUpRight,
  Search,
  MoreVertical,
  Activity,
  Loader2
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [tickets, setTickets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/data")
      const data = await res.json()
      if (data.users) setUsers(data.users)
      if (data.orders) setOrders(data.orders)
      if (data.tickets) setTickets(data.tickets)
    } catch (error) {
      console.error("Failed to fetch admin data")
    } finally {
      setLoading(false)
    }
  }

  // Protect Admin route and fetch data
  useEffect(() => {
    const isAdmin = process.env.NEXT_PUBLIC_ADMIN_USER_IDS?.split(',').includes(session?.user?.id || "")
    if (status === "unauthenticated") {
      router.push("/discord")
    } else if (status === "authenticated" && !isAdmin) {
      router.push("/dashboard")
    } else if (status === "authenticated" && isAdmin) {
      fetchData()
    }
  }, [session, status, router])

  const handleAction = async (type: string, id: string, extra = {}) => {
    try {
      const res = await fetch("/api/admin/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, id, ...extra })
      })
      if (res.ok) {
        fetchData() // Refresh data
      }
    } catch (error) {
      alert("Action failed")
    }
  }

  const getStatStyles = (color: string) => {
    switch(color) {
      case 'blue': return { bg: 'bg-blue-500/10', text: 'text-blue-500' }
      case 'emerald': return { bg: 'bg-emerald-500/10', text: 'text-emerald-500' }
      case 'amber': return { bg: 'bg-amber-500/10', text: 'text-amber-500' }
      case 'purple': return { bg: 'bg-purple-500/10', text: 'text-purple-500' }
      default: return { bg: 'bg-gray-500/10', text: 'text-gray-500' }
    }
  }

  const stats = [
    { name: "Total Users", value: users.length.toString(), icon: Users, color: "blue", trend: "+12%" },
    { name: "Active Nodes", value: "24", icon: Server, color: "emerald", trend: "Normal" },
    { name: "Pending Orders", value: orders.filter(o => o.status === "Pending").length.toString(), icon: Ticket, color: "amber", trend: "-5%" },
    { name: "Approved Orders", value: orders.filter(o => o.status === "Approved").length.toString(), icon: CreditCard, color: "purple", trend: "+18%" },
  ]

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
    </div>
  )

  return (
    <div className="space-y-8 pb-20">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold orbitron-font">Admin <span className="text-purple-500">Overview</span></h1>
            <div className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-[10px] font-black uppercase tracking-widest text-purple-500">
              Root Access
            </div>
          </div>
          <p className="text-sm text-gray-500">Global system monitoring and user management.</p>
        </div>

        <div className="flex gap-4">
          <button onClick={fetchData} className="bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-500" />
            Refresh Data
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const styles = getStatStyles(stat.color)
          return (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-[#0a0b0f] border border-white/10 rounded-2xl p-6 hover:border-purple-500/20 transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2.5 ${styles.bg} rounded-xl`}>
                  <stat.icon className={`w-5 h-5 ${styles.text}`} />
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest ${stat.trend.startsWith('+') ? 'text-emerald-500' :
                  stat.trend === 'Normal' ? 'text-blue-500' : 'text-amber-500'
                  }`}>
                  {stat.trend}
                </span>
              </div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">{stat.name}</p>
              <h4 className="text-2xl font-bold orbitron-font">{stat.value}</h4>
            </motion.div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* User Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="xl:col-span-2 space-y-6"
        >
          <div className="bg-[#0a0b0f] border border-white/10 rounded-[32px] overflow-hidden">
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold orbitron-font">User <span className="text-blue-500">Database</span></h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Manage active platform accounts</p>
              </div>
              <div className="flex gap-2">
                 <button className="p-2 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all">
                    <Search className="w-4 h-4 text-gray-400" />
                 </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/[0.02]">
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">User</th>
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Discord ID</th>
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Status</th>
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center font-bold text-blue-500 text-xs">
                            {user.name[0]?.toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">{user.name}</p>
                            <p className="text-[10px] text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-xs font-mono text-gray-500">{user.id}</td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                          user.status === 'Active' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-red-500/10 border-red-500/20 text-red-500'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2">
                           <button 
                             disabled={user.status === "Banned"}
                             onClick={() => handleAction("BAN_USER", user.id)}
                             className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-red-500/10 disabled:hover:text-red-500"
                             title="Ban User"
                           >
                             <ShieldAlert className="w-4 h-4" />
                           </button>
                           <button className="p-2 bg-white/5 text-gray-400 rounded-lg hover:bg-white/10 transition-all">
                             <MoreVertical className="w-4 h-4" />
                           </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Orders & Verification */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="xl:col-span-1 space-y-6"
        >
          <div className="bg-[#0a0b0f] border border-white/10 rounded-[32px] p-8 h-full">
             <div className="flex items-center justify-between mb-8">
               <h3 className="text-xl font-bold orbitron-font">Recent <span className="text-amber-500">Orders</span></h3>
               <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-[9px] font-black text-amber-500 uppercase tracking-widest">
                 {orders.filter(o => o.status === "Pending").length} Pending
               </span>
             </div>

             <div className="space-y-6">
               {orders.length === 0 && (
                 <div className="text-center py-12">
                   <Ticket className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                   <p className="text-sm text-gray-500">No recent orders found</p>
                 </div>
               )}

               {orders.map((order) => (
                 <div key={order.id} className="p-6 bg-white/5 border border-white/5 rounded-3xl space-y-5 group relative overflow-hidden">
                    <div className="flex justify-between items-start relative z-10">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-xs font-black text-white">{order.user_name}</p>
                          <span className={`text-[8px] px-1.5 py-0.5 rounded border ${
                            order.status === 'Approved' ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/10' : 
                            order.status === 'Pending' ? 'border-amber-500/30 text-amber-500 bg-amber-500/10' : 
                            'border-red-500/30 text-red-500 bg-red-500/10'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{order.plan_name} • {order.amount}</p>
                      </div>
                      <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">{new Date(order.created_at).toLocaleDateString()}</span>
                    </div>

                    <div className="aspect-video bg-black rounded-2xl overflow-hidden border border-white/5 relative group/img">
                       {order.proof_url ? (
                         <img src={order.proof_url} alt="Proof" className="w-full h-full object-cover opacity-60 group-hover/img:opacity-100 transition-all duration-500 scale-110 group-hover/img:scale-100" />
                       ) : (
                         <div className="w-full h-full flex items-center justify-center text-gray-700 text-[10px] font-black uppercase tracking-widest">No Proof</div>
                       )}
                       {order.proof_url && (
                         <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4 opacity-0 group-hover/img:opacity-100 transition-opacity">
                            <button 
                              onClick={() => window.open(order.proof_url)}
                              className="w-full py-2 bg-white/10 backdrop-blur-md rounded-xl text-[10px] font-black uppercase tracking-widest text-white border border-white/10 hover:bg-white/20"
                            >
                              View Full Proof
                            </button>
                         </div>
                       )}
                    </div>

                    <div className="flex gap-2 relative z-10">
                       {order.status === "Pending" && (
                         <>
                           <button 
                             onClick={() => handleAction("UPDATE_ORDER_STATUS", order.id, { status: "Approved" })}
                             className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20"
                           >
                             Approve
                           </button>
                           <button 
                             onClick={() => handleAction("UPDATE_ORDER_STATUS", order.id, { status: "Cancelled" })}
                             className="flex-1 py-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-red-500/20"
                           >
                             Reject
                           </button>
                         </>
                       )}
                       {order.status !== "Pending" && (
                         <button 
                           onClick={() => handleAction("DELETE_ORDER", order.id)}
                           className="w-full py-3 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/5"
                         >
                           Delete Entry
                         </button>
                       )}
                    </div>

                    {/* Glow effect for pending */}
                    {order.status === "Pending" && (
                      <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/10 blur-3xl rounded-full" />
                    )}
                 </div>
               ))}
             </div>
          </div>
        </motion.div>
      </div>

      {/* Tickets Section */}
      <div className="bg-[#0a0b0f] border border-white/10 rounded-[32px] overflow-hidden">
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold orbitron-font">Support <span className="text-blue-500">Tickets</span></h3>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Manage user support threads</p>
          </div>
          <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[9px] font-black text-blue-500 uppercase tracking-widest">
            {tickets.filter(t => t.status === "Open").length} Open
          </span>
        </div>
        <div className="divide-y divide-white/5">
          {tickets.length === 0 && (
             <div className="text-center py-12">
               <p className="text-sm text-gray-500">No tickets found</p>
             </div>
          )}
          {tickets.map((ticket) => (
             <div key={ticket.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors">
               <div className="flex items-center gap-4">
                 <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                   ticket.status === 'Open' ? 'bg-blue-500/10 text-blue-500' : 'bg-emerald-500/10 text-emerald-500'
                 }`}>
                   <Ticket className="w-5 h-5" />
                 </div>
                 <div>
                   <h4 className="font-bold text-white text-sm">{ticket.subject}</h4>
                   <p className="text-xs text-gray-500">From: {ticket.users?.name || 'Unknown'} • {new Date(ticket.created_at).toLocaleDateString()}</p>
                 </div>
               </div>
               <div className="flex items-center gap-3">
                 <span className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest border ${
                   ticket.status === 'Open' ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                 }`}>
                   {ticket.status}
                 </span>
                 <button 
                   onClick={() => router.push(`/dashboard/tickets/${ticket.id}`)}
                   className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs font-bold transition-all border border-white/10"
                 >
                   View
                 </button>
               </div>
             </div>
          ))}
        </div>
      </div>
    </div>
  )
}
