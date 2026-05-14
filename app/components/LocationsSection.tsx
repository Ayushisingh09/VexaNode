"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { memo, useMemo, useState, useEffect } from "react";
import { Globe } from "@/components/ui/globe";

const locations = [
    {
        name: "Amsterdam",
        region: "EU West",
        flag: "/flags/germany.png",
        ping: "66ms",
        status: "active",
        lat: 52.3676,
        lng: 4.9041,
    },
    {
        name: "Chicago, IL",
        region: "US Central",
        flag: "/flags/usa.png",
        ping: "157ms",
        status: "active",
        lat: 41.8781,
        lng: -87.6298,
    },
    {
        name: "Dallas, TX",
        region: "US South",
        flag: "/flags/usa.png",
        ping: "169ms",
        status: "active",
        lat: 32.7767,
        lng: -96.7970,
    },
    {
        name: "Seattle, WA",
        region: "US West",
        flag: "/flags/usa.png",
        ping: "197ms",
        status: "active",
        lat: 47.6062,
        lng: -122.3321,
    },
];

const LocationItem = memo(({ location, index }: { location: typeof locations[0], index: number }) => {
    const isActive = location.status === "active";

    return (
        <motion.div
            className="flex items-center justify-between gap-2 sm:gap-3 py-1.5 sm:py-2 lg:py-3 last:border-0"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
        >
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <Image
                    src={location.flag}
                    alt={`${location.name} flag`}
                    width={32}
                    height={32}
                    className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 rounded object-cover flex-shrink-0"
                    loading="lazy"
                />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                        <h3 className="text-gray-900 dark:text-white font-semibold text-xs sm:text-sm lg:text-base truncate">
                            {location.name}
                        </h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-[10px] sm:text-xs lg:text-sm mt-0.5 truncate">
                        {location.region}
                    </p>
                </div>
            </div>

        </motion.div>
    );
});

LocationItem.displayName = 'LocationItem';




export default function LocationsSection() {
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        const checkTheme = () => {
            const isDarkMode = document.documentElement.classList.contains('dark');
            setIsDark(isDarkMode);
        };

        checkTheme();
        const observer = new MutationObserver(checkTheme);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });

        return () => observer.disconnect();
    }, []);

    const containerVariants = useMemo(() => ({
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 }
    }), []);

    const globeConfig = useMemo(() => ({
        width: 900,
        height: 900,
        devicePixelRatio: 2,
        phi: 0,
        theta: 0.3,
        dark: 1,
        diffuse: 0.4,
        mapSamples: 16000,
        mapBrightness: 3,
        baseColor: [0.1, 0.2, 0.3] as [number, number, number], 
        markerColor: [0.231, 0.510, 0.965] as [number, number, number], 
        glowColor: [0.1, 0.2, 0.3] as [number, number, number], 
        markers: locations
            .filter(loc => loc.status === "active")
            .map(location => ({
                location: [location.lat, location.lng] as [number, number],
                size: 0.08,
            })),
        onRender: () => { },
    }), []);

    return (
        <div className="relative px-4 sm:px-6 lg:px-8 overflow-hidden">
            <div className="pointer-events-none relative mx-auto h-[30rem] sm:h-[40rem] lg:h-[50rem] overflow-hidden [mask-image:radial-gradient(ellipse_at_center_center,#000,transparent_50%)] my-[-12rem] sm:my-[-15rem] lg:my-[-18.8rem] before:absolute before:inset-0 before:h-full before:w-full before:opacity-40 before:[background-image:radial-gradient(circle_at_bottom_center,var(--color),transparent_70%)] after:absolute after:-left-1/2 after:top-1/2 after:aspect-[1/0.7] after:w-[200%] after:rounded-[50%] after:border-t after:border-secondary after:bg-primary"></div>
            <div className="absolute top-1/2 left-1/2 opacity-60 -translate-x-1/2 -translate-y-1/2 pointer-events-none w-full max-w-[100vw] overflow-hidden">
                <svg className="w-full h-auto max-w-[1463px] max-h-[926px]" width="1463" height="926" viewBox="0 0 1463 926" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g filter="url(#filter0_f_0_1)">
                        <ellipse cx="887.5" cy="402.5" rx="275.5" ry="102.5" className="svg-gradient-fill" fillOpacity={isDark ? 0.47 : 0.25} />
                    </g>
                    <g filter="url(#filter1_f_0_1)">
                        <ellipse cx="575.5" cy="523.5" rx="275.5" ry="102.5" className="svg-gradient-fill" fillOpacity={isDark ? 0.47 : 0.25} />
                    </g>
                    <defs>
                        <filter id="filter0_f_0_1" x="312" y="0" width="1151" height="805" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                            <feFlood floodOpacity="0" result="BackgroundImageFix" />
                            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                            <feGaussianBlur stdDeviation="150" result="effect1_foregroundBlur_0_1" />
                        </filter>
                        <filter id="filter1_f_0_1" x="0" y="121" width="1151" height="805" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                            <feFlood floodOpacity="0" result="BackgroundImageFix" />
                            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                            <feGaussianBlur stdDeviation="150" result="effect1_foregroundBlur_0_1" />
                        </filter>
                    </defs>
                </svg>






            </div>

            <div className="relative z-10 max-w-7xl mx-auto py-8 sm:py-12 lg:py-16">
                <div className="grid lg:grid-cols-2 gap-6 sm:gap-10 lg:gap-16 items-center">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-xl sm:text-2xl lg:text-4xl xl:text-5xl orbitron-font font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 leading-tight">
                            Global Presence,
                            <br />
                            <span className="icon-text-primary">Local Performance</span>
                        </h2>

                        <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm lg:text-base mb-4 sm:mb-6 lg:mb-8 leading-relaxed max-w-xl">
                            Our rapidly expanding datacenter network spans across the Americas and Europe,
                            delivering ultra-low latency from anywhere and lightning-fast connections wherever you play.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                            <div>
                                <h3 className="icon-text-primary orbitron-font text-sm sm:text-base lg:text-lg mb-1.5 sm:mb-2 font-semibold">Europe</h3>
                                <div className="space-y-0.5 sm:space-y-1">
                                    {locations
                                        .filter(loc => loc.region.includes("EU"))
                                        .map((location, index) => (
                                            <LocationItem key={location.name} location={location} index={index} />
                                        ))
                                    }
                                </div>
                            </div>

                            <div>
                                <h3 className="icon-text-primary orbitron-font text-sm sm:text-base lg:text-lg mb-1.5 sm:mb-2 font-semibold">Americas</h3>
                                <div className="space-y-0.5 sm:space-y-1">
                                    {locations
                                        .filter(loc => loc.region.includes("US"))
                                        .map((location, index) => (
                                            <LocationItem key={location.name} location={location} index={index + 1} />
                                        ))
                                    }
                                </div>
                            </div>
                        </div>

                    </motion.div>

                    <motion.div
                        className="relative hidden lg:block lg:h-[600px]"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.3 }}
                    >
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Globe config={globeConfig} />
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-px overflow-hidden">
                <div
                    className="h-full w-full bottom-border-gradient"
                    style={{
                        maskImage: 'linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)'
                    }}
                />
            </div>
        </div>
    );
}
