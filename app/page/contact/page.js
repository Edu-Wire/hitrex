"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { Mail, Phone, MapPin, Facebook, Twitter, Youtube, Send } from "lucide-react";

export default function ContactPage() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="bg-[#050505] text-white selection:bg-[#ff4d00] min-h-screen">
      
      {/* Hero Section - High Contrast Dark */}
      <div className="relative h-[70vh] overflow-hidden flex items-center justify-center">
        <Image
          src="/images/mountains.avif" // Ensure this path is correct or use a high-res landscape
          alt="Contact Background"
          fill
          className="object-cover brightness-[0.3] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-[#050505]"></div>
        
        <div className="relative z-10 text-center px-6">
          <motion.p
            initial={{ opacity: 0, tracking: "0.1em" }}
            animate={{ opacity: 1, tracking: "0.5em" }}
            transition={{ duration: 1 }}
            className="text-[#ff4d00] font-black uppercase text-[10px] md:text-xs mb-4 tracking-[0.5em]"
          >
            Get In Touch
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-6xl md:text-8xl font-black text-white uppercase italic tracking-tighter leading-none"
          >
            Contact <span className="text-[#ff4d00]">Us</span>
          </motion.h1>
        </div>
      </div>

      {/* Contact Section */}
      <section className="max-w-7xl mx-auto py-24 px-6 grid md:grid-cols-2 gap-16 md:gap-24 relative z-10 -mt-32">
        
        {/* Left Side - Contact Form (Themed Card) */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="bg-[#0f0f0f] backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-10 md:p-14 border border-white/5"
        >
          <h2 className="text-3xl md:text-4xl font-black mb-8 text-white uppercase italic tracking-tighter leading-tight">
            Ready for an <br /> <span className="text-[#ff4d00]">Adventure?</span>
          </h2>
          
          <form className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#ff4d00] ml-2">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full bg-[#1a1a1a] border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-[#ff4d00] transition-all text-white placeholder:text-zinc-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#ff4d00] ml-2">Email Address</label>
              <input
                type="email"
                placeholder="john@example.com"
                className="w-full bg-[#1a1a1a] border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-[#ff4d00] transition-all text-white placeholder:text-zinc-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#ff4d00] ml-2">Message</label>
              <textarea
                placeholder="Tell us about your next trek..."
                rows="4"
                className="w-full bg-[#1a1a1a] border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-[#ff4d00] transition-all text-white placeholder:text-zinc-600 resize-none"
              ></textarea>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-[#ff4d00] text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center gap-3 shadow-[0_10px_30px_-10px_#ff4d00]"
            >
              Send Message
              <Send size={18} />
            </motion.button>
          </form>
        </motion.div>

        {/* Right Side - Contact Info */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col justify-center space-y-12"
        >
          <div className="space-y-4">
            <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">Information</h2>
            <div className="h-1 w-20 bg-[#ff4d00]"></div>
            <p className="text-zinc-400 text-lg leading-relaxed max-w-sm font-medium">
              Have questions about gear, difficulty levels, or custom routes? Our guides are ready to help.
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex items-start gap-5 group">
              <div className="p-4 bg-[#111] rounded-2xl border border-white/5 group-hover:border-[#ff4d00] transition-colors">
                <MapPin className="text-[#ff4d00]" size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-1">Base Camp</p>
                <span className="text-xl font-bold uppercase tracking-tight">Brussels, Belgium</span>
              </div>
            </div>

            <div className="flex items-start gap-5 group">
              <div className="p-4 bg-[#111] rounded-2xl border border-white/5 group-hover:border-[#ff4d00] transition-colors">
                <Mail className="text-[#ff4d00]" size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-1">Direct Line</p>
                <span className="text-xl font-bold uppercase tracking-tight">hitrextrips@gmail.com</span>
              </div>
            </div>

            <div className="flex items-start gap-5 group">
              <div className="p-4 bg-[#111] rounded-2xl border border-white/5 group-hover:border-[#ff4d00] transition-colors">
                <Phone className="text-[#ff4d00]" size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-1">Support</p>
                <span className="text-xl font-bold uppercase tracking-tight">+32 400 000 000</span>
              </div>
            </div>
          </div>

          {/* Social Media Icons */}
          <div className="pt-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 text-zinc-500">Connect with the community</h3>
            <div className="flex items-center gap-4">
              {[Facebook, Twitter, Youtube].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ y: -5, color: "#ff4d00" }}
                  className="w-14 h-14 bg-[#111] border border-white/5 text-white rounded-2xl flex items-center justify-center hover:border-[#ff4d00]/50 transition-all shadow-xl"
                >
                  <Icon size={22} />
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Subtle Background Glow */}
      <div className="fixed bottom-0 right-0 w-[50vw] h-[50vh] bg-[#ff4d00]/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
    </div>
  );
}