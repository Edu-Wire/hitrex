"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Footer from "@/components/Footer";

gsap.registerPlugin(ScrollTrigger);

export default function TripsPage() {
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadActivities = async () => {
      try {
        const res = await fetch("/api/activities", {
          signal: controller.signal,
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to fetch activities");
        const data = await res.json();
        const apiActivities = Array.isArray(data?.activities)
          ? data.activities
          : [];
        if (!controller.signal.aborted) {
          setTrips(apiActivities);
          setError(apiActivities.length ? null : "No activities found.");
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error(err);
          setTrips([]);
          setError("Unable to load activities.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadActivities();
    return () => controller.abort();
  }, []);

  // Hero animation and global scroll effects run immediately on mount
  useEffect(() => {
    const ctx = gsap.context(() => {
      
      // 1. Animate "OUR" from Top (Upwards) - SMOOTHED
      const charsUp = gsap.utils.toArray(".char-up");
      gsap.fromTo(
        charsUp,
        { yPercent: -110, opacity: 0 }, // Using yPercent for better performance
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.5, // Slower for smoothness
          stagger: 0.08, // More distinct wave
          ease: "power4.out", // Ultra smooth deceleration
          delay: 0.2,
        }
      );

      // 2. Animate "TRIPS" from Bottom (Downwards) - SMOOTHED
      const charsDown = gsap.utils.toArray(".char-down");
      gsap.fromTo(
        charsDown,
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.5,
          stagger: 0.08,
          ease: "power4.out",
          delay: 0.2, 
        }
      );

      let proxy = { skew: 0 },
        skewSetter = gsap.quickSetter(".skew-elem", "skewY", "deg"),
        clamp = gsap.utils.clamp(-2, 2);

      ScrollTrigger.create({
        onUpdate: (self) => {
          let skew = clamp(self.getVelocity() / -500);
          if (Math.abs(skew) > Math.abs(proxy.skew)) {
            proxy.skew = skew;
            gsap.to(proxy, {
              skew: 0,
              duration: 0.8,
              ease: "power3",
              overwrite: true,
              onUpdate: () => skewSetter(proxy.skew),
            });
          }
        },
      });

      gsap.to(".hero-title", {
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
        y: 200,
        opacity: 0,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Section reveals wait for trips to load
  useEffect(() => {
    if (!trips.length) return;

    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray(".trip-section");
      sections.forEach((section) => {
        const revealImages = section.querySelectorAll(".reveal-img");
        const revealText = section.querySelector(".reveal-text");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "top 20%",
            toggleActions: "play none none reverse",
          },
        });

        tl.fromTo(
          revealText,
          { x: -50, opacity: 0 },
          { x: 0, opacity: 1, duration: 1.2, ease: "power3.out" } // Smoothed
        ).fromTo(
          revealImages,
          { clipPath: "inset(0 100% 0 0)", scale: 1.3 },
          {
            clipPath: "inset(0 0% 0 0)",
            scale: 1,
            duration: 1.4, // Smoothed
            ease: "power4.inOut",
            stagger: 0.2,
          },
          "-=1.0"
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, [trips]);

  // Helper function to split text into characters with custom class support
  const splitText = (text, customClass) => {
    return text.split("").map((char, i) => (
      <span key={i} className="inline-block overflow-hidden h-fit leading-none px-1 md:px-2">
        {/* Added will-change-transform for performance */}
        <span className={`${customClass} inline-block will-change-transform`}>
          {char === " " ? "\u00A0" : char}
        </span>
      </span>
    ));
  };

  return (
    <div ref={containerRef} className="bg-[#0a0a0a] text-white selection:bg-orange-500 overflow-x-hidden -mt-24 md:-mt-28">
      
      {/* 1. ULTRA HERO SECTION */}
      <section ref={heroRef} className="relative h-[110vh] w-full flex items-center justify-center overflow-hidden -mt-24 md:-mt-28">
        
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover opacity-90 scale-110"
        >
          <source
            src="https://res.cloudinary.com/dj5imyo2n/video/upload/v1768303199/22609-328810354_medium_utmf26.mp4"
            type="video/mp4"
          />
        </video>

        {/* Overlay for contrast */}
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/1000 to-[#0a0a0a]" />

        <div className="relative z-10 text-center skew-elem">
          <h1 className="hero-title text-[12vw] font-black leading-none tracking-tighter flex flex-col md:flex-row items-center gap-4 md:gap-8">
            
            {/* 'OUR' - Solid Text, Animates from Top */}
            <span className="flex overflow-hidden py-4">
              {splitText("OUR", "char-up")}
            </span>

            {/* 'TRIPS' - Stroke/Border Only, Animates from Bottom */}
            <span className="flex overflow-hidden text-transparent stroke-text py-4">
              {splitText("TRIPS", "char-down")}
            </span>

          </h1>
        </div>

        {/* Floating Data Decor */}
        <div className="absolute bottom-20 left-12 hidden md:block text-xs font-mono text-gray-500 uppercase tracking-widest">
          <p>Altitude: 4,500m</p>
          <p>Weather: Clear</p>
        </div>
      </section>

      {/* 2. TRIPS ITERATION */}
      <div className="relative z-20 space-y-40 pb-40">
        {error && (
          <p className="text-center text-sm text-amber-500">{error}</p>
        )}
        {loading && (
          <p className="text-center text-xs text-gray-400">Loading activities...</p>
        )}
        {trips.map((trip, index) => {
          const isEven = index % 2 === 0;
          return (
            <section key={trip.id} className="trip-section px-6 md:px-20 max-w-[1600px] mx-auto">
              <div className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 items-end`}>
                
                {/* Left Side: Text Info */}
                <div className="reveal-text flex-1 space-y-6">
                  <div className="flex items-center gap-4">
                    <span className="h-px w-12 bg-orange-500" />
                    <span className="text-orange-500 font-bold tracking-widest text-sm uppercase">{trip.subtitle}</span>
                  </div>
                  <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase skew-elem">
                    {trip.title}
                  </h2>
                  <p className="text-gray-400 text-xl max-w-lg leading-relaxed font-light">
                    {trip.description}
                  </p>
                  <p className="text-xs font-mono text-gray-600 uppercase tracking-tighter">{trip.coordinates}</p>
                </div>

                {/* Right Side: Image Grid with Reveal Mask */}
                <div className="flex-[1.5] w-full grid grid-cols-12 gap-4">
                  <div className="col-span-8 relative h-[500px] rounded-sm overflow-hidden reveal-img shadow-2xl">
                    <Image src={trip.images[0]} alt="img" fill className="object-cover" />
                  </div>
                  <div className="col-span-4 flex flex-col gap-4">
                    <div className="relative h-[242px] rounded-sm overflow-hidden reveal-img">
                      <Image src={trip.images[1]} alt="img" fill className="object-cover" />
                    </div>
                    <div className="relative h-[242px] rounded-sm overflow-hidden reveal-img">
                      <Image src={trip.images[2]} alt="img" fill className="object-cover" />
                    </div>
                  </div>
                </div>

              </div>
            </section>
          );
        })}
      </div>

      <style jsx global>{`
        .will-change-transform {
          will-change: transform, opacity;
        }
        .stroke-text {
          -webkit-text-stroke: 2px white;
          color: transparent;
        }
        @media (max-width: 768px) {
           .stroke-text {
            -webkit-text-stroke: 1px white;
          }
        }
      `}</style>

       <Footer />
    </div>
  );
}