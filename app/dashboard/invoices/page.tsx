"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { 
  CreditCard, 
  Search, 
  Eye, 
  X, 
  FileText, 
  Printer, 
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  HelpCircle
} from "lucide-react"
import { useUserData } from "@/lib/hooks/useUserData"
import { usePaymentsConfig } from "@/lib/hooks/usePaymentsConfig"
import { Skeleton, SkeletonTable } from "@/app/components/Skeleton"
import { useCurrency } from "../../contexts/CurrencyContext"

export default function InvoicesPage() {
  const { formatPrice } = useCurrency()
  const { data: userData, isLoading } = useUserData()
  const { data: paymentConfig } = usePaymentsConfig()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null)

  const orders = userData?.orders || []
  const cashfreeEnabled = paymentConfig?.cashfree?.enabled || false

  const filteredInvoices = orders.filter((order: any) => {
    const searchLower = searchQuery.toLowerCase()
    const invoiceId = `INV-${order.id.slice(0, 8).toUpperCase()}`
    return (
      invoiceId.toLowerCase().includes(searchLower) ||
      order.plan_name.toLowerCase().includes(searchLower) ||
      order.status.toLowerCase().includes(searchLower)
    )
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return (
          <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[9px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-1.5 w-fit">
            <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
            Paid
          </span>
        )
      case "Pending":
        return (
          <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-[9px] font-black uppercase tracking-widest text-amber-500 flex items-center gap-1.5 w-fit">
            <span className="w-1 h-1 bg-amber-500 rounded-full animate-pulse" />
            Pending
          </span>
        )
      case "Suspended":
        return (
          <span className="px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-[9px] font-black uppercase tracking-widest text-red-500 flex items-center gap-1.5 w-fit">
            <span className="w-1 h-1 bg-red-500 rounded-full" />
            Suspended
          </span>
        )
      default:
        return (
          <span className="px-3 py-1 bg-gray-500/10 border border-white/5 rounded-full text-[9px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1.5 w-fit">
            <span className="w-1 h-1 bg-gray-500 rounded-full" />
            Cancelled
          </span>
        )
    }
  }

  if (isLoading) return (
    <div className="space-y-8">
      <Skeleton className="h-14 w-64" />
      <Skeleton className="h-12 w-full" />
      <SkeletonTable rows={5} cols={4} />
    </div>
  )

  return (
    <div className="space-y-8 print:p-0">
      {/* Header (Hidden when printing) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white/5 border border-white/10 rounded-[32px] p-8 print:hidden">
        <div>
          <h2 className="text-3xl font-bold mb-1 orbitron-font">Billing & <span className="text-blue-500">Invoices</span></h2>
          <p className="text-xs text-gray-500">View and manage your account billing history and invoice statements.</p>
        </div>
        <div className="relative group w-full md:w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search invoices..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-xs font-medium outline-none focus:border-blue-500/30 transition-all"
          />
        </div>
      </div>

      {/* Invoices List (Hidden when printing) */}
      <div className="bg-[#0a0b0f] border border-white/10 rounded-[32px] overflow-hidden print:hidden">
        <div className="p-8 border-b border-white/5">
          <h3 className="text-xl font-bold orbitron-font">Invoice <span className="text-blue-500">History</span></h3>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Platform Statements</p>
        </div>

        {filteredInvoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/[0.02]">
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Invoice ID</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Date Issued</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Item</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Total</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Status</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredInvoices.map((invoice: any) => (
                  <tr key={invoice.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-8 py-6 text-xs font-mono text-blue-500 font-bold">
                      #INV-{invoice.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="px-8 py-6 text-xs text-gray-400">
                      {new Date(invoice.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-8 py-6 text-xs font-bold text-white max-w-xs truncate">
                      {invoice.plan_name}
                    </td>
                    <td className="px-8 py-6 text-xs font-bold text-white">
                      {invoice.amount}
                    </td>
                    <td className="px-8 py-6">
                      {getStatusBadge(invoice.status)}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button
                        onClick={() => setSelectedInvoice(invoice)}
                        className="px-4 py-2 bg-white/5 hover:bg-blue-600 border border-white/5 hover:border-blue-500 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-2 ml-auto"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-24 text-center border-dashed border-2 border-white/5 m-8 rounded-2xl">
            <FileText className="w-12 h-12 text-gray-700 mx-auto mb-4" />
            <h4 className="text-lg font-bold text-gray-500 mb-2">No invoices found.</h4>
            <p className="text-sm text-gray-600 max-w-sm mx-auto">
              Your billing statements will appear here once you place orders and submit payment verification screenshots.
            </p>
          </div>
        )}
      </div>

      {/* Detailed Invoice Modal (Paymenter Style) */}
      <AnimatePresence>
        {selectedInvoice && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto print:absolute print:bg-white print:text-black print:p-0 print:inset-0 print:z-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#07080c] border border-white/10 w-full max-w-4xl rounded-[40px] shadow-2xl relative overflow-hidden print:border-none print:bg-white print:text-black print:shadow-none print:w-full print:max-w-none print:rounded-none"
            >
              {/* Paymenter-Style Translucent Watermark Stamp */}
              <div className="absolute top-[25%] left-[5%] right-[5%] flex justify-center pointer-events-none select-none z-0 opacity-[0.03] print:opacity-[0.06]">
                {selectedInvoice.status === "Approved" && (
                  <span className="text-[12rem] font-black border-[20px] border-emerald-500 text-emerald-500 px-12 py-2 rotate-12 rounded-[50px] uppercase">PAID</span>
                )}
                {selectedInvoice.status === "Pending" && (
                  <span className="text-[9rem] font-black border-[20px] border-amber-500 text-amber-500 px-12 py-2 rotate-12 rounded-[50px] uppercase">PENDING</span>
                )}
                {selectedInvoice.status === "Suspended" && (
                  <span className="text-[8rem] font-black border-[20px] border-red-500 text-red-500 px-12 py-2 rotate-12 rounded-[50px] uppercase">SUSPENDED</span>
                )}
                {selectedInvoice.status === "Cancelled" && (
                  <span className="text-[8rem] font-black border-[20px] border-gray-500 text-gray-500 px-12 py-2 rotate-12 rounded-[50px] uppercase">VOID</span>
                )}
              </div>

              {/* Modal Top Bar (Hidden when printing) */}
              <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between print:hidden">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-500" />
                  <span className="text-xs font-black uppercase tracking-widest text-gray-400">Statement Preview</span>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => window.print()}
                    className="p-2.5 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 text-white transition-all flex items-center gap-2 text-xs font-bold"
                  >
                    <Printer className="w-4 h-4" />
                    Print / PDF
                  </button>
                  <button 
                    onClick={() => setSelectedInvoice(null)}
                    className="p-2.5 bg-white/5 border border-white/5 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Invoice Content */}
              <div className="p-8 md:p-12 space-y-12 relative z-10 print:p-0 print:text-black">
                {/* Brand & Invoice Details */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-white/5 pb-8 print:border-black/10">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 flex items-center justify-center print:bg-transparent">
                      <Image 
                        src="/logo.png" 
                        alt="Logo" 
                        width={48} 
                        height={48} 
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold orbitron-font text-white print:text-black">VexaNode</h4>
                      <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest print:text-black/60">Server Infrastructure Billing</p>
                    </div>
                  </div>

                  <div className="text-left md:text-right space-y-1">
                    <h3 className="text-2xl font-black orbitron-font text-white print:text-black">INVOICE</h3>
                    <p className="text-xs font-mono text-blue-500 font-bold">#INV-{selectedInvoice.id.toUpperCase()}</p>
                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest print:text-black/60">
                      Date Issued: {new Date(selectedInvoice.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Client / Vendor Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs leading-relaxed">
                  <div>
                    <h5 className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-3 print:text-black/60">Vendor</h5>
                    <p className="font-bold text-white print:text-black">VexaNode Infrastructure Ltd.</p>
                    <p className="text-gray-400 print:text-black/75">Billing Department</p>
                    <p className="text-gray-400 print:text-black/75">Mumbai, India</p>
                    <p className="text-gray-500 print:text-black/60">billing@vexanode.com</p>
                  </div>
                  <div>
                    <h5 className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-3 print:text-black/60">Invoiced To</h5>
                    <p className="font-bold text-white print:text-black">{selectedInvoice.user_name || "VexaNode Platform User"}</p>
                    <p className="text-gray-400 print:text-black/75">ID: {selectedInvoice.user_id}</p>
                    <p className="text-gray-500 print:text-black/60">Payment Gateway: QR Scan / UPI</p>
                  </div>
                </div>

                {/* Itemized Table */}
                <div className="border border-white/5 rounded-2xl overflow-hidden print:border-black/10">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-white/[0.02] border-b border-white/5 print:bg-black/5 print:border-black/10">
                        <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-500 print:text-black/70">Plan / Description</th>
                        <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-500 print:text-black/70">Qty</th>
                        <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-500 text-right print:text-black/70">Unit Price</th>
                        <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-500 text-right print:text-black/70">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 print:divide-black/10">
                      <tr>
                        <td className="px-6 py-5 font-bold text-white print:text-black">
                          {selectedInvoice.plan_name}
                        </td>
                        <td className="px-6 py-5 text-gray-400 print:text-black/85">1</td>
                        <td className="px-6 py-5 text-right text-gray-400 print:text-black/85">{selectedInvoice.amount}</td>
                        <td className="px-6 py-5 text-right font-bold text-white print:text-black">{selectedInvoice.amount}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Total Summary */}
                <div className="flex justify-end text-xs leading-loose">
                  <div className="w-full md:w-64 space-y-2.5">
                    <div className="flex justify-between text-gray-400 print:text-black/75">
                      <span>Subtotal</span>
                      <span>{selectedInvoice.amount}</span>
                    </div>
                    <div className="flex justify-between text-gray-400 print:text-black/75">
                      <span>Tax / VAT (0%)</span>
                      <span>₹0.00</span>
                    </div>
                    <div className="pt-4 border-t border-white/5 flex justify-between items-end print:border-black/10">
                      <span className="font-bold text-white print:text-black text-sm uppercase">Total Due</span>
                      <span className="text-xl font-bold orbitron-font text-blue-500 print:text-black">{selectedInvoice.amount}</span>
                    </div>

                    {(selectedInvoice.status === "Pending" || selectedInvoice.status === "Suspended") && (
                      <div className="mt-6 space-y-3 print:hidden">
                        {cashfreeEnabled ? (
                          <button
                            onClick={() => {
                              window.location.href = `/dashboard/checkout?order_id=${selectedInvoice.id}`
                            }}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 animate-pulse"
                          >
                            <CreditCard className="w-4 h-4" />
                            Pay Now with Cashfree
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              window.location.href = `/dashboard/checkout?order_id=${selectedInvoice.id}`
                            }}
                            className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                          >
                            Pay with Manual QR / UPI
                          </button>
                        )}
                        <p className="text-[9px] text-gray-500 text-center font-semibold uppercase tracking-wider">
                          Secure online gateway and manual payment methods available.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Security Verification Info */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 print:border-black/10">
                  <div className="flex items-center gap-3 bg-white/[0.02] border border-white/5 px-5 py-3 rounded-xl print:bg-black/5 print:border-none">
                    <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                    <div>
                      <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Verified Payment ID</p>
                      <p className="text-[10px] font-mono text-white/60 font-bold truncate max-w-[200px] print:text-black/75">
                        {selectedInvoice.proof_url ? "AI System Approved Transaction" : "Manual System Approved"}
                      </p>
                    </div>
                  </div>

                  <div className="text-left md:text-right">
                    <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest print:text-black/60">Verification Stamp</p>
                    {selectedInvoice.status === "Approved" ? (
                      <span className="text-[10px] font-black text-emerald-500 tracking-wider flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> PAYMENT APPROVED
                      </span>
                    ) : selectedInvoice.status === "Pending" ? (
                      <span className="text-[10px] font-black text-amber-500 tracking-wider flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> PENDING AI SCREENSHOT VERIFICATION
                      </span>
                    ) : selectedInvoice.status === "Suspended" ? (
                      <span className="text-[10px] font-black text-red-500 tracking-wider flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> SERVICE SUSPENDED / UNPAID
                      </span>
                    ) : (
                      <span className="text-[10px] font-black text-gray-500 tracking-wider flex items-center gap-1">
                        <HelpCircle className="w-3.5 h-3.5" /> CANCELLED / VOID
                      </span>
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
