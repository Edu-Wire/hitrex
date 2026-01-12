"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { FiArrowLeft, FiArrowRight, FiCalendar, FiMapPin, FiActivity } from "react-icons/fi";
import { FaMountain, FaCompass } from "react-icons/fa";
import { Oswald } from "next/font/google";
import staticUpcomingTrips from "../data/upcomingTrips";

const oswald = Oswald({ subsets: ["latin"], weight: ["600", "700"] });

export default function UpcomingTrips() {
  const [trips, setTrips] = useState(staticUpcomingTrips);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchTrips = async () => {
      try {
        const response = await fetch("/api/upcoming-trips", { cache: "no-store" });

        if (!response.ok) {
          throw new Error("Failed to fetch upcoming trips");
        }

        const data = await response.json();
        const apiTrips = Array.isArray(data?.trips) ? data.trips : [];

        if (!isMounted) return;

        if (apiTrips.length) {
          setTrips(apiTrips);
          setCurrent(0);
          setError(null);
        } else {
          setTrips(staticUpcomingTrips);
          setError("Live trips unavailable, showing defaults.");
        }
      } catch (err) {
        if (!isMounted) return;
        console.error(err);
        setTrips(staticUpcomingTrips);
        setError("Live trips unavailable, showing defaults.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTrips();

    return () => {
      isMounted = false;
    };
  }, []);

  const total = trips.length;
  const visibleCount = Math.min(total, 4);

  // Advanced Stack Physics
  const getCardStyle = (offset) => {
    const depth = Math.min(offset, 3);
    return {
      x: offset === 0 ? 0 : offset * 40, // Stagger to the right
      y: offset === 0 ? 0 : offset * -15, // Lift up slightly
      scale: 1 - offset * 0.05,
      rotate: offset === 0 ? 0 : offset * 2,
      opacity: offset === 0 ? 1 : 0.4 - offset * 0.1,
      zIndex: total - offset,
    };
  };

  const handleNext = () => setCurrent((c) => (c + 1) % total);
  const handlePrev = () => setCurrent((c) => (c - 1 + total) % total);

  return (
    <section className="relative py-24 px-6 overflow-hidden bg-zinc-950">
      {/* Cinematic Background with Topo Pattern Overlay */}
      <div className="absolute inset-0 z-0">
        <Image 
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=2000" 
            fill 
            className="object-cover opacity-20 grayscale"
            alt="Mountain Background"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent" />
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/topography.png')]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-[0.8fr_1.2fr] items-center gap-16">
          
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 text-emerald-500 font-mono text-xs tracking-widest uppercase">
                <FaCompass className="animate-spin-slow" />
                Next Deployment
            </div>
            <h2 className={`${oswald.className} text-5xl md:text-7xl font-bold text-white uppercase leading-[0.9]`}>
              Live <br /> <span className="text-emerald-500">Expeditions</span>
            </h2>
              <p className="text-zinc-400 text-lg max-w-md leading-relaxed">
              Real-time upcoming departures. Our technical teams are currently prepping gear for these high-altitude routes.
            </p>
            {error && (
              <p className="text-amber-500 text-sm">{error}</p>
            )}
            {loading && (
              <p className="text-zinc-500 text-xs">Refreshing itineraries...</p>
            )}
            
            {/* Custom Navigation Bricks */}
            <div className="flex gap-4 pt-6">
              <button
                onClick={handlePrev}
                className="group h-14 w-14 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-white transition-all hover:bg-emerald-600 hover:border-emerald-500"
              >
                <FiArrowLeft className="text-xl group-hover:-translate-x-1 transition-transform" />
              </button>
              <button
                onClick={handleNext}
                className="group h-14 w-14 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-white transition-all hover:bg-emerald-600 hover:border-emerald-500"
              >
                <FiArrowRight className="text-xl group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>

          {/* Right Card Stack */}
          <div className="relative h-[550px] w-full flex items-center justify-center lg:justify-start lg:pl-20">
            <AnimatePresence mode="popLayout">
              {Array.from({ length: visibleCount }).map((_, layerIdx) => {
                const tripIndex = (current + layerIdx) % total;
                const trip = trips[tripIndex];
                const style = getCardStyle(layerIdx);
                const isTop = layerIdx === 0;

                return (
                  <motion.div
                    key={`${trip.id}-${tripIndex}`}
                    initial={{ opacity: 0, scale: 0.8, x: 200 }}
                    animate={style}
                    exit={{ opacity: 0, scale: 1.1, x: -200, rotate: -10 }}
                    transition={{ type: "spring", stiffness: 200, damping: 25 }}
                    className="absolute w-full max-w-[480px]"
                  >
                    <div className={`relative h-[480px] rounded-[2rem] overflow-hidden border ${isTop ? 'border-emerald-500/50 shadow-[0_0_50px_-12px_rgba(16,185,129,0.3)]' : 'border-white/10'} bg-zinc-900`}>
                      
                      {/* Card Visual */}
                      <div className="relative h-64 w-full">
                        <Image
                          src={trip.image}
                          alt={trip.name}
                          fill
                          className={`object-cover ${!isTop && 'grayscale opacity-50'}`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
                        
                        {isTop && (
                            <div className="absolute top-6 right-6 bg-emerald-500 text-black px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter flex items-center gap-2">
                                <FiActivity className="animate-pulse" /> Limited Slots
                            </div>
                        )}
                      </div>

                      {/* Card Content */}
                      <div className="p-8 space-y-4">
                        <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-bold uppercase tracking-[0.2em]">
                            <FiMapPin /> {trip.location}
                        </div>
                        <h3 className={`${oswald.className} text-3xl font-bold text-white uppercase tracking-tight`}>
                          {trip.name}
                        </h3>
                        
                        {isTop && (
                          <>
                            <p className="text-zinc-400 text-sm line-clamp-2 font-light leading-relaxed">
                                {trip.description}
                            </p>
                            <div className="flex items-center gap-6 pt-2">
                                <div className="flex flex-col">
                                    <span className="text-zinc-600 text-[10px] uppercase font-bold">Departure</span>
                                    <span className="text-white text-xs font-mono">{trip.date}</span>
                                </div>
                                <div className="h-8 w-px bg-white/10" />
                                <div className="flex flex-col">
                                    <span className="text-zinc-600 text-[10px] uppercase font-bold">Duration</span>
                                    <span className="text-white text-xs font-mono">{trip.duration}</span>
                                </div>
                            </div>
                            <button className="w-full mt-4 py-4 rounded-xl bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all duration-300">
                                Reserve Gear Spot
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}