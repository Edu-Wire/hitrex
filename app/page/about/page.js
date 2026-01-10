"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { Playfair_Display } from "next/font/google";

const displaySerif = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
});

export default function AboutPage() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  };

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.6]);

  return (
    <div className="relative min-h-screen text-gray-100 overflow-hidden">
      {/* Static background image */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/abooutBg.jpg"
          alt="About background"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/45" />
      </div>

      {/* Hero Section */}
      <div ref={heroRef} className="relative h-[70vh] overflow-hidden">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0">
          {/* transparent layer to keep parallax spacing; bg is fixed */}
        </motion.div>
        <div className="absolute inset-0 flex items-center justify-center text-center px-6">
          <motion.h1
            initial={{ opacity: 0, y: 50, scale: 3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            style={{
              scale: useTransform(scrollYProgress, [0, 3], [3, 0.85]),
            }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`${displaySerif.className} text-8xl md:text-6xl font-bold text-white drop-shadow-2xl origin-center ml-10`}
          >
            Who We Are ?
          </motion.h1>


     


        </div>
      </div>

      {/* Mission Section */}
      <section className="relative max-w-6xl mx-auto py-20 px-6 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="text-2xl font-bold mb-4 relative text-white">
            Our Mission
            <span className="block w-16 h-[3px] bg-green-700 mt-2"></span>
          </h2>
          <p className="text-gray-200 leading-relaxed">
            At Hitrex, we inspire individuals to embrace the outdoors through unforgettable
            hiking and trekking experiences that challenge the body and nourish the soul.
            We connect clients with nature’s most beautiful landscapes, fostering
            appreciation for wellness, environment, and growth.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Image
            src="/images/missio.avif"
            alt="Our Mission"
            width={600}
            height={400}
            className="rounded-2xl shadow-lg"
          />
        </motion.div>
      </section>

      {/* Experiences and Values */}
      <section className="relative max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h2 className="text-2xl font-bold mb-4 relative text-white">
            Extraordinary Experiences
            <span className="block w-16 h-[3px] bg-green-700 mt-2"></span>
          </h2>
          <p className="text-gray-200 leading-relaxed">
            Every trek with us is a unique story — whether mountain trails or hidden wonders,
            we create experiences that last a lifetime. Our expert guides ensure every
            journey is safe, inspiring, and unforgettable.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="text-2xl font-bold mb-4 relative text-white">
            Our Core Values
            <span className="block w-16 h-[3px] bg-green-700 mt-2"></span>
          </h2>
          <p className="text-gray-200 leading-relaxed">
            Our values revolve around <strong>adventure</strong>, <strong>sustainability</strong>, and
            <strong> community</strong>. We promote exploration with respect for nature and a
            commitment to safety and purpose-driven travel.
          </p>
        </motion.div>
      </section>

      {/* Team Section */}
      <section className="relative max-w-6xl mx-auto px-6 py-20 text-center">
        <motion.div
          className="pointer-events-none absolute inset-0"
          animate={{ opacity: [0.6, 0.3, 0.6] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="absolute -left-8 top-6 h-24 w-24 rounded-full bg-emerald-500/10 blur-2xl" />
          <div className="absolute right-0 bottom-0 h-28 w-28 rounded-full bg-blue-400/10 blur-2xl" />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold mb-12"
        >
          Meet Our Team
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((member, idx) => (
            <motion.div
              key={member}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: idx * 0.12, ease: "easeOut" }}
              whileHover={{ scale: 1.05, translateY: -4 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white/10 border border-white/15 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition backdrop-blur"
            >
              <Image
                src={`/images/person-${member}.avif`}
                alt="Team Member"
                width={400}
                height={300}
                className="w-full h-64 object-cover"
              />
              <div className="p-5">
                <h3 className="text-lg font-semibold text-emerald-200">
                  {`Team Member ${member}`}
                </h3>
                <p className="text-gray-100 text-sm mt-2">
                  Passionate explorer dedicated to creating memorable outdoor adventures.
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
