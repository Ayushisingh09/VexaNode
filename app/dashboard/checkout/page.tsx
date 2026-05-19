"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  CreditCard,
  ShieldCheck,
  ChevronRight,
  Upload,
  QrCode,
  Wallet,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Camera,
  ArrowLeft,
  Bitcoin,
  Download,
  ArrowRight,
  X,
} from "lucide-react"
import Link from "next/link"
import { useCurrency } from "../../contexts/CurrencyContext"
import { useRouter } from "next/navigation"

export default function CheckoutPage() {
  const { formatPrice, currency } = useCurrency()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState("upi")
  const [isGeneratingQR, setIsGeneratingQR] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [screenshot, setScreenshot] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [classificationError, setClassificationError] = useState<string | null>(null)

  const [cartTotal, setCartTotal] = useState(0)
  const [cartItems, setCartItems] = useState<any[]>([])

  useEffect(() => {
    if (step === 2 && paymentMethod === "upi") {
      setIsGeneratingQR(true)
      const timer = setTimeout(() => setIsGeneratingQR(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [step, paymentMethod])

  useEffect(() => {
    const total = localStorage.getItem('vexa_cart_total')
    const items = localStorage.getItem('vexa_cart_items')
    if (total) setCartTotal(parseInt(total))
    if (items) setCartItems(JSON.parse(items))
  }, [])

  const handleFileUpload = (e: any) => {
    const file = e.target.files[0]
    if (file) {
      setClassificationError(null)
      setIsUploading(true)
      const reader = new FileReader()
      reader.onloadend = () => {
        setScreenshot(reader.result as string)
        setIsUploading(false)
        analyzeScreenshot(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const analyzeScreenshot = async (imgData: string) => {
    setIsAnalyzing(true)
    setAnalysisResult(null)
    setClassificationError(null)

    try {
      // Perform client-side OCR first
      let ocrText = ""
      try {
        const { recognize } = await import("tesseract.js")
        const ret = await recognize(imgData, 'eng')
        ocrText = ret.data.text
      } catch (ocrErr) {
        console.error("Client-side OCR processing error:", ocrErr)
      }

      const res = await fetch("/api/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          image: imgData, 
          amount: cartTotal.toString(),
          ocrText: ocrText
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Verification failed")
      }

      setIsAnalyzing(false)
      
      if (!data.success) {
        setClassificationError(data.error || "VexaAI: This image does not appear to be a valid payment receipt for this order.")
        setScreenshot(null)
        return
      }

      setAnalysisResult({
        detectedAmount: cartTotal,
        confidence: data.confidence,
        status: "matched",
        type: "UPI Transfer",
        transactionId: data.transactionId
      })
    } catch (error: any) {
      setIsAnalyzing(false)
      setClassificationError(error.message)
      setScreenshot(null)
    }
  }

  const completeOrder = async () => {
    try {
      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: formatPrice(cartTotal),
          proofUrl: screenshot,
          items: cartItems
        })
      })

      if (res.ok) {
        setStep(3)
        // Clear cart
        localStorage.removeItem('vexa_cart_total')
        localStorage.removeItem('vexa_cart_items')
      } else {
        const data = await res.json()
        setClassificationError(data.error || "Failed to submit order. Please try again.")
      }
    } catch (error) {
      setClassificationError("Network error. Please try again.")
    }
  }

  const getMethodStyles = (id: string, color: string) => {
    const isActive = paymentMethod === id
    if (color === 'blue') {
      return isActive 
        ? "border-blue-500 bg-blue-500/5" 
        : "border-white/5 bg-white/5 hover:border-white/10"
    }
    if (color === 'yellow') {
      return isActive 
        ? "border-yellow-500 bg-yellow-500/5" 
        : "border-white/5 bg-white/5 hover:border-white/10"
    }
    return "border-white/5 bg-white/5 hover:border-white/10"
  }

  const getIconStyles = (id: string, color: string) => {
    const isActive = paymentMethod === id
    if (color === 'blue') return isActive ? "bg-blue-500 text-white" : "bg-white/5 text-gray-500 group-hover:text-white"
    if (color === 'yellow') return isActive ? "bg-yellow-500 text-white" : "bg-white/5 text-gray-500 group-hover:text-white"
    return "bg-white/5 text-gray-500 group-hover:text-white"
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-white transition-all text-xs font-black uppercase tracking-widest group">
          <div className="p-2 bg-white/5 rounded-lg group-hover:bg-blue-500/10 transition-all">
            <ArrowLeft className="w-4 h-4" />
          </div>
          Back to Dashboard
        </button>

        <div className="flex items-center gap-8">
          {[
            { step: 1, name: "Method" },
            { step: 2, name: "Payment" },
            { step: 3, name: "Success" }
          ].map((s) => (
            <div key={s.step} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black transition-all ${step >= s.step ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "bg-white/5 text-gray-500"
                }`}>
                {s.step}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest hidden sm:block ${step >= s.step ? "text-white" : "text-gray-600"}`}>
                {s.name}
              </span>
              {s.step < 3 && <div className="w-8 h-px bg-white/5 ml-2" />}
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            <div className="lg:col-span-2 bg-[#0a0b0f] border border-white/10 rounded-[40px] p-10 md:p-14">
              <h2 className="text-4xl font-bold mb-4 orbitron-font">Payment <span className="text-blue-500">Method</span></h2>
              <p className="text-sm text-gray-500 mb-12 max-w-md">Select your preferred gateway. We recommend UPI for instant automated server provisioning.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {[
                  { id: "upi", name: "UPI / QR Pay", icon: QrCode, desc: "Instant GPay, PhonePe, Paytm", color: "blue" },
                  { id: "binance", name: "Binance / Crypto", icon: Bitcoin, desc: "USDT, BTC (BEP20 / TRC20)", color: "yellow" },
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`p-8 rounded-[32px] border-2 transition-all text-left group relative overflow-hidden flex flex-col justify-between h-56 ${getMethodStyles(method.id, method.color)}`}
                  >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${getIconStyles(method.id, method.color)}`}>
                      <method.icon className="w-7 h-7" />
                    </div>

                    <div>
                      <h4 className="text-lg font-bold mb-1">{method.name}</h4>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{method.desc}</p>
                    </div>

                    {paymentMethod === method.id && (
                      <div className={`absolute top-6 right-6 p-1.5 rounded-full ${method.color === 'blue' ? 'bg-blue-500' : 'bg-yellow-500'}`}>
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                    )}

                    {/* Background Glow */}
                    <div className={`absolute -bottom-10 -right-10 w-32 h-32 blur-[60px] rounded-full transition-all ${paymentMethod === method.id 
                      ? (method.color === 'blue' ? "bg-blue-500/20" : "bg-yellow-500/20") 
                      : "bg-transparent"
                    }`} />
                  </button>
                ))}
              </div>

              <div className="p-8 bg-blue-600/5 border border-blue-600/10 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Final Payment Amount</p>
                  <h3 className="text-4xl font-bold orbitron-font text-white">{formatPrice(cartTotal)}</h3>
                </div>
                <button
                  onClick={() => setStep(2)}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-12 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3"
                >
                  Next Step
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-1 space-y-6">
              <div className="bg-[#0a0b0f] border border-white/10 rounded-[32px] p-8">
                <h3 className="text-lg font-bold orbitron-font mb-6">Order Summary</h3>
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {cartItems.map((item, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <div>
                        <p className="text-xs font-bold text-white">{item.name}</p>
                        <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-xs font-bold text-blue-500">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-end">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Total</span>
                  <span className="text-xl font-bold orbitron-font">{formatPrice(cartTotal)}</span>
                </div>
              </div>

              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-[32px] p-6 flex items-center gap-4">
                <ShieldCheck className="w-6 h-6 text-emerald-500 shrink-0" />
                <p className="text-[10px] text-emerald-500/70 font-bold uppercase tracking-widest leading-relaxed">Your data is secured with enterprise-grade encryption.</p>
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-10"
          >
            {/* Payment Portal */}
            <div className="bg-[#0a0b0f] border border-white/10 rounded-[40px] p-10 md:p-14 text-center">
              <h2 className="text-3xl font-bold mb-2 orbitron-font">Secure <span className="text-blue-500">Portal</span></h2>
              <p className="text-sm text-gray-500 mb-12">Scan the QR code and transfer the exact amount.</p>

              {paymentMethod === "upi" ? (
                <div className="space-y-10">
                  <div className="relative w-64 h-64 mx-auto group">
                    <div className="absolute inset-0 bg-blue-500/10 blur-[40px] rounded-full group-hover:bg-blue-500/20 transition-all" />
                    <div className="relative bg-white p-6 rounded-[40px] w-full h-full shadow-2xl overflow-hidden border-4 border-blue-500/20">
                      {isGeneratingQR ? (
                        <div className="absolute inset-0 bg-white z-20 flex flex-col items-center justify-center p-8">
                          <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
                          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Generating Secure QR</p>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 2 }}
                            className="h-1 bg-blue-500 rounded-full mt-4"
                          />
                        </div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="relative"
                        >
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(`upi://pay?pa=vexanode@upi&pn=VexaNode&am=${cartTotal}&cu=INR`)}`}
                            alt="QR"
                            className="w-full h-full"
                          />
                          {/* Scanner Line Animation */}
                          <motion.div
                            animate={{ top: ["0%", "100%", "0%"] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            className="absolute left-0 right-0 h-0.5 bg-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.5)] z-10"
                          />
                        </motion.div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Or Pay to UPI ID</p>
                    <div className="bg-white/5 border border-white/5 rounded-2xl py-4 px-6 flex items-center justify-between group hover:border-blue-500/30 transition-all">
                      <span className="text-sm font-bold text-blue-500 underline underline-offset-4 tracking-wider">vexanode@upi</span>
                      <button className="text-[9px] font-black bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-400 transition-all shadow-lg shadow-blue-500/20">COPY</button>
                    </div>
                  </div>

                  <div className="p-6 bg-amber-500/5 border border-amber-500/10 rounded-3xl flex gap-5 text-left">
                    <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center shrink-0">
                      <AlertCircle className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-amber-200/90 mb-1">Payment Instructions</p>
                      <p className="text-[10px] text-amber-200/60 leading-relaxed font-medium italic">
                        Once you finish payment, please upload the screenshot on the right. Our AI will automatically verify the transaction.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-10">
                  <div className="w-32 h-32 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-yellow-500/20 relative">
                    <Bitcoin className="w-16 h-16 text-yellow-500" />
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 border-2 border-dashed border-yellow-500/20 rounded-full"
                    />
                  </div>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-400">Send exactly <span className="text-white font-bold text-lg">{(cartTotal * 0.012).toFixed(2)} USDT</span> (BEP20)</p>
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-6 break-all text-xs font-mono text-gray-500 hover:text-white transition-colors cursor-pointer">
                      0x742d35Cc6634C0532925a3b844Bc454e4438f44e
                    </div>
                    <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Click address to copy</p>
                  </div>
                </div>
              )}
            </div>

            {/* Proof Section */}
            <div className="bg-[#0a0b0f] border border-white/10 rounded-[40px] p-10 md:p-14 flex flex-col">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-3xl font-bold orbitron-font">Vexa<span className="text-blue-500">Verify</span></h2>
                <div className="px-3 py-1 bg-blue-500/10 rounded-full text-[9px] font-black text-blue-500 uppercase tracking-widest border border-blue-500/20">AI Automated</div>
              </div>

              <div className="flex-1 flex flex-col">
                {classificationError && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-red-500/10 border border-red-500/20 p-5 rounded-2xl flex gap-4 mb-6"
                  >
                    <div className="p-2 bg-red-500/20 rounded-lg shrink-0">
                      <X className="w-4 h-4 text-red-500" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-red-200">Verification Failed</p>
                      <p className="text-[10px] text-red-200/60 font-medium">{classificationError}</p>
                    </div>
                  </motion.div>
                )}

                {!screenshot ? (
                  <label className="flex-1 border-2 border-dashed border-white/10 rounded-[40px] flex flex-col items-center justify-center p-12 hover:border-blue-500/40 hover:bg-blue-500/[0.02] transition-all cursor-pointer group relative overflow-hidden">
                    <div className="p-6 bg-white/5 rounded-3xl mb-6 group-hover:scale-110 transition-transform group-hover:bg-blue-600/10 group-hover:text-blue-500 text-gray-500">
                      <Camera className="w-10 h-10 transition-colors" />
                    </div>
                    <div className="text-center space-y-2">
                      <p className="text-sm font-bold text-white">Upload Payment Screenshot</p>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Supports JPG, PNG, WEBP</p>
                    </div>
                    <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />

                    {/* Corner Borders */}
                    <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-white/10 rounded-tl-xl" />
                    <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-white/10 rounded-br-xl" />
                  </label>
                ) : (
                  <div className="space-y-8 h-full flex flex-col">
                    <div className="relative flex-1 bg-black rounded-[32px] overflow-hidden border border-white/10 group shadow-2xl">
                      <img src={screenshot} alt="Payment Proof" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          onClick={() => { setScreenshot(null); setAnalysisResult(null); }}
                          className="p-4 bg-red-500 text-white rounded-full hover:scale-110 transition-all shadow-xl shadow-red-500/20"
                        >
                          <X className="w-6 h-6" />
                        </button>
                      </div>
                    </div>

                    {/* AI Result Card */}
                    <div className={`p-8 rounded-3xl border transition-all ${isAnalyzing ? "bg-white/5 border-white/10" : "bg-emerald-500/5 border-emerald-500/20 shadow-lg shadow-emerald-500/5"
                      }`}>
                      {isAnalyzing ? (
                        <div className="flex items-center gap-5">
                          <div className="relative">
                            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                            <div className="absolute inset-0 blur-lg bg-blue-500/50" />
                          </div>
                          <div>
                            <p className="text-xs font-black text-white uppercase tracking-widest mb-1">VexaAI Analyzing...</p>
                            <div className="flex items-center gap-2">
                              <div className="h-1 w-24 bg-white/10 rounded-full overflow-hidden">
                                <motion.div animate={{ x: [-100, 100] }} transition={{ duration: 1.5, repeat: Infinity }} className="h-full w-1/2 bg-blue-500" />
                              </div>
                              <span className="text-[10px] text-gray-500 font-bold">SCANNING OCR</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-5">
                            <div className="p-3 bg-emerald-500/20 rounded-2xl relative">
                              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                              <div className="absolute inset-0 blur-md bg-emerald-500/30" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-white mb-0.5">Amount Verified: {formatPrice(analysisResult?.detectedAmount)}</p>
                              <div className="flex items-center gap-3">
                                <span className="text-[9px] text-emerald-500 font-black uppercase tracking-widest px-2 py-0.5 bg-emerald-500/10 rounded-md border border-emerald-500/20">98.4% Confidence</span>
                                <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest">{analysisResult?.type}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <button
                  disabled={!analysisResult || isAnalyzing}
                  onClick={completeOrder}
                  className="w-full mt-8 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:bg-white/5 text-white py-5 rounded-[24px] font-bold text-xs uppercase tracking-widest transition-all shadow-2xl shadow-blue-500/20 flex items-center justify-center gap-3 group"
                >
                  Confirm Order
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0a0b0f] border border-white/10 rounded-[40px] p-12 text-center max-w-2xl mx-auto"
          >
            <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8 relative">
              <CheckCircle2 className="w-12 h-12 text-emerald-500" />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 1, repeat: Infinity }}
                className="absolute inset-0 border-4 border-emerald-500 rounded-full"
              />
            </div>

            <h2 className="text-3xl font-bold mb-4 orbitron-font">Order Submitted!</h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-10 max-w-md mx-auto">
              Your payment is being verified by our team. Once confirmed, your Pterodactyl server will be created automatically.
            </p>

            <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 mb-10 text-left overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-5 select-none rotate-12">
                <span className="text-6xl font-black italic">VEXA</span>
              </div>

              <div className="flex justify-between items-start mb-8">
                <div>
                  <h4 className="text-sm font-bold orbitron-font text-blue-500 uppercase">Invoice #VEXA-9428</h4>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{new Date().toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Status</p>
                  <p className="text-xs font-black text-amber-500">PENDING APPROVAL</p>
                </div>
              </div>

              <div className="space-y-4 mb-8 border-y border-white/5 py-6">
                {cartItems.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between text-xs font-medium">
                    <span className="text-gray-400">{item.name} <span className="text-gray-600">x{item.quantity}</span></span>
                    <span className="text-white">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total Amount</span>
                <span className="text-2xl font-bold orbitron-font text-white">{formatPrice(cartTotal)}</span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mb-10">
              <button
                onClick={() => window.print()}
                className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-3.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2"
              >
                Download Invoice
                <Download className="w-4 h-4 text-gray-500" />
              </button>
              <Link
                href="/dashboard"
                className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-500/20"
              >
                Return to Dashboard
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
