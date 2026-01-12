"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { FaCompass } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade } from "swiper/modules";

// Swiper Styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const { scrollYProgress } = useScroll();
  
  const yText = useTransform(scrollYProgress, [0, 0.2], [0, 200]);
  const opacityText = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  useEffect(() => {
    fetchBlogs();
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  // GSAP Entry Animation for Heading
  useEffect(() => {
    if (!loading) {
      const ctx = gsap.context(() => {
        gsap.to(".char-inner", {
          y: 0,
          stagger: 0.05,
          delay: 0.5,
          duration: 1.5,
          ease: "expo.out",
        });
        
        gsap.from(".hero-subtext", {
          opacity: 0,
          y: 20,
          duration: 1,
          delay: 1.2,
          ease: "power3.out"
        });
      }, containerRef);
      return () => ctx.revert();
    }
  }, [loading]);

  const fetchBlogs = async () => {
    try {
      const res = await fetch("/api/blogs");
      const data = await res.json();
      setBlogs(data.blogs || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Helper to split text for character animation
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
      
      {/* 1. ETHERIAL HERO SECTION */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: yText, opacity: opacityText }} className="relative z-20 text-center px-4">
          <div className="hero-subtext">
            <span className="text-orange-500 font-bold tracking-[0.5em] uppercase text-xs mb-4 block">
              The Explorer&rsquo;s Journal
            </span>
          </div>
          
          {/* ANIMATED HEADING */}
          <h1 className="text-7xl md:text-[12vw] font-black tracking-tighter leading-none mb-6 flex justify-center">
            {splitText("CHRONICLES")}
          </h1>

          <div className="hero-subtext">
            <p className="max-w-md mx-auto text-zinc-400 font-light text-lg italic">
              &ldquo;Every trail has a story. Some are written in dirt, others in the soul.&rdquo;
            </p>
          </div>
        </motion.div>

        {/* Hero Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80"
            alt="Hero"
            fill
            priority
            className="object-cover opacity-100 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/60 to-[#050505]" />
        </div>

        <motion.div 
          animate={{ y: [0, 10, 0] }} 
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
        >
          <div className="w-[1px] h-12 bg-gradient-to-b from-orange-500 to-transparent" />
        </motion.div>
      </section>

      {/* 2. BLOG FEED */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-32">
        {loading ? (
          <div className="h-96 flex items-center justify-center">
            <div className="w-12 h-12 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-40">
            {blogs.map((blog, index) => (
              <BlogRow key={blog._id || index} blog={blog} index={index} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function BlogRow({ blog, index }) {
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
               Featured Story
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