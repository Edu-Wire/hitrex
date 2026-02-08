"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Footer from "@/components/Footer";

gsap.registerPlugin(ScrollTrigger);

import { useTranslations } from "next-intl";

export default function TripsPage() {
  const t = useTranslations("ActivitiesPage");
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const [error, setError] = useState(null);
  const [trips, setTrips] = useState(fallbackActivities);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const loadActivities = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/activities", {
          signal: controller.signal,
          cache: "no-store",
        });
        const data = await res.json();
        if (!controller.signal.aborted && data.success && data.activities?.length > 0) {
          setTrips(data.activities);
          setError(null);
        } else if (!controller.signal.aborted) {
          setTrips(fallbackActivities);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error(err);
          setTrips(fallbackActivities);
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
    gsap.context(() => {

      // 1. Animate "OUR" from Top (Upwards) - SMOOTHED
      const charsUp = gsap.utils.toArray(".char-up");
      gsap.fromTo(
        charsUp,
        { yPercent: -110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.5,
          stagger: 0.08,
          ease: "power4.out",
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
  }, []);

  // Section reveals wait for trips to load
  useEffect(() => {
    if (!trips.length) return;

    gsap.context(() => {
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
          { x: 0, opacity: 1, duration: 1.2, ease: "power3.out" }
        ).fromTo(
          revealImages,
          { clipPath: "inset(0 100% 0 0)", scale: 1.3 },
          {
            clipPath: "inset(0 0% 0 0)",
            scale: 1,
            duration: 1.4,
            ease: "power4.inOut",
            stagger: 0.2,
          },
          "-=1.0"
        );
      });
    }, containerRef);
  }, [trips]);

  const splitText = (text, customClass) => {
    return text.split("").map((char, i) => (
      <span key={i} className="inline-block overflow-hidden h-fit leading-none px-1 md:px-2">
        <span className={`${customClass} inline-block will-change-transform`}>
          {char === " " ? "\u00A0" : char}
        </span>
      </span>
    ));
  };

  return (
    <div ref={containerRef} className="bg-[#0a0a0a] text-white selection:bg-orange-500 overflow-x-hidden -mt-24 md:-mt-28">

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

        <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/1000 to-[#0a0a0a]" />

        <div className="relative z-10 text-center skew-elem">
          <h1 className="hero-title text-[12vw] font-black leading-none tracking-tighter flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <span className="flex overflow-hidden py-4">
              {splitText(t("our_trips").split(" ")[0], "char-up")}
            </span>
            <span className="flex overflow-hidden text-transparent stroke-text py-4">
              {splitText(t("our_trips").split(" ")[1], "char-down")}
            </span>
          </h1>
        </div>

        <div className="absolute bottom-20 left-12 hidden md:block text-xs font-mono text-gray-500 uppercase tracking-widest">
          <p>{t("altitude")}: 4,500m</p>
          <p>{t("weather")}: {t("clear")}</p>
        </div>
      </section>

      <div className="relative z-20 space-y-40 pb-40">
        {loading && (
          <p className="text-center text-xs text-gray-400">{t("loading")}</p>
        )}
        {trips.map((trip, index) => {
          const isEven = index % 2 === 0;
          return (
            <section key={trip.id} className="trip-section px-6 md:px-20 max-w-[1600px] mx-auto">
              <div className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 items-end`}>

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

                <div className="flex-[1.5] w-full grid grid-cols-12 gap-4">
                  <div className="col-span-8 relative h-[500px] rounded-sm overflow-hidden reveal-img shadow-2xl">
                    <Image src={trip.images?.[0] || "/images/destination-fallback.jpg"} alt="img" fill className="object-cover" />
                  </div>
                  <div className="col-span-4 flex flex-col gap-4">
                    <div className="relative h-[242px] rounded-sm overflow-hidden reveal-img">
                      <Image src={trip.images?.[1] || "/images/destination-fallback.jpg"} alt="img" fill className="object-cover" />
                    </div>
                    <div className="relative h-[242px] rounded-sm overflow-hidden reveal-img">
                      <Image src={trip.images?.[2] || "/images/destination-fallback.jpg"} alt="img" fill className="object-cover" />
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

const fallbackActivities = [
  {
    id: "annapurna-circuit",
    subtitle: "High Altitude Terrain",
    title: "Annapurna Circuit",
    description: "Navigate the legendary Thorong La Pass. A 160km odyssey through the heart of the Himalayas, transitioning from tropical forests to arctic tundras.",
    coordinates: "28.7941° N, 83.8203° E // Nepal",
    images: [
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1502926535242-4382295d8338?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop"
    ]
  },
  {
    id: "dolomites-traverse",
    subtitle: "Alpine Excellence",
    title: "Dolomites Alta Via",
    description: "Vertical cathedrals of limestone. Experience the Alta Via 1, where jagged peaks meet emerald meadows in Northern Italy's most iconic range.",
    coordinates: "46.5405° N, 12.1357° E // Italy",
    images: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1470252649358-96753a782901?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519681393784-d120267923af?w=800&auto=format&fit=crop"
    ]
  },
  {
    id: "icelandic-highlands",
    subtitle: "Magmatic Landscapes",
    title: "Laugavegur Trail",
    description: "A journey through shifting elements. Ryholite mountains, obsidian lava fields, and glacier-fed rivers defining the raw power of Iceland.",
    coordinates: "63.9038° N, 19.0639° W // Iceland",
    images: [
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=800&auto=format&fit=crop"
    ]
  }
];