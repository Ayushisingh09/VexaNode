"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Play, Pause, Volume2, Settings, Maximize2, Share2, Music, ListMusic, Mic2, ChevronDown } from "lucide-react"
import Image from "next/image"

const mockPlaylist = [
  { id: 1, title: "Bairan - Duet Version | @officialBanjaare X @Si...", artist: "Sony Music India and Simiran Kaur Dhadli", time: "2:37", image: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=40&w=100" },
  { id: 2, title: "Banjaare - Bairan (Lyrics)", artist: "The Vibe Guide", time: "2:32", active: true, image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=40&w=100" },
  { id: 3, title: "Bairan - Animated Love Story | Banjaare (Official...", artist: "Banjaare", time: "2:31", image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=40&w=100" },
  { id: 4, title: "Bairan - Banjaare", artist: "AndazE Alfaz", time: "4:54", image: "https://images.unsplash.com/photo-1459749411177-042180ce673c?auto=format&fit=crop&q=40&w=100" },
  { id: 5, title: "Banjaare - Bairan (Lyrics)", artist: "7clouds", time: "2:29", image: "https://images.unsplash.com/photo-1514525253361-bee1d95393c0?auto=format&fit=crop&q=40&w=100" }
]

export default function LavalinkTest() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [search, setSearch] = useState("")

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="bg-[#0c0d12] border border-white/5 rounded-3xl overflow-hidden shadow-2xl relative">
        {/* Header Tab */}
        <div className="flex px-6 pt-6">
          <div className="bg-emerald-600/10 border border-emerald-500/20 px-4 py-2 rounded-t-xl flex items-center gap-2">
            <Headphones className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-bold text-emerald-400 orbitron-font">Lavalink Audio Test</span>
          </div>
        </div>

        <div className="p-6 pt-0">
          <div className="bg-[#111218] border border-white/5 rounded-2xl p-6">
            {/* Search Bar */}
            <div className="flex gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Search song... e.g. Believer Imagine Dragons" 
                  className="w-full bg-black/40 border border-white/5 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3.5 rounded-xl font-bold transition-all">
                Search
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Playlist */}
              <div className="lg:col-span-5 space-y-2 h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                {mockPlaylist.map((item) => (
                  <div 
                    key={item.id}
                    className={`flex items-center gap-4 p-3 rounded-xl border transition-all cursor-pointer ${
                      item.active 
                        ? "bg-emerald-600/10 border-emerald-500/30 ring-1 ring-emerald-500/20" 
                        : "bg-black/20 border-white/5 hover:border-white/10 hover:bg-black/30"
                    }`}
                  >
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                      <Image src={item.image} alt={item.title} fill className="object-cover" />
                      {item.active && (
                        <div className="absolute inset-0 bg-emerald-600/20 flex items-center justify-center">
                          <Music className="w-4 h-4 text-white animate-pulse" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-sm font-bold truncate ${item.active ? "text-white" : "text-gray-300"}`}>
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-gray-500 truncate">{item.artist}</p>
                      <span className="text-[10px] text-gray-500">{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Player */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                 {/* Now Playing Bar */}
                 <div className="bg-black/40 border border-white/5 rounded-xl p-3 flex items-center gap-4">
                   <div className="w-10 h-10 rounded-lg overflow-hidden relative">
                      <Image src={mockPlaylist[1].image} alt="Playing" fill className="object-cover" />
                   </div>
                   <div className="flex-1">
                      <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Now Playing</div>
                      <div className="text-sm font-bold text-white">Banjaare - Bairan (Lyrics)</div>
                      <div className="text-[10px] text-gray-400">The Vibe Guide</div>
                   </div>
                 </div>

                 {/* Visual Player */}
                 <div className="relative flex-1 rounded-2xl overflow-hidden group">
                    <Image 
                      src="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=800" 
                      alt="Player Visual" 
                      fill 
                      className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
                    
                    {/* Controls Overlay */}
                    <div className="absolute inset-0 flex flex-col justify-between p-6">
                       <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                                <Image src={mockPlaylist[1].image} alt="Logo" width={20} height={20} className="rounded-full" />
                             </div>
                             <div>
                                <h5 className="text-sm font-bold text-white">Banjaare - Bairan (Lyrics)</h5>
                                <p className="text-[10px] text-gray-300">The Vibe Guide</p>
                             </div>
                          </div>
                          <div className="flex items-center gap-3 text-white/70">
                             <Volume2 className="w-4 h-4 cursor-pointer hover:text-white" />
                             <span className="text-[10px] font-bold">CC</span>
                             <Settings className="w-4 h-4 cursor-pointer hover:text-white" />
                          </div>
                       </div>

                       <div className="flex items-center justify-center">
                          <button 
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center hover:scale-110 hover:bg-white/20 transition-all text-white"
                          >
                            {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 translate-x-0.5" />}
                          </button>
                       </div>

                       <div className="space-y-3">
                          <div className="flex justify-between items-end">
                             <div className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white border border-white/10">
                                0:01 / 2:32
                             </div>
                             <div className="flex gap-4">
                                <Share2 className="w-4 h-4 text-white/70 cursor-pointer hover:text-white" />
                                <Maximize2 className="w-4 h-4 text-white/70 cursor-pointer hover:text-white" />
                             </div>
                          </div>
                          <div className="relative h-1 bg-white/20 rounded-full cursor-pointer group">
                             <div className="absolute top-0 left-0 h-full w-[10%] bg-emerald-500 rounded-full" />
                             <div className="absolute top-1/2 left-[10%] -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg" />
                          </div>
                          <div className="flex justify-end">
                             <Image src="https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg" alt="YouTube" width={60} height={12} className="brightness-0 invert opacity-50" />
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Lyrics Bar */}
                 <div className="bg-black/40 border border-white/5 rounded-xl p-3 flex items-center justify-between group cursor-pointer hover:bg-black/60 transition-colors">
                    <div className="flex items-center gap-3">
                       <Mic2 className="w-4 h-4 text-gray-500" />
                       <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Lyrics</span>
                       <span className="bg-white/5 px-2 py-0.5 rounded text-[9px] text-gray-600 font-bold uppercase">Not available</span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-600 group-hover:translate-y-0.5 transition-transform" />
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.1);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.2);
        }
      `}</style>
    </section>
  )
}

function Headphones({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <path d="M3 18V10C3 5.02944 7.02944 1 12 1C16.9706 1 21 5.02944 21 10V18" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M21 16H18C16.8954 16 16 16.8954 16 18V20C16 21.1046 16.8954 22 18 22H21V16Z" fill="currentColor" fillOpacity="0.2" />
      <path d="M3 16H6C7.10457 16 8 16.8954 8 18V20C8 21.1046 7.10457 22 6 22H3V16Z" fill="currentColor" fillOpacity="0.2" />
    </svg>
  )
}
