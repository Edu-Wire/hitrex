"use client";
import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { gsap } from "gsap";
import Footer from "@/components/Footer";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { Oswald } from "next/font/google";

const heroSans = Oswald({
  subsets: ["latin"],
  weight: ["600", "700"],
});

const teamMembers = [
  {
    id: 1,
    name: "Uzair Ahmed",
    role: "Founder",
    image: "/images/TL-1.jpg",
    bio: "Uzair Ahmed is a professionally qualified accountant with a deep-rooted passion for travel, nature, and adventure. While his professional expertise lies in accounting and financial management, his true enthusiasm is found on mountain trails and in the outdoors.",
    details: "With over 15 years of hiking experience, Uzair has explored a wide variety of terrains and landscapes. For the past 6 years, he has been actively organising and leading hiking trips in collaboration with different organisations, bringing together adventure enthusiasts for safe, well-planned, and memorable experiences. By combining his professional discipline with his love for hiking, Uzair ensures every journey is thoughtfully organised, safety-focused, and enriching."
  },
  {
    id: 2,
    name: "Mustafa Simsek",
    role: "Co-Founder",
    image: "/images/TL-2.jpg",
    bio: "Mustafa Simsek is a professionally trained lawyer with a lifelong passion for mountains, hiking, and mountaineering. His journey into the outdoors began at a very young age in Turkey, where he developed a strong connection with high-altitude environments and challenging terrain.",
    details: "One of the defining milestones of his early mountaineering career was successfully climbing Mount Ararat, the highest peak in Turkey. Over the years, Mustafa has gone on to summit numerous peaks around the world. To formalise his expertise, he obtained a professional hiking guide permit, enabling him to lead groups with a strong focus on safety, route planning, and responsible outdoor practices. Mustafa brings a global perspective, deep mountaineering experience, and genuine passion for exploration."
  }
];

export default function AboutPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll();

  // Parallax for Hero
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 400]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1.05, 1.2]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // GSAP Entry Animation for Heading
    const ctx = gsap.context(() => {
      gsap.to(".char-inner", {
        y: 0,
        stagger: 0.04,
        delay: 0.5,
        duration: 1.5,
        ease: "expo.out",
      });

      gsap.from(".hero-line", {
        scaleX: 0,
        duration: 1.5,
        delay: 1,
        ease: "power4.inOut",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const splitText = (text) => {
    return text.split("").map((char, i) => (
      <span key={i} className="inline-block overflow-hidden pb-1 md:pb-4">
        <span className="char-inner inline-block translate-y-[110%] will-change-transform">
          {char === " " ? "\u00A0" : char}
        </span>
      </span>
    ));
  };

  return (
    <div ref={containerRef} className="bg-[#050505] min-h-screen text-white selection:bg-orange-500 relative -mt-24">

      {/* 1. CINEMATIC HERO */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: heroY }} className="relative z-20 text-center px-4">
          <span className="text-orange-500 font-bold tracking-[0.6em] uppercase text-[10px] mb-6 block opacity-80">
            Our Legacy & Story
          </span>

          <h1
            className={`${heroSans.className} text-5xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[9vw] font-black tracking-tighter leading-[0.9] flex justify-center max-w-[min(1100px,92vw)] mx-auto px-4`}

          >
            {splitText("WHO WE ARE")}
          </h1>

          <div className="hero-line h-px w-40 bg-orange-600 mx-auto mt-8 opacity-50" />
        </motion.div>

        {/* Hero Background */}
        <motion.div style={{ scale: heroScale }} className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          >
            <source
              src="https://res.cloudinary.com/dj5imyo2n/video/upload/v1768303140/263586_medium_tqruyy.mp4"
              type="video/mp4"
            />
          </video>

          {/* Overlay for text readability */}
          <div className="absolute inset-0  " />
        </motion.div>


        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 hidden md:block"
        >
          <p className="text-[10px] tracking-[0.3em] uppercase text-zinc-500 mb-4 [writing-mode:vertical-lr]">Scroll</p>
          <div className="w-[1px] h-12 bg-gradient-to-b from-orange-500 to-transparent mx-auto" />
        </motion.div>
      </section>

      {/* 2. MISSION SECTION (EDITORIAL LAYOUT) */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        <div className="grid md:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-8"
          >
            <div>
              <span className="text-orange-500 font-bold text-xs uppercase tracking-widest">01 / Purpose</span>
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter uppercase mt-4">
                Our Mission
              </h2>
            </div>
            <p className="text-zinc-400 text-xl leading-relaxed font-light italic">
              &ldquo;At Hitrex, we inspire individuals to embrace the outdoors through unforgettable
              hiking and trekking experiences that challenge the body and nourish the soul.&rdquo;
            </p>
            <p className="text-zinc-500 leading-relaxed">
              We connect clients with nature’s most beautiful landscapes, fostering
              appreciation for wellness, environment, and growth. Our journeys are designed
              not just to reach a peak, but to discover the strength within.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl group"
          >
            <Image
              src="/images/missio.avif"
              alt="Our Mission"
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 ring-1 ring-inset ring-white/20 rounded-[3rem]" />
          </motion.div>
        </div>
      </section>

      {/* 3. CORE VALUES (HORIZONTAL CARDS) */}
      <section className="bg-zinc-950/50 py-12 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-6">
            <h2 className="text-5xl text-center md:text-left mx-auto md:mx-0 md:ml-[20px] font-black uppercase tracking-tighter">
              Extraordinary<br />
              <span className="text-orange-600">Values</span>
            </h2>

            <p className="max-w-sm text-zinc-500 text-sm">Guided by a commitment to the wild, safety, and the spirit of the global trekking community.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <ValueCard
              title="Extraordinary Experiences"
              desc="Every trek with us is a unique story — whether mountain trails or hidden wonders, we create experiences that last a lifetime. Our expert guides ensure every journey is safe and inspiring."
            />
            <ValueCard
              title="Our Core Values"
              desc="Adventure, sustainability, and community. We promote exploration with respect for nature and a commitment to safety and purpose-driven travel."
            />
          </div>
        </div>
      </section>

      {/* 4. TEAM SECTION (MODERN GRID) */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="text-center mb-10">
          <span className="text-orange-500 font-bold text-xs uppercase tracking-[0.4em]">The Experts</span>
          <h2 className="text-6xl font-black uppercase tracking-tighter mt-4">Meet Our Team</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {teamMembers.map((member, idx) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.8 }}
              className="group text-left"
            >
              <div className="relative h-[550px] rounded-[2.5rem] overflow-hidden mb-8 bg-zinc-900 shadow-xl border border-white/5">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent opacity-80" />
              </div>

              <div className="space-y-4 px-4">
                <div>
                  <h3 className="text-3xl font-black uppercase tracking-tighter text-white">
                    {member.name}
                  </h3>
                  <p className="text-orange-600 text-xs font-black uppercase tracking-[0.2em] mt-2">
                    {member.role}
                  </p>
                </div>

                <div className="space-y-4 text-zinc-400 text-sm leading-relaxed font-light">
                  <p>{member.bio}</p>
                  <p className="hidden md:block text-zinc-500">{member.details}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}

function ValueCard({ title, desc }) {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl transition-all hover:bg-white/[0.05] hover:border-white/10"
    >
      <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center mb-8 shadow-[0_0_20px_rgba(234,88,12,0.4)]">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
      </div>
      <h3 className="text-3xl font-black uppercase tracking-tighter mb-4">{title}</h3>
      <p className="text-zinc-400 leading-relaxed font-light">{desc}</p>
    </motion.div>
  );
}