"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Footer from "@/components/Footer";

export default function TripDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [destination, setDestination] = useState(null);
    const [loading, setLoading] = useState(true);

    const containerRef = useRef(null);
    const heroImageRef = useRef(null);
    const contentRef = useRef(null);

    useEffect(() => {
        fetchDestination();
    }, [params.id]);

    const fetchDestination = async () => {
        try {
            const res = await fetch(`/api/destinations/${params.id}`);
            const data = await res.json();
            if (data.destination) {
                setDestination(data.destination);
            }
        } catch (error) {
            console.error("Error fetching destination:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (loading || !destination) return;

        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            // Hero Image Parallax
            gsap.to(heroImageRef.current, {
                y: "20%",
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: true
                }
            });

            // Content Reveal
            gsap.from(contentRef.current.children, {
                y: 50,
                opacity: 0,
                duration: 1,
                stagger: 0.1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: contentRef.current,
                    start: "top 80%"
                }
            });
        }, containerRef);

        return () => ctx.revert();
    }, [loading, destination]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="w-24 h-[1px] bg-white/10 relative overflow-hidden">
                    <div className="absolute inset-0 bg-orange-600 animate-loading-smooth" />
                </div>
            </div>
        );
    }

    if (!destination) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">
                <div className="text-center">
                    <h2 className="text-4xl font-black uppercase mb-4">Trip Not Found</h2>
                    <button onClick={() => router.back()} className="text-orange-500 hover:text-white transition-colors">
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="bg-[#050505] min-h-screen text-white overflow-x-hidden selection:bg-orange-600 -mt-24">
            {/* Hero Section */}
            <section className="relative h-[80vh] w-full overflow-hidden">
                <div ref={heroImageRef} className="absolute inset-0 w-full h-[120%] -top-[10%] will-change-transform">
                    <Image
                        src={destination.image}
                        alt={destination.name}
                        fill
                        priority
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[#050505]" />
                </div>

                <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 pb-24 z-10">
                    <div className="max-w-[1440px] mx-auto">
                        <div className="inline-block bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 mb-6">
                            {destination.location}
                        </div>
                        <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] mb-6">
                            {destination.name}
                        </h1>
                        <div className="flex flex-wrap gap-4 text-sm font-bold uppercase tracking-widest opacity-80">
                            <span>{destination.duration || "5 Days"}</span>
                            <span className="w-1 h-1 bg-white rounded-full self-center" />
                            <span>{destination.difficulty || "Moderate"}</span>
                            <span className="w-1 h-1 bg-white rounded-full self-center" />
                            <span>${destination.price || "2,400"}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <main className="max-w-[1440px] mx-auto px-6 md:px-12 py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
                {/* Left Column: Details */}
                <div ref={contentRef} className="lg:col-span-8 space-y-16">

                    {/* Description */}
                    <div className="space-y-6">
                        <h3 className="text-xs font-black text-orange-500 uppercase tracking-[0.2em] mb-4">Overview</h3>
                        <p className="text-xl md:text-2xl font-light leading-relaxed text-zinc-300">
                            {destination.description}
                        </p>
                    </div>

                    {/* Highlights (Mock data if missing) */}
                    <div className="space-y-8">
                        <h3 className="text-xs font-black text-orange-500 uppercase tracking-[0.2em] mb-4">Highlights</h3>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {destination.highlights ? destination.highlights.map((highlight, i) => (
                                <li key={i} className="flex items-start gap-3 text-zinc-400 group">
                                    <span className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2 group-hover:scale-150 transition-transform" />
                                    <span className="leading-relaxed">{highlight}</span>
                                </li>
                            )) : (
                                // Fallback highlights
                                ["Expert guided tours", "Premium accommodation", "Local culinary experiences", "Private transport"].map((h, i) => (
                                    <li key={i} className="flex items-start gap-3 text-zinc-400 group">
                                        <span className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2 group-hover:scale-150 transition-transform" />
                                        <span className="leading-relaxed">{h}</span>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>

                    {/* Gallery (Placeholder using main image) */}
                    <div className="space-y-6">
                        <h3 className="text-xs font-black text-orange-500 uppercase tracking-[0.2em] mb-4">Gallery</h3>
                        <div className="grid grid-cols-2 gap-4 h-64 md:h-96">
                            <div className="relative w-full h-full rounded-2xl overflow-hidden">
                                <Image src={destination.image} alt="Gallery 1" fill className="object-cover hover:scale-110 transition-transform duration-700" />
                            </div>
                            <div className="relative w-full h-full rounded-2xl overflow-hidden">
                                <Image src={destination.image} alt="Gallery 2" fill className="object-cover grayscale hover:grayscale-0 hover:scale-110 transition-all duration-700" />
                            </div>
                        </div>
                    </div>

                </div>

                {/* Right Column: Sticky Booking Card */}
                <div className="lg:col-span-4 relative">
                    <div className="sticky top-32 p-8 rounded-3xl bg-zinc-900/50 border border-white/5 backdrop-blur-xl">
                        <div className="mb-8 pb-8 border-b border-white/5">
                            <p className="text-sm text-zinc-400 font-bold uppercase tracking-widest mb-2">Total Price</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-black">${destination.price || "2,400"}</span>
                                <span className="text-zinc-500 text-sm font-bold uppercase">/ Person</span>
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-400">Date</span>
                                <span className="font-bold">{destination.date || "Flexible"}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-400">Difficulty</span>
                                <span className="font-bold uppercase text-orange-500">{destination.difficulty || "Moderate"}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-400">Group Size</span>
                                <span className="font-bold">Max 12</span>
                            </div>
                        </div>

                        <button
                            onClick={() => router.push(`/book/${destination._id}`)}
                            className="w-full bg-[#ff4d00] hover:bg-white text-white hover:text-black py-4 rounded-xl font-black uppercase tracking-widest transition-all duration-300 shadow-[0_10px_30px_-10px_#ff4d00] hover:shadow-none"
                        >
                            Book Now
                        </button>

                        <p className="text-[10px] text-center text-zinc-600 mt-4 uppercase font-bold tracking-tight">
                            Free cancellation up to 48h before
                        </p>
                    </div>
                </div>
            </main>

            <style jsx global>{`
        @keyframes loading-smooth {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }
        .animate-loading-smooth {
          animation: loading-smooth 2s infinite ease-in-out;
        }
      `}</style>
            <Footer />
        </div>
    );
}
