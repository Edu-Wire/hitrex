"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

export default function DestinationsPage() {
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [selectedActivity, setSelectedActivity] = useState("All");
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState(["All"]);
  const [activities, setActivities] = useState(["All"]);

  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const res = await fetch("/api/destinations");
      const data = await res.json();
      const list = data.destinations || [];
      setDestinations(list);

      const locs = new Set(["All"]);
      const acts = new Set(["All"]);
      list.forEach((d) => {
        d.location?.split("/").forEach((l) => locs.add(l.trim()));
        d.tags?.forEach((t) => acts.add(t));
      });
      setLocations(Array.from(locs));
      setActivities(Array.from(acts));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filtered = destinations.filter((dest) => {
    return (
      (selectedLocation === "All" || dest.location.includes(selectedLocation)) &&
      (selectedActivity === "All" || dest.tags.includes(selectedActivity))
    );
  });

  useEffect(() => {
    if (loading) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      // 1. HERO TEXT REVEAL
      const chars = gsap.utils.toArray(".char");
      gsap.to(chars, {
        y: "0%",
        opacity: 1,
        duration: 1.5,
        stagger: 0.04,
        ease: "expo.out",
        delay: 0.2,
      });

      // 2. HERO BG PARALLAX
      gsap.to(".hero-bg", {
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
        },
        y: 150,
        scale: 1.05,
        ease: "none",
      });

      // 3. STAGGERED CARD REVEAL
      const cards = cardsRef.current.filter(Boolean);
      gsap.set(cards, { opacity: 0, y: 50 });

      ScrollTrigger.batch(cards, {
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            duration: 1,
            ease: "power4.out",
            overwrite: true,
          }),
        start: "top bottom-=50px",
      });

      // 4. FLOATING EFFECT
      cards.forEach((card, i) => {
        gsap.to(card, {
          y: "-=10",
          duration: 2.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.2,
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [filtered, loading]);

  const splitText = (text) => {
    return text.split("").map((char, i) => (
      <span key={i} className="inline-block overflow-hidden h-fit leading-tight">
        <span className="char inline-block translate-y-[110%] opacity-0 will-change-transform">
          {char === " " ? "\u00A0" : char}
        </span>
      </span>
    ));
  };

  return (
    <div
      ref={containerRef}
      className="bg-[#050505] min-h-screen text-white overflow-x-hidden selection:bg-orange-600 -mt-24 md:-mt-28"
    >
      <section
        ref={headerRef}
        className="relative h-[100vh] w-full flex flex-col items-center justify-center overflow-hidden pt-24"
      >


        <div className="hero-bg absolute inset-0 will-change-transform">
  <video
    autoPlay
    loop
    muted
    playsInline
    preload="auto"
    className="absolute inset-0 w-full h-full object-cover"
  >
    <source
      src="https://res.cloudinary.com/dj5imyo2n/video/upload/v1768302705/270940_medium_mggjxf.mp4"
      type="video/mp4"
    />
  </video>

  {/* Overlay for readability */}
  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/20 to-[#050505]/75" />
</div>





        {/* <div className="hero-bg absolute inset-0 will-change-transform">
          <Image
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80"
            alt="Mountains"
            fill
            priority
            className="object-cover opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/15 to-[#050505]/70" />
        </div> */}

        <div className="relative z-10 text-center px-4 max-w-7xl">
          <h1 className="text-8xl md:text-[11vw] font-black tracking-tighter mb-12 leading-[0.8] flex flex-col items-center">
            <span className="flex">{splitText("BEYOND")}</span>
            <span className="flex text-transparent stroke-text">
              {splitText("HORIZONS")}
            </span>
          </h1>

          {/* REDESIGNED COMPACT FILTER BAR */}
          <div className="bg-white/[0.01] backdrop-blur-2xl border border-white/10 p-1.5 rounded-2xl md:rounded-full flex flex-col md:flex-row items-center gap-1 shadow-2xl max-w-fit mx-auto transition-all hover:bg-white/[0.05]">
            
            {/* Region Select */}
            <div className="relative group px-6 py-2 w-full md:w-auto md:min-w-[160px] border-b md:border-b-0 md:border-r border-white/5 transition-colors hover:bg-white/5 rounded-xl md:rounded-none md:first:rounded-l-full">
              <div className="flex flex-col items-start">
                <label className="text-[8px] uppercase tracking-[0.2em] text-orange-500 font-bold mb-0.5">
                  Region
                </label>
                <div className="relative w-full flex items-center">
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="bg-transparent text-sm font-medium text-white w-full outline-none appearance-none cursor-pointer font-sans py-0.5 pr-6"
                  >
                    {locations.map((loc) => (
                      <option key={loc} value={loc} className="bg-zinc-900 text-white">
                        {loc}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-0 pointer-events-none text-zinc-500 group-hover:text-white transition-colors">
                    <svg width="8" height="5" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Adventure Select */}
            <div className="relative group px-6 py-2 w-full md:w-auto md:min-w-[160px] transition-colors hover:bg-white/5 rounded-xl md:rounded-none">
              <div className="flex flex-col items-start">
                <label className="text-[8px] uppercase tracking-[0.2em] text-orange-500 font-bold mb-0.5">
                  Adventure
                </label>
                <div className="relative w-full flex items-center">
                  <select
                    value={selectedActivity}
                    onChange={(e) => setSelectedActivity(e.target.value)}
                    className="bg-transparent text-sm font-medium text-white w-full outline-none appearance-none cursor-pointer font-sans py-0.5 pr-6"
                  >
                    {activities.map((act) => (
                      <option key={act} value={act} className="bg-zinc-900 text-white">
                        {act}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-0 pointer-events-none text-zinc-500 group-hover:text-white transition-colors">
                    <svg width="8" height="5" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button className="w-full md:w-auto bg-white text-black hover:bg-orange-600 hover:text-white px-8 py-3.5 rounded-xl md:rounded-full font-bold uppercase text-[10px] tracking-widest transition-all duration-300 shadow-xl whitespace-nowrap">
              Discover
            </button>
          </div>
        </div>
      </section>

      <main className="max-w-[1440px] mx-auto px-6 md:px-12 py-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
          <div className="space-y-4">
            <p className="text-orange-500 font-bold text-xs tracking-[0.3em] uppercase">Selection / 2026</p>
            <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter leading-none">PREMIUM<br />ROUTES</h2>
          </div>
          <div className="text-right">
            <span className="text-8xl font-light text-white/5 tracking-tighter">{filtered.length}</span>
          </div>
        </div>

        {loading ? (
          <div className="h-96 flex items-center justify-center">
            <div className="w-24 h-[1px] bg-white/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-orange-600 animate-loading-smooth" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-24">
            {filtered.map((dest, index) => (
              <div key={dest._id} ref={(el) => (cardsRef.current[index] = el)} className="group relative will-change-transform">
                <div className="relative h-[550px] rounded-[2.5rem] overflow-hidden bg-zinc-900 transition-transform duration-700 ease-[cubic-bezier(0.2,1,0.3,1)] group-hover:scale-[0.98]">
                  <Image src={dest.image} alt={dest.name} fill className="object-cover opacity-80 group-hover:opacity-100 transition-all duration-1000 scale-110 group-hover:scale-100" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                  <div className="absolute top-8 left-8 overflow-hidden rounded-full">
                    <span className="bg-white/10 backdrop-blur-md text-white text-[9px] font-black px-5 py-2 inline-block uppercase tracking-widest border border-white/20">{dest.tags[0]}</span>
                  </div>
                </div>
                <div className="mt-8 px-4">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <p className="text-orange-500 font-bold text-[10px] uppercase tracking-widest mb-2">{dest.location}</p>
                      <h3 className="text-4xl font-black tracking-tighter uppercase leading-none transition-colors group-hover:text-orange-500">{dest.name}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] text-zinc-500 font-bold uppercase mb-1">Est.</p>
                      <p className="text-2xl font-black">${dest.price || "2,400"}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{dest.date}</p>
                    <button onClick={() => router.push(`/book/${dest._id}`)} className="text-[10px] font-black uppercase tracking-widest border-b border-orange-500 pb-1 hover:text-orange-500 transition-colors">View Details</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <style jsx global>{`
        .stroke-text {
          -webkit-text-stroke: 1.5px rgba(255, 255, 255, 0.6);
          text-stroke: 1.5px rgba(255, 255, 255, 0.6);
          transition: -webkit-text-stroke 0.4s ease;
        }
        .stroke-text:hover {
          -webkit-text-stroke: 1.5px rgba(255, 255, 255, 1);
        }
        @keyframes reveal-simple {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-reveal-simple {
          animation: reveal-simple 1s ease forwards 1s;
        }
        @keyframes loading-smooth {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }
        .animate-loading-smooth {
          animation: loading-smooth 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}