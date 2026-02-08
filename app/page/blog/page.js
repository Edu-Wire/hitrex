"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import Footer from "@/components/Footer";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { FaCompass } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade } from "swiper/modules";

// Swiper Styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import { useTranslations } from "next-intl";

export default function BlogPage() {
  const t = useTranslations("BlogPage");
  const [blogs, setBlogs] = useState(fallbackBlogs);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll();

  const yText = useTransform(scrollYProgress, [0, 0.2], [0, 200]);
  const opacityText = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  useEffect(() => {
    fetchBlogs();
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".char-inner", {
        y: 0,
        stagger: 0.05,
        delay: 0.2,
        duration: 1.2,
        ease: "expo.out",
      });

      gsap.from(".hero-subtext", {
        opacity: 0,
        y: 20,
        duration: 1,
        delay: 0.8,
        ease: "power3.out"
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/blogs");
      const data = await res.json();
      if (data.success && data.blogs?.length > 0) {
        setBlogs(data.blogs);
      } else {
        setBlogs(fallbackBlogs);
      }
    } catch (e) {
      console.error(e);
      setBlogs(fallbackBlogs);
    } finally {
      setLoading(false);
    }
  };

  const splitText = (text) => {
    return text.split("").map((char, i) => (
      <span key={i} className="inline-block overflow-hidden pb-2 md:pb-4">
        <span className="char-inner inline-block translate-y-[110%] will-change-transform">
          {char === " " ? "\u00A0" : char}
        </span>
      </span>
    ));
  };

  return (
    <div ref={containerRef} className="bg-[#050505] min-h-screen text-white selection:bg-orange-500 relative -mt-24">

      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: yText, opacity: opacityText }} className="relative z-20 text-center px-4">
          <div className="hero-subtext">
            <span className="text-orange-500 font-bold tracking-[0.5em] uppercase text-xs mb-4 block">
              {t("explorers_journal")}
            </span>
          </div>

          <h1 className="text-7xl md:text-[12vw] font-black tracking-tighter leading-none mb-6 flex justify-center">
            {splitText(t("chronicles"))}
          </h1>

          <div className="hero-subtext">
            <p className="max-w-md mx-auto text-zinc-400 font-light text-lg italic">
              &ldquo;{t("quote")}&rdquo;
            </p>
          </div>
        </motion.div>

        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover opacity-100 scale-105"
          >
            <source
              src="https://res.cloudinary.com/dj5imyo2n/video/upload/v1768546401/12683975_1920_1080_30fps_qdvkya.mp4"
              type="video/mp4"
            />
          </video>

          <div className="absolute inset-0 from-transparent via-[#050505]/1000 to-[#050505]" />
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
        >
          <div className="w-[1px] h-12 bg-gradient-to-b from-orange-500 to-transparent" />
        </motion.div>
      </section>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-32">
        {loading && (
          <div className="h-96 flex items-center justify-center">
            <div className="w-12 h-12 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <div className="space-y-40">
          {blogs.map((blog, index) => (
            <BlogRow key={blog._id || index} blog={blog} index={index} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function BlogRow({ blog, index }) {
  const t = useTranslations("BlogPage");
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 md:gap-24`}
    >
      <div className="w-full md:w-3/5 group">
        <div className="relative rounded-[2rem] overflow-hidden bg-zinc-900 aspect-[16/10] shadow-2xl">
          <Swiper
            modules={[Pagination, Autoplay, EffectFade]}
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000 }}
            effect="fade"
            className="h-full w-full"
          >
            {blog.images?.map((img, i) => (
              <SwiperSlide key={i}>
                <Image
                  src={img}
                  alt={blog.title}
                  fill
                  className="object-cover transition-transform duration-[2s] group-hover:scale-110"
                />
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="absolute top-8 left-8 z-20">
            <span className="bg-orange-600/90 backdrop-blur-md text-white text-[10px] font-black px-4 py-1.5 uppercase tracking-tighter rounded-full">
              {t("featured_story")}
            </span>
          </div>
        </div>
      </div>

      <div className="w-full md:w-2/5 space-y-6">
        <div className="space-y-2">
          <span className="text-orange-500 font-bold text-[10px] uppercase tracking-[0.3em]">
            {blog.subtitle || "Adventure"}
          </span>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-tight">
            {blog.title}
          </h2>
        </div>
        <p className="text-zinc-400 leading-relaxed font-light text-lg">
          {blog.description}
        </p>
      </div>

    </motion.div>
  );
}

const fallbackBlogs = [
  {
    title: "The Art of Himalayan Survival",
    subtitle: "Technical Intel",
    description: "Beyond the gear, it's a mental game. Understanding thermodynamics and altitude physiology is what separates a successful summit from a rescue operation.",
    images: [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800"
    ]
  },
  {
    title: "Alpine Light: Photography at 5000m",
    subtitle: "Visual Diary",
    description: "Capturing the blue hour in the Alps. Why mirrorless systems are revolutionizing high-altitude photography and how to manage batteries in sub-zero temps.",
    images: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200",
      "https://images.unsplash.com/photo-1470252649358-96753a782901?w=800"
    ]
  }
];