"use client"

import { useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Users,
  Server,
  Ticket,
  CreditCard,
  ShieldAlert,
  ShieldCheck,
  Search,
  MoreVertical,
  Activity,
  Loader2,
  Trash2,
  Check,
  X,
  Eye,
  FileText,
  Calendar,
  Layers,
  ArrowUpRight,
  TrendingUp,
  UserCheck,
  UserX,
  MessageSquare,
  Clock,
  Settings,
  Key,
  EyeOff,
  Save
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useCurrency } from "../../contexts/CurrencyContext"

type TabType = "overview" | "invoices" | "clients" | "tickets" | "settings"

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { formatPrice } = useCurrency()

  const [users, setUsers] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [tickets, setTickets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabType>("overview")

  // Cashfree Settings States
  const [cashfreeEnabled, setCashfreeEnabled] = useState(false)
  const [cashfreeAppId, setCashfreeAppId] = useState("")
  const [cashfreeSecretKey, setCashfreeSecretKey] = useState("")
  const [cashfreeSandbox, setCashfreeSandbox] = useState(true)
  const [storageSystem, setStorageSystem] = useState("Database")
  const [settingsSaving, setSettingsSaving] = useState(false)
  const [settingsSuccess, setSettingsSuccess] = useState(false)
  const [showSecret, setShowSecret] = useState(false)

  // Searching & Filtering states
  const [invoiceSearch, setInvoiceSearch] = useState("")
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState("all")
  const [clientSearch, setClientSearch] = useState("")
  const [clientStatusFilter, setClientStatusFilter] = useState("all")

  // Modal / Detailed view states
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null)
  const [zoomProof, setZoomProof] = useState(false)

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/data")
      const data = await res.json()
      if (data.users) setUsers(data.users)
      if (data.orders) setOrders(data.orders)
      if (data.tickets) setTickets(data.tickets)

      // Fetch admin settings
      const settingsRes = await fetch("/api/admin/settings")
      if (settingsRes.ok) {
        const settingsData = await settingsRes.json()
        if (settingsData.cashfree) {
          setCashfreeEnabled(settingsData.cashfree.enabled)
          setCashfreeAppId(settingsData.cashfree.appId)
          setCashfreeSecretKey(settingsData.cashfree.secretKey)
          setCashfreeSandbox(settingsData.cashfree.sandbox)
        }
        if (settingsData.storage) {
          setStorageSystem(settingsData.storage)
        }
      }
    } catch (error) {
      console.error("Failed to fetch admin data")
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    setSettingsSaving(true)
    setSettingsSuccess(false)
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enabled: cashfreeEnabled,
          appId: cashfreeAppId,
          secretKey: cashfreeSecretKey,
          sandbox: cashfreeSandbox
        })
      })
      if (res.ok) {
        setSettingsSuccess(true)
        setTimeout(() => setSettingsSuccess(false), 3000)
        // Refresh to get storage updates
        const settingsRes = await fetch("/api/admin/settings")
        if (settingsRes.ok) {
          const settingsData = await settingsRes.json()
          if (settingsData.storage) setStorageSystem(settingsData.storage)
        }
      } else {
        const data = await res.json()
        alert(data.error || "Failed to save settings")
      }
    } catch (error) {
      alert("Network error. Failed to save settings.")
    } finally {
      setSettingsSaving(false)
    }
  }

  // Protect Admin route and fetch data
  useEffect(() => {
    const isAdmin = session?.user?.isAdmin || process.env.NEXT_PUBLIC_ADMIN_USER_IDS?.split(',').map(id => id.trim()).includes(session?.user?.id || "")
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
        // Automatically close modal if deleted or status updated
        if (selectedInvoice && selectedInvoice.id === id) {
          if (type === "DELETE_ORDER") {
            setSelectedInvoice(null)
          } else if (type === "UPDATE_ORDER_STATUS") {
            // Update selected invoice reference locally
            const nextStatus = (extra as any).status
            setSelectedInvoice((prev: any) => ({ ...prev, status: nextStatus }))
          }
        }
        fetchData() // Refresh data
      } else {
        alert("Action failed")
      }
    } catch (error) {
      alert("Action failed")
    }
  }

  // Analytics helper functions
  const totalRevenue = orders
    .filter(o => o.status === "Approved")
    .reduce((acc, o) => {
      const parsed = parseFloat(o.amount.replace(/[^0-9.]/g, ''))
      return acc + (isNaN(parsed) ? 0 : parsed)
    }, 0)

  const pendingRevenue = orders
    .filter(o => o.status === "Pending")
    .reduce((acc, o) => {
      const parsed = parseFloat(o.amount.replace(/[^0-9.]/g, ''))
      return acc + (isNaN(parsed) ? 0 : parsed)
    }, 0)

  // Filtering lists
  const filteredOrders = orders.filter(o => {
    const searchMatch = 
      o.user_name?.toLowerCase().includes(invoiceSearch.toLowerCase()) ||
      o.plan_name?.toLowerCase().includes(invoiceSearch.toLowerCase()) ||
      `INV-${o.id.slice(0,8)}`.toLowerCase().includes(invoiceSearch.toLowerCase())
    
    const statusMatch = invoiceStatusFilter === "all" || o.status === invoiceStatusFilter
    return searchMatch && statusMatch
  })

  const filteredClients = users.filter(u => {
    const searchMatch = 
      u.name?.toLowerCase().includes(clientSearch.toLowerCase()) ||
      u.email?.toLowerCase().includes(clientSearch.toLowerCase()) ||
      u.id?.toLowerCase().includes(clientSearch.toLowerCase())

    const statusMatch = clientStatusFilter === "all" || u.status === clientStatusFilter
    return searchMatch && statusMatch
  })

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
    </div>
  )

  return (
    <div className="space-y-8 pb-20">
      {/* Admin Panel Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-gradient-to-r from-purple-950/20 via-transparent to-transparent border border-white/10 rounded-[32px] p-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold orbitron-font">
              Root <span className="text-purple-500">Administrator</span>
            </h1>
            <div className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-[10px] font-black uppercase tracking-widest text-purple-500">
              Paymenter Mode Active
            </div>
          </div>
          <p className="text-xs text-gray-500">Manage clients, invoices, verification screenshots, and support queues.</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={fetchData} 
            className="bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-3 rounded-xl font-bold text-xs transition-all flex items-center gap-2"
          >
            <Activity className="w-4 h-4 text-emerald-500" />
            Sync Platform Data
          </button>
        </div>
      </div>

      {/* Paymenter-Style Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-white/5 pb-2">
        {(["overview", "invoices", "clients", "tickets", "settings"] as TabType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === tab
                ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20 border border-purple-500/30"
                : "text-gray-500 hover:text-white hover:bg-white/5"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Tab 1: Overview & Analytics */}
        {activeTab === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8"
          >
            {/* Stats Dashboard Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-[#0a0b0f] border border-white/10 rounded-2xl p-6 group hover:border-purple-500/20 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> Sales approved
                  </span>
                </div>
                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1">Approved Income</p>
                <h4 className="text-2xl font-bold orbitron-font text-white">₹{totalRevenue.toLocaleString()}</h4>
              </div>

              <div className="bg-[#0a0b0f] border border-white/10 rounded-2xl p-6 group hover:border-purple-500/20 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500">
                    <Clock className="w-5 h-5 animate-pulse" />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-amber-500">Pending Review</span>
                </div>
                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1">Pending Income</p>
                <h4 className="text-2xl font-bold orbitron-font text-white">₹{pendingRevenue.toLocaleString()}</h4>
              </div>

              <div className="bg-[#0a0b0f] border border-white/10 rounded-2xl p-6 group hover:border-purple-500/20 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-blue-500">Registered</span>
                </div>
                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1">Total Accounts</p>
                <h4 className="text-2xl font-bold orbitron-font text-white">{users.length}</h4>
              </div>

              <div className="bg-[#0a0b0f] border border-white/10 rounded-2xl p-6 group hover:border-purple-500/20 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-500/10 rounded-xl text-purple-500">
                    <Ticket className="w-5 h-5" />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-purple-500">
                    {tickets.filter(t => t.status === "Open").length} Active
                  </span>
                </div>
                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1">Total Support Tickets</p>
                <h4 className="text-2xl font-bold orbitron-font text-white">{tickets.length}</h4>
              </div>
            </div>

            {/* Quick Actions & System Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Pending Verification Queue */}
              <div className="lg:col-span-2 bg-[#0a0b0f] border border-white/10 rounded-[32px] p-8 space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold orbitron-font">Payment <span className="text-purple-500">Review Queue</span></h3>
                    <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-1">Pending receipt verification requests</p>
                  </div>
                  <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-[9px] font-black text-amber-500 uppercase tracking-widest">
                    {orders.filter(o => o.status === "Pending").length} Request(s)
                  </span>
                </div>

                <div className="space-y-4">
                  {orders.filter(o => o.status === "Pending").length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-white/5 rounded-2xl">
                      <ShieldCheck className="w-12 h-12 text-emerald-500/30 mx-auto mb-4" />
                      <p className="text-sm text-gray-500 italic">No payments pending review</p>
                    </div>
                  ) : (
                    orders.filter(o => o.status === "Pending").map((order) => (
                      <div key={order.id} className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between gap-4 hover:bg-white/[0.04] transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-500 font-bold font-mono text-xs shrink-0">
                            #INV
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">{order.user_name}</p>
                            <p className="text-[10px] text-gray-500">{order.plan_name} • {order.amount}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedInvoice(order)}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-xs font-bold text-white transition-all flex items-center gap-1.5"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Review
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Server Stats Info */}
              <div className="bg-[#0a0b0f] border border-white/10 rounded-[32px] p-8 space-y-6">
                <div>
                  <h3 className="text-lg font-bold orbitron-font">Platform <span className="text-purple-500">Summary</span></h3>
                  <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-1">Platform service statistics</p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl flex justify-between items-center">
                    <span className="text-xs text-gray-400 font-medium">Pending Orders</span>
                    <span className="text-sm font-bold text-amber-500">{orders.filter(o => o.status === "Pending").length}</span>
                  </div>
                  <div className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl flex justify-between items-center">
                    <span className="text-xs text-gray-400 font-medium">Active Subscriptions</span>
                    <span className="text-sm font-bold text-emerald-500">{orders.filter(o => o.status === "Approved").length}</span>
                  </div>
                  <div className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl flex justify-between items-center">
                    <span className="text-xs text-gray-400 font-medium">Suspended Subscriptions</span>
                    <span className="text-sm font-bold text-red-500">{orders.filter(o => o.status === "Suspended").length}</span>
                  </div>
                  <div className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl flex justify-between items-center">
                    <span className="text-xs text-gray-400 font-medium">Cancelled Subscriptions</span>
                    <span className="text-sm font-bold text-gray-500">{orders.filter(o => o.status === "Cancelled").length}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 2: Invoices & Orders */}
        {activeTab === "invoices" && (
          <motion.div
            key="invoices"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Search & Filters */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#0a0b0f] border border-white/10 rounded-2xl p-6">
              <div className="relative group w-full md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-purple-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search Invoice ID, client or plan..."
                  value={invoiceSearch}
                  onChange={(e) => setInvoiceSearch(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-xs font-medium outline-none focus:border-purple-500/30 transition-all"
                />
              </div>

              <div className="flex gap-2 w-full md:w-auto">
                <select
                  value={invoiceStatusFilter}
                  onChange={(e) => setInvoiceStatusFilter(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:border-purple-500/30 transition-all text-white w-full md:w-44"
                >
                  <option value="all">All Invoices</option>
                  <option value="Approved">Paid</option>
                  <option value="Pending">Pending Review</option>
                  <option value="Suspended">Suspended</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Invoices Database List */}
            <div className="bg-[#0a0b0f] border border-white/10 rounded-[32px] overflow-hidden">
              {filteredOrders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white/[0.02]">
                        <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-gray-500">Invoice ID</th>
                        <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-gray-500">Client</th>
                        <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-gray-500">Product / Service</th>
                        <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-gray-500">Amount</th>
                        <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-gray-500">Status</th>
                        <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-gray-500 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-white/[0.02] transition-colors group">
                          <td className="px-8 py-6 text-xs font-mono text-purple-500 font-bold">
                            #INV-{order.id.slice(0, 8).toUpperCase()}
                          </td>
                          <td className="px-8 py-6">
                            <div className="text-xs font-bold text-white">{order.user_name}</div>
                            <div className="text-[10px] text-gray-500 truncate max-w-[150px]">{order.user_id}</div>
                          </td>
                          <td className="px-8 py-6 text-xs text-white font-medium max-w-xs truncate">
                            {order.plan_name}
                          </td>
                          <td className="px-8 py-6 text-xs font-bold text-white">
                            {order.amount}
                          </td>
                          <td className="px-8 py-6">
                            {order.status === "Approved" ? (
                              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">Paid</span>
                            ) : order.status === "Pending" ? (
                              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-amber-500/10 border border-amber-500/20 text-amber-500">Pending Review</span>
                            ) : order.status === "Suspended" ? (
                              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-red-500/10 border border-red-500/20 text-red-500">Suspended</span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-gray-500/10 border border-white/5 text-gray-400">Cancelled</span>
                            )}
                          </td>
                          <td className="px-8 py-6 text-right">
                            <div className="flex justify-end items-center gap-2">
                              <button
                                onClick={() => setSelectedInvoice(order)}
                                className="px-3.5 py-2 bg-white/5 hover:bg-purple-600 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                Review
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm("Delete this invoice statement permanently?")) {
                                    handleAction("DELETE_ORDER", order.id)
                                  }
                                }}
                                className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
                                title="Delete Statement"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-24 text-center">
                  <FileText className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                  <p className="text-sm text-gray-500 italic">No invoices found matching query</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Tab 3: Client Manager */}
        {activeTab === "clients" && (
          <motion.div
            key="clients"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Search & Filters */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#0a0b0f] border border-white/10 rounded-2xl p-6">
              <div className="relative group w-full md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-purple-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search Name, Email, Discord ID..."
                  value={clientSearch}
                  onChange={(e) => setClientSearch(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-xs font-medium outline-none focus:border-purple-500/30 transition-all"
                />
              </div>

              <div className="flex gap-2 w-full md:w-auto">
                <select
                  value={clientStatusFilter}
                  onChange={(e) => setClientStatusFilter(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:border-purple-500/30 transition-all text-white w-full md:w-44"
                >
                  <option value="all">All Clients</option>
                  <option value="Active">Active Users</option>
                  <option value="Banned">Banned Users</option>
                </select>
              </div>
            </div>

            {/* Client Database List */}
            <div className="bg-[#0a0b0f] border border-white/10 rounded-[32px] overflow-hidden">
              {filteredClients.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white/[0.02]">
                        <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-gray-500">Client Details</th>
                        <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-gray-500">Discord ID</th>
                        <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-gray-500">Registered</th>
                        <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-gray-500">Status</th>
                        <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-gray-500 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredClients.map((user) => (
                        <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center font-bold text-purple-500 text-sm font-mono shrink-0">
                                {user.name ? user.name[0].toUpperCase() : "U"}
                              </div>
                              <div>
                                <p className="text-xs font-black text-white">{user.name || "Unknown client"}</p>
                                <p className="text-[10px] text-gray-500">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6 text-xs font-mono text-gray-500">
                            {user.id}
                          </td>
                          <td className="px-8 py-6 text-xs text-gray-400">
                            {user.joined_at ? new Date(user.joined_at).toLocaleDateString() : "N/A"}
                          </td>
                          <td className="px-8 py-6">
                            {user.status === "Active" ? (
                              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">Active</span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-red-500/10 border border-red-500/20 text-red-500">Banned</span>
                            )}
                          </td>
                          <td className="px-8 py-6 text-right">
                            <div className="flex justify-end gap-2">
                              {user.status === "Active" ? (
                                <button
                                  onClick={() => handleAction("BAN_USER", user.id)}
                                  className="px-3.5 py-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border border-red-500/20"
                                >
                                  <UserX className="w-3.5 h-3.5" />
                                  Ban Account
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleAction("UNBAN_USER", user.id)}
                                  className="px-3.5 py-2 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border border-emerald-500/20"
                                >
                                  <UserCheck className="w-3.5 h-3.5" />
                                  Unban Account
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-24 text-center">
                  <Users className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                  <p className="text-sm text-gray-500 italic">No clients found matching query</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Tab 4: Support Queue */}
        {activeTab === "tickets" && (
          <motion.div
            key="tickets"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Tickets Database List */}
            <div className="bg-[#0a0b0f] border border-white/10 rounded-[32px] overflow-hidden">
              <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold orbitron-font">Support <span className="text-purple-500">Threads</span></h3>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Manage user support requests</p>
                </div>
                <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-[9px] font-black text-purple-500 uppercase tracking-widest">
                  {tickets.filter(t => t.status === "Open").length} Active Tickets
                </span>
              </div>

              {tickets.length > 0 ? (
                <div className="divide-y divide-white/5">
                  {tickets.map((ticket) => (
                    <div key={ticket.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/[0.02] transition-all">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          ticket.status === 'Open' ? 'bg-purple-500/10 text-purple-500' : 'bg-emerald-500/10 text-emerald-500'
                        }`}>
                          <MessageSquare className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <h4 className="font-bold text-white text-sm">{ticket.subject}</h4>
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${
                              ticket.priority === 'High' || ticket.priority === 'Urgent' 
                                ? 'bg-red-500/10 border-red-500/20 text-red-500' 
                                : 'bg-gray-500/10 border-white/5 text-gray-400'
                            }`}>
                              {ticket.priority || "Normal"}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">
                            Requested by: {ticket.users?.name || 'Unknown client'} • {new Date(ticket.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                          ticket.status === 'Open' ? 'bg-purple-500/10 border-purple-500/20 text-purple-500' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                        }`}>
                          {ticket.status}
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => router.push(`/dashboard/tickets/${ticket.id}`)}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs font-bold transition-all border border-white/10 flex items-center gap-1.5"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Open
                          </button>
                          
                          {ticket.status === "Open" ? (
                            <button
                              onClick={() => handleAction("UPDATE_TICKET_STATUS", ticket.id, { status: "Closed" })}
                              className="px-3.5 py-2 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white rounded-lg text-xs font-bold transition-all border border-emerald-500/20"
                            >
                              Resolve
                            </button>
                          ) : (
                            <button
                              onClick={() => handleAction("UPDATE_TICKET_STATUS", ticket.id, { status: "Open" })}
                              className="px-3.5 py-2 bg-purple-500/10 hover:bg-purple-500 text-purple-500 hover:text-white rounded-lg text-xs font-bold transition-all border border-purple-500/20"
                            >
                              Re-open
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-24 text-center">
                  <Ticket className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                  <p className="text-sm text-gray-500 italic">No tickets found</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Tab 5: Configuration Settings */}
        {activeTab === "settings" && (
          <motion.div
            key="settings"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8"
          >
            <div className="bg-[#0a0b0f] border border-white/10 rounded-[32px] p-8 md:p-10 space-y-8">
              <div>
                <h3 className="text-xl font-bold orbitron-font flex items-center gap-2">
                  <Settings className="w-5 h-5 text-purple-500 animate-spin" style={{ animationDuration: '6s' }} />
                  System <span className="text-purple-500">Configuration</span>
                </h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
                  Manage external application API integrations and payment gateways
                </p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-8">
                {/* Cashfree Payment Gateway Integration Card */}
                <div className="bg-[#06070a] border border-white/5 rounded-2xl p-6 md:p-8 space-y-6 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-36 h-36 bg-purple-600/5 blur-[50px] rounded-full group-hover:bg-purple-600/10 transition-all pointer-events-none" />

                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
                    <div>
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-purple-500/10 border border-purple-500/20 text-purple-500 rounded-xl">
                          <CreditCard className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-md font-bold text-white">Cashfree Payment Gateway</h4>
                          <p className="text-[10px] text-gray-500 font-medium">Accept automated UPI, Indian Cards, Netbanking, and Wallets.</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${
                        cashfreeEnabled 
                          ? "bg-purple-500/10 border-purple-500/25 text-purple-500" 
                          : "bg-white/5 border-white/5 text-gray-500"
                      }`}>
                        {cashfreeEnabled ? "Enabled" : "Disabled"}
                      </span>
                      {cashfreeEnabled && (
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                          cashfreeSandbox 
                            ? "bg-amber-500/10 border-amber-500/25 text-amber-500" 
                            : "bg-emerald-500/10 border-emerald-500/25 text-emerald-500"
                        }`}>
                          {cashfreeSandbox ? "Sandbox" : "Production"}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    {/* Enable toggle */}
                    <div className="p-5 bg-white/[0.01] border border-white/5 rounded-xl flex items-center justify-between hover:border-purple-500/10 transition-colors">
                      <div>
                        <label className="text-xs font-bold text-white block mb-1">Enable Gateway</label>
                        <p className="text-[10px] text-gray-500">Allow customers to check out using Cashfree PG.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCashfreeEnabled(!cashfreeEnabled)}
                        className={`w-12 h-6 rounded-full p-1 transition-all relative ${
                          cashfreeEnabled ? "bg-purple-600" : "bg-white/10"
                        }`}
                      >
                        <motion.div
                          layout
                          className="w-4 h-4 bg-white rounded-full absolute top-1 left-1"
                          animate={{ x: cashfreeEnabled ? 24 : 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      </button>
                    </div>

                    {/* Sandbox toggle */}
                    <div className="p-5 bg-white/[0.01] border border-white/5 rounded-xl flex items-center justify-between hover:border-purple-500/10 transition-colors">
                      <div>
                        <label className="text-xs font-bold text-white block mb-1">Sandbox (Test Mode)</label>
                        <p className="text-[10px] text-gray-500">Use Cashfree Sandbox Environment for test payments.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCashfreeSandbox(!cashfreeSandbox)}
                        className={`w-12 h-6 rounded-full p-1 transition-all relative ${
                          cashfreeSandbox ? "bg-amber-600" : "bg-white/10"
                        }`}
                      >
                        <motion.div
                          layout
                          className="w-4 h-4 bg-white rounded-full absolute top-1 left-1"
                          animate={{ x: cashfreeSandbox ? 24 : 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      </button>
                    </div>

                    {/* App ID Input */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 flex items-center gap-1.5">
                        <Key className="w-3.5 h-3.5 text-purple-500" />
                        Cashfree App ID
                      </label>
                      <input
                        type="text"
                        value={cashfreeAppId}
                        onChange={(e) => setCashfreeAppId(e.target.value)}
                        placeholder="e.g. TEST103829420..."
                        disabled={!cashfreeEnabled}
                        className="w-full bg-black/40 border border-white/5 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl py-3.5 px-4 text-xs font-medium outline-none focus:border-purple-500/30 transition-all font-mono"
                      />
                    </div>

                    {/* Secret Key Input */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <ShieldAlert className="w-3.5 h-3.5 text-purple-500" />
                          Cashfree Secret Key
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowSecret(!showSecret)}
                          className="text-[9px] font-black uppercase text-purple-500 hover:underline tracking-wider"
                          disabled={!cashfreeEnabled}
                        >
                          {showSecret ? "Hide" : "Show"}
                        </button>
                      </label>
                      <div className="relative">
                        <input
                          type={showSecret ? "text" : "password"}
                          value={cashfreeSecretKey}
                          onChange={(e) => setCashfreeSecretKey(e.target.value)}
                          placeholder="cf_secret_key_..."
                          disabled={!cashfreeEnabled}
                          className="w-full bg-black/40 border border-white/5 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl py-3.5 px-4 text-xs font-medium outline-none focus:border-purple-500/30 transition-all font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form submit & status indicators */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-white/5">
                  <div className="text-left">
                    <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest block mb-0.5">Configuration Storage</span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-white">{storageSystem}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <AnimatePresence>
                      {settingsSuccess && (
                        <motion.div
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          className="text-xs text-emerald-500 font-bold flex items-center gap-1.5"
                        >
                          <Check className="w-4 h-4" />
                          Configurations Saved!
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <button
                      type="submit"
                      disabled={settingsSaving}
                      className="w-full sm:w-auto bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white px-10 py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-xl shadow-purple-600/20 flex items-center justify-center gap-2"
                    >
                      {settingsSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Save Configurations
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slide-over / Side-by-Side Verification Invoice Modal */}
      <AnimatePresence>
        {selectedInvoice && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#07080c] border border-white/10 w-full max-w-5xl rounded-[40px] shadow-2xl relative overflow-hidden"
            >
              {/* Modal Header */}
              <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-purple-500" />
                  <h4 className="text-sm font-black uppercase tracking-widest text-gray-300">
                    Verify Statement #INV-{selectedInvoice.id.slice(0, 8).toUpperCase()}
                  </h4>
                </div>
                <button
                  onClick={() => {
                    setSelectedInvoice(null)
                    setZoomProof(false)
                  }}
                  className="p-2.5 bg-white/5 border border-white/5 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Side-by-Side Content */}
              <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-white/5">
                {/* Left Side: Invoice Summary & Actions */}
                <div className="p-8 md:p-10 space-y-8">
                  <div>
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                      selectedInvoice.status === "Approved" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" :
                      selectedInvoice.status === "Pending" ? "bg-amber-500/10 border-amber-500/20 text-amber-500" :
                      selectedInvoice.status === "Suspended" ? "bg-red-500/10 border-red-500/20 text-red-500" :
                      "bg-gray-500/10 border-white/5 text-gray-400"
                    }`}>
                      {selectedInvoice.status}
                    </span>
                    <h3 className="text-2xl font-bold mt-4 orbitron-font text-white">{selectedInvoice.plan_name}</h3>
                    <p className="text-[10px] text-gray-500 font-mono mt-1">Invoice ID: {selectedInvoice.id}</p>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-3">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Invoiced Client</span>
                        <span className="text-white font-bold">{selectedInvoice.user_name}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Client ID</span>
                        <span className="text-white/60 font-mono text-[10px]">{selectedInvoice.user_id}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Total Price</span>
                        <span className="text-purple-500 font-bold orbitron-font">{selectedInvoice.amount}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Date Issued</span>
                        <span className="text-white font-medium">{new Date(selectedInvoice.created_at).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions bar */}
                  <div className="space-y-3">
                    {selectedInvoice.status === "Pending" && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleAction("UPDATE_ORDER_STATUS", selectedInvoice.id, { status: "Approved" })}
                          className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                        >
                          <Check className="w-4 h-4" />
                          Approve Payment
                        </button>
                        <button
                          onClick={() => handleAction("UPDATE_ORDER_STATUS", selectedInvoice.id, { status: "Cancelled" })}
                          className="flex-1 py-3.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                        >
                          <X className="w-4 h-4" />
                          Reject Invoice
                        </button>
                      </div>
                    )}

                    {selectedInvoice.status === "Approved" && (
                      <button
                        onClick={() => handleAction("UPDATE_ORDER_STATUS", selectedInvoice.id, { status: "Suspended" })}
                        className="w-full py-3.5 bg-amber-500/10 hover:bg-amber-500 text-amber-500 hover:text-black border border-amber-500/20 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                      >
                        <ShieldAlert className="w-4 h-4" />
                        Suspend Service
                      </button>
                    )}

                    {selectedInvoice.status === "Suspended" && (
                      <button
                        onClick={() => handleAction("UPDATE_ORDER_STATUS", selectedInvoice.id, { status: "Approved" })}
                        className="w-full py-3.5 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white border border-emerald-500/20 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        Re-Approve (Unsuspend)
                      </button>
                    )}

                    <button
                      onClick={() => {
                        if (confirm("Delete this order?")) {
                          handleAction("DELETE_ORDER", selectedInvoice.id)
                        }
                      }}
                      className="w-full py-3.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Entry
                    </button>
                  </div>
                </div>

                {/* Right Side: Verification Screenshot */}
                <div className="p-8 md:p-10 flex flex-col justify-center items-center space-y-4">
                  <div className="w-full flex justify-between items-center mb-2">
                    <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Verification Proof</span>
                    {selectedInvoice.proof_url && (
                      <button
                        onClick={() => setZoomProof(!zoomProof)}
                        className="text-xs font-bold text-purple-500 hover:underline flex items-center gap-1"
                      >
                        {zoomProof ? "Fit Screen" : "Zoom View"}
                      </button>
                    )}
                  </div>

                  <div className="w-full aspect-video bg-black rounded-3xl overflow-hidden border border-white/5 relative group">
                    {selectedInvoice.proof_url ? (
                      <img
                        src={selectedInvoice.proof_url}
                        alt="Receipt Proof"
                        className={`w-full h-full transition-all duration-300 ${zoomProof ? "object-contain" : "object-cover opacity-80 group-hover:opacity-100"}`}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-600 gap-2">
                        <FileText className="w-8 h-8" />
                        <span className="text-[10px] font-black uppercase tracking-widest">No Proof Uploaded</span>
                      </div>
                    )}

                    {selectedInvoice.proof_url && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => window.open(selectedInvoice.proof_url)}
                          className="w-full py-2.5 bg-white/10 backdrop-blur-md border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/20"
                        >
                          View Full Screen
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
