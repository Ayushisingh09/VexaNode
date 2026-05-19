'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { NavigationConfig, NavigationItem, DropdownItem } from '../types/navigation';
import { usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button"
import { useLanguage } from '../contexts/LanguageContext'
import { useSession } from 'next-auth/react'
import LanguageSelector from './LanguageSelector'
import CurrencySelector from './CurrencySelector'
import {
  Cloud,
  Server,
  Gamepad2,
  Globe,
  Network,
  Info,
  User,
  Menu,
  X,
  ChevronRight,
  FileText,
  Shield,
  Check,
  Database,
} from 'lucide-react';
import { FaDiscord, FaServer, FaMusic, FaBook, FaShieldAlt, FaGamepad } from "react-icons/fa";
import { GrServerCluster } from "react-icons/gr";
import Confetti from 'react-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { CustomIcons } from './CustomIcons';
import navigationConfig from '../config/sections/navigation.json';
import heroConfig from '../config/sections/hero.json';
import type { HeroConfig } from '../types/hero';
import uiConfig from '../config/sections/ui.json';

const config = navigationConfig as NavigationConfig;
const heroSettings = heroConfig as HeroConfig;


const iconMap: { [key: string]: React.ElementType } = {
  Cloud,
  Server: CustomIcons.VPS,
  Gamepad2: CustomIcons.Minecraft,
  Globe,
  Network,
  Info,
  User,
  FileText: FaBook,
  Shield: FaShieldAlt,
  Menu,
  X,
  ChevronRight,
  FaDiscord: CustomIcons.Bot,
  GrServerCluster,
  Music: FaMusic,
  FaGamepad,
  Database,
};

const getIcon = (iconName?: string) => iconName ? iconMap[iconName] : null;


const SocialIcons: { [key: string]: React.FC } = {
  discord: React.memo(() => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  )),
  twitter: React.memo(() => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ))
};




const Navbar: React.FC = () => {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(config.banner.show);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiConfig, setConfettiConfig] = useState({
    recycle: false,
    numberOfPieces: 200,
    gravity: 0.3
  });
  const [showPopup, setShowPopup] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });
  const [navbarHeight, setNavbarHeight] = useState(60);
  const [mobileDropdownStates, setMobileDropdownStates] = useState<{ [key: string]: boolean }>({});
  const pathname = usePathname();
  const { t } = useLanguage();
  const navRef = React.useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      if (navRef.current) {
        setNavbarHeight(navRef.current.getBoundingClientRect().bottom);
      }
    };
    handleResize();

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (navRef.current) {
      setNavbarHeight(navRef.current.getBoundingClientRect().bottom);
    }
  }, [isScrolled, showBanner]);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const toggleMobileDropdown = useCallback((itemName: string) => {
    setMobileDropdownStates(prev => ({
      ...prev,
      [itemName]: !prev[itemName]
    }));
  }, []);
  const filteredGames = useMemo(() =>
    heroSettings.hero.games.filter((game: any) => game.showInDropdown),
    [heroSettings.hero.games]
  );

  const handleCopyCode = useCallback(() => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(config.banner.couponCode)
        .then(() => {
          setConfettiConfig({
            recycle: false,
            numberOfPieces: 200,
            gravity: 0.3
          });
          setShowConfetti(true);
          setShowPopup(true);
        })
        .catch(() => {
          alert('Failed to copy code. Please try again.');
        });
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = config.banner.couponCode;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setConfettiConfig({
          recycle: false,
          numberOfPieces: 200,
          gravity: 0.3
        });
        setShowConfetti(true);
        setShowPopup(true);
      } catch (err) {
        alert('Failed to copy code. Please try again.');
      }
      document.body.removeChild(textArea);
    }
  }, [config.banner.couponCode]);

  const handleClosePopup = useCallback(() => {
    setConfettiConfig(prev => ({
      ...prev,
      gravity: 0.8,
      numberOfPieces: prev.numberOfPieces
    }));

    setShowPopup(false);

    setTimeout(() => {
      setShowConfetti(false);
    }, 2000);
  }, []);

  const renderDropdown = useCallback((item: NavigationItem) => {
    if (!item.dropdownItems) return null;

    const isGrid = item.dropdownType === 'grid';

    return (
      <div className={`absolute top-full left-0 mt-0 pt-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 z-50`}>
        <div className={`bg-[#0c0d12] border-t-2 border-[#3b82f6] rounded-b-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden ${isGrid ? 'w-[600px] p-6' : 'w-[280px] p-4'}`}>
          <div className={isGrid ? "grid grid-cols-2 gap-4" : "space-y-2"}>
            {item.dropdownItems.map((dropdownItem, idx) => {
              if (isGrid) {
                return (
                  <Link
                    key={idx}
                    href={dropdownItem.href}
                    className="relative group/card h-32 rounded-xl border border-white/5 overflow-hidden transition-all duration-300 hover:border-[#3b82f6]/30"
                  >
                    {dropdownItem.image ? (
                      <div className="absolute inset-0">
                        <Image src={dropdownItem.image} alt="" fill className="object-cover opacity-40 group-hover/card:scale-110 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/40 to-transparent" />
                      </div>
                    ) : (
                      <div className={`absolute inset-0 bg-gradient-to-br ${dropdownItem.color || 'from-[#1a1b23] to-[#0c0d12]'}`} />
                    )}

                    <div className="relative h-full p-4 flex flex-col justify-between z-10">
                      <div className="flex justify-between items-start">
                        <h3 className="text-white font-bold leading-tight tracking-tight">
                          {dropdownItem.name}
                        </h3>
                        <ChevronRight className="w-4 h-4 text-white/50 group-hover/card:translate-x-1 transition-transform" />
                      </div>
                      <p className="text-white/60 text-[10px] uppercase tracking-widest font-medium">
                        {dropdownItem.description}
                      </p>
                    </div>
                  </Link>
                );
              }

              return (
                <Link
                  key={idx}
                  href={dropdownItem.href}
                  className="flex flex-col p-3 rounded-lg border border-white/5 hover:border-[#3b82f6]/20 hover:bg-white/5 transition-all duration-300 group/item"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-white group-hover/item:text-[#3b82f6] transition-colors">
                      {dropdownItem.name}
                    </span>
                    {dropdownItem.badge && (
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${dropdownItem.badgeColor || 'bg-blue-500'} text-white`}>
                        {dropdownItem.badge}
                      </span>
                    )}
                  </div>
                  {dropdownItem.description && (
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      {dropdownItem.description}
                    </p>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    );
  }, []);

  const getTranslatedNavName = useCallback((itemName: string) => {
    const navKey = itemName.toLowerCase().replace(/\s+/g, '');
    switch (navKey) {
      case 'home': return t('navbar.home');
      case 'minecraft': return 'Minecraft';
      case 'lavalink': return 'Lavalink';
      case 'dedicated': return 'Dedicated';
      case 'bothosting': return t('navbar.botHosting');
      case 'vpshosting': return t('navbar.vpsHosting');
      case 'blogs': return t('navbar.blogs');
      case 'legal': return t('navbar.legal');
      default: return itemName;
    }
  }, [t]);

  const renderMegaMenu = (item: NavigationItem) => {
    if (!item.megaMenuSections) return null;

    return (
      <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-screen max-w-5xl px-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
        <div className="bg-[#0c0d12]/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] grid grid-cols-3 gap-12">
          {item.megaMenuSections.map((section, sIdx) => (
            <div key={sIdx}>
              <h3 className="text-[10px] font-bold text-gray-500 tracking-[0.2em] mb-6 uppercase">
                {section.title}
              </h3>
              <div className="space-y-6">
                {section.items.map((subItem, iIdx) => {
                  const SubIcon = getIcon(subItem.icon);
                  return (
                    <Link
                      key={iIdx}
                      href={subItem.href}
                      className="flex items-start gap-4 group/item hover:bg-white/5 p-3 -m-3 rounded-xl transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover/item:border-blue-500/50 transition-colors">
                        {SubIcon && <SubIcon className="w-5 h-5 text-gray-400 group-hover/item:text-blue-500 transition-colors" />}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-200 group-hover/item:text-white transition-colors">
                          {subItem.name}
                        </div>
                        <div className="text-xs text-gray-500 group-hover/item:text-gray-400 transition-colors mt-1">
                          {subItem.description}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderNavigationItem = useCallback((item: NavigationItem) => {
    const IconComponent = item.icon ? getIcon(item.icon) : null;
    const isActive = pathname === item.href || (item.hasDropdown && pathname.startsWith(item.href));

    return (
      <div key={item.name} className="relative group flex items-center h-full">
        <Link
          href={item.href}
          className={`px-4 py-8 text-[13px] font-semibold text-gray-400 hover:text-white transition-all duration-300 flex items-center gap-1 relative
          ${isActive ? 'text-white' : ''}`}
          prefetch={true}
        >
          {item.showStatusDot && (
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
          )}
          <span>{item.name}</span>
          {item.hasDropdown && <ChevronRight className="w-3 h-3 rotate-90 opacity-50 group-hover:opacity-100 transition-all" />}

          <motion.div
            className="absolute bottom-6 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            layoutId="nav-hover-dot"
          />
        </Link>
        {item.hasDropdown && (item.isMegaMenu ? renderMegaMenu(item) : renderDropdown(item))}
      </div>
    );
  }, [pathname, renderDropdown, renderMegaMenu]);

  const renderMobileNavigationItem = useCallback((item: NavigationItem) => {
    const IconComponent = item.icon ? getIcon(item.icon) : null;
    const translatedName = getTranslatedNavName(item.name);
    const isDropdownOpen = mobileDropdownStates[item.name] || false;

    // Items with mega menu (Products)
    if (item.hasDropdown && item.isMegaMenu && item.megaMenuSections) {
      return (
        <div key={item.name}>
          <button
            onClick={() => toggleMobileDropdown(item.name)}
            className={`w-full flex items-center justify-between px-4 py-4 transition-all duration-200 border-b border-white/5 ${
              isDropdownOpen ? 'bg-[#3b82f6]/5' : 'hover:bg-white/3'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isDropdownOpen ? 'bg-[#3b82f6]/15 border border-[#3b82f6]/30' : 'bg-white/5 border border-white/10'}`}>
                {IconComponent
                  ? <IconComponent className={`w-4 h-4 ${isDropdownOpen ? 'text-[#3b82f6]' : 'text-gray-400'}`} />
                  : <Network className={`w-4 h-4 ${isDropdownOpen ? 'text-[#3b82f6]' : 'text-gray-400'}`} />
                }
              </div>
              <span className={`text-sm font-semibold tracking-wide ${isDropdownOpen ? 'text-white' : 'text-gray-300'}`}>{translatedName.toUpperCase()}</span>
            </div>
            <motion.div animate={{ rotate: isDropdownOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronRight className={`w-4 h-4 ${isDropdownOpen ? 'text-[#3b82f6]' : 'text-gray-500'}`} />
            </motion.div>
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="overflow-hidden bg-[#0a0b10]"
              >
                {item.megaMenuSections.map((section, sIdx) => (
                  <div key={sIdx}>
                    <div className="px-4 pt-3 pb-1">
                      <span className="text-[10px] font-bold tracking-[0.2em] text-[#3b82f6]/60 uppercase">{section.title}</span>
                    </div>
                    {section.items.map((subItem, iIdx) => {
                      const SubIcon = getIcon(subItem.icon);
                      const isSubActive = pathname === subItem.href;
                      return (
                        <Link
                          key={iIdx}
                          href={subItem.href}
                          onClick={closeMobileMenu}
                          prefetch={true}
                          className={`flex items-center justify-between px-4 py-3.5 transition-all duration-150 border-b border-white/3 ${
                            isSubActive ? 'bg-[#3b82f6]/8' : 'hover:bg-white/3'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isSubActive ? 'bg-[#3b82f6]/15 border border-[#3b82f6]/30' : 'bg-white/5 border border-white/8'}`}>
                              {SubIcon && <SubIcon className={`w-3.5 h-3.5 ${isSubActive ? 'text-[#3b82f6]' : 'text-gray-400'}`} />}
                            </div>
                            <div>
                              <div className={`text-sm font-semibold leading-tight ${isSubActive ? 'text-[#3b82f6]' : 'text-gray-200'}`}>{subItem.name}</div>
                              {subItem.description && (
                                <div className="text-[11px] text-gray-500 mt-0.5 leading-tight">{subItem.description}</div>
                              )}
                            </div>
                          </div>
                          <ChevronRight className={`w-4 h-4 flex-shrink-0 ${isSubActive ? 'text-[#3b82f6]' : 'text-gray-600'}`} />
                        </Link>
                      );
                    })}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }

    // Items with standard list dropdown (Legal, Company)
    if (item.hasDropdown && item.dropdownItems) {
      return (
        <div key={item.name}>
          <button
            onClick={() => toggleMobileDropdown(item.name)}
            className={`w-full flex items-center justify-between px-4 py-4 transition-all duration-200 border-b border-white/5 ${
              isDropdownOpen ? 'bg-[#3b82f6]/5' : 'hover:bg-white/3'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isDropdownOpen ? 'bg-[#3b82f6]/15 border border-[#3b82f6]/30' : 'bg-white/5 border border-white/10'}`}>
                {IconComponent
                  ? <IconComponent className={`w-4 h-4 ${isDropdownOpen ? 'text-[#3b82f6]' : 'text-gray-400'}`} />
                  : <FileText className={`w-4 h-4 ${isDropdownOpen ? 'text-[#3b82f6]' : 'text-gray-400'}`} />
                }
              </div>
              <span className={`text-sm font-semibold tracking-wide ${isDropdownOpen ? 'text-white' : 'text-gray-300'}`}>{translatedName.toUpperCase()}</span>
            </div>
            <motion.div animate={{ rotate: isDropdownOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronRight className={`w-4 h-4 ${isDropdownOpen ? 'text-[#3b82f6]' : 'text-gray-500'}`} />
            </motion.div>
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="overflow-hidden bg-[#0a0b10]"
              >
                {item.dropdownItems.map((dropdownItem: any, idx: number) => {
                  const dName = dropdownItem.name === 'Terms of Service' ? t('navbar.termsOfService') :
                    dropdownItem.name === 'Privacy Policy' ? t('navbar.privacyPolicy') :
                      dropdownItem.name;
                  const isSubActive = pathname === dropdownItem.href;
                  return (
                    <Link
                      key={idx}
                      href={dropdownItem.href}
                      onClick={closeMobileMenu}
                      prefetch={true}
                      className={`flex items-center justify-between px-4 py-3.5 border-b border-white/3 transition-all duration-150 ${
                        isSubActive ? 'bg-[#3b82f6]/8' : 'hover:bg-white/3'
                      }`}
                    >
                      <div>
                        <div className={`text-sm font-semibold ${isSubActive ? 'text-[#3b82f6]' : 'text-gray-200'}`}>{dName}</div>
                        {dropdownItem.description && (
                          <div className="text-[11px] text-gray-500 mt-0.5">{dropdownItem.description}</div>
                        )}
                      </div>
                      <ChevronRight className={`w-4 h-4 flex-shrink-0 ${isSubActive ? 'text-[#3b82f6]' : 'text-gray-600'}`} />
                    </Link>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }

    // Simple nav item
    const isActive = pathname === item.href;
    return (
      <Link
        key={item.name}
        href={item.href}
        onClick={closeMobileMenu}
        prefetch={true}
        className={`flex items-center justify-between px-4 py-4 border-b border-white/5 transition-all duration-200 ${
          isActive ? 'bg-[#3b82f6]/8' : 'hover:bg-white/3'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isActive ? 'bg-[#3b82f6]/15 border border-[#3b82f6]/30' : 'bg-white/5 border border-white/10'}`}>
            {item.showStatusDot
              ? <span className="w-2 h-2 bg-[#3b82f6] rounded-full shadow-[0_0_8px_rgba(59,130,246,0.7)]" />
              : IconComponent
                ? <IconComponent className={`w-4 h-4 ${isActive ? 'text-[#3b82f6]' : 'text-gray-400'}`} />
                : <Globe className={`w-4 h-4 ${isActive ? 'text-[#3b82f6]' : 'text-gray-400'}`} />
            }
          </div>
          <span className={`text-sm font-semibold tracking-wide ${isActive ? 'text-[#3b82f6]' : 'text-gray-300'}`}>{translatedName.toUpperCase()}</span>
        </div>
        <ChevronRight className={`w-4 h-4 ${isActive ? 'text-[#3b82f6]' : 'text-gray-600'}`} />
      </Link>
    );
  }, [pathname, closeMobileMenu, filteredGames, mobileDropdownStates, toggleMobileDropdown]);

  return (
    <div style={{ overflowX: 'hidden', position: 'relative' }}>

      {showConfetti && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 10000,
          pointerEvents: 'none',
          overflow: 'hidden'
        }}>
          <Confetti
            width={windowDimensions.width}
            height={windowDimensions.height}
            recycle={confettiConfig.recycle}
            numberOfPieces={confettiConfig.numberOfPieces}
            gravity={confettiConfig.gravity}
          />
        </div>
      )}


      <AnimatePresence>
        {showPopup && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="absolute backdrop-blur-sm inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={handleClosePopup}
            />
            <motion.div
              className="relative bg-white/50 dark:bg-black/50 backdrop-blur-sm border border-secondary rounded-lg p-8 max-w-sm mx-4 text-center shadow-2xl"
              initial={{
                opacity: 0,
                scale: 0.8,
                y: 20
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0
              }}
              exit={{
                opacity: 0,
                scale: 0.8,
                y: 20
              }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 300,
                duration: 0.4
              }}
            >
              <motion.div
                className="flex justify-center mb-4"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  delay: 0.2,
                  type: "spring",
                  damping: 20,
                  stiffness: 300
                }}
              >
                <div className="w-16 h-16 card-primary rounded-full flex items-center justify-center">
                  <Check className="w-8 h-8 icon-text-primary" />
                </div>
              </motion.div>
              <motion.h3
                className="text-xl font-semibold text-gray-900 dark:text-white mb-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                Coupon Code Copied!
              </motion.h3>
              <motion.p
                className="text-gray-600 dark:text-gray-300 mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
              >
                The coupon code has been copied to your clipboard.
              </motion.p>
              <motion.button
                onClick={handleClosePopup}
                className="w-full button-primary text-icon-text-primary px-6 py-3 rounded-lg font-semibold hover:hover-gradient border border-transparent hover:border-secondary transition-all duration-300"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{
                  opacity: 0,
                  scale: 0.8,
                  y: 20
                }}
                transition={{
                  type: "spring",
                  damping: 25,
                  stiffness: 300,
                  duration: 0.4
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Ok, Thank you!
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showBanner && config.banner.show && (
        <div
          className={`relative text-white text-sm py-3 px-4 transition-colors duration-300 ${!config.banner.useThemeColor ? config.banner.backgroundColor : ''
            }`}
          style={{
            backgroundColor: config.banner.useThemeColor
              ? 'var(--button-primary)'
              : undefined
          }}
        >
          <div className="max-w-7xl mx-auto px-2 sm:px-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 flex items-center justify-center space-x-2 sm:space-x-3">
                <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 icon-text-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="icon-text-primary text-xs font-bold">%</span>
                </div>
                <span className="text-xs sm:text-sm md:text-base text-white font-medium">{config.banner.text}</span>
                <button
                  onClick={handleCopyCode}
                  className="bg-white/20 hover:bg-white/30 px-1.5 sm:px-2 md:px-3 py-1 rounded text-xs font-bold transition-colors cursor-pointer whitespace-nowrap flex-shrink-0 text-white border border-white/30 hover:border-white/50"
                >
                  {config.banner.couponCode}
                </button>
              </div>
              <button
                className="text-white hover:text-white/90 transition-colors flex-shrink-0"
                onClick={() => setShowBanner(false)}
                aria-label="Close banner"
              >
                <X className="w-4 h-4" />
              </button>

            </div>
          </div>
        </div>
      )}


      <nav ref={navRef} className={`fixed left-0 right-0 z-50 transition-all duration-500 ease-in-out ${isScrolled
          ? 'top-0 bg-[#0c0d12]/90 backdrop-blur-xl border-b border-white/5 py-2'
          : (showBanner ? 'top-[52px] bg-[#0c0d12]/60 backdrop-blur-md py-4' : 'top-0 bg-[#0c0d12]/60 backdrop-blur-md py-4')
        }`}>
        <div className="px-4 sm:px-0 max-w-7xl mx-auto">
          <div className="flex items-center">

            <div className="flex-shrink-0 flex items-center mr-6">
              <Link
                href="/"
                className="flex items-center space-x-3 group transition-transform duration-300 hover:scale-[1.02]"
                aria-label="Go to homepage"
                prefetch={true}
              >
                <div className="relative">
                  <Image
                    src={heroSettings.navbar.logo}
                    alt={heroSettings.navbar.brandName}
                    className="h-8 sm:h-10 md:h-12 w-auto drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                    width={48}
                    height={48}
                    priority
                    quality={90}
                    sizes="(max-width: 640px) 32px, (max-width: 768px) 40px, 48px"
                  />
                </div>
                <span className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white orbitron-font tracking-tight">
                  {heroSettings.navbar.brandName}<span className="text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]">{heroSettings.navbar.brandAccent}</span>
                </span>
              </Link>
            </div>


            <div className="hidden md:flex md:items-center flex-1 justify-center">
              {config.mainNavigation.map((item) => renderNavigationItem(item))}
              <div className="relative group flex items-center h-full">
                <Link
                  href="/partners"
                  className={`px-4 py-8 text-[13px] font-semibold text-gray-400 hover:text-white transition-all duration-300 flex items-center gap-1 relative ${pathname === '/partners' ? 'text-white' : ''}`}
                >
                  Partners
                  <motion.div
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    layoutId="nav-hover-dot"
                  />
                </Link>
              </div>
            </div>

            <div className="hidden md:flex md:items-center space-x-4 ml-auto">
              <CurrencySelector />
              <LanguageSelector />
              
              {session?.user ? (
                <Link
                  href="/dashboard/account"
                  className="flex items-center gap-2 group transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/30 overflow-hidden flex items-center justify-center group-hover:border-blue-500">
                    {session.user.image ? (
                      <img src={session.user.image} alt="User" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
                    )}
                  </div>
                </Link>
              ) : (
                <Link
                  href={config.loginLink?.href || "#"}
                  className="text-gray-400 hover:text-white text-sm font-bold transition-colors px-4 py-2"
                >
                  {config.loginLink?.name || "Log In"}
                </Link>
              )}

              <Link
                href={config.clientSpace.href}
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]"
                prefetch={true}
              >
                {config.clientSpace.name}
              </Link>
            </div>

            <div className="flex items-center py-2 md:hidden ml-auto">
              <button
                type="button"
                className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all"
                onClick={toggleMobileMenu}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
                aria-label="Toggle navigation menu"
              >
                <span className="sr-only">Open main menu</span>
                <motion.div
                  animate={{ rotate: isMobileMenuOpen ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </motion.div>
              </button>
            </div>
          </div>
        </div>
      </nav>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              id="mobile-menu"
              className="md:hidden fixed inset-x-0 bottom-0 z-40"
              style={{ top: `${navbarHeight}px` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Backdrop */}
              <motion.div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={closeMobileMenu}
              />

              {/* Drawer panel */}
              <motion.div
                className="relative bg-[#0d0f1a] flex flex-col h-full overflow-hidden origin-top border-t border-[#3b82f6]/30"
                style={{ maxHeight: `calc(100vh - ${navbarHeight}px)` }}
                initial={{ scaleY: 0.95, opacity: 0 }}
                animate={{ scaleY: 1, opacity: 1 }}
                exit={{ scaleY: 0.95, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                {/* Drawer header */}
                <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/8 flex-shrink-0 bg-[#0d0f1a]">
                  <Link href="/" onClick={closeMobileMenu} className="flex items-center gap-2.5">
                    <Image
                      src={heroSettings.navbar.logo}
                      alt={heroSettings.navbar.brandName}
                      className="h-7 w-auto"
                      width={28} height={28} priority quality={90}
                    />
                    <span className="text-white font-bold text-base orbitron-font tracking-tight">
                      {heroSettings.navbar.brandName}<span className="text-[#3b82f6]">{heroSettings.navbar.brandAccent}</span>
                    </span>
                  </Link>
                  <button
                    onClick={closeMobileMenu}
                    className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                    aria-label="Close menu"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Scrollable nav list */}
                <div className="flex-1 overflow-y-auto overscroll-contain">
                  {/* Partners link (hardcoded) */}
                  <Link
                    href="/partners"
                    onClick={closeMobileMenu}
                    prefetch={true}
                    className={`flex items-center justify-between px-4 py-4 border-b border-white/5 transition-all duration-200 ${pathname === '/partners' ? 'bg-[#3b82f6]/8' : 'hover:bg-white/3'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${pathname === '/partners' ? 'bg-[#3b82f6]/15 border border-[#3b82f6]/30' : 'bg-white/5 border border-white/10'}`}>
                        <Network className={`w-4 h-4 ${pathname === '/partners' ? 'text-[#3b82f6]' : 'text-gray-400'}`} />
                      </div>
                      <span className={`text-sm font-semibold tracking-wide ${pathname === '/partners' ? 'text-[#3b82f6]' : 'text-gray-300'}`}>PARTNERS</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 ${pathname === '/partners' ? 'text-[#3b82f6]' : 'text-gray-600'}`} />
                  </Link>

                  {config.mainNavigation.map((item) => renderMobileNavigationItem(item))}
                </div>

                {/* Footer actions */}
                <div className="flex-shrink-0 border-t border-white/8 bg-[#0a0b10] px-4 py-4 space-y-3">
                  {/* Language + social row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-widest">Lang</span>
                      <LanguageSelector className="w-28" />
                    </div>
                    <div className="flex items-center gap-2">
                      {config.socialLinks.map((social) => {
                        const SocialIcon = SocialIcons[social.icon];
                        return (
                          <a
                            key={social.name}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Visit our ${social.name} page`}
                            className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-[#3b82f6]/40 hover:bg-[#3b82f6]/10 transition-all"
                          >
                            <SocialIcon />
                          </a>
                        );
                      })}
                    </div>
                  </div>

                  {/* Auth / dashboard CTA */}
                  {session?.user ? (
                    <Link
                      href="/dashboard/account"
                      onClick={closeMobileMenu}
                      className="flex items-center justify-center gap-2 w-full bg-[#3b82f6] hover:bg-[#2563eb] text-[#0a0b10] font-bold text-sm px-4 py-3 rounded-xl transition-all duration-200 shadow-[0_0_20px_rgba(59,130,246,0.25)]"
                    >
                      <User className="w-4 h-4" />
                      <span>My Dashboard</span>
                    </Link>
                  ) : (
                    <div className="flex gap-2">
                      <Link
                        href={config.loginLink?.href || '/login'}
                        onClick={closeMobileMenu}
                        className="flex-1 flex items-center justify-center gap-2 border border-white/15 text-gray-300 hover:text-white hover:border-white/30 font-semibold text-sm px-4 py-3 rounded-xl transition-all duration-200"
                      >
                        {config.loginLink?.name || 'Log In'}
                      </Link>
                      <Link
                        href={config.clientSpace.href}
                        onClick={closeMobileMenu}
                        prefetch={true}
                        className="flex-1 flex items-center justify-center gap-2 bg-[#3b82f6] hover:bg-[#2563eb] text-[#0a0b10] font-bold text-sm px-4 py-3 rounded-xl transition-all duration-200 shadow-[0_0_20px_rgba(59,130,246,0.25)]"
                      >
                        {t('navbar.clientSpace')}
                      </Link>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
    </div>
  );
};

export default Navbar;