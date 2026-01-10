"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { FiArrowLeft, FiArrowRight, FiCalendar, FiClock } from "react-icons/fi";
import { FaGlobeAmericas } from "react-icons/fa";
import upcomingTrips from "../data/upcomingTrips";

export default function UpcomingTrips() {
  const [current, setCurrent] = useState(0);
  const [showControls, setShowControls] = useState(false);

  const cards = upcomingTrips.map((trip, idx) => ({
    ...trip,
    displayTitle: idx === 0 ? "National Cuisine" : trip.name,
    blurb:
      idx === 0
        ? "Discover authentic flavors, regional spices, and culinary stories from the heart of each destination."
        : trip.description,
  }));

  const total = cards.length;
  const visibleCount = Math.min(total, 4);

  const getCardStyle = (offset) => {
    const depth = Math.min(offset, 3);
    const baseOpacity = Math.max(0.25, 0.6 - depth * 0.12);
    return {
      x: offset === 0 ? 0 : -depth * 26,
      y: depth * 10,
      scale: offset === 0 ? 1 : 1 - depth * 0.07,
      rotate: offset === 0 ? 0 : -depth * 2.5,
      opacity: offset === 0 ? 1 : baseOpacity,
      visibility: "visible",
      zIndex: total - offset,
      pointerEvents: offset === 0 ? "auto" : "none",
    };
  };

  const handleNext = () => setCurrent((c) => (c + 1) % total);
  const handlePrev = () => setCurrent((c) => (c - 1 + total) % total);

  return (
    <section
      className="relative py-16 px-6 text-slate-900 overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(10,12,16,0.72), rgba(10,12,16,0.72)),
          url("https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=2000&auto=format&fit=crop")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid md:grid-cols-[0.55fr_1.45fr] items-center gap-10 mb-10">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Upcoming Trips
            </h2>
            <p className="text-white/80 text-base md:text-lg max-w-xl leading-relaxed">
              Handpicked adventures rotating through the stack. Swipe through to find your next escape.
            </p>
          </div>

          <div
            className="relative h-[500px] flex items-center justify-center"
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
          >
            <button
              onClick={handlePrev}
              aria-label="Previous card"
              className={`absolute left-2 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full border border-white/30 bg-white/15 text-white flex items-center justify-center transition duration-200 ${
                showControls ? "opacity-100" : "opacity-0"
              }`}
            >
              <FiArrowLeft />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next card"
              className={`absolute right-2 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full border border-white/30 bg-white text-slate-900 flex items-center justify-center shadow-md transition duration-200 ${
                showControls ? "opacity-100" : "opacity-0"
              }`}
            >
              <FiArrowRight />
            </button>

            {Array.from({ length: visibleCount }).map((_, layerIdx) => {
              const tripIndex = (current + layerIdx) % total;
              const trip = cards[tripIndex];
              const style = getCardStyle(layerIdx);
              const isTop = layerIdx === 0;
              const initialFromBack =
                layerIdx === visibleCount - 1
                  ? { opacity: 0, x: 80, y: -30, scale: 0.9 }
                  : { opacity: 0, x: 30, y: 40, scale: 0.95 };

              return (
                <motion.div
                  key={`${trip.id}-${layerIdx}`}
                  layout
                  initial={initialFromBack}
                  animate={{
                    x: style.x,
                    y: style.y,
                    scale: style.scale,
                    rotate: style.rotate,
                    opacity: style.opacity,
                  }}
                  transition={{ type: "spring", stiffness: 170, damping: 22, mass: 1.15 }}
                  style={{
                    zIndex: style.zIndex,
                    pointerEvents: style.pointerEvents,
                    visibility: style.visibility,
                  }}
                  className="absolute w-full max-w-xl"
                >
                  {isTop ? (
                    <div className="relative h-[420px] rounded-3xl bg-white shadow-2xl shadow-black/20 border border-white/60 overflow-hidden">
                      <div className="relative h-56 w-full overflow-hidden">
                        <Image
                          src={trip.image}
                          alt={trip.displayTitle}
                          fill
                          className="object-cover"
                          sizes="480px"
                          priority={layerIdx < 2}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
                        <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between">
                          <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-white/70">
                              {trip.location}
                            </p>
                            <h3 className="text-2xl font-semibold drop-shadow-sm text-white">
                              {trip.displayTitle}
                            </h3>
                          </div>
                          <div className="h-11 w-11 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-md">
                            <FaGlobeAmericas />
                          </div>
                        </div>
                      </div>

                      <div className="p-6 space-y-3">
                        <p className="text-sm text-slate-700 leading-relaxed line-clamp-3">
                          {trip.blurb}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span className="inline-flex items-center gap-1">
                            <FiCalendar className="text-slate-700" /> {trip.date}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <FiClock className="text-slate-700" /> {trip.duration}
                          </span>
                        </div>
                        <button className="mt-3 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-slate-900 text-white text-sm font-semibold transition shadow-lg hover:bg-slate-800">
                          Learn More <FiArrowRight />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="relative h-[420px] rounded-3xl bg-white shadow-xl shadow-black/10 border border-white/50 overflow-hidden">
                      <div className="relative h-full w-full">
                        <Image
                          src={trip.image}
                          alt={trip.displayTitle}
                          fill
                          className="object-cover"
                          sizes="480px"
                        />
                        <div className="absolute inset-0 bg-white/65 backdrop-blur-sm" />
                        <div className="absolute bottom-4 left-5 right-5 text-slate-900 text-sm font-semibold">
                          {trip.displayTitle}
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
