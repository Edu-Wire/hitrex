"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { FaMountain, FaClock, FaArrowRight, FaCompass } from "react-icons/fa";

export default function AdventureCard({
    title = "Everest Base Camp",
    subtitle = "Nepal • Himalayan Range",
    image = "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2671&auto=format&fit=crop", // Default placeholder
    price = "$2,400",
    elevation = "5,364m",
    duration = "14 Days",
}) {
    return (
        <motion.div
            initial="rest"
            whileHover="hover"
            animate="rest"
            className="group relative h-[450px] w-full max-w-md overflow-hidden rounded-[2rem] bg-zinc-900 cursor-pointer shadow-2xl"
        >
            {/* 1. BACKGROUND IMAGE with Zoom Effect */}
            <motion.div
                variants={{
                    rest: { scale: 1 },
                    hover: { scale: 1.15 },
                }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute inset-0 h-full w-full"
            >
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover opacity-80 transition-opacity duration-500 group-hover:opacity-100"
                />
            </motion.div>

            {/* 2. DARK OVERLAY & GRADIENT */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-80" />

            {/* 3. ANIMATED TOPOGRAPHIC PATTERN (The "Trekking" Vibe) */}
            <motion.div
                variants={{
                    rest: { opacity: 0, rotate: 0, scale: 0.8 },
                    hover: { opacity: 0.15, rotate: 20, scale: 1.5 }, // Spins and zooms on hover
                }}
                transition={{ duration: 10, ease: "linear", repeat: Infinity, repeatType: "loop" }} // Slow infinite spin
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 10 C 20 20, 40 20, 50 10' stroke='white' stroke-width='1' fill='none'/%3E%3Cpath d='M10 30 C 20 40, 40 40, 50 30' stroke='white' stroke-width='1' fill='none'/%3E%3Cpath d='M10 50 C 20 60, 40 60, 50 50' stroke='white' stroke-width='1' fill='none'/%3E%3C/svg%3E")`, // Simple SVG pattern
                    backgroundSize: "200px",
                }}
            />

            {/* 4. CROSSHAIR CORNERS (Scope Effect) */}
            <div className="absolute inset-4 pointer-events-none border border-white/0 transition-all duration-500 group-hover:inset-6 group-hover:border-white/20 rounded-xl">
                {/* Top Left Corner */}
                <motion.div variants={{ rest: { opacity: 0 }, hover: { opacity: 1 } }} className="absolute -top-[1px] -left-[1px] w-4 h-4 border-t-2 border-l-2 border-emerald-500" />
                {/* Bottom Right Corner */}
                <motion.div variants={{ rest: { opacity: 0 }, hover: { opacity: 1 } }} className="absolute -bottom-[1px] -right-[1px] w-4 h-4 border-b-2 border-r-2 border-emerald-500" />
            </div>

            {/* 5. PRICE TAG (Floats top right) */}
            <div className="absolute top-6 right-6 overflow-hidden rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5">
                <span className="text-xs font-bold text-white uppercase tracking-widest">{price}</span>
            </div>

            {/* 6. CONTENT AREA */}
            <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col justify-end">

                {/* Subtitle & Compass */}
                <motion.div
                    variants={{ rest: { y: 0 }, hover: { y: -5 } }}
                    className="flex items-center gap-2 mb-3"
                >
                    <FaCompass className="text-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-[0.2em]">
                        {subtitle}
                    </span>
                </motion.div>

                {/* Title */}
                <h3 className="text-4xl font-black text-white uppercase leading-none tracking-tight mb-4 drop-shadow-lg">
                    {title}
                </h3>

                {/* Hidden Details (Slide Up Reveal) */}
                <motion.div
                    variants={{
                        rest: { height: 0, opacity: 0 },
                        hover: { height: "auto", opacity: 1 },
                    }}
                    transition={{ duration: 0.4 }}
                    className="overflow-hidden"
                >
                    {/* Stats Grid */}
                    <div className="flex gap-6 border-t border-white/20 pt-4 mb-4">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2 text-zinc-400 text-[10px] uppercase font-bold tracking-wider mb-1">
                                <FaMountain size={10} /> Max Alt
                            </div>
                            <span className="text-white font-bold font-mono">{elevation}</span>
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2 text-zinc-400 text-[10px] uppercase font-bold tracking-wider mb-1">
                                <FaClock size={10} /> Duration
                            </div>
                            <span className="text-white font-bold font-mono">{duration}</span>
                        </div>
                    </div>

                    {/* Action Button */}
                    <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase text-xs tracking-widest py-3 rounded-lg flex items-center justify-between px-4 transition-colors">
                        <span>View Expedition</span>
                        <FaArrowRight />
                    </button>
                </motion.div>

                {/* Decor: Simple line that vanishes on hover */}
                <motion.div
                    variants={{ rest: { width: "100%" }, hover: { width: "0%" } }}
                    className="h-[2px] bg-white/20 mt-4"
                />
            </div>
        </motion.div>
    );
}