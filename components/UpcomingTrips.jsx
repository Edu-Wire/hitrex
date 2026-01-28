"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { FiArrowLeft, FiArrowRight, FiCalendar, FiMapPin, FiActivity } from "react-icons/fi";
import { FaMountain, FaCompass } from "react-icons/fa";
import { Oswald } from "next/font/google";


const oswald = Oswald({ subsets: ["latin"], weight: ["600", "700"] });

export default function UpcomingTrips() {
  const [trips, setTrips] = useState(fallbackTrips);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchTrips = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/upcoming-trips", { cache: "no-store" });
        const data = await response.json();
        const apiTrips = Array.isArray(data?.trips) ? data.trips : [];

        if (!isMounted) return;

        if (apiTrips.length > 0) {
          setTrips(apiTrips);
          setError(null);
        } else {
          setTrips(fallbackTrips);
        }
      } catch (err) {
        if (!isMounted) return;
        console.error(err);
        setTrips(fallbackTrips);
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

  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Responsive Stack Physics
  const getCardStyle = (offset) => {
    const isMobile = windowWidth < 640;
    const depth = Math.min(offset, 3);

    return {
      x: offset === 0 ? 0 : offset * (isMobile ? 15 : 40),
      y: offset === 0 ? 0 : offset * (isMobile ? -8 : -15),
      scale: 1 - offset * 0.05,
      rotate: offset === 0 ? 0 : offset * 2,
      opacity: offset === 0 ? 1 : 0.4 - offset * 0.1,
      zIndex: total - offset,
    };
  };

  const handleNext = () => setCurrent((c) => (c + 1) % total);
  const handlePrev = () => setCurrent((c) => (c - 1 + total) % total);

  return (
    <section className="relative py-10 sm:py-14 px-4 sm:px-6 overflow-hidden bg-zinc-950">
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
        <div className="grid lg:grid-cols-[0.8fr_1.2fr] items-center gap-12 lg:gap-16">

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 text-emerald-500 text-xs tracking-widest uppercase">
              <FaCompass className="animate-spin-slow" />
              Next Deployment
            </div>
            <h2 className={`${oswald.className} text-5xl sm:text-7xl lg:text-8xl font-bold text-white uppercase leading-[0.9] tracking-tighter`}>
              UPCOMING <br /> <span className="text-emerald-500">TRIPS</span>
            </h2>
            <p className="text-zinc-400 text-lg max-w-md leading-relaxed">
              Real-time upcoming departures. Our technical teams are currently prepping gear for these high-altitude routes.
            </p>
            {loading && (
              <p className="text-zinc-500 text-xs">Refreshing itineraries...</p>
            )}

            <div className="hidden sm:flex gap-4 pt-6">
              <button
                onClick={handlePrev}
                className="group h-12 w-12 sm:h-14 sm:w-14 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-white transition-all hover:bg-emerald-600 hover:border-emerald-500"
              >
                <FiArrowLeft className="text-xl group-hover:-translate-x-1 transition-transform" />
              </button>
              <button
                onClick={handleNext}
                className="group h-12 w-12 sm:h-14 sm:w-14 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-white transition-all hover:bg-emerald-600 hover:border-emerald-500"
              >
                <FiArrowRight className="text-xl group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>

          <div className="relative min-h-[560px] sm:min-h-[600px] lg:h-[650px] w-full flex items-center justify-center lg:justify-start md:pl-12 lg:pl-20">
            <AnimatePresence mode="popLayout">
              {trips.length > 0 && Array.from({ length: visibleCount }).map((_, layerIdx) => {
                const tripIndex = (current + layerIdx) % total;
                const trip = trips[tripIndex];
                if (!trip) return null;
                const style = getCardStyle(layerIdx);
                const isTop = layerIdx === 0;

                return (
                  <motion.div
                    key={`${trip.id || trip._id}-${tripIndex}`}
                    initial={{ opacity: 0, scale: 0.8, x: 200 }}
                    animate={style}
                    exit={{ opacity: 0, scale: 1.1, x: -200, rotate: -10 }}
                    transition={{ type: "spring", stiffness: 200, damping: 25 }}
                    drag={isTop ? "x" : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.6}
                    onDragEnd={(e, { offset }) => {
                      if (offset.x < -100) handleNext();
                      else if (offset.x > 100) handlePrev();
                    }}
                    whileTap={isTop ? { cursor: "grabbing" } : {}}
                    className={`absolute w-full max-w-[360px] sm:max-w-[420px] lg:max-w-[480px] ${isTop ? 'cursor-grab touch-pan-y' : ''}`}
                  >
                    <div className={`relative h-[500px] sm:h-[550px] lg:h-[600px] rounded-[2rem] overflow-hidden border ${isTop ? 'border-emerald-500/50 shadow-[0_0_50px_-12px_rgba(16,185,129,0.3)]' : 'border-white/10'} bg-zinc-900 flex flex-col`}>

                      <div className="relative h-44 sm:h-64 w-full flex-none">
                        <Image
                          src={trip.image || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800"}
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

                      <div className="p-5 sm:p-8 space-y-2 sm:space-y-4 flex flex-col flex-1">
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
                                <span className="text-white text-xs">{trip.date}</span>
                              </div>
                              <div className="h-8 w-px bg-white/10" />
                              <div className="flex flex-col">
                                <span className="text-zinc-600 text-[10px] uppercase font-bold">Duration</span>
                                <span className="text-white text-xs">{trip.duration}</span>
                              </div>
                            </div>
                            <button className="w-full mt-auto py-3 sm:py-4 rounded-xl bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all duration-300">
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

const fallbackTrips = [
  {
    id: "trip-1",
    name: "Matterhorn Summit",
    location: "Swiss Alps",
    date: "Aug 2024",
    duration: "6 Days",
    image: "https://images.unsplash.com/photo-1502926535242-4382295d8338?w=800",
    description: "A technical ascent of the mountain of mountains. Requires high level of fitness and previous alpine experience."
  },
  {
    id: "trip-2",
    name: "Everest Base Camp",
    location: "Khumbu Region",
    date: "Sep 2024",
    duration: "14 Days",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800",
    description: "The classic trek to the foot of the world's highest peak. Incredible Sherpa culture and mountain vistas."
  }
];