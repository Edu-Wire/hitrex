"use client";

import { useEffect, useRef, useState } from "react";
import DestinationsMarquee from "@/components/DestinationsMarquee";
import { useSession } from "next-auth/react";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Oswald } from "next/font/google";
import {
  FaCompass,
  FaHiking,
  FaCampground,
  FaRoute,
  FaMountain,
  FaClock,
  FaCloudSun,
  FaTools,
  FaFirstAid,
  FaStar,
  FaUserCircle,
  FaExclamationTriangle, // ✅ added
  FaAngleRight,          // ✅ added
} from "react-icons/fa";


import HeroSection from "@/components/HeroSection";
import UpcomingTrips from "@/components/UpcomingTrips";

import { PageTransition } from "@/components/animations";

const oswald = Oswald({ subsets: ["latin"] });


export default function Home() {
  const containerRef = useRef(null);
  const [destinations, setDestinations] = useState([]);
  const [destError, setDestError] = useState(null);
  const [destLoading, setDestLoading] = useState(true);
  const { data: session } = useSession();

  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [submittingReview, setSubmittingReview] = useState(false);
  const countWords = (text = "") =>
    text
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);

  useEffect(() => {
    const controller = new AbortController();

    const loadDestinations = async () => {
      try {
        const res = await fetch("/api/destinations", {
          signal: controller.signal,
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to fetch destinations");
        const data = await res.json();
        const apiDestinations = Array.isArray(data?.destinations)
          ? data.destinations
          : [];
        if (!controller.signal.aborted && apiDestinations.length) {
          setDestinations(apiDestinations);
          setDestError(null);
        } else if (!controller.signal.aborted) {
          setDestinations([]);
          setDestError("No active destinations found.");
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error(err);
          setDestinations([]);
          setDestError("Live destinations unavailable.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setDestLoading(false);
        }
      }
    };

    loadDestinations();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const loadReviews = async () => {
      try {
        setLoadingReviews(true);
        const res = await fetch("/api/reviews", {
          signal: controller.signal,
          cache: "no-store",
        });
        const data = await res.json();
        if (!controller.signal.aborted) {
          setReviews(Array.isArray(data?.reviews) ? data.reviews : []);
          setReviewError("");
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error(err);
          setReviewError("Could not load reviews right now.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingReviews(false);
        }
      }
    };

    loadReviews();
    return () => controller.abort();
  }, []);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, idx) => (
      <FaStar
        key={idx}
        className={`h-4 w-4 ${idx < rating ? "text-amber-400" : "text-zinc-600"
          }`}
      />
    ));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!session) {
      setReviewError("Please log in to leave a review.");
      return;
    }

    const wordCount = countWords(reviewForm.comment);
    if (wordCount > 100) {
      setReviewError("Review must be 100 words or fewer.");
      return;
    }

    setSubmittingReview(true);
    setReviewError("");
    setReviewSuccess("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewForm),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to submit review");
      }

      setReviews((prev) => [data.review, ...prev]);
      setReviewForm({ rating: 5, comment: "" });
      setReviewSuccess("Review submitted. Thank you for sharing!");
    } catch (err) {
      setReviewError(err.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const displayedReviews = reviews.slice(0, 3);
  const reviewWordCount = countWords(reviewForm.comment);

  return (
    <PageTransition>
      <main
        ref={containerRef}
        className="relative min-h-screen w-full bg-[#0a0a0a] overflow-hidden -mt-24 md:-mt-28"
      >
        {/* ================= HERO ================= */}
        <HeroSection />

        {/* ================= DESTINATIONS ================= */}
        <section
          id="destinations"
          className="relative w-full pt-18 sm:pt-12 lg:pt-10 pb-20 md:pb-18 lg:pb-12 bg-white rounded-t-[3rem] md:rounded-t-[4rem] mt-0 z-20 border-t border-zinc-200"
        >
          {/* Header Grid: Balanced Design */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-16 md:mb-14">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">

              {/* Left Side: Massive Typography */}
              <div className="lg:col-span-7">
                <motion.div style={{ y: y1 }}>
                  <h2
                    className={`${oswald.className} text-5xl sm:text-7xl lg:text-8xl font-bold text-zinc-900 uppercase leading-[0.9] tracking-tighter`}
                  >
                    Prime <br />
                    <span className="text-emerald-600">Terrains</span>
                  </h2>
                </motion.div>
              </div>

              {/* Right Side: Descriptive Panel (Fills Empty Space) */}
              <div className="lg:col-span-5 pb-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="flex flex-col gap-6"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-xs uppercase tracking-[0.3em] text-zinc-400 font-bold">
                      Technical Intel
                    </span>
                  </div>

                  <p className="text-zinc-600 text-lg md:text-xl leading-relaxed font-light">
                    Analyzing high-altitude glacial lakes and hidden massifs across the
                    Himalayan range. We provide verified data and exclusive access for explorers
                    seeking raw, untamed nature in its purest form.
                  </p>

                  <div className="grid grid-cols-2 gap-4 border-t border-zinc-100 pt-8">
                    <div className="flex flex-col">
                      <span className="text-3xl font-black text-zinc-900 tracking-tighter">12+</span>
                      <span className="text-[10px] uppercase text-zinc-400">Peak Zones</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-3xl font-black text-zinc-900 tracking-tighter">100%</span>
                      <span className="text-[10px] uppercase text-zinc-400">Verified Intel</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Status Indicators */}
            {(destError || destLoading) && (
              <div className="mt-12 flex gap-6 items-center border-y border-zinc-100 py-4">
                {destError && (
                  <div className="flex items-center gap-2 text-amber-600">
                    <FaExclamationTriangle size={14} />
                    <p className="text-xs font-medium uppercase tracking-widest">{destError}</p>
                  </div>
                )}
                {destLoading && (
                  <div className="flex items-center gap-3 text-zinc-400">
                    <div className="w-4 h-4 border-2 border-zinc-200 border-t-emerald-500 rounded-full animate-spin" />
                    <p className="text-[10px] uppercase tracking-[0.2em]">Syncing Archives...</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Cards Auto-Scroll Marquee (Hybrid: JS-driven + Manual) */}
          <DestinationsMarquee destinations={destinations} />


          {/* Footer Action: Explore Catalog - Restored and Repositioned */}

        </section>

        {/* ================= UPCOMING TRIPS ================= */}
        <section id="trips" className="bg-zinc-900  text-white">
          <UpcomingTrips />
        </section>

        {/* ================= DIFFICULTY ================= */}
        <section id="difficulty" className="relative py-24 sm:py-32 bg-white overflow-hidden">
          {/* Decorative Topography Pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/topography.png')]" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <span className="text-emerald-600 text-sm tracking-[0.3em] uppercase block font-bold">
                Technical Grading
              </span>
              <h2 className={`${oswald.className} text-5xl sm:text-7xl lg:text-8xl font-bold text-gray-900 leading-[0.9] tracking-tighter`}>
                Measure Your <br /> Grit.
              </h2>
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-xl">
                Our trails are rated using the HITREX standard, analyzing vertical gain, oxygen levels, and technical demand.
              </p>
              <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100 max-w-sm">
                <FaExclamationTriangle className="text-amber-500" />
                <p className="text-xs text-amber-800 font-medium">Always check local weather warnings before departure.</p>
              </div>
            </motion.div>

            <div className="space-y-4">
              {difficultyData.map((item, idx) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className={`group relative flex items-center justify-between p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer ${item.color}`}
                >
                  <div className="flex items-start gap-4">
                    <span className={`h-3 w-3 mt-2 rounded-full ${item.dot} shadow-lg`} />
                    <div>
                      <h4 className={`${oswald.className} text-xl uppercase font-bold text-zinc-900`}>{item.title}</h4>
                      <p className="text-sm text-gray-600 mt-1 max-w-xs">{item.text}</p>
                    </div>
                  </div>
                  <div className="text-right hidden sm:block">
                    <span className="text-[10px] text-gray-400 block uppercase mb-1">Threshold</span>
                    <span className="text-sm font-bold text-zinc-900">{item.stats}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= REVIEWS ================= */}
        <section id="reviews" className="bg-zinc-950 py-24 sm:py-32 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-emerald-500 text-sm uppercase font-bold tracking-widest">
                  Community Pulse
                </span>
                <h2 className={`${oswald.className} text-5xl sm:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tighter`}>
                  Trail Voices
                </h2>
                <p className="text-zinc-400 text-base sm:text-lg leading-relaxed max-w-lg">
                  Hear from trekkers who trusted HITREX. Share your story to guide the next explorer—login is required to keep submissions authentic.
                </p>
              </div>

              <form onSubmit={handleReviewSubmit} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-zinc-200">Your rating</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setReviewForm((prev) => ({ ...prev, rating: val }))}
                        className={`h-9 w-9 rounded-full border flex items-center justify-center transition ${reviewForm.rating >= val
                          ? "bg-amber-500 border-amber-400 text-black"
                          : "border-zinc-700 text-zinc-400 hover:border-amber-500/60"
                          }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-zinc-200" htmlFor="review-comment">
                      Experience
                    </label>
                    <span className={`text-[11px] ${reviewWordCount > 100 ? "text-red-400" : "text-zinc-500"}`}>
                      {reviewWordCount}/100 words
                    </span>
                  </div>
                  <textarea
                    id="review-comment"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition min-h-[140px]"
                    placeholder="What made your trek memorable?"
                    value={reviewForm.comment}
                    onChange={(e) =>
                      setReviewForm((prev) => ({ ...prev, comment: e.target.value }))
                    }
                    disabled={submittingReview}
                  />
                </div>

                {!session && (
                  <p className="text-xs text-amber-400">
                    Please login before posting a review.
                  </p>
                )}

                {reviewError && (
                  <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2">
                    {reviewError}
                  </div>
                )}
                {reviewSuccess && (
                  <div className="text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-3 py-2">
                    {reviewSuccess}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={
                    submittingReview ||
                    !reviewForm.comment.trim() ||
                    !session ||
                    reviewWordCount > 100
                  }
                  className={`w-full text-sm font-bold uppercase tracking-widest rounded-xl py-3 transition ${submittingReview ||
                    !reviewForm.comment.trim() ||
                    !session ||
                    reviewWordCount > 100
                    ? "bg-zinc-700 text-zinc-400 cursor-not-allowed"
                    : "bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/20"
                    }`}
                >
                  {submittingReview ? "Submitting..." : "Post Review"}
                </button>
              </form>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className={`${oswald.className} text-2xl uppercase font-bold`}>
                  Recent Reviews
                </h3>
                <span className="text-xs text-zinc-500">Showing up to 3</span>
              </div>

              {loadingReviews ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((idx) => (
                    <div
                      key={idx}
                      className="h-40 rounded-2xl bg-zinc-900 border border-zinc-800 animate-pulse"
                    />
                  ))}
                </div>
              ) : displayedReviews.length ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {displayedReviews.map((review) => (
                    <div
                      key={review._id || review.id}
                      className="rounded-2xl bg-zinc-900 border border-zinc-800 p-5 space-y-4"
                    >
                      <div className="flex items-center gap-3">
                        <FaUserCircle className="h-7 w-7 text-emerald-400" />
                        <div>
                          <p className="text-sm font-semibold text-white">
                            {review.name || "Explorer"}
                          </p>
                          <div className="flex items-center gap-1">
                            {renderStars(review.rating || 0)}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-zinc-300 leading-relaxed line-clamp-4">
                        {review.comment}
                      </p>
                      <p className="text-[11px] text-zinc-500">
                        {review.createdAt
                          ? new Date(review.createdAt).toLocaleDateString()
                          : ""}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-zinc-400">No reviews yet. Be the first to share your trek.</p>
              )}
            </div>
          </div>
        </section>

        {/* ================= INSIGHTS ================= */}
        <section id="insights" className="relative py-24 sm:py-32 bg-zinc-950 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-6">
              <div className="space-y-4">
                <span className="text-emerald-500 text-sm uppercase font-bold tracking-widest">
                  Strategic Briefing
                </span>
                <h2 className={`${oswald.className} text-5xl sm:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tighter`}>
                  Expedition Intel
                </h2>
              </div>
              <p className="text-zinc-400 max-w-xs text-base sm:text-lg leading-relaxed pb-2 border-b border-zinc-800">
                Plan smarter with technical understanding and preparation tips from the HITREX lead explorers.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
              {insightData.map((item, idx) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className={`group p-8 rounded-3xl border-2 ${item.color} hover:border-emerald-500/50 transition-all duration-500 flex flex-col justify-between h-full ${idx === 2 ? 'sm:col-span-2 md:col-span-1' : ''}`}
                >
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 text-2xl mb-6 group-hover:bg-emerald-500 group-hover:text-black transition-all duration-500">
                      {item.icon}
                    </div>
                    <h4 className={`${oswald.className} text-xl sm:text-2xl uppercase font-bold mb-3`}>{item.title}</h4>
                    <p className="text-zinc-400 text-sm leading-relaxed">{item.text}</p>
                  </div>

                  <button className="mt-8 flex items-center gap-2 text-xs font-bold text-emerald-500 uppercase tracking-widest group-hover:gap-4 transition-all">
                    Full Protocol <FaAngleRight />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </PageTransition >
  );
}



/* ================= DATA ================= */

const difficultyData = [
  {
    title: "Class 1: Casual",
    color: "border-green-500/20 bg-green-500/5",
    dot: "bg-green-500",
    text: "Well-marked trails with flat terrain. Suitable for all fitness levels and families.",
    stats: "0-200m Elevation"
  },
  {
    title: "Class 3: Technical",
    color: "border-yellow-500/20 bg-yellow-500/5",
    dot: "bg-yellow-500",
    text: "Scrambling required. Steep inclines with uneven surfaces. High fitness required.",
    stats: "500-1200m Elevation"
  },
  {
    title: "Class 5: Extreme",
    color: "border-red-500/20 bg-red-500/5",
    dot: "bg-red-500",
    text: "Vertical ascents and technical gear required. Only for certified mountaineers.",
    stats: "2000m+ Vertical"
  },
];

const insightData = [
  {
    title: "Atmospheric Gear",
    icon: <FaCloudSun />,
    color: "bg-zinc-900 border-zinc-800",
    text: "Layering systems are vital. High-altitude weather can shift 20°C in under an hour."
  },
  {
    title: "Maintenance Kit",
    icon: <FaTools />,
    color: "bg-zinc-900 border-zinc-800",
    text: "Carry a multi-tool and repair tape for gear malfunctions in remote zones."
  },
  {
    title: "Wilderness First Aid",
    icon: <FaFirstAid />,
    color: "bg-zinc-900 border-zinc-800",
    text: "Basic trauma and altitude sickness training is mandatory for Class 3+ trails."
  },
];