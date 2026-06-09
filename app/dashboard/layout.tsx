"use client"

import { useSession, signOut } from "next-auth/react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { 
  LayoutDashboard, 
  Server, 
  Ticket, 
  User, 
  ShoppingCart, 
  LogOut, 
  Menu, 
  X, 
  ShieldCheck,
  ChevronRight,
  Bell,
  Search,
  CreditCard
} from "lucide-react"
import { useState, useEffect } from "react"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Protect the route
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#050507] flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  if (!session) return null

  const navigation = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Services", href: "/dashboard/services", icon: Server },
    { name: "Invoices", href: "/dashboard/invoices", icon: CreditCard },
    { name: "Tickets", href: "/dashboard/tickets", icon: Ticket },
    { name: "Account", href: "/dashboard/account", icon: User },
    { name: "Order", href: "/dashboard/order", icon: ShoppingCart },
  ]

  const isAdmin = process.env.NEXT_PUBLIC_ADMIN_USER_IDS?.split(',').includes(session?.user?.id || "") || false

  return (
    <div className="min-h-screen bg-[#050507] text-white selection:bg-blue-500/30">
      {/* Top Navigation */}
      <header className="fixed top-0 left-0 right-0 h-24 bg-[#050507]/40 backdrop-blur-md border-b border-white/5 z-50 px-6 lg:px-12 transition-all">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
          <div className="flex items-center gap-10">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                <span className="text-xl font-bold italic">V</span>
              </div>
              <span className="text-xl font-bold orbitron-font tracking-tighter hidden sm:block">VexaNode</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    pathname === item.href 
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" 
                      : "text-gray-500 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  href="/dashboard/admin"
                  className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    pathname.startsWith("/dashboard/admin") 
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20" 
                      : "text-purple-500/70 hover:text-purple-500 hover:bg-purple-500/5"
                  }`}
                >
                  Admin Panel
                </Link>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="hidden md:flex items-center gap-3 bg-white/5 border border-white/5 rounded-xl px-4 py-2 group focus-within:border-blue-500/50 transition-all">
              <Search className="w-4 h-4 text-gray-500 group-focus-within:text-blue-500" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent border-none focus:ring-0 text-xs text-gray-300 w-32 outline-none"
              />
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-3 bg-gradient-to-r from-blue-600/10 to-purple-600/10 pl-4 pr-1.5 py-1.5 rounded-xl border border-white/10 hover:border-blue-500/30 transition-all group cursor-pointer relative">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-bold text-white truncate max-w-[80px]">{session.user?.name}</p>
                <p className="text-[8px] text-gray-500 uppercase font-black tracking-widest">{isAdmin ? 'Admin' : 'User'}</p>
              </div>
              <Image 
                src={session.user?.image || "https://cdn.discordapp.com/embed/avatars/0.png"} 
                alt="Avatar" 
                width={36} 
                height={36} 
                unoptimized
                className="rounded-lg border border-white/10 group-hover:border-blue-500/50 transition-all"
              />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-[#0a0b0f] rounded-full" />
            </div>

            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2.5 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-all"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="pt-32 pb-20 px-6 lg:px-12 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] lg:hidden"
          >
            <motion.div 
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              className="bg-[#0a0b0f] p-8 border-b border-white/10"
            >
              <div className="flex items-center justify-between mb-10">
                <h1 className="text-xl font-bold orbitron-font">Menu</h1>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-white/5 rounded-lg">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="grid grid-cols-1 gap-3">
                {navigation.map((item) => (
                  <Link 
                    key={item.name} 
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-white/5 border border-white/5 font-bold text-sm"
                  >
                    <item.icon className="w-5 h-5 text-blue-500" />
                    {item.name}
                  </Link>
                ))}
                {isAdmin && (
                  <Link
                    href="/dashboard/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-500 font-bold text-sm"
                  >
                    <ShieldCheck className="w-5 h-5 text-purple-500" />
                    Admin Panel
                  </Link>
                )}
                <button 
                  onClick={() => signOut()}
                  className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 font-bold text-sm"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </nav>

              <div className="mt-auto pt-6 border-t border-white/5">
                <div className="flex items-center gap-3 mb-6">
                  <Image 
                    src={session.user?.image || "https://cdn.discordapp.com/embed/avatars/0.png"} 
                    alt="" 
                    width={40} 
                    height={40} 
                    unoptimized
                    className="rounded-full border border-white/10" 
                  />
                  <div>
                    <p className="text-sm font-bold text-white">{session.user?.name}</p>
                    <p className="text-xs text-gray-500 uppercase font-black tracking-widest">{isAdmin ? 'Admin' : 'User'}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
