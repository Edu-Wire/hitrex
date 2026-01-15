"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Youtube,
  Send,
} from "lucide-react";
import Footer from "@/components/Footer";

export default function ContactPage() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="bg-[#050505] text-white selection:bg-[#ff4d00] min-h-screen relative">

      {/* 🔥 FIX: Black background behind navbar (PAGE-ONLY FIX) */}
      <div className="fixed top-0 left-0 w-full h-[128px] bg-[#050505] z-0" />

      {/* PAGE CONTENT */}
      <div className="relative z-10 pt-32">

        {/* Hero Section */}
        <div className="relative h-[70vh] overflow-hidden flex items-center justify-center">
          <Image
            src="/images/mountains.avif"
            alt="Contact Background"
            fill
            className="object-cover brightness-[0.3] scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-[#050505]" />

          <div className="relative z-10 text-center px-6">
            <motion.p
              initial={{ opacity: 0, letterSpacing: "0.1em" }}
              animate={{ opacity: 1, letterSpacing: "0.5em" }}
              transition={{ duration: 1 }}
              className="text-[#ff4d00] font-black uppercase text-[10px] md:text-xs mb-4 tracking-[0.5em]"
            >
              Get In Touch
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-none"
            >
              Contact <span className="text-[#ff4d00]">Us</span>
            </motion.h1>
          </div>
        </div>

        {/* Contact Section */}
        <section className="max-w-7xl mx-auto py-24 px-6 grid md:grid-cols-2 gap-16 md:gap-24 relative z-10 -mt-32">

          {/* Contact Form */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="bg-[#0f0f0f] rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-10 md:p-14 border border-white/5"
          >
            <h2 className="text-3xl md:text-4xl font-black mb-8 uppercase italic tracking-tighter">
              Ready for an <br />
              <span className="text-[#ff4d00]">Adventure?</span>
            </h2>

            <form className="space-y-6">
              {[
                { label: "Full Name", placeholder: "John Doe", type: "text" },
                {
                  label: "Email Address",
                  placeholder: "john@example.com",
                  type: "email",
                },
              ].map((field) => (
                <div key={field.label} className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#ff4d00] ml-2">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    className="w-full bg-[#1a1a1a] border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-[#ff4d00] text-white placeholder:text-zinc-600"
                  />
                </div>
              ))}

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#ff4d00] ml-2">
                  Message
                </label>
                <textarea
                  rows="4"
                  placeholder="Tell us about your next trek..."
                  className="w-full bg-[#1a1a1a] border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-[#ff4d00] text-white placeholder:text-zinc-600 resize-none"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-[#ff4d00] text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3 shadow-[0_10px_30px_-10px_#ff4d00]"
              >
                Send Message <Send size={18} />
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-center space-y-12"
          >
            <div className="space-y-4">
              <h2 className="text-4xl font-black uppercase italic tracking-tighter">
                Information
              </h2>
              <div className="h-1 w-20 bg-[#ff4d00]" />
              <p className="text-zinc-400 text-lg leading-relaxed max-w-sm">
                Have questions about routes, gear, or difficulty? Our guides are ready to help.
              </p>
            </div>

            {[
              {
                icon: MapPin,
                label: "Base Camp",
                value: "Brussels, Belgium",
              },
              {
                icon: Mail,
                label: "Direct Line",
                value: "hitrextrips@gmail.com",
              },
              {
                icon: Phone,
                label: "Support",
                value: "+32 400 000 000",
              },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-5 group">
                <div className="p-4 bg-[#111] rounded-2xl border border-white/5 group-hover:border-[#ff4d00]">
                  <Icon className="text-[#ff4d00]" size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-1">
                    {label}
                  </p>
                  <span className="text-xl font-bold uppercase tracking-tight">
                    {value}
                  </span>
                </div>
              </div>
            ))}

            {/* Socials */}
            <div className="pt-8">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 text-zinc-500">
                Connect with the community
              </h3>
              <div className="flex gap-4">
                {[Facebook, Twitter, Youtube].map((Icon, index) => (
                  <motion.a
                    key={index}
                    whileHover={{ y: -5 }}
                    className="w-14 h-14 bg-[#111] border border-white/5 rounded-2xl flex items-center justify-center hover:border-[#ff4d00]"
                  >
                    <Icon size={22} />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </section>
      </div>

      {/* Background Glow */}
      <div className="fixed bottom-0 right-0 w-[50vw] h-[50vh] bg-[#ff4d00]/5 blur-[120px] pointer-events-none -z-10" />
      <Footer />
    </div>
  );
}
