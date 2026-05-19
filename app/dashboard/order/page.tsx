"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ShoppingCart, 
  ChevronRight, 
  Zap, 
  Cpu, 
  HardDrive, 
  Shield, 
  Plus,
  Minus,
  CheckCircle2,
  Tag,
  Music,
  Database,
  Layers,
  Search,
  Filter,
  ArrowRight,
  Globe,
  Activity
} from "lucide-react"
import Link from "next/link"
import { useCurrency } from "../../contexts/CurrencyContext"

const locations = [
  { id: "us-n-virginia", name: "N. Virginia", country: "USA", flag: "🇺🇸" },
  { id: "us-ohio", name: "Ohio", country: "USA", flag: "🇺🇸" },
  { id: "us-n-california", name: "N. California", country: "USA", flag: "🇺🇸" },
  { id: "us-oregon", name: "Oregon", country: "USA", flag: "🇺🇸" },
  { id: "brazil-sao-paulo", name: "São Paulo", country: "Brazil", flag: "🇧🇷" },
  { id: "ireland", name: "Ireland", country: "Ireland", flag: "🇮🇪" },
  { id: "germany-frankfurt", name: "Frankfurt", country: "Germany", flag: "🇩🇪" },
  { id: "uk-london", name: "London", country: "UK", flag: "🇬🇧" },
  { id: "france-paris", name: "Paris", country: "France", flag: "🇫🇷" },
  { id: "sweden-stockholm", name: "Stockholm", country: "Sweden", flag: "🇸🇪" },
  { id: "italy-milan", name: "Milan", country: "Italy", flag: "🇮🇹" },
  { id: "spain", name: "Spain", country: "Spain", flag: "🇪🇸" },
  { id: "me-bahrain", name: "Bahrain", country: "Middle East", flag: "🌍" },
  { id: "me-uae", name: "UAE", country: "Middle East", flag: "🌍" },
  { id: "sa-cape-town", name: "Cape Town", country: "South Africa", flag: "🇿🇦" },
  { id: "india-mumbai", name: "Mumbai", country: "India", flag: "🇮🇳" },
  { id: "india-hyderabad", name: "Hyderabad", country: "India", flag: "🇮🇳" },
  { id: "singapore", name: "Singapore", country: "Singapore", flag: "🇸🇬" },
  { id: "japan-tokyo", name: "Tokyo", country: "Japan", flag: "🇯🇵" },
  { id: "japan-osaka", name: "Osaka", country: "Japan", flag: "🇯🇵" },
  { id: "korea-seoul", name: "Seoul", country: "South Korea", flag: "🇰🇷" },
  { id: "australia-sydney", name: "Sydney", country: "Australia", flag: "🇦🇺" },
  { id: "canada-montreal", name: "Montreal", country: "Canada", flag: "🇨🇦" },
  { id: "canada-calgary", name: "Calgary", country: "Canada", flag: "🇨🇦" }
];

const cpuTypes = [
  { id: "std", name: "Standard", desc: "Intel Xeon E5" },
  { id: "pre", name: "Premium", desc: "Intel Xeon Platinum" },
  { id: "per", name: "Performance", desc: "AMD EPYC" }
];

const categories = [
  { id: "vps", name: "VPS Hosting", icon: Cpu },
  { id: "bot", name: "Bot Hosting", icon: Zap },
  { id: "lavalink", name: "Lavalink", icon: Music },
  { id: "db", name: "Databases", icon: Database }
]

const plans: any = {
  bot: [
    { id: "starter", name: "Starter", desc: "Entry bot hosting for light projects.", price: 35, cpu: "50%", ram: "512 MB", ssd: "1 GB", popular: false },
    { id: "basic", name: "Basic", desc: "Balanced plan for growing bots.", price: 99, cpu: "100%", ram: "1 GB", ssd: "2 GB", popular: false },
    { id: "silver", name: "Silver", desc: "Advanced bots and higher workloads.", price: 129, cpu: "150%", ram: "2 GB", ssd: "4 GB", popular: true },
    { id: "gold", name: "Gold", desc: "High-end production workloads.", price: 199, cpu: "200%", ram: "4 GB", ssd: "8 GB", popular: false },
    { id: "platinum", name: "Platinum", desc: "Enterprise scale bot hosting.", price: 279, cpu: "250%", ram: "6 GB", ssd: "12 GB", popular: false },
    { id: "diamond", name: "Diamond", desc: "Extreme performance for huge bots.", price: 349, cpu: "300%", ram: "8 GB", ssd: "16 GB", popular: false },
  ],
  vps: [
    { id: "std-1", name: "Standard Plan 1", desc: "1 Core / 1GB RAM / 15GB NVMe", price: 99, cpu: "1 Core", ram: "1GB RAM", ssd: "15GB NVMe", popular: false },
    { id: "std-2", name: "Standard Plan 2", desc: "2 Core / 1GB RAM / 20GB NVMe", price: 149, cpu: "2 Core", ram: "1GB RAM", ssd: "20GB NVMe", popular: false },
    { id: "std-3", name: "Standard Plan 3", desc: "1 Core / 2GB RAM / 30GB NVMe", price: 179, cpu: "1 Core", ram: "2GB RAM", ssd: "30GB NVMe", popular: false },
    { id: "std-4", name: "Standard Plan 4", desc: "2 Core / 4GB RAM / 60GB NVMe", price: 299, cpu: "2 Core", ram: "4GB RAM", ssd: "60GB NVMe", popular: true },
    { id: "std-5", name: "Standard Plan 5", desc: "2 Core / 8GB RAM / 100GB NVMe", price: 549, cpu: "2 Core", ram: "8GB RAM", ssd: "100GB NVMe", popular: false },
    { id: "std-6", name: "Standard Plan 6", desc: "4 Core / 16GB RAM / 160GB NVMe", price: 999, cpu: "4 Core", ram: "16GB RAM", ssd: "160GB NVMe", popular: false },
    { id: "std-7", name: "Standard Plan 7", desc: "8 Core / 32GB RAM / 250GB NVMe", price: 1799, cpu: "8 Core", ram: "32GB RAM", ssd: "250GB NVMe", popular: false },
    { id: "std-8", name: "Standard Plan 8", desc: "16 Core / 64GB RAM / 400GB NVMe", price: 3299, cpu: "16 Core", ram: "64GB RAM", ssd: "400GB NVMe", popular: false },
    { id: "pre-1", name: "Premium Plan 1", desc: "1 Core / 1GB RAM / 20GB NVMe", price: 149, cpu: "1 Core", ram: "1GB RAM", ssd: "20GB NVMe", popular: false },
    { id: "pre-2", name: "Premium Plan 2", desc: "2 Core / 1GB RAM / 25GB NVMe", price: 199, cpu: "2 Core", ram: "1GB RAM", ssd: "25GB NVMe", popular: false },
    { id: "pre-3", name: "Premium Plan 3", desc: "1 Core / 2GB RAM / 40GB NVMe", price: 249, cpu: "1 Core", ram: "2GB RAM", ssd: "40GB NVMe", popular: false },
    { id: "pre-4", name: "Premium Plan 4", desc: "2 Core / 4GB RAM / 80GB NVMe", price: 399, cpu: "2 Core", ram: "4GB RAM", ssd: "80GB NVMe", popular: false },
    { id: "pre-5", name: "Premium Plan 5", desc: "2 Core / 8GB RAM / 120GB NVMe", price: 749, cpu: "2 Core", ram: "8GB RAM", ssd: "120GB NVMe", popular: false },
    { id: "pre-6", name: "Premium Plan 6", desc: "4 Core / 16GB RAM / 200GB NVMe", price: 1399, cpu: "4 Core", ram: "16GB RAM", ssd: "200GB NVMe", popular: false },
    { id: "pre-7", name: "Premium Plan 7", desc: "8 Core / 32GB RAM / 300GB NVMe", price: 2499, cpu: "8 Core", ram: "32GB RAM", ssd: "300GB NVMe", popular: false },
    { id: "pre-8", name: "Premium Plan 8", desc: "16 Core / 64GB RAM / 500GB NVMe", price: 4499, cpu: "16 Core", ram: "64GB RAM", ssd: "500GB NVMe", popular: false },
    { id: "per-1", name: "Performance Plan 1", desc: "1 Core / 1GB RAM / 25GB NVMe", price: 199, cpu: "1 Core", ram: "1GB RAM", ssd: "25GB NVMe", popular: false },
    { id: "per-2", name: "Performance Plan 2", desc: "2 Core / 1GB RAM / 30GB NVMe", price: 279, cpu: "2 Core", ram: "1GB RAM", ssd: "30GB NVMe", popular: false },
    { id: "per-3", name: "Performance Plan 3", desc: "1 Core / 2GB RAM / 50GB NVMe", price: 349, cpu: "1 Core", ram: "2GB RAM", ssd: "50GB NVMe", popular: false },
    { id: "per-4", name: "Performance Plan 4", desc: "2 Core / 4GB RAM / 100GB NVMe", price: 549, cpu: "2 Core", ram: "4GB RAM", ssd: "100GB NVMe", popular: false },
    { id: "per-5", name: "Performance Plan 5", desc: "2 Core / 8GB RAM / 150GB NVMe", price: 999, cpu: "2 Core", ram: "8GB RAM", ssd: "150GB NVMe", popular: false },
    { id: "per-6", name: "Performance Plan 6", desc: "4 Core / 16GB RAM / 250GB NVMe", price: 1899, cpu: "4 Core", ram: "16GB RAM", ssd: "250GB NVMe", popular: false },
    { id: "per-7", name: "Performance Plan 7", desc: "8 Core / 32GB RAM / 400GB NVMe", price: 3499, cpu: "8 Core", ram: "32GB RAM", ssd: "400GB NVMe", popular: false },
    { id: "per-8", name: "Performance Plan 8", desc: "16 Core / 64GB RAM / 600GB NVMe", price: 6299, cpu: "16 Core", ram: "64GB RAM", ssd: "600GB NVMe", popular: false }
  ],
  lavalink: [
    { id: "self-starter", name: "Starter", desc: "Self-managed audio node.", price: 35, cpu: "50%", ram: "512 MB", ssd: "1 GB", popular: false },
    { id: "self-basic", name: "Basic", desc: "Reliable music hosting.", price: 99, cpu: "100%", ram: "1 GB", ssd: "2 GB", popular: true },
  ],
  db: [
    { id: "mongodb-basic", name: "MongoDB Basic", desc: "Scalable NoSQL database.", price: 40, cpu: "Shared", ram: "1 GB", ssd: "5 GB", popular: true },
    { id: "sql-basic", name: "SQL Basic", desc: "High-performance SQL hosting.", price: 40, cpu: "Shared", ram: "1 GB", ssd: "5 GB", popular: false },
  ]
}

export default function OrderPage() {
  const { formatPrice, currency, setCurrency } = useCurrency()
  const [selectedCategory, setSelectedCategory] = useState("vps")
  const [cart, setCart] = useState<any[]>([])
  const [coupon, setCoupon] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [vpsLocation, setVpsLocation] = useState("india-mumbai")
  const [vpsTier, setVpsTier] = useState("std")

  const addToCart = (plan: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === plan.id)
      if (existing) {
        return prev.map(item => item.id === plan.id ? { ...item, quantity: item.quantity + 1 } : item)
      }
      return [...prev, { ...plan, quantity: 1, category: selectedCategory }]
    })
  }

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id))
  }

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)

  let filteredPlans = plans[selectedCategory].filter((plan: any) => 
    plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plan.desc.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (selectedCategory === "vps") {
    filteredPlans = filteredPlans.filter((plan: any) => plan.id.startsWith(vpsTier))
  }

  const handleAddToCart = (plan: any) => {
    let finalPlan = { ...plan }
    if (selectedCategory === "vps") {
      const loc = locations.find(l => l.id === vpsLocation)
      finalPlan = {
        ...finalPlan,
        id: `${plan.id}-${vpsLocation}`,
        name: `${plan.name} (${loc?.flag} ${loc?.country} - ${loc?.name})`
      }
    }
    addToCart(finalPlan)
  }

  return (
    <div className="space-y-10 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <ShoppingCart className="w-5 h-5 text-blue-500" />
             </div>
             <h1 className="text-4xl font-bold orbitron-font">Store <span className="text-blue-500">Front</span></h1>
          </div>
          <p className="text-sm text-gray-500 max-w-lg">
            Deploy high-performance infrastructure in seconds. select a category below and build your custom stack.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white/5 border border-white/5 p-1.5 rounded-2xl">
           {["INR", "USD", "EUR", "GBP"].map((curr) => (
             <button
               key={curr}
               onClick={() => setCurrency(curr as any)}
               className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                 (currency as unknown as string) === curr ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "text-gray-500 hover:text-white"
               }`}
             >
               {curr}
             </button>
           ))}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-4 border-b border-white/5 pb-4">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all group relative overflow-hidden ${
              selectedCategory === cat.id 
                ? "bg-blue-600 text-white shadow-xl shadow-blue-500/10" 
                : "bg-white/5 border border-white/5 text-gray-400 hover:text-white hover:border-white/10"
            }`}
          >
            <cat.icon className={`w-4 h-4 ${selectedCategory === cat.id ? "text-white" : "text-gray-500 group-hover:text-blue-500"}`} />
            <span className="text-xs font-bold uppercase tracking-widest">{cat.name}</span>
            {selectedCategory === cat.id && (
              <motion.div layoutId="cat-glow" className="absolute inset-0 bg-white/10" />
            )}
          </button>
        ))}

        <div className="flex-1 min-w-[200px]">
           <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search plans..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-xs font-medium outline-none focus:border-blue-500/30 transition-all"
              />
           </div>
        </div>
      </div>

      {/* VPS Filters */}
      {selectedCategory === "vps" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
          <div className="bg-white/5 border border-white/5 p-5 rounded-2xl flex flex-col justify-center">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2"><Globe className="w-4 h-4 text-blue-500" /> Deployment Location</h4>
            <div className="relative">
              <select
                value={vpsLocation}
                onChange={(e) => setVpsLocation(e.target.value)}
                className="w-full appearance-none bg-black/40 border border-white/10 text-white py-3 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-semibold hover:border-white/20 cursor-pointer"
              >
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id} className="bg-[#0a0b0f] text-white">
                    {loc.flag} {loc.country} - {loc.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                <ChevronRight className="w-4 h-4 rotate-90" />
              </div>
            </div>
          </div>
          <div className="bg-white/5 border border-white/5 p-5 rounded-2xl flex flex-col justify-center">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2"><Cpu className="w-4 h-4 text-blue-500" /> Processor Architecture</h4>
            <div className="flex flex-wrap gap-2">
              {cpuTypes.map((cpu) => (
                <button
                  key={cpu.id}
                  onClick={() => setVpsTier(cpu.id)}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                    vpsTier === cpu.id
                      ? "bg-blue-600/20 border border-blue-500 text-blue-400 shadow-lg shadow-blue-500/10"
                      : "bg-black/20 border border-white/10 text-gray-500 hover:border-white/20"
                  }`}
                >
                  {cpu.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-10 items-start">
        {/* Plans Grid */}
        <div className="xl:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="wait">
            {filteredPlans.map((plan: any, idx: number) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.05 }}
                className={`relative bg-gradient-to-br from-white/[0.03] to-transparent border rounded-[32px] p-8 hover:border-blue-500/50 transition-all group flex flex-col h-full ${
                  plan.popular ? "border-blue-500/30 ring-1 ring-blue-500/20" : "border-white/5"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-8 bg-blue-600 text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg shadow-blue-500/20 z-10">
                    Most Popular
                  </div>
                )}

                <div className="mb-6 flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold orbitron-font mb-1">{plan.name}</h3>
                    <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">Monthly Subscription</p>
                  </div>
                  <div className={`p-3 rounded-2xl ${plan.popular ? "bg-blue-600 text-white" : "bg-white/5 text-gray-500"}`}>
                    <Zap className="w-5 h-5" />
                  </div>
                </div>

                <p className="text-sm text-gray-500 mb-8 leading-relaxed line-clamp-2">{plan.desc}</p>

                <div className="space-y-4 mb-8 flex-1">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-gray-500">vCPU Cores</span>
                    <span className="text-white font-bold">{plan.cpu}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-gray-500">RAM Memory</span>
                    <span className="text-white font-bold">{plan.ram}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-gray-500">NVMe Storage</span>
                    <span className="text-white font-bold">{plan.ssd}</span>
                  </div>
                  <div className="pt-2 flex items-center gap-2 text-[10px] text-emerald-500 font-bold uppercase tracking-widest">
                    <CheckCircle2 className="w-3 h-3" />
                    Unlimited Bandwidth
                  </div>
                </div>

                <div className="pt-8 border-t border-white/5 mt-auto">
                  <div className="flex items-end justify-between mb-6">
                    <div>
                      <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Starting at</p>
                      <div className="text-3xl font-bold orbitron-font">{formatPrice(plan.price)}</div>
                    </div>
                    <div className="text-[10px] text-gray-600 font-medium">/month</div>
                  </div>

                  <button 
                    onClick={() => handleAddToCart(plan)}
                    className={`w-full py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                      plan.popular 
                        ? "bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-500/20" 
                        : "bg-white/5 hover:bg-white/10 text-white border border-white/5"
                    }`}
                  >
                    Add to Cart
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Dynamic Sidebar Cart */}
        <div className="xl:col-span-1 space-y-6 sticky top-32">
          <div className="bg-[#0a0b0f] border border-white/10 rounded-[40px] p-8 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none">
              <ShoppingCart className="w-32 h-32" />
            </div>

            <h3 className="text-xl font-bold orbitron-font mb-8 flex items-center gap-3">
              Your <span className="text-blue-500">Cart</span>
            </h3>

            <div className="space-y-6 mb-10 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
              <AnimatePresence initial={false}>
                {cart.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="text-center py-10"
                  >
                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ShoppingCart className="w-5 h-5 text-gray-600" />
                    </div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Cart is empty</p>
                  </motion.div>
                ) : (
                  cart.map((item) => (
                    <motion.div 
                      key={item.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="text-xs font-bold text-white mb-0.5">{item.name}</p>
                          <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{item.category} • x{item.quantity}</p>
                        </div>
                        <div className="text-sm font-bold text-blue-500">{formatPrice(item.price * item.quantity)}</div>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-[9px] text-red-500 font-black uppercase hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            <div className="pt-8 border-t border-white/5 space-y-6">
              <div className="flex justify-between items-end">
                <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Total Bill</span>
                <span className="text-3xl font-bold orbitron-font text-white">{formatPrice(cartTotal)}</span>
              </div>

              <div className="relative">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Coupon Code" 
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  className="w-full bg-[#050507] border border-white/5 rounded-2xl py-3.5 pl-12 pr-24 text-[10px] font-black uppercase tracking-widest outline-none focus:border-blue-500/50 transition-all"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-500/10 text-blue-500 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">
                  Apply
                </button>
              </div>

              <Link 
                href="/dashboard/checkout"
                onClick={() => {
                  localStorage.setItem('vexa_cart_total', cartTotal.toString());
                  localStorage.setItem('vexa_cart_items', JSON.stringify(cart));
                }}
                className={`w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:bg-white/5 text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 ${cart.length === 0 ? 'pointer-events-none opacity-50' : ''}`}
              >
                Go to Checkout
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Mini Stats/Trust Badge */}
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-[32px] p-6 flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-2xl">
               <Shield className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-xs font-bold text-white mb-0.5">Secure Transaction</p>
              <p className="text-[10px] text-emerald-500/70 font-bold uppercase tracking-widest">256-bit SSL Encrypted</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
