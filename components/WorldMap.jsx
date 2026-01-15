"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { FaCompass, FaCampground, FaMapMarkerAlt } from "react-icons/fa";

const markers = [
    { id: 1, name: "Northwest Passage", x: 15, y: 38, country: "Canada" },
    { id: 2, name: "Amazonia Base", x: 28, y: 56, country: "Brazil" },
    { id: 3, name: "Andean Peak", x: 26, y: 80, country: "Chile" },
    { id: 4, name: "Alpine Summit", x: 48, y: 26, country: "France" },
    { id: 5, name: "Southern Cape", x: 53, y: 76, country: "South Africa" },
    { id: 6, name: "Siberian Watch", x: 80, y: 22, country: "Russia" },
    { id: 7, name: "Outback Trail", x: 88, y: 78, country: "Australia" },
];

const paths = [
    "M15,38 Q22,45 28,56 Q27,70 26,80", // Americas connection
    "M15,38 Q30,35 48,26", // North America to Europe
    "M48,26 Q50,55 53,76", // Europe to Africa
    "M48,26 Q65,25 80,22", // Europe to Asia
    "M80,22 Q84,50 88,78", // Asia to Australia
    "M53,76 Q75,85 88,78", // Africa to Australia
];

export default function WorldMap() {
    const [hovered, setHovered] = useState(null);

    // Animation variants for the path
    const pathVariants = {
        hidden: { pathLength: 0, opacity: 0 },
        visible: (custom) => ({
            pathLength: 1,
            opacity: 0.5,
            transition: {
                pathLength: { delay: custom * 0.3, duration: 1.5, ease: "easeInOut" },
                opacity: { delay: custom * 0.3, duration: 0.5 }
            }
        })
    };

    return (
        <div className="relative w-full aspect-video bg-[#B9E2F5] rounded-[2.5rem] border-8 border-white overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] group">

            {/* Background Stylized Map SVG */}
            <svg
                viewBox="0 0 100 100"
                className="w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Simple Continent Shapes (Mimicking the image style) */}
                <g className="fill-[#8BAC42] transition-colors duration-700">
                    {/* North America */}
                    <motion.path
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        d="M5,25 Q10,12 35,20 L30,48 Q20,52 8,42 Z"
                    />
                    {/* South America */}
                    <motion.path
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        d="M22,52 Q30,55 35,78 L28,95 Q12,85 18,62 Z"
                    />
                    {/* Eurasia */}
                    <motion.path
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        d="M40,18 Q65,5 98,22 L88,58 Q60,68 42,52 Z"
                    />
                    {/* Africa */}
                    <motion.path
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        d="M45,50 Q62,48 68,75 L55,92 Q42,88 45,62 Z"
                    />
                    {/* Australia */}
                    <motion.path
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        d="M82,75 Q98,75 95,95 L80,95 Z"
                    />
                </g>

                {/* Dashed Connecting Lines */}
                {paths.map((p, i) => (
                    <motion.path
                        key={i}
                        d={p}
                        custom={i}
                        variants={pathVariants}
                        initial="hidden"
                        animate="visible"
                        className="stroke-[#E55934] fill-none"
                        strokeDasharray="4 4"
                        strokeWidth="1.2"
                    />
                ))}

                {/* Decorative Icons from the Reference Image */}
                <foreignObject x="10" y="15" width="8" height="8">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        className="text-[#3A5A40] text-4xl opacity-40 group-hover:opacity-80 transition-opacity"
                    >
                        <FaCompass />
                    </motion.div>
                </foreignObject>
                <foreignObject x="75" y="40" width="8" height="8">
                    <div className="text-[#3A5A40] text-3xl opacity-30 group-hover:opacity-60 transition-opacity">
                        <FaCampground />
                    </div>
                </foreignObject>

                {/* Map Markers */}
                {markers.map((m) => (
                    <g
                        key={m.id}
                        className="cursor-pointer"
                        onMouseEnter={() => setHovered(m)}
                        onMouseLeave={() => setHovered(null)}
                    >
                        {/* Dynamic Glow for active points */}
                        <circle cx={m.x} cy={m.y} r="3.5" className="fill-white/50">
                            <animate attributeName="r" from="2" to="6" dur="2s" repeatCount="indefinite" />
                            <animate attributeName="opacity" from="1" to="0" dur="2s" repeatCount="indefinite" />
                        </circle>

                        {/* The Iconic Orange Pin */}
                        <motion.g
                            whileHover={{ scale: 1.4, y: -2 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                            <circle
                                cx={m.x} cy={m.y} r="2.8"
                                className={`transition-colors duration-300 ${hovered?.id === m.id ? 'fill-white' : 'fill-[#E55934]'} stroke-white stroke-[0.5] shadow-lg`}
                            />
                            <circle
                                cx={m.x} cy={m.y} r="1"
                                className={`transition-colors duration-300 ${hovered?.id === m.id ? 'fill-[#E55934]' : 'fill-white'}`}
                            />
                        </motion.g>
                    </g>
                ))}
            </svg>

            {/* Hover Info Tooltip */}
            <AnimatePresence>
                {hovered && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 10 }}
                        className="absolute z-50 bg-white border-2 border-[#E55934] p-4 rounded-3xl shadow-2xl pointer-events-none"
                        style={{
                            left: `${hovered.x}%`,
                            top: `${hovered.y}%`,
                            transform: 'translate(-50%, -130%)'
                        }}
                    >
                        <div className="flex flex-col gap-1 items-center">
                            <span className="text-[10px] font-black text-[#8BAC42] uppercase tracking-[0.2em]">Registry: {hovered.country}</span>
                            <h4 className="text-[#E55934] text-lg font-black uppercase leading-none">{hovered.name}</h4>
                            <div className="flex items-center gap-2 mt-2 bg-emerald-50 px-3 py-1 rounded-full">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[8px] text-emerald-800 font-bold uppercase tracking-widest">Active Expedition</span>
                            </div>
                        </div>
                        {/* Tooltip Arrow */}
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r-2 border-b-2 border-[#E55934] rotate-45" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Decorative Overlays */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-white/90 backdrop-blur-md border border-[#8BAC42]/30 px-6 py-2 rounded-full shadow-sm flex items-center gap-3"
                >
                    <div className="w-2 h-2 rounded-full bg-[#E55934] animate-ping" />
                    <span className="text-[#3A5A40] font-black uppercase tracking-[0.4em] text-[11px]">Hitrex Global Network</span>
                </motion.div>
            </div>

            <div className="absolute bottom-8 right-8">
                <div className="bg-white/90 backdrop-blur-md p-4 rounded-3xl border border-black/5 flex items-center gap-4">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-[#8BAC42] font-black uppercase">Live Nodes</span>
                        <span className="text-xl font-black text-zinc-900 leading-none">07</span>
                    </div>
                    <div className="w-[1px] h-8 bg-zinc-200" />
                    <p className="text-[10px] text-zinc-400 font-bold max-w-[100px] leading-tight">Syncing planetary archives for trekking routes.</p>
                </div>
            </div>
        </div>
    );
}
