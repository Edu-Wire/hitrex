"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FiArrowUpRight, FiMap, FiCompass, FiActivity, FiVolume2, FiVolumeX } from "react-icons/fi";
import { Oswald } from "next/font/google";
// import { motion, AnimatePresence } from "framer-motion";
import { motion, AnimatePresence, useScroll } from "framer-motion";


const heroHeadline = Oswald({
  subsets: ["latin"],
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
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const [soundOn, setSoundOn] = useState(false);

  useEffect(() => {
    const videoEl = videoRef.current;
    const audioEl = audioRef.current;
    if (!videoEl || !audioEl) return;

    const handlePause = () => {
      audioEl.pause();
      setSoundOn(false);
    };

    videoEl.addEventListener("pause", handlePause);

    return () => {
      videoEl.removeEventListener("pause", handlePause);
    };
  }, []);



  const toggleSound = async () => {
    const audioEl = audioRef.current;
    const videoEl = videoRef.current;
    if (!audioEl || !videoEl) return;

    try {
      if (soundOn) {
        audioEl.pause();
        setSoundOn(false);
      } else {
        audioEl.currentTime = videoEl.currentTime;
        audioEl.volume = 0.18;
        await audioEl.play(); // ✅ user interaction → allowed
        setSoundOn(true);
      }
    } catch (err) {
      console.error("Audio play failed:", err);
      setSoundOn(false);
    }
  };


  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-zinc-950">
      {/* Background Video with subtle zoom effect */}
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 10, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source
            src="https://res.cloudinary.com/dj5imyo2n/video/upload/v1768304612/258658_medium_mncdkm.mp4"
            type="video/mp4"
          />
        </video>


        <audio
          ref={audioRef}
          src="/sound/bird-sound-249237.mp3"
          loop
          preload="auto"
        />
      </motion.div>

      {/* Dynamic Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-black/90 via-black/40 to-transparent" />

      {/* Sound toggle overlay */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
        <button
          onClick={toggleSound}
          className="flex items-center justify-center px-3 sm:px-4 py-2.5 rounded-full bg-white text-black text-sm font-semibold shadow-lg hover:bg-emerald-100 border border-emerald-200"
        >
          {soundOn ? <FiVolume2 /> : <FiVolumeX />}
        </button>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16 min-h-[90vh] pt-24 sm:pt-32 md:pt-40">

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

          <h1
            className={`${heroHeadline.className} text-5xl sm:text-7xl lg:text-8xl font-bold leading-[0.9] text-white mb-6 uppercase tracking-tighter`}
          >
            CONQUER
            <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-emerald-400">
              THE UNKNOWN
            </span>
          </h1>


          <p className="text-base sm:text-lg text-gray-300 max-w-xl mb-8 sm:mb-10 font-light leading-relaxed">
            From vertical ascents to hidden valley trails, HITREX provides the gear and the guides to push your limits.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/page/destination"
              className="group relative inline-flex items-center gap-3 text-base sm:text-lg font-bold text-black bg-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-full transition-all hover:scale-105"
            >
              Start Trekking
              <FiArrowUpRight className="text-xl group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>

            {/* <button className="inline-flex items-center gap-3 text-white border border-white/20 hover:bg-white/10 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full transition-all">
              Watch Expedition
            </button> */}
          </div>
        </motion.div>

        {/* Right glass cards */}
        <HeroCards />
      </div>

      {/* Bottom decorative stats for 'Hiking' vibe */}

    </section>
  );
}

function HeroCards() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true); // default visible
  const [isMobile, setIsMobile] = useState(false);

  const { scrollY } = useScroll();

  // Detect mobile screen
  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  // Scroll-based visibility (ONLY mobile)
  useEffect(() => {
    if (!isMobile) {
      setVisible(true); // always visible on desktop
      return;
    }

    const unsubscribe = scrollY.on("change", (y) => {
      if (y > 30) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    });

    return () => unsubscribe();
  }, [scrollY, isMobile]);

  // Image slider
  useEffect(() => {
    const id = setInterval(() => {
      setIdx((i) => (i + 1) % slides.length);
    }, 4500);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      initial={false}
      animate={{
        opacity: visible ? 1 : 0,
        y: visible ? 0 : 220,
        scale: visible ? 1 : 0.85,
        rotate: visible ? 0 : 6,
      }}
      transition={{
        duration: 0.9,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="w-full lg:w-[420px] flex flex-col gap-4 pointer-events-auto"
    >
      {/* Main Glass Card */}
      <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-5 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
          <motion.div
            key={idx}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 4.5, ease: "linear" }}
            className="h-full bg-emerald-500"
          />
        </div>

        <div className="flex justify-between items-center mb-6 mt-2">
          <span className="flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest">
            LIVE PEAK
          </span>
          <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">
            {slides[idx].location}
          </span>
        </div>

        <div className="relative h-72 rounded-3xl overflow-hidden mb-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 1.15 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slides[idx].url})` }}
            />
          </AnimatePresence>

          <div className="absolute bottom-5 left-5 bg-black/60 backdrop-blur-xl px-4 py-2 rounded-xl border border-white/10">
            <span className="text-white text-[11px] font-bold">
              ALTITUDE: {slides[idx].elevation}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => document.getElementById("destinations")?.scrollIntoView({ behavior: "smooth" })}
            className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 py-4 rounded-2xl text-white text-xs font-bold border border-white/5"
          >
            VIEW TRAILS
          </button>
          <button
            onClick={() => document.getElementById("trips")?.scrollIntoView({ behavior: "smooth" })}
            className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 py-4 rounded-2xl text-white text-xs font-bold shadow-lg"
          >
            BOOK NOW
          </button>
        </div>
      </div>
    </motion.div>
  );
}

