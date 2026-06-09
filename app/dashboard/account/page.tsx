"use client"

import { useSession, signOut, signIn } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect, useRef } from "react"
import {
  User,
  Mail,
  Fingerprint,
  ShieldCheck,
  Settings,
  Bell,
  Trash2,
  Copy,
  Check,
  Loader2,
  Camera,
  Globe,
  Coins,
  CheckCircle2,
  AlertTriangle,
  Key,
  Eye,
  EyeOff,
  Calendar,
  CreditCard,
  Link2,
  DollarSign,
  LogOut
} from "lucide-react"
import Image from "next/image"
import { useCurrency } from "../../contexts/CurrencyContext"
import { useLanguage } from "../../contexts/LanguageContext"

type TabType = "profile" | "security" | "linked" | "preferences" | "notifications" | "danger"

export default function AccountPage() {
  const { data: session, status: sessionStatus } = useSession()
  const { currency, setCurrency, formatPrice } = useCurrency()
  const { language, setLanguage } = useLanguage()

  // State management
  const [activeTab, setActiveTab] = useState<TabType>("profile")
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState<any>(null)

  // Profile Form States
  const [displayName, setDisplayName] = useState("")
  const [isEditingName, setIsEditingName] = useState(false)
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState(false)

  // Clipboard copied status
  const [copiedId, setCopiedId] = useState(false)

  // Password Change Form States
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState(false)

  // Avatar upload and crop modal states
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [zoom, setZoom] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)

  // Danger Zone States
  const [deleteConfirmation, setDeleteConfirmation] = useState("")
  const [isDeletingAccount, setIsDeletingAccount] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  // 2FA Setup Mock States
  const [show2FAModal, setShow2FAModal] = useState(false)
  const [is2FAEnabled, setIs2FAEnabled] = useState(false)
  const [twoFACode, setTwoFACode] = useState("")
  const [twoFAError, setTwoFAError] = useState<string | null>(null)

  // Mock Notification settings state
  const [notifEmailAlerts, setNotifEmailAlerts] = useState(true)
  const [notifSecurityAlerts, setNotifSecurityAlerts] = useState(true)
  const [notifOrderUpdates, setNotifOrderUpdates] = useState(true)
  const [notifSaving, setNotifSaving] = useState(false)
  const [notifSuccess, setNotifSuccess] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const previewContainerRef = useRef<HTMLDivElement>(null)

  const fetchUserData = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/user/data")
      if (res.ok) {
        const data = await res.json()
        setUserData(data)
        setDisplayName(data.user?.name || "")
      }
    } catch (err) {
      console.error("Failed to fetch account user details", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      fetchUserData()
    }
  }, [sessionStatus])

  // Copy to clipboard helper
  const handleCopyId = () => {
    if (userData?.user?.id) {
      navigator.clipboard.writeText(userData.user.id)
      setCopiedId(true)
      setTimeout(() => setCopiedId(false), 2000)
    }
  }

  // Edit Profile Name
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileSaving(true)
    setProfileSuccess(false)
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: displayName })
      })
      if (res.ok) {
        setProfileSuccess(true)
        setIsEditingName(false)
        fetchUserData()
      } else {
        const data = await res.json()
        alert(data.error || "Failed to update profile")
      }
    } catch (err) {
      alert("Network error updating profile.")
    } finally {
      setProfileSaving(false)
    }
  }

  // Password Strength calculations
  const calculatePasswordStrength = (pwd: string) => {
    if (!pwd) return 0
    let points = 0
    if (pwd.length >= 6) points += 1
    if (/[A-Z]/.test(pwd)) points += 1
    if (/[0-9]/.test(pwd)) points += 1
    if (/[^a-zA-Z0-9]/.test(pwd)) points += 1
    return points
  }
  const passwordStrength = calculatePasswordStrength(newPassword)
  const passwordStrengthLabel = ["Weak", "Weak", "Fair", "Good", "Strong"][passwordStrength]
  const passwordStrengthColor = [
    "bg-red-500",
    "bg-red-500",
    "bg-amber-500",
    "bg-yellow-500",
    "bg-emerald-500"
  ][passwordStrength]

  // Submit Password Change
  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError(null)
    setPasswordSuccess(false)

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.")
      return
    }

    setPasswordSaving(true)
    try {
      const res = await fetch("/api/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword })
      })

      const data = await res.json()
      if (res.ok) {
        setPasswordSuccess(true)
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
        fetchUserData()
      } else {
        setPasswordError(data.error || "Failed to update password")
      }
    } catch (err) {
      setPasswordError("Network error. Please try again.")
    } finally {
      setPasswordSaving(false)
    }
  }

  // Unlink Google / Discord connections
  const handleUnlink = async (provider: "google" | "discord") => {
    if (confirm(`Are you sure you want to disconnect your ${provider} account?`)) {
      try {
        const res = await fetch(`/api/user/unlink?provider=${provider}`, {
          method: "DELETE"
        })
        const data = await res.json()
        if (res.ok) {
          alert(`${provider} connection unlinked successfully.`)
          fetchUserData()
        } else {
          alert(data.error || "Failed to disconnect account.")
        }
      } catch (err) {
        alert("Failed to connect to the server.")
      }
    }
  }

  // Delete Account Permanently
  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== "DELETE") {
      alert("Please type 'DELETE' to confirm account erasure.")
      return
    }

    setIsDeletingAccount(true)
    try {
      const res = await fetch("/api/user/delete-account", {
        method: "DELETE"
      })
      if (res.ok) {
        alert("Your VexaNode account has been deleted permanently.")
        signOut({ callbackUrl: "/login" })
      } else {
        const data = await res.json()
        alert(data.error || "Failed to delete account.")
        setIsDeletingAccount(false)
      }
    } catch (err) {
      alert("Network error deleting account.")
      setIsDeletingAccount(false)
    }
  }

  // Mock Save Notifications
  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault()
    setNotifSaving(true)
    setNotifSuccess(false)
    setTimeout(() => {
      setNotifSaving(false)
      setNotifSuccess(true)
      setTimeout(() => setNotifSuccess(false), 3000)
    }, 1000)
  }

  // 2FA Verification mock submit
  const handleEnable2FA = (e: React.FormEvent) => {
    e.preventDefault()
    setTwoFAError(null)
    if (twoFACode.trim().length !== 6 || !/^\d+$/.test(twoFACode)) {
      setTwoFAError("Please enter a valid 6-digit authentication code.")
      return
    }
    setIs2FAEnabled(true)
    setShow2FAModal(false)
    setTwoFACode("")
  }

  // File Uploading & Canvas Crop controls
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedFile(reader.result as string)
        setZoom(1)
        setOffset({ x: 0, y: 0 })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleSaveCrop = () => {
    if (!selectedFile) return
    setIsUploadingAvatar(true)

    const img = new window.Image()
    img.src = selectedFile
    img.onload = async () => {
      try {
        const canvas = document.createElement("canvas")
        canvas.width = 256
        canvas.height = 256
        const ctx = canvas.getContext("2d")

        if (ctx) {
          ctx.clearRect(0, 0, 256, 256)

          // Apply circular clip
          ctx.save()
          ctx.beginPath()
          ctx.arc(128, 128, 128, 0, Math.PI * 2)
          ctx.clip()

          const size = Math.min(img.width, img.height)
          const scale = zoom
          const dx = offset.x
          const dy = offset.y

          // Calculate source rectangle to crop a square from center
          const srcSize = size / scale
          const srcX = (img.width - srcSize) / 2 - (dx * (srcSize / 256))
          const srcY = (img.height - srcSize) / 2 - (dy * (srcSize / 256))

          ctx.drawImage(img, srcX, srcY, srcSize, srcSize, 0, 0, 256, 256)
          ctx.restore()

          const base64Image = canvas.toDataURL("image/png")

          const res = await fetch("/api/user/avatar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: base64Image })
          })

          if (res.ok) {
            setSelectedFile(null)
            fetchUserData()
          } else {
            const data = await res.json()
            alert(data.error || "Failed to upload avatar")
          }
        }
      } catch (err) {
        alert("Error cropping image.")
      } finally {
        setIsUploadingAvatar(false)
      }
    }
  }

  const menuItems = [
    { id: "profile", name: "My Profile", icon: User },
    { id: "security", name: "Security & Login", icon: ShieldCheck },
    { id: "linked", name: "Connections", icon: Link2 },
    { id: "preferences", name: "Preferences", icon: Globe },
    { id: "notifications", name: "Alert Settings", icon: Bell },
    { id: "danger", name: "Danger Zone", icon: Trash2 },
  ]

  // Skeleton Placeholder
  if (loading || sessionStatus === "loading") {
    return (
      <div className="max-w-5xl mx-auto space-y-8 animate-pulse">
        <div className="h-10 bg-white/5 rounded-2xl w-48 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="space-y-3 lg:col-span-1">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-12 bg-white/5 border border-white/5 rounded-2xl w-full" />
            ))}
          </div>
          <div className="lg:col-span-3 bg-white/5 border border-white/10 rounded-[32px] p-8 space-y-6">
            <div className="h-8 bg-white/5 rounded-xl w-64 mb-10" />
            <div className="space-y-4">
              <div className="h-24 bg-white/5 rounded-2xl w-full" />
              <div className="h-14 bg-white/5 rounded-2xl w-full" />
              <div className="h-14 bg-white/5 rounded-2xl w-full" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-gradient-to-r from-blue-950/20 via-transparent to-transparent border border-white/10 rounded-[32px] p-8">
        <div>
          <h1 className="text-3xl font-bold orbitron-font">Account <span className="text-blue-500">Settings</span></h1>
          <p className="text-xs text-gray-500 mt-1">Configure profile details, linked social networks, currency, and security keys.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3.5 py-1 bg-blue-500/10 border border-blue-500/25 text-blue-500 text-[10px] font-black uppercase tracking-wider rounded-full">
            Client Tier #01
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Selector Navigation */}
        <aside className="lg:col-span-1 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as TabType)}
              className={`w-full px-5 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-4 border text-left ${activeTab === item.id
                  ? item.id === "danger"
                    ? "bg-red-500/10 border-red-500/30 text-red-500 shadow-lg shadow-red-500/5"
                    : "bg-blue-600 text-white shadow-lg shadow-blue-600/25 border-blue-500/30"
                  : "bg-white/5 border-white/5 text-gray-500 hover:text-white hover:bg-white/10"
                }`}
            >
              <item.icon className={`w-4 h-4 ${activeTab === item.id ? "" : "text-gray-500 group-hover:text-white"}`} />
              {item.name}
            </button>
          ))}
        </aside>

        {/* Tab Panel Content Box */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.15 }}
              className="bg-[#0a0b0f] border border-white/10 rounded-[32px] p-8 md:p-10"
            >
              {/* TAB 1: PROFILE TAB */}
              {activeTab === "profile" && (
                <div className="space-y-8">
                  <div className="border-b border-white/5 pb-6">
                    <h3 className="text-xl font-bold orbitron-font">Profile <span className="text-blue-500">Overview</span></h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Manage public profile attributes and avatars</p>
                  </div>

                  <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                    {/* Interactive Avatar Container */}
                    <div className="relative group">
                      <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white/10 group-hover:border-blue-500/40 transition-all cursor-pointer shadow-xl">
                        <Image
                          src={userData?.user?.image || "https://cdn.discordapp.com/embed/avatars/0.png"}
                          alt="Avatar"
                          fill
                          sizes="128px"
                          unoptimized
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[9px] font-black uppercase tracking-widest gap-1"
                        >
                          <Camera className="w-5 h-5 text-blue-500 animate-pulse" />
                          Change
                        </div>
                      </div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>

                    {/* Metadata summary cards */}
                    <div className="flex-1 w-full grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="bg-[#050507] border border-white/5 rounded-2xl p-4">
                        <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest block mb-1">Joined Date</span>
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-blue-500" />
                          {new Date(userData?.stats?.joinDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="bg-[#050507] border border-white/5 rounded-2xl p-4">
                        <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest block mb-1">Total Spent</span>
                        <span className="text-xs font-bold text-blue-500 flex items-center gap-1.5 orbitron-font">
                          <DollarSign className="w-3.5 h-3.5 text-blue-500" />
                          {formatPrice(userData?.stats?.totalSpent || 0)}
                        </span>
                      </div>
                      <div className="bg-[#050507] border border-white/5 rounded-2xl p-4 col-span-2 md:col-span-1">
                        <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest block mb-1">Total Orders</span>
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <CreditCard className="w-3.5 h-3.5 text-blue-500" />
                          {userData?.stats?.orderCount || 0} Invoice(s)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Form fields */}
                  <form onSubmit={handleSaveProfile} className="space-y-6 pt-4">
                    {/* Display Name Input */}
                    <div className="space-y-2">
                      <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2">
                        <User className="w-3 h-3 text-blue-500" />
                        Display Name / Nickname
                      </label>
                      <div className="flex gap-3">
                        <input
                          type="text"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          disabled={!isEditingName}
                          className="flex-1 bg-[#050507] border border-white/5 focus:border-blue-500/30 rounded-2xl px-6 py-4 text-xs font-medium outline-none transition-all disabled:opacity-50"
                        />
                        {isEditingName ? (
                          <div className="flex gap-2">
                            <button
                              type="submit"
                              disabled={profileSaving}
                              className="px-6 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                            >
                              {profileSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-4 h-4" />}
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setDisplayName(userData?.user?.name || "")
                                setIsEditingName(false)
                              }}
                              className="px-4 bg-white/5 border border-white/5 hover:bg-white/10 text-white rounded-2xl text-xs font-bold transition-all"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setIsEditingName(true)}
                            className="px-6 bg-white/5 border border-white/5 hover:bg-white/10 text-white rounded-2xl text-xs font-bold transition-all"
                          >
                            Edit Name
                          </button>
                        )}
                      </div>
                      <AnimatePresence>
                        {profileSuccess && (
                          <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="text-[10px] text-emerald-500 font-bold flex items-center gap-1.5"
                          >
                            <Check className="w-3.5 h-3.5" /> Display name saved successfully!
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Email Input (Read only) */}
                    <div className="space-y-2">
                      <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2">
                        <Mail className="w-3 h-3 text-blue-500" />
                        Account Email Address
                      </label>
                      <input
                        type="email"
                        value={userData?.user?.email || ""}
                        readOnly
                        className="w-full bg-[#050507] border border-white/5 opacity-50 rounded-2xl px-6 py-4 text-xs font-medium cursor-not-allowed outline-none"
                      />
                    </div>

                    {/* User Database UUID */}
                    <div className="space-y-2">
                      <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2">
                        <Fingerprint className="w-3 h-3 text-blue-500" />
                        VexaNode UUID / User ID
                      </label>
                      <div className="bg-[#050507] border border-white/5 rounded-2xl px-6 py-4 flex items-center justify-between">
                        <span className="text-xs font-mono text-gray-500 tracking-wider select-all">{userData?.user?.id}</span>
                        <button
                          type="button"
                          onClick={handleCopyId}
                          className="p-2 bg-white/5 hover:bg-blue-600 hover:text-white rounded-lg text-gray-400 transition-all flex items-center gap-1 text-[10px] font-bold"
                        >
                          {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                          {copiedId ? "COPIED" : "COPY"}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 2: SECURITY & LOGIN */}
              {activeTab === "security" && (
                <div className="space-y-8">
                  <div className="border-b border-white/5 pb-6">
                    <h3 className="text-xl font-bold orbitron-font">Security & <span className="text-blue-500">Access Keys</span></h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Manage passwords and two-factor code authentications</p>
                  </div>

                  {/* Password Change Form */}
                  <div className="p-6 bg-white/[0.01] border border-white/5 rounded-[24px] space-y-6">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Key className="w-4 h-4 text-blue-500" />
                      {userData?.user?.hasPassword ? "Change Password" : "Create Account Password"}
                    </h4>

                    {!userData?.user?.hasPassword && (
                      <p className="text-[10px] text-gray-400 font-medium leading-relaxed italic bg-blue-500/5 border border-blue-500/10 rounded-xl p-3.5">
                        Your account was registered using a social provider (Discord or Google). You can set an account password here to allow logging in directly using your email address and password.
                      </p>
                    )}

                    <form onSubmit={handleSavePassword} className="space-y-4">
                      {userData?.user?.hasPassword && (
                        <div className="space-y-2">
                          <label className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Current Password</label>
                          <div className="relative">
                            <input
                              type={showCurrentPassword ? "text" : "password"}
                              value={currentPassword}
                              onChange={(e) => setCurrentPassword(e.target.value)}
                              placeholder="••••••••••••"
                              required
                              className="w-full bg-[#050507] border border-white/5 focus:border-blue-500/30 rounded-2xl py-3.5 pl-6 pr-12 text-xs font-medium outline-none transition-all font-mono"
                            />
                            <button
                              type="button"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                            >
                              {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">New Password</label>
                          <div className="relative">
                            <input
                              type={showNewPassword ? "text" : "password"}
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              placeholder="••••••••••••"
                              required
                              className="w-full bg-[#050507] border border-white/5 focus:border-blue-500/30 rounded-2xl py-3.5 pl-6 pr-12 text-xs font-medium outline-none transition-all font-mono"
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                            >
                              {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Confirm New Password</label>
                          <div className="relative">
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              placeholder="••••••••••••"
                              required
                              className="w-full bg-[#050507] border border-white/5 focus:border-blue-500/30 rounded-2xl py-3.5 pl-6 pr-12 text-xs font-medium outline-none transition-all font-mono"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                            >
                              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Password strength indicator */}
                      {newPassword.length > 0 && (
                        <div className="space-y-2 pt-2">
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="text-gray-500 font-bold uppercase tracking-widest">Password Strength</span>
                            <span className="font-bold text-white uppercase tracking-wider">{passwordStrengthLabel}</span>
                          </div>
                          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden flex gap-0.5">
                            {[1, 2, 3, 4].map((barIndex) => (
                              <div
                                key={barIndex}
                                className={`h-full flex-1 transition-all duration-300 ${passwordStrength >= barIndex ? passwordStrengthColor : "bg-white/5"
                                  }`}
                              />
                            ))}
                          </div>
                          <ul className="text-[9px] text-gray-500 font-medium grid grid-cols-2 gap-x-4 gap-y-1 pt-1.5 list-inside list-disc">
                            <li className={newPassword.length >= 6 ? "text-emerald-500" : ""}>At least 6 characters</li>
                            <li className={/[A-Z]/.test(newPassword) ? "text-emerald-500" : ""}>One uppercase letter</li>
                            <li className={/[0-9]/.test(newPassword) ? "text-emerald-500" : ""}>One number digit</li>
                            <li className={/[^a-zA-Z0-9]/.test(newPassword) ? "text-emerald-500" : ""}>One special character</li>
                          </ul>
                        </div>
                      )}

                      {/* Error & Success Messages */}
                      <AnimatePresence>
                        {passwordError && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-xs text-red-400 font-bold flex items-center gap-2"
                          >
                            <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                            {passwordError}
                          </motion.div>
                        )}
                        {passwordSuccess && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl text-xs text-emerald-500 font-bold flex items-center gap-2"
                          >
                            <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                            Password successfully updated!
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="pt-2 flex justify-end">
                        <button
                          type="submit"
                          disabled={passwordSaving}
                          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-8 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2"
                        >
                          {passwordSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                          Update Password
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Multi-Factor Authentication */}
                  <div className="p-6 bg-white/[0.01] border border-white/5 rounded-[24px] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-blue-500" />
                        Two-Factor Authentication (2FA)
                      </h4>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1.5 leading-relaxed max-w-md">
                        Secure your hosting console by requiring an TOTP token code duringDirect login sequences.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => is2FAEnabled ? setIs2FAEnabled(false) : setShow2FAModal(true)}
                      className={`px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${is2FAEnabled
                          ? "bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white"
                          : "bg-blue-600 border-transparent text-white hover:bg-blue-500 shadow-lg shadow-blue-600/20"
                        }`}
                    >
                      {is2FAEnabled ? "Disable 2FA" : "Enable 2FA"}
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: LINKED SOCIAL CONNECTIONS */}
              {activeTab === "linked" && (
                <div className="space-y-8">
                  <div className="border-b border-white/5 pb-6">
                    <h3 className="text-xl font-bold orbitron-font">Linked <span className="text-blue-500">Accounts</span></h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Manage connections with external social login systems</p>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    {/* Providers details */}
                    {[
                      {
                        id: "discord",
                        name: "Discord Connection",
                        icon: Globe,
                        desc: "Allow sign in and support tickets integration using Discord account specs.",
                        color: "from-indigo-600/25 to-purple-600/25",
                        borderColor: "border-indigo-500/20"
                      },
                      {
                        id: "google",
                        name: "Google Integration",
                        icon: Mail,
                        desc: "Connect Google API keys to access email credentials login options dynamically.",
                        color: "from-red-600/25 to-orange-600/25",
                        borderColor: "border-red-500/20"
                      }
                    ].map((prov) => {
                      const isLinked = userData?.linkedAccounts?.includes(prov.id)
                      return (
                        <div
                          key={prov.id}
                          className={`p-6 bg-gradient-to-br ${prov.color} border ${prov.borderColor} rounded-[24px] flex flex-col md:flex-row justify-between items-start md:items-center gap-6`}
                        >
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <h4 className="text-sm font-bold text-white">{prov.name}</h4>
                              <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${isLinked
                                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                                  : "bg-white/5 border-white/5 text-gray-500"
                                }`}>
                                {isLinked ? "Connected" : "Not Linked"}
                              </span>
                            </div>
                            <p className="text-[10px] text-gray-300/60 font-medium leading-relaxed max-w-md">{prov.desc}</p>
                          </div>

                          <button
                            type="button"
                            onClick={() => isLinked ? handleUnlink(prov.id as any) : signIn(prov.id)}
                            className={`w-full md:w-auto px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${isLinked
                                ? "bg-black/40 hover:bg-red-500 hover:text-white border-white/10 text-gray-400"
                                : "bg-white hover:bg-gray-100 text-black border-transparent shadow-lg shadow-white/5"
                              }`}
                          >
                            {isLinked ? "Disconnect" : "Link Account"}
                          </button>
                        </div>
                      )
                    })}
                  </div>

                  {/* Verification status dynamic badges card */}
                  <div className="p-6 bg-white/[0.01] border border-white/5 rounded-[24px] space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-widest text-gray-500">Security Verification Badges</h4>
                    <div className="flex flex-wrap gap-2.5">
                      <div className="px-4 py-2 bg-emerald-500/5 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        Email Verified
                      </div>

                      {userData?.linkedAccounts?.includes("discord") && (
                        <div className="px-4 py-2 bg-purple-500/5 border border-purple-500/20 text-purple-400 text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-purple-400" />
                          Discord Active
                        </div>
                      )}

                      {userData?.linkedAccounts?.includes("google") && (
                        <div className="px-4 py-2 bg-red-500/5 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-red-400" />
                          Google Active
                        </div>
                      )}

                      {userData?.user?.hasPassword && (
                        <div className="px-4 py-2 bg-blue-500/5 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-blue-400" />
                          Credentials Active
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: PREFERENCES */}
              {activeTab === "preferences" && (
                <div className="space-y-8">
                  <div className="border-b border-white/5 pb-6">
                    <h3 className="text-xl font-bold orbitron-font">Regional & <span className="text-blue-500">Billing Toggles</span></h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Manage display currency and regional interface translations</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Currency Selector Card */}
                    <div className="p-6 bg-white/[0.01] border border-white/5 rounded-[24px] space-y-4">
                      <label className="text-xs font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                        <Coins className="w-4 h-4 text-blue-500" />
                        Billing Currency
                      </label>
                      <p className="text-[10px] text-gray-500 font-medium leading-relaxed">Adjust layout currency. Product items, totals, and invoices will convert immediately.</p>
                      <select
                        value={currency.code}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="w-full bg-[#050507] border border-white/5 rounded-2xl px-4 py-3.5 text-xs outline-none focus:border-blue-500/30 transition-all text-white"
                      >
                        <option value="INR">INR (₹) - Indian Rupee (Base)</option>
                        <option value="USD">USD ($) - US Dollar</option>
                        <option value="EUR">EUR (€) - Euro</option>
                        <option value="GBP">GBP (£) - British Pound</option>
                      </select>
                    </div>

                    {/* Language Selector Card */}
                    <div className="p-6 bg-white/[0.01] border border-white/5 rounded-[24px] space-y-4">
                      <label className="text-xs font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                        <Globe className="w-4 h-4 text-blue-500" />
                        Interface Language
                      </label>
                      <p className="text-[10px] text-gray-500 font-medium leading-relaxed">Select system language. Translate interface buttons, menus, and hosting notifications.</p>
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value as any)}
                        className="w-full bg-[#050507] border border-white/5 rounded-2xl px-4 py-3.5 text-xs outline-none focus:border-blue-500/30 transition-all text-white"
                      >
                        <option value="en">English (US)</option>
                        <option value="hi">Hindi (हिन्दी)</option>
                        <option value="es">Spanish (Español)</option>
                        <option value="fr">French (Français)</option>
                        <option value="de">German (Deutsch)</option>
                        <option value="pt">Portuguese (Português)</option>
                        <option value="ru">Russian (Русский)</option>
                        <option value="zh">Chinese (中文)</option>
                        <option value="ja">Japanese (日本語)</option>
                        <option value="tr">Turkish (Türkçe)</option>
                        <option value="ar">Arabic (العربية)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: NOTIFICATIONS */}
              {activeTab === "notifications" && (
                <div className="space-y-8">
                  <div className="border-b border-white/5 pb-6">
                    <h3 className="text-xl font-bold orbitron-font">Notification <span className="text-blue-500">Alerts</span></h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Configure email alerts and account event reminders</p>
                  </div>

                  <form onSubmit={handleSaveNotifications} className="space-y-6">
                    <div className="space-y-4">
                      {/* Alert Toggles */}
                      {[
                        {
                          id: "email",
                          title: "Email Notifications",
                          desc: "Receive invoices, statements, and payment confirmations via email.",
                          state: notifEmailAlerts,
                          setter: setNotifEmailAlerts
                        },
                        {
                          id: "security",
                          title: "Security & Logins Alerts",
                          desc: "Get notified when new login connections or key changes are detected.",
                          state: notifSecurityAlerts,
                          setter: setNotifSecurityAlerts
                        },
                        {
                          id: "orders",
                          title: "Product Cycle Tenders",
                          desc: "Receive automatic suspension warnings and payment proofs processing notifications.",
                          state: notifOrderUpdates,
                          setter: setNotifOrderUpdates
                        }
                      ].map((toggle) => (
                        <div
                          key={toggle.id}
                          className="p-5 bg-white/[0.01] border border-white/5 rounded-2xl flex items-center justify-between hover:border-blue-500/10 transition-colors"
                        >
                          <div>
                            <span className="text-xs font-bold text-white block mb-1">{toggle.title}</span>
                            <p className="text-[10px] text-gray-500 leading-relaxed font-medium">{toggle.desc}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => toggle.setter(!toggle.state)}
                            className={`w-12 h-6 rounded-full p-1 transition-all relative ${toggle.state ? "bg-blue-600" : "bg-white/10"
                              }`}
                          >
                            <motion.div
                              layout
                              className="w-4 h-4 bg-white rounded-full absolute top-1 left-1"
                              animate={{ x: toggle.state ? 24 : 0 }}
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-end items-center gap-4 pt-4 border-t border-white/5">
                      <AnimatePresence>
                        {notifSuccess && (
                          <motion.p
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0 }}
                            className="text-xs text-emerald-500 font-bold flex items-center gap-1"
                          >
                            <Check className="w-4 h-4" /> Preferences saved!
                          </motion.p>
                        )}
                      </AnimatePresence>
                      <button
                        type="submit"
                        disabled={notifSaving}
                        className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-8 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2"
                      >
                        {notifSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        Save Preferences
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 6: DANGER ZONE */}
              {activeTab === "danger" && (
                <div className="space-y-8">
                  <div className="border-b border-red-500/10 pb-6">
                    <h3 className="text-xl font-bold orbitron-font text-red-500">Danger <span className="text-white">Zone</span></h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Irreversible account cancellation and deletion operations</p>
                  </div>

                  <div className="p-6 bg-red-500/[0.02] border border-red-500/20 rounded-[24px] space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-red-500/10 rounded-2xl shrink-0">
                        <AlertTriangle className="w-6 h-6 text-red-500" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white mb-1">Delete VexaNode Account</h4>
                        <p className="text-[10px] text-gray-400 font-medium leading-relaxed">
                          This operation will immediately terminate all active host subscriptions, delete your ticketing queue, erase billing files, and permanently clean your authentication profile. This is **non-reversible**.
                        </p>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => setShowDeleteModal(true)}
                        className="w-full md:w-auto bg-red-600 hover:bg-red-500 text-white px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-red-500/20"
                      >
                        Delete Account Permanently
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* 1. CUSTOM AVATAR UPLOAD AND CROP MODAL */}
      <AnimatePresence>
        {selectedFile && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#07080c] border border-white/10 w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl p-6 md:p-8 space-y-6"
            >
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <h4 className="text-sm font-black uppercase tracking-widest text-gray-300">Crop Avatar Image</h4>
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="text-gray-500 hover:text-white p-1"
                >
                  Close
                </button>
              </div>

              {/* Crop Box Area */}
              <div
                ref={previewContainerRef}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                className="w-64 h-64 mx-auto rounded-full overflow-hidden border-2 border-dashed border-blue-500/50 bg-black relative cursor-move select-none"
              >
                <div
                  onMouseDown={handleMouseDown}
                  style={{
                    transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                    transformOrigin: "center center",
                    transition: isDragging ? "none" : "transform 0.1s ease-out",
                    position: "absolute",
                    width: "100%",
                    height: "100%"
                  }}
                  className="flex items-center justify-center"
                >
                  <img
                    src={selectedFile}
                    alt="Source Crop"
                    draggable="false"
                    className="max-w-none w-full h-full object-contain pointer-events-none"
                  />
                </div>
                {/* Circular overlay border */}
                <div className="absolute inset-0 border-4 border-black/40 rounded-full pointer-events-none" />
              </div>

              {/* Zoom slider controls */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                  <span>Zoom Scale</span>
                  <span>{Math.round(zoom * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full accent-blue-500 h-1 bg-white/10 rounded-lg outline-none appearance-none"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={handleSaveCrop}
                  disabled={isUploadingAvatar}
                  className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
                >
                  {isUploadingAvatar ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      UPLOADING...
                    </>
                  ) : (
                    "Save Avatar"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="flex-1 py-3.5 bg-white/5 hover:bg-white/10 border border-white/5 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. DANGER ZONE ERASURE CONFIRMATION MODAL */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#07080c] border border-red-500/20 w-full max-w-md rounded-[32px] p-6 md:p-8 space-y-6"
            >
              <div className="text-center space-y-4">
                <div className="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center mx-auto text-red-500 border border-red-500/20 animate-pulse">
                  <AlertTriangle className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold orbitron-font text-red-500">Confirm Account Erasure</h3>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    This action is final. All service data, subscriptions, credentials, and settings will be deleted.
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block">
                    Type <span className="text-red-500 font-black">DELETE</span> to confirm
                  </label>
                  <input
                    type="text"
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                    placeholder="DELETE"
                    className="w-full bg-[#050507] border border-white/5 focus:border-red-500/30 rounded-2xl py-3.5 px-6 text-xs text-center font-bold tracking-widest outline-none transition-all text-red-500"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleDeleteAccount}
                    disabled={isDeletingAccount || deleteConfirmation !== "DELETE"}
                    className="flex-1 py-3.5 bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-red-500/20"
                  >
                    {isDeletingAccount ? "Deleting..." : "Erase Account"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowDeleteModal(false)
                      setDeleteConfirmation("")
                    }}
                    className="flex-1 py-3.5 bg-white/5 border border-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. 2FA MOCK METER SETUP MODAL */}
      <AnimatePresence>
        {show2FAModal && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#07080c] border border-white/10 w-full max-w-md rounded-[32px] p-6 md:p-8 space-y-6"
            >
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <h4 className="text-sm font-black uppercase tracking-widest text-gray-300">Set Up 2FA</h4>
                <button
                  type="button"
                  onClick={() => setShow2FAModal(false)}
                  className="text-gray-500 hover:text-white p-1 text-xs uppercase font-bold"
                >
                  Close
                </button>
              </div>

              <div className="space-y-6 text-center">
                <div className="bg-white p-4 rounded-2xl w-40 h-40 mx-auto border-4 border-blue-500/20 relative">
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=otpauth://totp/VexaNode:royal@vexanode.cloud?secret=JBSWY3DPEHPK3PXP&issuer=VexaNode"
                    alt="Mock 2FA QR"
                    className="w-full h-full"
                  />
                </div>

                <div className="text-left space-y-2">
                  <p className="text-[11px] text-gray-400 font-medium leading-relaxed">
                    1. Scan the QR code using Google Authenticator, Authy, or your password manager.
                  </p>
                  <p className="text-[11px] text-gray-400 font-medium leading-relaxed">
                    2. Type the 6-digit authentication token below to confirm configuration.
                  </p>
                </div>

                <form onSubmit={handleEnable2FA} className="space-y-4 text-left">
                  <div className="space-y-2">
                    <input
                      type="text"
                      maxLength={6}
                      value={twoFACode}
                      onChange={(e) => setTwoFACode(e.target.value)}
                      placeholder="e.g. 123456"
                      className="w-full bg-[#050507] border border-white/5 rounded-2xl py-3.5 px-6 text-xs text-center font-bold tracking-[0.5em] outline-none focus:border-blue-500/30 transition-all text-white font-mono"
                    />
                    {twoFAError && (
                      <p className="text-[10px] text-red-500 font-bold">{twoFAError}</p>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-500/20"
                    >
                      Enable 2FA Protection
                    </button>
                    <button
                      type="button"
                      onClick={() => setShow2FAModal(false)}
                      className="flex-1 py-3.5 bg-white/5 border border-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
