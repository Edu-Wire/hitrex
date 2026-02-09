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
  FaExclamationTriangle,
  FaAngleRight,
} from "react-icons/fa";
import { useTranslations } from "next-intl";


import HeroSection from "@/components/HeroSection";
import UpcomingTrips from "@/components/UpcomingTrips";

import { PageTransition } from "@/components/animations";

const oswald = Oswald({ subsets: ["latin"] });


const difficultyData = [
  {
    title: "Class 1: Casual",
    color: "border-green-500/20 bg-green-500/5",
    dot: "bg-green-500",
    text: "Perfect for beginners & families. Well-marked trails on flat or gently rolling terrain. These hikes require minimal physical effort and no technical skills. Suitable for first-time hikers, families, leisure walkers, and all basic fitness levels. What to expect: Easy pace, scenic routes, minimal elevation, and comfortable walking paths.",
    stats: "Beginner Friendly",
  },
  {
    title: "Class 2: Moderate",
    color: "border-blue-500/20 bg-blue-500/5",
    dot: "bg-blue-500",
    text: "For active individuals & weekend hikers. Trails with more elevation gain and some uneven surfaces. A moderate level of fitness is required. Ideal for those who hike occasionally and want a bit of a challenge. What to expect: Steeper sections, longer distances, and diverse terrain.",
    stats: "Fitness Level: Low/Mid",
  },
  {
    title: "Class 3: Challenging",
    color: "border-emerald-500/20 bg-emerald-500/5",
    dot: "bg-emerald-500",
    text: "For seasoned hikers. Expect significant elevation, rugged paths, and potentially long days on the trail. Requires good endurance and a steady foot. Recommended for regular hikers and outdoor enthusiasts. What to expect: Significant climbs, potentially remote areas, and varied weather conditions.",
    stats: "Stamina Required",
  },
  {
    title: "Class 4: Difficult",
    color: "border-orange-500/20 bg-orange-500/5",
    dot: "bg-orange-500",
    text: "High-intensity treks for the experienced. Very steep climbs, technical sections, and extreme altitudes. Requires high endurance, mental grit, and preparation for unpredictable environments. Best for fit hikers and aspiring mountaineers. What to expect: Technical terrain, rapid altitude changes, and sustained effort.",
    stats: "Extreme Preparedness",
  },
  {
    title: "Class 5: Technical",
    color: "border-red-500/20 bg-red-500/5",
    dot: "bg-red-500",
    text: "The peak of adventure. Use of ropes, technical climbing gear, and high-altitude gear may be necessary. For professional explorers and highly skilled mountaineers. Extreme commitment and fitness required. What to expect: Mountaineering techniques, high risk, and rewarding summits.",
    stats: "Expert ONLY",
  },
];

const insightData = [
  {
    title: "Atmospheric Gear",
    iconName: "FaCloudSun",
    color: "bg-zinc-900 border-zinc-800",
    text: "Layering systems are vital. High-altitude weather can shift 20°C in under an hour.",
  },
  {
    title: "Maintenance Kit",
    iconName: "FaTools",
    color: "bg-zinc-900 border-zinc-800",
    text: "Carry a multi-tool and repair tape for gear malfunctions in remote zones.",
  },
  {
    title: "Wilderness First Aid",
    iconName: "FaFirstAid",
    color: "bg-zinc-900 border-zinc-800",
    text: "Basic trauma and altitude sickness training is mandatory for Class 3+ trails.",
  },
];

export default function Home() {
  const t = useTranslations("HomePage");
  const containerRef = useRef(null);
  const [destinations, setDestinations] = useState([]);
  const [destError, setDestError] = useState(null);
  const [destLoading, setDestLoading] = useState(true);
  const [difficulties, setDifficulties] = useState(difficultyData); // Use hardcoded data
  const [diffLoading, setDiffLoading] = useState(false); // No loading
  const [insights, setInsights] = useState(insightData); // Use hardcoded data
  const [insLoading, setInsLoading] = useState(false); // No loading
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
        if (!controller.signal.aborted && data.success && data.destinations?.length > 0) {
          setDestinations(data.destinations);
          setDestError(null);
        } else if (!controller.signal.aborted) {
          setDestinations([]);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error(err);
          setDestinations([]);
          setDestError("Failed to load destinations.");
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

  // Removed useEffect for fetching difficulties

  // Removed useEffect for fetching insights

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
    return [...Array(5)].map((_, i) => (
      <FaStar
        key={i}
        className={`h-3 w-3 ${i < rating ? "text-amber-400" : "text-zinc-700"}`}
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

  // Icon mapping for insights
  const iconMap = {
    FaCloudSun: <FaCloudSun />,
    FaTools: <FaTools />,
    FaFirstAid: <FaFirstAid />,
  };

  return (
    <PageTransition>
      <main
        ref={containerRef}
        className="relative min-h-screen w-full bg-[#0a0a0a] overflow-hidden -mt-24 md:-mt-28"
      >
        <HeroSection />

        <section
          id="destinations"
          className="relative w-full pt-18 sm:pt-12 lg:pt-10 pb-20 md:pb-18 lg:pb-12 bg-white rounded-t-[3rem] md:rounded-t-[4rem] mt-0 z-20 border-t border-zinc-200"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-16 md:mb-14">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
              <div className="lg:col-span-7">
                <motion.div style={{ y: y1 }}>
                  <h2
                    className={`${oswald.className} text-5xl sm:text-7xl lg:text-8xl font-bold text-zinc-900 uppercase leading-[0.9] tracking-tighter`}
                  >
                    {t("title_line1")} <br />
                    <span className="text-emerald-600">{t("title_line2")}</span>
                  </h2>
                </motion.div>
              </div>

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
                      {t("subtitle")}
                    </span>
                  </div>

                  <p className="text-zinc-600 text-lg md:text-xl leading-relaxed font-light">
                    {t("description")}
                  </p>

                  <div className="grid grid-cols-2 gap-4 border-t border-zinc-100 pt-8">
                    <div className="flex flex-col">
                      <span className="text-3xl font-black text-zinc-900 tracking-tighter">{t("stats_peak")}</span>
                      <span className="text-[10px] uppercase text-zinc-400">{t("stats_peak_label")}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-3xl font-black text-zinc-900 tracking-tighter">{t("stats_intel")}</span>
                      <span className="text-[10px] uppercase text-zinc-400">{t("stats_intel_label")}</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

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
                    <p className="text-[10px] uppercase tracking-[0.2em]">{t("syncing")}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <DestinationsMarquee destinations={destinations} />
        </section>

        <section id="trips" className="bg-zinc-900  text-white">
          <UpcomingTrips />
        </section>

        <section
          id="difficulty"
          className="relative py-24 sm:py-32 bg-white overflow-hidden"
        >
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/topography.png')]" />

          <div className="w-full relative z-10 space-y-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-7xl mx-auto px-4 sm:px-6 w-full text-center space-y-6"
            >
              <div className="inline-block">
                <span className="text-emerald-600 text-sm tracking-[0.5em] uppercase block font-bold mb-4">
                  {t("difficulty_protocol")}
                </span>
                <h2 className={`${oswald.className} text-6xl sm:text-7xl lg:text-8xl font-black text-zinc-900 leading-tight tracking-tighter uppercase`}>
                  {t("difficulty_title")} <span className="text-emerald-600">{t("difficulty_title_span")}</span>
                </h2>
              </div>

              <p className="text-zinc-500 text-base sm:text-xl font-light leading-relaxed max-w-2xl mx-auto">
                {t("difficulty_desc")}
              </p>
            </motion.div>

            <div className="relative w-full">
              <div
                className="flex gap-8 px-4 sm:px-[10vw] overflow-x-auto no-scrollbar pb-12 cursor-grab active:cursor-grabbing"
              >
                {difficulties.map((item, idx) => (
                  <div
                    key={item._id || idx}
                    className={`flex-shrink-0 w-[350px] sm:w-[450px] p-8 sm:p-10 rounded-[3rem] border-2 transition-all duration-500 hover:shadow-2xl ${item.color} bg-white flex flex-col justify-between h-[350px] sm:h-[400px] group`}
                  >
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className={`w-12 h-12 rounded-2xl ${item.dot} opacity-20 flex items-center justify-center`}>
                          <div className={`w-3 h-3 rounded-full ${item.dot} shadow-lg`} />
                        </div>
                        <span className="text-xs font-black tracking-widest text-zinc-400 uppercase">Class 0{idx + 1}</span>
                      </div>

                      <div>
                        <h4 className={`${oswald.className} text-3xl sm:text-4xl uppercase font-black text-zinc-900 tracking-tight mb-4`}>
                          {item.title.split(": ")[1] || item.title}
                        </h4>
                        <p className="text-sm text-zinc-500 leading-relaxed font-medium">
                          {item.text}
                        </p>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-zinc-100 flex items-center justify-between">
                      <span className="text-[10px] text-zinc-400 uppercase font-black tracking-widest">Threshold</span>
                      <span className="text-sm font-black text-zinc-900">{item.stats}</span>
                    </div>
                  </div>
                ))}

              </div>

              <div className="absolute inset-y-0 left-0 w-[5vw] bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
              <div className="absolute inset-y-0 right-0 w-[10vw] bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
            </div>
          </div>
        </section>

        <section id="reviews" className="bg-zinc-950 py-24 sm:py-32 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-emerald-500 text-sm uppercase font-bold tracking-widest">
                  {t("community_pulse")}
                </span>
                <h2 className={`${oswald.className} text-5xl sm:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tighter`}>
                  {t("reviews_title")}
                </h2>
                <p className="text-zinc-400 text-base sm:text-lg leading-relaxed max-w-lg">
                  {t("reviews_desc")}
                </p>
              </div>

              <form onSubmit={handleReviewSubmit} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-zinc-200">{t("your_rating")}</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() =>
                          setReviewForm((prev) => ({ ...prev, rating: val }))
                        }
                        className="transition"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill={reviewForm.rating >= val ? "#f59e0b" : "none"}
                          stroke={reviewForm.rating >= val ? "#f59e0b" : "#71717a"}
                          strokeWidth="2"
                          className="h-7 w-7 cursor-pointer"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11.48 3.499a.562.562 0 011.04 0l2.125 4.31a.563.563 0 00.424.308l4.754.691a.563.563 0 01.312.959l-3.44 3.352a.563.563 0 00-.162.498l.812 4.735a.563.563 0 01-.816.592l-4.25-2.234a.563.563 0 00-.524 0l-4.25 2.234a.562.562 0 01-.816-.592l.812-4.735a.562.562 0 00-.162-.498L4.89 10.067a.563.563 0 01.312-.959l4.754-.691a.563.563 0 00.424-.308l2.1-4.31z"
                          />
                        </svg>
                      </button>
                    ))}

                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-zinc-200" htmlFor="review-comment">
                      {t("experience")}
                    </label>
                    <span className={`text-[11px] ${reviewWordCount > 100 ? "text-red-400" : "text-zinc-500"}`}>
                      {reviewWordCount}/100 words
                    </span>
                  </div>
                  <textarea
                    id="review-comment"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition min-h-[140px]"
                    placeholder={t("experience_placeholder")}
                    value={reviewForm.comment}
                    onChange={(e) =>
                      setReviewForm((prev) => ({ ...prev, comment: e.target.value }))
                    }
                    disabled={submittingReview}
                  />
                </div>

                {!session && (
                  <p className="text-xs text-amber-400">
                    {t("login_to_review")}
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
                  {submittingReview ? "Submitting..." : t("post_review")}
                </button>
              </form>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className={`${oswald.className} text-2xl uppercase font-bold`}>
                  {t("recent_reviews")}
                </h3>
                <span className="text-xs text-zinc-500">{t("showing_reviews")}</span>
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
                <p className="text-sm text-zinc-400">{t("no_reviews")}</p>
              )}
            </div>
          </div>
        </section>

        <section id="insights" className="relative py-24 sm:py-32 bg-zinc-950 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-6">
              <div className="space-y-4">
                <span className="text-emerald-500 text-sm uppercase font-bold tracking-widest">
                  {t("strategic_briefing")}
                </span>
                <h2 className={`${oswald.className} text-5xl sm:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tighter`}>
                  {t("insights_title")}
                </h2>
              </div>
              <p className="text-zinc-400 max-w-xs text-base sm:text-lg leading-relaxed pb-2 border-b border-zinc-800">
                {t("insights_desc")}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
              {insLoading ? (
                [1, 2, 3].map((i) => (
                  <div key={i} className="h-64 rounded-3xl bg-zinc-900 border border-zinc-800 animate-pulse" />
                ))
              ) : insights.map((item, idx) => (
                <motion.div
                  key={item._id || idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className={`group p-8 rounded-3xl border-2 ${item.color} hover:border-emerald-500/50 transition-all duration-500 flex flex-col justify-between h-full ${idx === 2 ? 'sm:col-span-2 md:col-span-1' : ''}`}
                >
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 text-2xl mb-6 group-hover:bg-emerald-500 group-hover:text-black transition-all duration-500">
                      {iconMap[item.iconName] || item.icon || <FaCompass />}
                    </div>
                    <h4 className={`${oswald.className} text-xl sm:text-2xl uppercase font-bold mb-3`}>{item.title}</h4>
                    <p className="text-zinc-400 text-sm leading-relaxed">{item.text}</p>
                  </div>

                  <button className="mt-8 flex items-center gap-2 text-xs font-bold text-emerald-500 uppercase tracking-widest group-hover:gap-4 transition-all">
                    {t("full_protocol")} <FaAngleRight />
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

/* ================= DATA ================= */

