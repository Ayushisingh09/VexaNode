"use client"

import { useEffect, useRef, useState } from "react"
import createGlobe, { COBEOptions } from "cobe"
import { useMotionValue, useSpring } from "framer-motion"

import { cn } from "@/lib/utils"

const MOVEMENT_DAMPING = 1400

const GLOBE_CONFIG: COBEOptions = {
    width: 900,
    height: 900,
    onRender: () => { },
    devicePixelRatio: 2,
    phi: 0,
    theta: 0.3,
    dark: 1,
    diffuse: 0.4,
    mapSamples: 16000,
    mapBrightness: 3,
    baseColor: [0.1, 0.2, 0.3],
    markerColor: [1.0, 0.95, 0.6],
    glowColor: [1.0, 0.95, 0.6],

    markers: [
        { location: [14.5995, 120.9842], size: 0.03 },
        { location: [19.076, 72.8777], size: 0.1 },
        { location: [23.8103, 90.4125], size: 0.05 },
        { location: [30.0444, 31.2357], size: 0.07 },
        { location: [39.9042, 116.4074], size: 0.08 },
        { location: [-23.5505, -46.6333], size: 0.1 },
        { location: [19.4326, -99.1332], size: 0.1 },
        { location: [40.7128, -74.006], size: 0.1 },
        { location: [34.6937, 135.5022], size: 0.05 },
        { location: [41.0082, 28.9784], size: 0.06 },
    ],
};


export function Globe({
    className,
    config = GLOBE_CONFIG,
}: {
    className?: string
    config?: COBEOptions
}) {
    let phi = 0
    let width = 0
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const pointerInteracting = useRef<number | null>(null)
    const pointerInteractionMovement = useRef(0)
    const [isDark, setIsDark] = useState(true)

    const r = useMotionValue(0)
    const rs = useSpring(r, {
        mass: 1,
        damping: 30,
        stiffness: 100,
    })
    const [themeColorUpdate, setThemeColorUpdate] = useState(0)

    const updatePointerInteraction = (value: number | null) => {
        pointerInteracting.current = value
        if (canvasRef.current) {
            canvasRef.current.style.cursor = value !== null ? "grabbing" : "grab"
        }
    }
    const __globeMovement = [
        "d0d95cc52efefbee5a1c3aa6f8f5f50e",
    ]
    const updateMovement = (clientX: number) => {
        if (pointerInteracting.current !== null) {
            const delta = clientX - pointerInteracting.current
            pointerInteractionMovement.current = delta
            r.set(r.get() + delta / MOVEMENT_DAMPING)
        }
    }

    useEffect(() => {
        const checkTheme = () => {
            const isDarkMode = document.documentElement.classList.contains('dark')
            setIsDark(isDarkMode)
        }

        checkTheme()

        const observer = new MutationObserver(() => {
            checkTheme()
            setThemeColorUpdate(prev => prev + 1)
        })

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class', 'style']
        })

        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'theme-color') {
                setThemeColorUpdate(prev => prev + 1)
            }
        }
        window.addEventListener('storage', handleStorageChange)

        const handleThemeColorChange = () => {
            setThemeColorUpdate(prev => prev + 1)
        }
        window.addEventListener('themeColorChange', handleThemeColorChange)

        return () => {
            observer.disconnect()
            window.removeEventListener('storage', handleStorageChange)
            window.removeEventListener('themeColorChange', handleThemeColorChange)
        }
    }, [])

    useEffect(() => {
        const onResize = () => {
            if (canvasRef.current) {
                width = canvasRef.current.offsetWidth
            }
        }

        window.addEventListener("resize", onResize)
        onResize()

        const root = document.documentElement
        const markerColorR = parseFloat(getComputedStyle(root).getPropertyValue('--globe-marker-color-r')) || (isDark ? 0.376 : 0.8)
        const markerColorG = parseFloat(getComputedStyle(root).getPropertyValue('--globe-marker-color-g')) || (isDark ? 0.647 : 0.2)
        const markerColorB = parseFloat(getComputedStyle(root).getPropertyValue('--globe-marker-color-b')) || (isDark ? 0.980 : 0.2)

        const baseColorR = parseFloat(getComputedStyle(root).getPropertyValue('--globe-base-color-r')) || (isDark ? 0.1 : 1.0)
        const baseColorG = parseFloat(getComputedStyle(root).getPropertyValue('--globe-base-color-g')) || (isDark ? 0.2 : 1.0)
        const baseColorB = parseFloat(getComputedStyle(root).getPropertyValue('--globe-base-color-b')) || (isDark ? 0.3 : 1.0)

        const glowColorR = parseFloat(getComputedStyle(root).getPropertyValue('--globe-glow-color-r')) || (isDark ? 0.1 : 0.8)
        const glowColorG = parseFloat(getComputedStyle(root).getPropertyValue('--globe-glow-color-g')) || (isDark ? 0.2 : 0.2)
        const glowColorB = parseFloat(getComputedStyle(root).getPropertyValue('--globe-glow-color-b')) || (isDark ? 0.3 : 0.2)

        const themeConfig = {
            ...config,
            dark: isDark ? 1 : 0,
            baseColor: [baseColorR, baseColorG, baseColorB] as [number, number, number],
            markerColor: [markerColorR, markerColorG, markerColorB] as [number, number, number],
            glowColor: [glowColorR, glowColorG, glowColorB] as [number, number, number],
        }

        const globe = createGlobe(canvasRef.current!, {
            ...themeConfig,
            width: width * 2,
            height: width * 2,
            onRender: (state) => {
                if (!pointerInteracting.current) phi += 0.005
                state.phi = phi + rs.get()
                state.width = width * 2
                state.height = width * 2
            },
        })

        setTimeout(() => (canvasRef.current!.style.opacity = "1"), 0)
        return () => {
            globe.destroy()
            window.removeEventListener("resize", onResize)
        }
    }, [rs, config, isDark, themeColorUpdate])

    return (
        <div
            className={cn(
                "absolute inset-0 mx-auto aspect-[1/1] w-full max-w-[600px]",
                className
            )}
        >
            <canvas
                className={cn(
                    "size-full opacity-0 transition-opacity duration-500 [contain:layout_paint_size]"
                )}
                ref={canvasRef}
                onPointerDown={(e) => {
                    pointerInteracting.current = e.clientX
                    updatePointerInteraction(e.clientX)
                }}
                onPointerUp={() => updatePointerInteraction(null)}
                onPointerOut={() => updatePointerInteraction(null)}
                onMouseMove={(e) => updateMovement(e.clientX)}
                onTouchMove={(e) =>
                    e.touches[0] && updateMovement(e.touches[0].clientX)
                }
            />
        </div>
    )
}
