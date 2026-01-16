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
        window.scrollTo(0, 0);
        fetchDestination();
    }, [params.id]);

    const fetchDestination = async () => {
        try {
            const res = await fetch(`/api/destinations/${params.id}`);
            const data = await res.json();
            if (data.destination) setDestination(data.destination);
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!destination) return;

        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            gsap.to(heroImageRef.current, {
                y: "20%",
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: true,
                },
            });

            gsap.from(contentRef.current.children, {
                y: 40,
                opacity: 0,
                duration: 0.9,
                stagger: 0.12,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: contentRef.current,
                    start: "top 80%",
                },
            });
        }, containerRef);

        return () => ctx.revert();
    }, [destination]);

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
                    <button
                        onClick={() => router.back()}
                        className="text-orange-500 hover:text-white transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="bg-[#050505] min-h-screen text-white overflow-x-hidden selection:bg-orange-600 -mt-24">
            {/* Hero Section */}
            <section className="relative min-h-[60vh] md:min-h-[80vh] w-full overflow-hidden flex flex-col justify-end">
                <div ref={heroImageRef} className="absolute inset-0 w-full h-[120%] -top-[10%] will-change-transform z-0">
                    <Image
                        src={destination.image}
                        alt={destination.name}
                        fill
                        priority
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[#050505]" />
                </div>

                <div className="relative z-10 w-full p-6 md:p-12 pb-12 md:pb-24 mt-24">
                    <div className="max-w-[1440px] mx-auto">
                        <div className="inline-block bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 mb-6">
                            {destination.location}
                        </div>
                        {/* Improved Heading for Mobile and Tablet */}
                        <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-[1.0] md:leading-[0.8] mb-6 md:mb-8 break-words text-wrap">
                            {destination.name}
                        </h1>
                        <div className="flex flex-wrap gap-4 text-xs md:text-sm font-bold uppercase tracking-widest opacity-80 items-center">
                            <span>{destination.duration || "5 Days"}</span>
                            <span className="w-1 h-1 bg-white rounded-full" />
                            <span>{destination.difficulty || "Moderate"}</span>
                            <span className="w-1 h-1 bg-white rounded-full" />
                            <span>€{destination.price || "2,400"}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <main className="py-12 md:py-24 space-y-16 md:space-y-24">
                {/* Top Grid: Overview & Booking - Centered */}
                <div className="max-w-[1440px] mx-auto px-4 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-24">
                    {/* Left Column: Details */}
                    <div ref={contentRef} className="lg:col-span-8 space-y-16">
                        {/* Description */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-black text-orange-500 uppercase tracking-[0.2em] mb-4">Overview</h3>
                            <p className="text-xl md:text-2xl font-light leading-relaxed text-zinc-300">
                                {destination.description}
                            </p>
                        </div>

                        {/* Highlights */}
                        <div className="space-y-8">
                            <h3 className="text-xs font-black text-orange-500 uppercase tracking-[0.2em] mb-4">Highlights</h3>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {(destination.highlights && destination.highlights.length > 0 ? destination.highlights : ["Expert guided tours", "Premium accommodation", "Local culinary experiences", "Private transport"]).map((highlight, i) => (
                                    <li key={i} className="flex items-start gap-3 text-zinc-400 group">
                                        <span className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2 group-hover:scale-150 transition-transform" />
                                        <span className="leading-relaxed">{highlight}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Activities */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-black text-orange-500 uppercase tracking-[0.2em] mb-4">Activities</h3>
                            <div className="flex flex-wrap gap-2">
                                {destination.activities && destination.activities.length > 0 ? (
                                    destination.activities.map((act, i) => (
                                        <span key={i} className="bg-zinc-900 border border-white/10 px-4 py-2 rounded-full text-sm text-zinc-300">
                                            {act}
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-zinc-500 italic">No specific activities listed.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sticky Booking Card */}
                    <div className="lg:col-span-4 relative">
                        <div className="sticky top-32 p-8 rounded-3xl bg-zinc-900/50 border border-white/5 backdrop-blur-xl">
                            <div className="mb-8 pb-8 border-b border-white/5">
                                <p className="text-sm text-zinc-400 font-bold uppercase tracking-widest mb-2">Total Price</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl font-black">€{destination.price || "2,400"}</span>
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
                </div>

                {/* Truly Full Width Section: Inclusions & Exclusions */}
                <div className="w-full bg-zinc-950/30 border-y border-white/5 py-16 md:py-24">
                    <div className="max-w-[1440px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
                        {/* Included */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-black text-orange-500 uppercase tracking-[0.2em] mb-4">Included</h3>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                                {destination.included && destination.included.length > 0 ? (
                                    destination.included.map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 text-zinc-400">
                                            <span className="text-green-500 mt-1">✓</span>
                                            <span className="leading-relaxed">{item}</span>
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-zinc-500 italic">Information pending.</li>
                                )}
                            </ul>
                        </div>

                        {/* Excluded */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-black text-red-500 uppercase tracking-[0.2em] mb-4">Excluded</h3>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                                {destination.excluded && destination.excluded.length > 0 ? (
                                    destination.excluded.map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 text-zinc-400">
                                            <span className="text-red-500 mt-1">✕</span>
                                            <span className="leading-relaxed">{item}</span>
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-zinc-500 italic">Information pending.</li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Truly Full Width Section: Gallery */}
                <div className="w-full space-y-8 md:space-y-12 py-12 md:py-24">
                    <div className="max-w-[1440px] mx-auto px-6 md:px-12">
                        <h3 className="text-xs font-black text-orange-500 uppercase tracking-[0.2em] mb-12">Gallery</h3>
                    </div>
                    {/* Edge-to-edge Gallery on large screens */}
                    <div className="px-4 md:px-8 max-w-[1920px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {destination.gallery && destination.gallery.length > 0 ? (
                            destination.gallery.map((img, i) => (
                                <div key={i} className="relative h-64 md:h-80 lg:h-96 rounded-3xl overflow-hidden group">
                                    <Image
                                        src={img}
                                        alt={`Gallery ${i + 1}`}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="relative h-96 rounded-3xl overflow-hidden col-span-full">
                                <Image
                                    src={destination.image}
                                    alt="Main Gallery"
                                    fill
                                    className="object-cover opacity-50"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <p className="text-zinc-500 italic">No additional images in gallery.</p>
                                </div>
                            </div>
                        )}
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
