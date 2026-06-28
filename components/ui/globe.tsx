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

    // Using exact VexaNode datacenters as markers
    markers: [
        { location: [19.076, 72.8777], size: 0.1 },     // Mumbai
        { location: [1.3521, 103.8198], size: 0.08 },   // Singapore
        { location: [50.1109, 8.6821], size: 0.08 },    // Frankfurt
        { location: [40.7128, -74.006], size: 0.1 },    // New York
        { location: [34.0522, -118.2437], size: 0.08 }, // LA
        { location: [-23.5505, -46.6333], size: 0.08 }, // Sao Paulo
        { location: [35.6762, 139.6503], size: 0.08 },  // Tokyo
    ],
};

const arcs = [
    { from: [40.7128, -74.006], to: [50.1109, 8.6821] },    // NY -> Frankfurt
    { from: [40.7128, -74.006], to: [34.0522, -118.2437] }, // NY -> LA
    { from: [40.7128, -74.006], to: [-23.5505, -46.6333] }, // NY -> Sao Paulo
    { from: [40.7128, -74.006], to: [19.076, 72.8777] },    // NY -> Mumbai
    { from: [19.076, 72.8777], to: [1.3521, 103.8198] },    // Mumbai -> Singapore
    { from: [19.076, 72.8777], to: [35.6762, 139.6503] },   // Mumbai -> Tokyo
    { from: [50.1109, 8.6821], to: [19.076, 72.8777] }      // Frankfurt -> Mumbai
];

const projectPoint = (lat: number, lng: number, phi: number, theta: number, width: number) => {
    const latRad = lat * Math.PI / 180;
    const lngRad = lng * Math.PI / 180;
    
    // Cobe uses specific rotation offset and scale
    const phiRot = 1.5 * Math.PI - lngRad;
    const x0 = Math.cos(latRad) * Math.sin(phiRot - phi); 
    const y0 = Math.sin(latRad);
    const z0 = Math.cos(latRad) * Math.cos(phiRot - phi);
    
    const y1 = y0 * Math.cos(theta) - z0 * Math.sin(theta);
    const z1 = y0 * Math.sin(theta) + z0 * Math.cos(theta);
    
    // Cobe sphere radius is exactly 40% of the container width to leave room for the glow
    const r = width * 0.4;
    
    return {
        x: (width / 2) + (x0 * r),
        y: (width / 2) - (y1 * r),
        visible: z1 > -0.1
    };
};

const drawArc = (from: any, to: any, width: number) => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const dist = Math.sqrt(dx*dx + dy*dy);
    const cx = width / 2, cy = width / 2;
    const midX = (from.x + to.x) / 2;
    const midY = (from.y + to.y) / 2;
    const vecX = midX - cx;
    const vecY = midY - cy;
    const vecLen = Math.sqrt(vecX*vecX + vecY*vecY) || 1;
    const offset = dist * 0.3; // Arc bend
    const cpX = midX + (vecX / vecLen) * offset;
    const cpY = midY + (vecY / vecLen) * offset;
    return `M ${from.x} ${from.y} Q ${cpX} ${cpY} ${to.x} ${to.y}`;
};

export function Globe({ className, config = GLOBE_CONFIG }: { className?: string, config?: COBEOptions }) {
    let phi = 0
    let width = 0
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const svgRef = useRef<SVGSVGElement>(null)
    const pathsRef = useRef<(SVGPathElement | null)[]>([])
    const cometsRef = useRef<(SVGPathElement | null)[]>([])
    const t = useRef(0)
    
    const pointerInteracting = useRef<number | null>(null)
    const pointerInteractionMovement = useRef(0)
    const [isDark, setIsDark] = useState(true)

    const r = useMotionValue(0)
    const rs = useSpring(r, { mass: 1, damping: 30, stiffness: 100 })
    const [themeColorUpdate, setThemeColorUpdate] = useState(0)

    const updatePointerInteraction = (value: number | null) => {
        pointerInteracting.current = value
        if (canvasRef.current) {
            canvasRef.current.style.cursor = value !== null ? "grabbing" : "grab"
        }
    }
    const updateMovement = (clientX: number) => {
        if (pointerInteracting.current !== null) {
            const delta = clientX - pointerInteracting.current
            pointerInteractionMovement.current = delta
            r.set(r.get() + delta / MOVEMENT_DAMPING)
        }
    }

    useEffect(() => {
        const checkTheme = () => setIsDark(document.documentElement.classList.contains('dark'))
        checkTheme()
        const observer = new MutationObserver(() => {
            checkTheme()
            setThemeColorUpdate(prev => prev + 1)
        })
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        const onResize = () => {
            if (canvasRef.current) width = canvasRef.current.offsetWidth
        }
        window.addEventListener("resize", onResize)
        onResize()

        const themeConfig = {
            ...config,
            dark: isDark ? 1 : 0,
            baseColor: [0.03, 0.05, 0.15] as [number, number, number],
            markerColor: [0, 0.639, 1] as [number, number, number], // #00a3ff VexaNode brand
            glowColor: [0.08, 0.12, 0.25] as [number, number, number],
        }

        const globe = createGlobe(canvasRef.current!, {
            ...themeConfig,
            width: width * 2,
            height: width * 2,
            onRender: (state) => {
                if (!pointerInteracting.current) phi += 0.005
                const currentPhi = phi + rs.get()
                state.phi = currentPhi
                state.width = width * 2
                state.height = width * 2
                
                // SVG Overlay Animation
                t.current += 1.5;
                if (svgRef.current) {
                    svgRef.current.setAttribute('viewBox', `0 0 ${width} ${width}`)
                    arcs.forEach((arc, i) => {
                        const fromP = projectPoint(arc.from[0], arc.from[1], currentPhi, themeConfig.theta, width);
                        const toP = projectPoint(arc.to[0], arc.to[1], currentPhi, themeConfig.theta, width);
                        
                        const isVisible = fromP.visible || toP.visible;
                        
                        if (pathsRef.current[i] && cometsRef.current[i]) {
                            if (isVisible) {
                                const d = drawArc(fromP, toP, width);
                                pathsRef.current[i]!.setAttribute('d', d);
                                pathsRef.current[i]!.style.opacity = (fromP.visible && toP.visible) ? '0.3' : '0.1';
                                
                                cometsRef.current[i]!.setAttribute('d', d);
                                cometsRef.current[i]!.style.opacity = (fromP.visible && toP.visible) ? '1' : '0';
                                // Reverse dash offset to make comet fly forward
                                cometsRef.current[i]!.style.strokeDashoffset = String(1000 - ((t.current + i * 150) % 1000));
                            } else {
                                pathsRef.current[i]!.style.opacity = '0';
                                cometsRef.current[i]!.style.opacity = '0';
                            }
                        }
                    });
                }
            },
        })

        setTimeout(() => (canvasRef.current!.style.opacity = "1"), 0)
        return () => {
            globe.destroy()
            window.removeEventListener("resize", onResize)
        }
    }, [rs, config, isDark, themeColorUpdate])

    return (
        <div className={cn("absolute inset-0 mx-auto aspect-[1/1] w-full max-w-[600px]", className)}>
            <canvas
                className="size-full opacity-0 transition-opacity duration-500 [contain:layout_paint_size]"
                ref={canvasRef}
                onPointerDown={(e) => {
                    pointerInteracting.current = e.clientX
                    updatePointerInteraction(e.clientX)
                }}
                onPointerUp={() => updatePointerInteraction(null)}
                onPointerOut={() => updatePointerInteraction(null)}
                onMouseMove={(e) => updateMovement(e.clientX)}
                onTouchMove={(e) => e.touches[0] && updateMovement(e.touches[0].clientX)}
            />
            
            {/* VexaNode Custom Network SVG Overlay */}
            <svg
                ref={svgRef}
                className="absolute inset-0 size-full pointer-events-none drop-shadow-[0_0_10px_rgba(0,163,255,0.8)]"
            >
                {arcs.map((_, i) => (
                    <g key={i}>
                        <path 
                            ref={el => { pathsRef.current[i] = el }} 
                            fill="none" 
                            stroke="#00a3ff"
                            strokeWidth="1.5" 
                            style={{ transition: 'opacity 0.2s' }}
                        />
                        <path 
                           ref={el => { cometsRef.current[i] = el }} 
                           fill="none" 
                           stroke="#4da2ff" 
                           strokeWidth="3.5" 
                           strokeLinecap="round"
                           style={{ 
                               strokeDasharray: '15 1000',
                               transition: 'opacity 0.2s' 
                           }}
                        />
                    </g>
                ))}
            </svg>
        </div>
    )
}
