"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";
import { Oswald } from "next/font/google";

const heroHeadline = Oswald({
  subsets: ["latin"],
  weight: ["600", "700"],
});

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative w-full min-h-screen overflow-hidden -mt-24 pt-24">
      {/* Background */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="/176780-856056381_small.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16 min-h-[80vh]">
        {/* Left copy */}
        <div
          className={`max-w-2xl text-left transform transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <h1
            className={`${heroHeadline.className} text-6xl sm:text-5xl lg:text-6xl font-semibold leading-tight text-white mb-6 uppercase tracking-tight`}
          >
            Find Your Spirit On The Highest Peaks
          </h1>
          <p className={ `text-lg ${heroHeadline.className} sm:text-xl text-gray-200 max-w-xl mb-8` }>
          Uncover hidden trails, majestic peaks, and wild adventures that push your limits.
          </p>
          <Link
            href="/page/destination"
            className="inline-flex items-center gap-3 text-lg font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/30 px-5 py-3 rounded-full transition"
          >
            Explore HITREX 
            <FiArrowUpRight className="text-xl" />
          </Link>
        </div>

        {/* Right glass cards */}
        <HeroCards isVisible={isVisible} />
      </div>
    </section>
  );
}

const slides = [
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&auto=format&fit=crop", // hikers on a peak
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&auto=format&fit=crop", // alpine lake trail
  "https://images.unsplash.com/photo-1470246973918-29a93221c455?w=1200&auto=format&fit=crop", // misty forest adventure
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&auto=format&fit=crop", // ridge hiking silhouettes
];

function HeroCards({ isVisible }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIdx((i) => (i + 1) % slides.length);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className={`w-full lg:w-[420px] flex flex-col gap-4 transform transition-all duration-1000 delay-200 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
    >
      <div className="bg-white/10 border border-white/15 rounded-2xl p-5 shadow-2xl backdrop-blur">
        <div className="flex items-center justify-between text-sm text-white/80 mb-4">
          <span className="px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold">
            Must-See
          </span>
          <span className="text-white/80 text-xs">Sheikh Zayed Grand Mosque</span>
        </div>
        <div className="w-full h-44 rounded-xl overflow-hidden bg-white/10 mb-4">
          <div
            className="w-full h-full bg-cover bg-center transition-all duration-700"
            style={{ backgroundImage: `url(${slides[idx]})` }}
          />
        </div>
        <div className="text-sm text-white/80 font-semibold">3 / 7</div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Highlights", href: "/#destinations" },
          { label: "Upcoming Trips", href: "/#trips" },
          { label: "Trail Levels", href: "/#difficulty" },
          { label: "Gear & Tips", href: "/#insights" },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="bg-white/10 border border-white/15 rounded-xl px-4 py-3 text-white font-semibold hover:bg-white/20 transition shadow-lg shadow-black/10 text-center"
          >
            {item.label}
          </Link>
        ))}
      </div>

      <Link
        href="/#trips"
        className="bg-white/10 border border-white/15 rounded-xl px-5 py-4 text-white font-semibold hover:bg-white/20 transition shadow-lg shadow-black/10 text-center"
      >
        Start planning
      </Link>
    </div>
  );
}
