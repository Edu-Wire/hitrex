"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiArrowUpRight, FiMap, FiCompass, FiActivity } from "react-icons/fi";
import { Oswald } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";

const heroHeadline = Oswald({
  subsets: ["latin"],
  weight: ["600", "700"],
});

const slides = [
  {
    url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&auto=format&fit=crop",
    location: "Karakoram Range",
    elevation: "6,500m"
  },
  {
    url: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&auto=format&fit=crop",
    location: "Alpine Lakes",
    elevation: "2,100m"
  },
  {
    url: "https://images.unsplash.com/photo-1470246973918-29a93221c455?w=1200&auto=format&fit=crop",
    location: "Black Forest Trail",
    elevation: "1,200m"
  },
  {
    url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&auto=format&fit=crop",
    location: "The Ridge Line",
    elevation: "4,800m"
  },
];

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-screen overflow-hidden -mt-24 pt-24 bg-zinc-950">
      {/* Background Video with subtle zoom effect */}
      <motion.div 
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 10, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <video
          className="w-full h-full object-cover"
          src="/176780-856056381_small.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
      </motion.div>
      
      {/* Dynamic Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-black/90 via-black/40 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16 min-h-[90vh]">
        
        {/* Left copy */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl text-left"
        >
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-2 text-emerald-400 font-bold tracking-widest uppercase text-xs mb-4"
          >
            <FiCompass className="animate-spin-slow" /> 
            Adventure Awaits
          </motion.div>
          
          <h1 className={`${heroHeadline.className} text-6xl sm:text-7xl lg:text-8xl font-bold leading-[0.9] text-white mb-6 uppercase`}>
            CONQUER <br /> <span className="text-transparent border-t border-b border-white/30 bg-clip-text bg-gradient-to-r from-white to-gray-500">THE UNKNOWN</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-300 max-w-lg mb-10 font-light leading-relaxed">
            From vertical ascents to hidden valley trails, HITREX provides the gear and the guides to push your limits.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/page/destination"
              className="group relative inline-flex items-center gap-3 text-lg font-bold text-black bg-white px-8 py-4 rounded-full transition-all hover:scale-105"
            >
              Start Trekking
              <FiArrowUpRight className="text-xl group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
            
            <button className="inline-flex items-center gap-3 text-white border border-white/20 hover:bg-white/10 px-8 py-4 rounded-full transition-all">
              Watch Expedition
            </button>
          </div>
        </motion.div>

        {/* Right glass cards */}
        <HeroCards />
      </div>

      {/* Bottom decorative stats for 'Hiking' vibe */}
      <div className="absolute bottom-10 left-0 w-full hidden md:block">
        <div className="max-w-7xl mx-auto px-8 flex gap-12 text-white/40 text-xs tracking-widest uppercase">
          <div className="flex flex-col"><span>Lat: 45.8327° N</span><span>Lon: 6.8651° E</span></div>
          <div className="flex flex-col"><span>Conditions: Clear</span><span>Temp: -4°C</span></div>
          <div className="flex flex-col"><span>HITREX Official Partner</span><span>Est. 2024</span></div>
        </div>
      </div>
    </section>
  );
}

function HeroCards() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIdx((i) => (i + 1) % slides.length);
    }, 4500);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="w-full lg:w-[400px] flex flex-col gap-4"
    >
      {/* Main Glass Card */}
      <div className="group bg-white/5 border border-white/10 rounded-3xl p-4 shadow-2xl backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-white/10">
            <motion.div 
                key={idx}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 4.5, ease: "linear" }}
                className="h-full bg-emerald-500"
            />
        </div>

        <div className="flex items-center justify-between text-white/80 mb-4 mt-2">
          <span className="flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
            <FiActivity /> Live Peak View
          </span>
          <span className="text-[10px] uppercase font-medium">{slides[idx].location}</span>
        </div>

        <div className="relative w-full h-56 rounded-2xl overflow-hidden mb-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.7 }}
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${slides[idx].url})` }}
            />
          </AnimatePresence>
          <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-md px-3 py-1 rounded-md border border-white/10">
             <p className="text-white text-[10px] font-mono">ELV: {slides[idx].elevation}</p>
          </div>
        </div>
      </div>

      {/* Adventure Navigation Grid */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Trail Maps", icon: <FiMap />, href: "/#destinations" },
          { label: "Book Trip", icon: <FiActivity />, href: "/#trips" },
        ].map((item, i) => (
          <motion.div
            whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.15)" }}
            key={item.label}
          >
            <Link
                href={item.href}
                className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-2xl py-4 text-white text-sm font-semibold transition"
            >
                {item.icon}
                {item.label}
            </Link>
          </motion.div>
        ))}
      </div>

      <Link
        href="/#trips"
        className="relative group bg-emerald-600 rounded-2xl px-5 py-5 text-white font-bold hover:bg-emerald-500 transition shadow-xl overflow-hidden text-center uppercase tracking-widest text-xs"
      >
        <span className="relative z-10">Start Your Expedition</span>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </Link>
    </motion.div>
  );
}