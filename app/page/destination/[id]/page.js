"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { FaCheckCircle, FaTimesCircle, FaUtensils, FaBed, FaHiking, FaCamera, FaMapMarkedAlt, FaShieldAlt, FaBus, FaTicketAlt } from "react-icons/fa";
import Footer from "@/components/Footer";

import { useTranslations } from "next-intl";

// Helper function to get appropriate icon for included/excluded items
const getItemIcon = (item) => {
    const lowerItem = item.toLowerCase();
    if (lowerItem.includes('meal') || lowerItem.includes('food') || lowerItem.includes('breakfast') || lowerItem.includes('dinner')) {
        return <FaUtensils className="text-green-500" />;
    }
    if (lowerItem.includes('accommodation') || lowerItem.includes('hotel') || lowerItem.includes('stay') || lowerItem.includes('camp')) {
        return <FaBed className="text-green-500" />;
    }
    if (lowerItem.includes('guide') || lowerItem.includes('hiking') || lowerItem.includes('trek') || lowerItem.includes('climb')) {
        return <FaHiking className="text-green-500" />;
    }
    if (lowerItem.includes('photo') || lowerItem.includes('camera')) {
        return <FaCamera className="text-green-500" />;
    }
    if (lowerItem.includes('transport') || lowerItem.includes('transfer') || lowerItem.includes('bus') || lowerItem.includes('car')) {
        return <FaBus className="text-green-500" />;
    }
    if (lowerItem.includes('insurance') || lowerItem.includes('permit') || lowerItem.includes('safety')) {
        return <FaShieldAlt className="text-green-500" />;
    }
    if (lowerItem.includes('entry') || lowerItem.includes('ticket') || lowerItem.includes('fee')) {
        return <FaTicketAlt className="text-green-500" />;
    }
    return <FaCheckCircle className="text-green-500" />;
};

export default function TripDetailsPage() {
    const t = useTranslations("DestinationDetails");
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
            if (data.destination) {
                setDestination(data.destination);
            } else {
                // Try fetching from upcoming trips if not found in destinations
                const tripRes = await fetch(`/api/upcoming-trips/${params.id}`);
                const tripData = await tripRes.json();
                if (tripData.trip) {
                    setDestination(tripData.trip);
                }
            }
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
                    <h2 className="text-4xl font-black uppercase mb-4">{t("trip_not_found")}</h2>
                    <button
                        onClick={() => router.back()}
                        className="text-orange-500 hover:text-white transition-colors"
                    >
                        {t("go_back")}
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
                            <div className="flex items-center gap-2">
                                <span>€{destination.offer > 0 ? Math.round(destination.price * (1 - destination.offer / 100)) : destination.price}</span>
                                {destination.offer > 0 && (
                                    <span className="text-[10px] text-zinc-500 line-through opacity-60">€{destination.price}</span>
                                )}
                            </div>
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
                            <h3 className="text-xs font-black text-orange-500 uppercase tracking-[0.2em] mb-4">{t("overview")}</h3>
                            <p className="text-xl md:text-2xl font-light leading-relaxed text-zinc-300">
                                {destination.description}
                            </p>
                        </div>

                        {/* Highlights */}
                        <div className="space-y-8">
                            <h3 className="text-xs font-black text-orange-500 uppercase tracking-[0.2em] mb-4">{t("highlights")}</h3>
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
                            <h3 className="text-xs font-black text-orange-500 uppercase tracking-[0.2em] mb-4">{t("activities")}</h3>
                            <div className="flex flex-wrap gap-2">
                                {destination.activities && destination.activities.length > 0 ? (
                                    destination.activities.map((act, i) => (
                                        <span key={i} className="bg-zinc-900 border border-white/10 px-4 py-2 rounded-full text-sm text-zinc-300">
                                            {act}
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-zinc-500 italic">{t("no_activities")}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sticky Booking Card */}
                    <div className="lg:col-span-4 relative">
                        <div className="sticky top-32 p-8 rounded-3xl bg-zinc-900/50 border border-white/5 backdrop-blur-xl">
                            <div className="mb-8 pb-8 border-b border-white/5">
                                <p className="text-sm text-zinc-400 font-bold uppercase tracking-widest mb-2">{t("total_price")}</p>
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-5xl font-black">€{destination.offer > 0 ? Math.round(destination.price * (1 - destination.offer / 100)) : destination.price}</span>
                                        <span className="text-zinc-500 text-sm font-bold uppercase">{t("per_person")}</span>
                                    </div>
                                    {destination.offer > 0 && (
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg text-zinc-500 line-through opacity-50">€{destination.price}</span>
                                            <span className="bg-emerald-500/10 text-emerald-500 text-[10px] font-black px-2 py-0.5 rounded-md">-{destination.offer}% OFF</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-sm">
                                    <span className="text-zinc-400">Date</span>
                                    <span className="font-bold">{destination.date || t("flexible")}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-zinc-400">Difficulty</span>
                                    <span className="font-bold uppercase text-orange-500">{destination.difficulty || "Moderate"}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-zinc-400">Group Size</span>
                                    <span className="font-bold">{t("max_12")}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => router.push(`/book/${destination._id}`)}
                                className="w-full bg-[#ff4d00] hover:bg-white text-white hover:text-black py-4 rounded-xl font-black uppercase tracking-widest transition-all duration-300 shadow-[0_10px_30px_-10px_#ff4d00] hover:shadow-none"
                            >
                                {t("book_now_btn")}
                            </button>

                            <p className="text-[10px] text-center text-zinc-600 mt-4 uppercase font-bold tracking-tight">
                                {t("free_cancellation")}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Truly Full Width Section: Inclusions & Exclusions */}
                <div className="w-full bg-zinc-950/30 border-y border-white/5 py-16 md:py-24">
                    <div className="max-w-[1440px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
                        {/* Included */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-black text-orange-500 uppercase tracking-[0.2em] mb-4">{t("included")}</h3>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                                {destination.included && destination.included.length > 0 ? (
                                    destination.included.map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 text-zinc-400">
                                            <span className="mt-1">{getItemIcon(item)}</span>
                                            <span className="leading-relaxed">{item}</span>
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-zinc-500 italic">{t("info_pending")}</li>
                                )}
                            </ul>
                        </div>

                        {/* Excluded */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-black text-red-500 uppercase tracking-[0.2em] mb-4">{t("excluded")}</h3>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                                {destination.excluded && destination.excluded.length > 0 ? (
                                    destination.excluded.map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 text-zinc-400">
                                            <span className="mt-1 text-red-500"><FaTimesCircle /></span>
                                            <span className="leading-relaxed">{item}</span>
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-zinc-500 italic">{t("info_pending")}</li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Truly Full Width Section: Gallery */}
                <div className="w-full space-y-8 md:space-y-12 py-12 md:py-24">
                    <div className="max-w-[1440px] mx-auto px-6 md:px-12">
                        <h3 className="text-xs font-black text-orange-500 uppercase tracking-[0.2em] mb-12">{t("gallery")}</h3>
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
                                    <p className="text-zinc-500 italic">{t("no_gallery")}</p>
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
