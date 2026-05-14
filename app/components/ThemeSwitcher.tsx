"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Palette, X } from 'lucide-react'
import uiConfig from '../config/sections/ui.json'

interface ThemeColor {
  name: string
  value: string
  label: string
}

interface ThemeSwitcherConfig {
  show: boolean
  position: string
  defaultColor: string
  availableColors: ThemeColor[]
}

const config = uiConfig.themeSwitcher as ThemeSwitcherConfig

export default function ThemeSwitcher() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedColor, setSelectedColor] = useState(config.defaultColor)
  const _themeswitch = [
    "d0d95cc52efefbee5a1c3aa6f8f5f50e",
  ]
  useEffect(() => {
    const savedColor = localStorage.getItem('theme-color')
    if (savedColor && config.availableColors.find(c => c.name === savedColor)) {
      setSelectedColor(savedColor)
      applyTheme(savedColor)
    } else {
      applyTheme(config.defaultColor)
    }

    // Listen for theme mode changes (dark/light toggle)
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          // Re-apply current theme color when dark/light mode changes
          const currentColor = localStorage.getItem('theme-color') || config.defaultColor
          applyTheme(currentColor)
        }
      })
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })

    return () => observer.disconnect()
  }, [])

  const applyTheme = (colorName: string) => {
    const color = config.availableColors.find(c => c.name === colorName)
    if (!color) return

    const root = document.documentElement
    root.style.setProperty('--icon-primary', color.value)
    root.style.setProperty('--button-primary', color.value)
    root.style.setProperty('--text-secondary', color.value)
    root.style.setProperty('--icon-text-primary', color.value)

    const rgb = color.value.match(/\d+/g)
    if (rgb && rgb.length >= 3) {
      const r = parseInt(rgb[0])
      const g = parseInt(rgb[1])
      const b = parseInt(rgb[2])
      root.style.setProperty('--hover-gradient', `radial-gradient(50% 50% at 50% 100%, rgba(${r}, ${g}, ${b}, 0.25) 0%, transparent 100%)`)
      root.style.setProperty('--border-secondary', `rgba(${r}, ${g}, ${b}, 0.3)`)
      root.style.setProperty('--card-primary', `rgba(${r}, ${g}, ${b}, 0.301)`)

      const isDark = root.classList.contains('dark')
      if (isDark) {
        root.style.setProperty('--globe-marker-color-r', (r / 255).toString())
        root.style.setProperty('--globe-marker-color-g', (g / 255).toString())
        root.style.setProperty('--globe-marker-color-b', (b / 255).toString())

        root.style.setProperty('--globe-base-color-r', (r / 255).toString())
        root.style.setProperty('--globe-base-color-g', (g / 255).toString())
        root.style.setProperty('--globe-base-color-b', (b / 255).toString())
        root.style.setProperty('--globe-glow-color-r', ((r / 255) * 0.3).toString())
        root.style.setProperty('--globe-glow-color-g', ((g / 255) * 0.3).toString())
        root.style.setProperty('--globe-glow-color-b', ((b / 255) * 0.3).toString())
      } else {
        root.style.setProperty('--globe-base-color-r', '1.0')
        root.style.setProperty('--globe-base-color-g', '1.0')
        root.style.setProperty('--globe-base-color-b', '1.0')

        root.style.setProperty('--globe-marker-color-r', (r / 255).toString())
        root.style.setProperty('--globe-marker-color-g', (g / 255).toString())
        root.style.setProperty('--globe-marker-color-b', (b / 255).toString())

        root.style.setProperty('--globe-glow-color-r', '1.0')
        root.style.setProperty('--globe-glow-color-g', '1.0')
        root.style.setProperty('--globe-glow-color-b', '1.0')
      }
    }

    localStorage.setItem('theme-color', colorName)
    window.dispatchEvent(new CustomEvent('themeColorChange', { detail: colorName }))
  }

  const handleColorChange = (colorName: string) => {
    setSelectedColor(colorName)
    applyTheme(colorName)
    setIsOpen(false)
  }

  if (!config.show) return null

  const getPositionClasses = () => {
    switch (config.position) {
      case 'bottom-left':
        return 'bottom-4 left-4'
      case 'bottom-right':
        return 'bottom-4 right-4'
      case 'top-left':
        return 'top-4 left-4'
      case 'top-right':
        return 'top-4 right-4'
      default:
        return 'bottom-4 right-4'
    }
  }

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed ${getPositionClasses()} z-50 w-12 h-12 rounded-full shadow-lg transition-all duration-300 hover:scale-110`}
        style={{ backgroundColor: config.availableColors.find(c => c.name === selectedColor)?.value }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Change theme color"
      >
        <Palette className="w-6 h-6 text-white mx-auto" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`fixed ${getPositionClasses()} z-50 bg-white dark:bg-black  rounded-2xl shadow-2xl border border-primary p-4 min-w-[280px]`}
            style={{ transform: 'translateY(-100px)' }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Choose Theme</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {config.availableColors.map((color) => (
                <motion.button
                  key={color.name}
                  onClick={() => handleColorChange(color.name)}
                  className={`relative p-3 rounded-xl transition-all duration-300 hover:scale-105 ${selectedColor === color.name
                      ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-gray-600'
                      : 'hover:shadow-md'
                    }`}
                  style={{ backgroundColor: color.value }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-full h-8 rounded-lg bg-white/20 flex items-center justify-center">
                    <span className="text-xs font-medium text-white drop-shadow-sm">
                      {color.label}
                    </span>
                  </div>
                  {selectedColor === color.name && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center"
                    >
                      <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
} 