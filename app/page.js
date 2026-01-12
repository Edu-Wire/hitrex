"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Oswald, Playfair_Display } from "next/font/google";
import {
  FaCompass,
  FaHiking,
  FaCampground,
  FaRoute,
  FaMountain,
  FaClock,
  FaCloudSun,
  FaTools,
  FaFirstAid,
  FaExclamationTriangle, // ✅ added
  FaAngleRight,          // ✅ added
} from "react-icons/fa";


import HeroSection from "@/components/HeroSection";
import UpcomingTrips from "@/components/UpcomingTrips";
import destinations from "@/data/destinations";
import { PageTransition, StaggerContainer } from "@/components/animations";

const oswald = Oswald({ subsets: ["latin"], weight: ["400", "700"] });
const displaySerif = Playfair_Display({ subsets: ["latin"], weight: ["600"] });

export default function Home() {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);

  return (
    <PageTransition>
      <main
        ref={containerRef}
        className="relative min-h-screen w-full bg-[#0a0a0a] overflow-hidden -mt-24 md:-mt-28"
      >
        {/* ================= HERO ================= */}
        <HeroSection />

        {/* ================= DESTINATIONS ================= */}
        <section
          id="destinations"
          className="relative w-full pt-40 pb-32 bg-zinc-100 rounded-t-[4rem] mt-0 z-20"
        >
          <div className="max-w-7xl mx-auto px-6 mb-16">
            <motion.div style={{ y: y1 }}>
              <h2
                className={`${oswald.className} text-6xl md:text-8xl font-bold text-zinc-900 uppercase tracking-tight`}
              >
                Prime <br />
                <span className="text-emerald-600">Terrains</span>
              </h2>
            </motion.div>
          </div>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-6 max-w-7xl mx-auto">
            {destinations.slice(0, 4).map((dest, index) => (
              <DestinationCardFlip key={dest.id} dest={dest} index={index} />
            ))}
          </StaggerContainer>
        </section>

        {/* ================= UPCOMING TRIPS ================= */}
        <section id="trips" className="bg-zinc-900 py-24 text-white">
          <UpcomingTrips />
        </section>

        {/* ================= DIFFICULTY ================= */}
        <section id="difficulty" className="relative py-32 bg-white overflow-hidden">
               {/* Decorative Topography Pattern */}
               <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/topography.png')]" />
               
               <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
                 <motion.div 
                   initial={{ opacity: 0, x: -30 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   viewport={{ once: true }}
                   className="space-y-6"
                 >
                   <span className="text-emerald-600 font-mono text-sm tracking-[0.3em] uppercase block font-bold">
                     // Technical Grading
                   </span>
                   <h2 className={`${displaySerif.className} text-5xl md:text-7xl font-bold text-gray-900 leading-tight`}>
                     Measure Your <br /> Grit.
                   </h2>
                   <p className="text-gray-600 text-lg leading-relaxed max-w-md">
                     Our trails are rated using the HITREX standard, analyzing vertical gain, oxygen levels, and technical demand.
                   </p>
                   <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100 max-w-sm">
                       <FaExclamationTriangle className="text-amber-500" />
                       <p className="text-xs text-amber-800 font-medium">Always check local weather warnings before departure.</p>
                   </div>
                 </motion.div>
       
                 <div className="space-y-4">
                   {difficultyData.map((item, idx) => (
                     <motion.div
                       key={item.title}
                       initial={{ opacity: 0, y: 20 }}
                       whileInView={{ opacity: 1, y: 0 }}
                       transition={{ delay: idx * 0.1 }}
                       viewport={{ once: true }}
                       className={`group relative flex items-center justify-between p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer ${item.color}`}
                     >
                       <div className="flex items-start gap-4">
                         <span className={`h-3 w-3 mt-2 rounded-full ${item.dot} shadow-lg`} />
                         <div>
                           <h4 className={`${oswald.className} text-xl uppercase font-bold text-zinc-900`}>{item.title}</h4>
                           <p className="text-sm text-gray-600 mt-1 max-w-xs">{item.text}</p>
                         </div>
                       </div>
                       <div className="text-right hidden sm:block">
                           <span className="text-[10px] font-mono text-gray-400 block uppercase mb-1">Threshold</span>
                           <span className="text-sm font-bold text-zinc-900">{item.stats}</span>
                       </div>
                     </motion.div>
                   ))}
                 </div>
               </div>
             </section>

        {/* ================= INSIGHTS ================= */}
       <section id="insights" className="relative py-32 bg-zinc-950 text-white">
             <div className="max-w-7xl mx-auto px-6">
               <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                 <div className="space-y-4">
                   <span className="text-emerald-500 font-mono text-sm uppercase font-bold tracking-widest">
                     // Strategic Briefing
                   </span>
                   <h2 className={`${displaySerif.className} text-5xl md:text-6xl font-bold leading-tight`}>
                     Expedition Intel
                   </h2>
                 </div>
                 <p className="text-zinc-400 max-w-xs text-sm leading-relaxed pb-2 border-b border-zinc-800">
                     Plan smarter with technical understanding and preparation tips from the HITREX lead explorers.
                 </p>
               </div>
     
               <div className="grid md:grid-cols-3 gap-6">
                 {insightData.map((item, idx) => (
                   <motion.div
                     key={item.title}
                     initial={{ opacity: 0, scale: 0.95 }}
                     whileInView={{ opacity: 1, scale: 1 }}
                     transition={{ delay: idx * 0.1 }}
                     viewport={{ once: true }}
                     className={`group p-8 rounded-3xl border-2 ${item.color} hover:border-emerald-500/50 transition-all duration-500 flex flex-col justify-between h-full`}
                   >
                     <div>
                       <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 text-2xl mb-6 group-hover:bg-emerald-500 group-hover:text-black transition-all duration-500">
                         {item.icon}
                       </div>
                       <h4 className={`${oswald.className} text-2xl uppercase font-bold mb-3`}>{item.title}</h4>
                       <p className="text-zinc-400 text-sm leading-relaxed">{item.text}</p>
                     </div>
                     
                     <button className="mt-8 flex items-center gap-2 text-xs font-bold text-emerald-500 uppercase tracking-widest group-hover:gap-4 transition-all">
                         Full Protocol <FaAngleRight />
                     </button>
                   </motion.div>
                 ))}
               </div>
             </div>
           </section>
      </main>
    </PageTransition>
  );
}

/* ================= DESTINATION CARD ================= */

function DestinationCardFlip({ dest, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group h-[520px] [perspective:1500px]"
    >
      <div className="relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
        {/* FRONT */}
        <div className="absolute inset-0 backface-hidden rounded-3xl overflow-hidden shadow-xl">
          <Image
            src={dest.image}
            alt={dest.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-8 left-6">
            <h3
              className={`${oswald.className} text-3xl text-white font-bold`}
            >
              {dest.name}
            </h3>
            <p className="text-sm text-zinc-300">{dest.location}</p>
          </div>
        </div>

        {/* BACK */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-3xl bg-zinc-900 p-6 flex flex-col justify-between">
          <div>
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FaMountain className="text-emerald-500" />
              Technical Intel
            </h4>

            <p className="text-sm text-zinc-400 italic">
              {dest.description}
            </p>

            <div className="mt-6 space-y-3">
              <Info icon={<FaRoute />} label="Route" value="Scrambling" />
              <Info icon={<FaClock />} label="Duration" value="14–18 Days" />
            </div>
          </div>

          <button className="bg-emerald-600 hover:bg-emerald-500 transition text-white py-3 rounded-lg text-xs uppercase tracking-widest">
            Initialize Booking
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function Info({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 text-sm text-white">
      <span className="text-emerald-500">{icon}</span>
      <span className="text-zinc-400">{label}:</span>
      <span>{value}</span>
    </div>
  );
}

/* ================= DATA ================= */

const difficultyData = [
  { 
    title: "Class 1: Casual", 
    color: "border-green-500/20 bg-green-500/5", 
    dot: "bg-green-500", 
    text: "Well-marked trails with flat terrain. Suitable for all fitness levels and families.",
    stats: "0-200m Elevation"
  },
  { 
    title: "Class 3: Technical", 
    color: "border-yellow-500/20 bg-yellow-500/5", 
    dot: "bg-yellow-500", 
    text: "Scrambling required. Steep inclines with uneven surfaces. High fitness required.",
    stats: "500-1200m Elevation"
  },
  { 
    title: "Class 5: Extreme", 
    color: "border-red-500/20 bg-red-500/5", 
    dot: "bg-red-500", 
    text: "Vertical ascents and technical gear required. Only for certified mountaineers.",
    stats: "2000m+ Vertical"
  },
];

const insightData = [
  { 
    title: "Atmospheric Gear", 
    icon: <FaCloudSun />,
    color: "bg-zinc-900 border-zinc-800", 
    text: "Layering systems are vital. High-altitude weather can shift 20°C in under an hour." 
  },
  { 
    title: "Maintenance Kit", 
    icon: <FaTools />,
    color: "bg-zinc-900 border-zinc-800", 
    text: "Carry a multi-tool and repair tape for gear malfunctions in remote zones." 
  },
  { 
    title: "Wilderness First Aid", 
    icon: <FaFirstAid />,
    color: "bg-zinc-900 border-zinc-800", 
    text: "Basic trauma and altitude sickness training is mandatory for Class 3+ trails." 
  },
];