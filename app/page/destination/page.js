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
      list.forEach(d => {
        d.location?.split("/").forEach(l => locs.add(l.trim()));
        d.tags?.forEach(t => acts.add(t));
      });
      setLocations(Array.from(locs));
      setActivities(Array.from(acts));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const filtered = destinations.filter((dest) => {
    return (
      (selectedLocation === "All" || dest.location.includes(selectedLocation)) &&
      (selectedActivity === "All" || dest.tags.includes(selectedActivity))
    );
  });

  // GSAP 3D Scroll Animations
  useEffect(() => {
    if (loading || filtered.length === 0) return;
    
    gsap.registerPlugin(ScrollTrigger);

    // Header Parallax
    gsap.to(".hero-bg", {
      scrollTrigger: {
        trigger: headerRef.current,
        start: "top top",
        scrub: true
      },
      y: 100,
      scale: 1.1,
      opacity: 0.2
    });

    const cards = cardsRef.current.filter(Boolean);
    
    cards.forEach((card, i) => {
      // 1. Perspective Flip on Scroll
      gsap.fromTo(card, 
        { 
          opacity: 0, 
          rotationX: -30, 
          y: 100, 
          scale: 0.9,
          transformOrigin: "top center" 
        },
        {
          opacity: 1,
          rotationX: 0,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top bottom-=100",
            end: "top center+=100",
            scrub: 1,
            toggleActions: "play none none reverse"
          }
        }
      );

      // 2. Continuous Floating Animation
      gsap.to(card, {
        y: "-=10",
        duration: 2 + Math.random(),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: i * 0.2
      });
    });

    // 3. Image Parallax within cards
    const cardImages = document.querySelectorAll(".card-parallax-img");
    cardImages.forEach(img => {
      gsap.to(img, {
        yPercent: 15,
        ease: "none",
        scrollTrigger: {
          trigger: img,
          scrub: true
        }
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [filtered, loading]);

  return (
    <div className="bg-[#080808] min-h-screen text-white overflow-x-hidden selection:bg-orange-500 selection:text-white">
      
      {/* 1. IMPACT HERO SECTION */}
      <section ref={headerRef} className="relative h-[70vh] w-full flex flex-col items-center justify-center overflow-hidden">
        <div className="hero-bg absolute inset-0">
          <Image
            src="/images/samrat-khadka-wrfl3DeoTIw-unsplash.jpg"
            alt="Trekking Hero"
            fill
            priority
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#080808]/50 to-[#080808]" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl">
          <p className="text-orange-500 font-bold tracking-[0.4em] uppercase text-xs mb-4 animate-fade-in">Hitrex Worldwide</p>
          <h1 className="text-7xl md:text-9xl font-black italic tracking-tighter mb-8 opacity-0 animate-reveal-title">
            GO <span className="text-transparent stroke-text">BEYOND</span>
          </h1>
          
          {/* FLOATING FILTER PANEL */}
          <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-2 rounded-2xl md:rounded-full flex flex-col md:flex-row items-center gap-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <div className="flex flex-1 w-full items-center px-6 gap-4 border-b md:border-b-0 md:border-r border-white/10 py-3">
              <span className="text-orange-500 font-black text-[10px] uppercase tracking-widest">Target</span>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="bg-transparent text-lg font-black w-full outline-none appearance-none cursor-pointer"
              >
                {locations.map(loc => <option key={loc} value={loc} className="bg-stone-950">{loc}</option>)}
              </select>
            </div>

            <div className="flex flex-1 w-full items-center px-6 gap-4 py-3">
              <span className="text-orange-500 font-black text-[10px] uppercase tracking-widest">Type</span>
              <select
                value={selectedActivity}
                onChange={(e) => setSelectedActivity(e.target.value)}
                className="bg-transparent text-lg font-black w-full outline-none appearance-none cursor-pointer"
              >
                {activities.map(act => <option key={act} value={act} className="bg-stone-950">{act}</option>)}
              </select>
            </div>

            <button className="bg-orange-600 hover:bg-orange-500 text-white px-12 py-4 rounded-xl md:rounded-full font-black uppercase tracking-tighter transition-all hover:scale-105 active:scale-95 shadow-lg shadow-orange-900/20">
              Discover
            </button>
          </div>
        </div>
      </section>

      {/* 2. PERSPECTIVE GRID */}
      <main className="max-w-[1400px] mx-auto px-6 md:px-12 py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="h-[2px] w-12 bg-orange-600" />
              <p className="text-orange-500 font-black text-xs tracking-widest uppercase">Catalog 2026</p>
            </div>
            <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter">THE EXPEDITIONS</h2>
          </div>
          <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl backdrop-blur-xl">
             <span className="text-3xl font-black text-orange-500">{filtered.length}</span>
             <span className="text-xs font-bold text-gray-500 ml-3 uppercase tracking-widest">Paths Found</span>
          </div>
        </div>

        {loading ? (
          <div className="h-96 flex items-center justify-center">
            <div className="w-16 h-1 w-32 bg-white/10 overflow-hidden relative rounded-full">
               <div className="absolute inset-0 bg-orange-600 animate-loading-bar" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 perspective-container">
            {filtered.map((dest, index) => (
              <div
                key={dest._id}
                ref={(el) => (cardsRef.current[index] = el)}
                className="group relative bg-[#111] rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-orange-500/40 transition-all duration-700 shadow-2xl will-change-transform"
              >
                {/* Parallax Image Section */}
                <div className="relative h-[450px] overflow-hidden">
                  <div className="card-parallax-img absolute inset-0 h-[120%] -top-[10%]">
                    <Image
                      src={dest.image}
                      alt={dest.name}
                      fill
                      className="object-cover opacity-60 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent" />
                  
                  {/* Category Tag */}
                  <div className="absolute top-8 left-8">
                     <span className="bg-orange-600 text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-xl">
                        {dest.tags[0]}
                     </span>
                  </div>
                </div>

                {/* Content Overlay */}
                <div className="p-10 relative -mt-32 z-10 bg-gradient-to-t from-[#111] via-[#111] to-transparent">
                  <p className="text-orange-500 font-mono text-[10px] uppercase tracking-[0.3em] mb-3">{dest.location}</p>
                  <h3 className="text-4xl font-black italic tracking-tighter mb-6 group-hover:text-orange-500 transition-colors uppercase leading-none">
                    {dest.name}
                  </h3>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-white/10">
                    <div>
                       <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Duration</p>
                       <p className="text-lg font-black">{dest.date}</p>
                    </div>
                    <button 
                      onClick={() => router.push(`/book/${dest._id}`)}
                      className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all transform hover:rotate-45"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <style jsx global>{`
        .perspective-container {
          perspective: 2000px;
        }
        .stroke-text {
          -webkit-text-stroke: 2px white;
        }
        @keyframes reveal-title {
          from { opacity: 0; transform: translateY(80px) rotateX(-20deg); }
          to { opacity: 1; transform: translateY(0) rotateX(0); }
        }
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-reveal-title {
          animation: reveal-title 1.5s cubic-bezier(0.19, 1, 0.22, 1) forwards;
        }
        .animate-fade-in {
          animation: fadeIn 1s ease forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; } to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}