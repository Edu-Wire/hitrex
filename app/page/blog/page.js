"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaCompass, FaMountain, FaHiking, FaCampground } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import {
  PageTransition,
  FadeInUp,
  SlideInLeft,
  SlideInRight,
} from "@/components/animations";

export default function BlogPage() {
  const [cursor, setCursor] = useState({ x: 0, y: 0, visible: false });
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const onMove = (e) => setCursor({ x: e.clientX, y: e.clientY, visible: true });
    const onLeave = () => setCursor((c) => ({ ...c, visible: false }));
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const loadBlogs = async () => {
      try {
        const res = await fetch("/api/blogs", { signal: controller.signal, cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch blogs");
        const data = await res.json();
        const apiBlogs = Array.isArray(data?.blogs) ? data.blogs : [];
        if (!controller.signal.aborted) {
          setBlogs(apiBlogs);
          setError(apiBlogs.length ? null : "No blogs available yet.");
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error(err);
          setBlogs([]);
          setError("Unable to load blogs right now.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    loadBlogs();
    return () => controller.abort();
  }, []);

  return (
    <PageTransition>
      <div
        className="relative w-full min-h-screen overflow-hidden  "
        style={{
          backgroundImage: "url('/blogbg.jpg')",
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
          backgroundPosition: "center",
        }}
      >
        {/* Cursor ring */}
        <motion.div
          className="pointer-events-none fixed z-50 rounded-full"
          style={{
            width: 72,
            height: 72,
            background: "rgba(255,255,255,0.8)",
            boxShadow: "0 0 24px 8px rgba(255,255,255,0.3)",
            border: "2px solid rgba(0,0,0,0.08)",
          }}
          animate={{
            x: cursor.x - 36,
            y: cursor.y - 36,
            opacity: cursor.visible ? 0.9 : 0,
            scale: cursor.visible ? 1 : 0.7,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 18, mass: 0.4 }}
        />

        {/* Floating adventure icons */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <motion.div
            className="absolute left-10 top-24 text-6xl opacity-10"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <FaMountain />
          </motion.div>
          <motion.div
            className="absolute right-16 top-48 text-5xl opacity-10"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          >
            <FaCompass />
          </motion.div>
          <motion.div
            className="absolute left-1/3 bottom-24 text-6xl opacity-10"
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
          >
            <FaHiking />
          </motion.div>
          <motion.div
            className="absolute right-1/3 bottom-10 text-5xl opacity-10"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 0.9 }}
          >
            <FaCampground />
          </motion.div>
        </div>

        {/* Hero Banner */}
        <div className="relative h-[50vh] sm:h-[60vh] w-full">
          {/* <Image
            src="/images/blog-hero.avif"
            alt="Blogs Banner"
            fill
            priority
            className="object-cover"
          /> */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30 flex flex-col items-center justify-center text-center px-4 pt-24 sm:pt-28">
            <FadeInUp>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-3 sm:mb-4">
                Blogs
              </h1>
              <p className="text-base sm:text-lg text-gray-200">
                Inspiring stories from the trails
              </p>
            </FadeInUp>
          </div>
        </div>

        {/* Blog Sections with world map background */}
        <div
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-20 overflow-hidden"
          style={{
            backgroundImage:
              "url('https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg')",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "contain",
          }}
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/85 via-white/90 to-white/95" />
          <div className="relative space-y-20">
          {error && (
            <p className="text-center text-sm text-amber-600">{error}</p>
          )}
          {loading && (
            <p className="text-center text-xs text-gray-500">Loading blogs...</p>
          )}
          {blogs.map((blog, index) => (
            <div
              key={blog._id || blog.id || index}
              className={`flex flex-col ${
                index % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"
              } gap-10 md:gap-16 items-center`}
            >
              {/* Text Section */}
              <div className="w-full md:w-1/2">
                {index % 2 === 0 ? (
                  <SlideInLeft delay={index * 0.2}>
                    <div>
                      <h3 className="text-xs sm:text-sm font-semibold text-green-700 uppercase tracking-wide border-l-4 border-green-700 pl-2 mb-2 sm:mb-3">
                        {blog.subtitle}
                      </h3>
                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
                        {blog.title}
                      </h2>
                      <p className="text-gray-600 mb-5 sm:mb-6 leading-relaxed text-sm sm:text-base">
                        {blog.description}
                      </p>
                      <Link
                        href={`/blogs/${blog.id}`}
                        className="inline-block bg-green-700 hover:bg-green-800 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg transition-all transform hover:scale-105 text-sm sm:text-base"
                      >
                        Read More →
                      </Link>
                    </div>
                  </SlideInLeft>
                ) : (
                  <SlideInRight delay={index * 0.2}>
                    <div>
                      <h3 className="text-xs sm:text-sm font-semibold text-green-700 uppercase tracking-wide border-l-4 border-green-700 pl-2 mb-2 sm:mb-3">
                        {blog.subtitle}
                      </h3>
                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
                        {blog.title}
                      </h2>
                      <p className="text-gray-600 mb-5 sm:mb-6 leading-relaxed text-sm sm:text-base">
                        {blog.description}
                      </p>
                      <Link
                        href={`/blogs/${blog.id}`}
                        className="inline-block bg-green-700 hover:bg-green-800 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg transition-all transform hover:scale-105 text-sm sm:text-base"
                      >
                        Read More →
                      </Link>
                    </div>
                  </SlideInRight>
                )}
              </div>

              {/* Swiper Section */}
              <div className="w-full md:w-1/2">
                {index % 2 === 0 ? (
                  <SlideInRight delay={index * 0.2 + 0.1}>
                    <Swiper
                      modules={[Pagination]}
                      pagination={{ clickable: true }}
                      spaceBetween={15}
                      slidesPerView={1}
                      breakpoints={{
                        640: { slidesPerView: 1 },
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 2 },
                      }}
                    >
                      {blog.images.map((src, idx) => (
                        <SwiperSlide key={idx}>
                          <div className="relative h-52 sm:h-64 md:h-72 w-full rounded-xl overflow-hidden group shadow-lg">
                            <Image
                              src={src}
                              alt={`${blog.title} ${idx + 1}`}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                              <span className="text-white text-sm sm:text-base font-semibold">
                                {blog.title}
                              </span>
                            </div>
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </SlideInRight>
                ) : (
                  <SlideInLeft delay={index * 0.2 + 0.1}>
                    <Swiper
                      modules={[Pagination]}
                      pagination={{ clickable: true }}
                      spaceBetween={15}
                      slidesPerView={1}
                      breakpoints={{
                        640: { slidesPerView: 1 },
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 2 },
                      }}
                    >
                      {blog.images.map((src, idx) => (
                        <SwiperSlide key={idx}>
                          <div className="relative h-52 sm:h-64 md:h-72 w-full rounded-xl overflow-hidden group shadow-lg">
                            <Image
                              src={src}
                              alt={`${blog.title} ${idx + 1}`}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                              <span className="text-white text-sm sm:text-base font-semibold">
                                {blog.title}
                              </span>
                            </div>
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </SlideInLeft>
                )}
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
