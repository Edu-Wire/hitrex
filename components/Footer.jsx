"use client";
import Link from "next/link";
import { 
  Mail, Phone, MapPin, Facebook, Twitter, 
  Instagram, Youtube, Send
} from "lucide-react";
import { FadeInUp, StaggerContainer, StaggerItem } from "./animations";

export default function Footer() {
  return (
    <footer className="font-sans bg-emerald-950 text-emerald-50 mt-0 border-t border-emerald-900 text-xs lg:text-sm">
      {/* Reduced outer vertical padding to py-6 */}
      <div className="max-w-7xl mx-auto px-3 py-6">
        
        {/* Grid: 1 col mobile (stacked blocks), 2 col tablet, 4 col desktop */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* --- BLOCK 1: BRAND --- */}
          <StaggerItem className="bg-emerald-900/20 rounded-xl p-4 border border-white/5">
            <FadeInUp>
              <div className="flex flex-col h-full justify-between gap-3">
                <div>
                  {/* Logo height: h-12 (48px) */}
                  <div className="mb-3">
                    <img 
                      src="/logo.png" 
                      alt="HITREX Logo" 
                      className="h-12 w-auto object-contain" 
                    />
                  </div>
                  {/* Text: small on mobile, standard on desktop */}
                  <p className="text-emerald-200/50 leading-relaxed text-[11px] lg:text-sm">
                    Your companion for unforgettable trekking adventures.
                  </p>
                </div>
                <div className="flex gap-3">
                  {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                    <a key={i} href="#" className="text-emerald-400 hover:text-white transition-colors">
                      <Icon className="w-4 h-4 lg:w-5 lg:h-5" />
                    </a>
                  ))}
                </div>
              </div>
            </FadeInUp>
          </StaggerItem>

          {/* --- BLOCK 2: LINKS --- */}
          <StaggerItem className="bg-emerald-900/20 rounded-xl p-4 border border-white/5">
            <FadeInUp delay={0.1}>
              <h4 className="text-white font-bold mb-2 uppercase tracking-wider text-[10px] lg:text-xs">
                Quick Links
              </h4>
              {/* Grid: 2 cols mobile, 1 col desktop */}
              <ul className="grid grid-cols-2 lg:grid-cols-1 gap-y-1.5 lg:gap-y-2 gap-x-2">
                {['Home', 'About Us', 'Destinations', 'Activities', 'Blog', 'Contact'].map((item) => (
                  <li key={item}>
                    <Link 
                      href={item === 'Home' ? '/' : `/page/${item.toLowerCase().replace(' ', '')}`} 
                      className="text-emerald-200/60 hover:text-emerald-400 transition-colors font-medium block text-[11px] lg:text-sm"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </FadeInUp>
          </StaggerItem>

          {/* --- BLOCK 3: SERVICES --- */}
          <StaggerItem className="bg-emerald-900/20 rounded-xl p-4 border border-white/5">
            <FadeInUp delay={0.2}>
              <h4 className="text-white font-bold mb-2 uppercase tracking-wider text-[10px] lg:text-xs">
                Services
              </h4>
              <ul className="grid grid-cols-2 lg:grid-cols-1 gap-y-1.5 lg:gap-y-2 gap-x-2">
                {['Day Trips', 'Weekends', 'Camping', 'Groups', 'Rentals', 'Guides'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-emerald-200/60 hover:text-emerald-400 transition-colors font-medium block text-[11px] lg:text-sm">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </FadeInUp>
          </StaggerItem>

          {/* --- BLOCK 4: CONTACT --- */}
          <StaggerItem className="bg-emerald-900/20 rounded-xl p-4 border border-white/5">
            <FadeInUp delay={0.3}>
              <h4 className="text-white font-bold mb-2 uppercase tracking-wider text-[10px] lg:text-xs">
                Contact
              </h4>
              
              <div className="space-y-2 mb-3">
                <div className="flex items-start gap-2">
                  <MapPin className="text-emerald-500 shrink-0 mt-0.5 w-3 h-3 lg:w-4 lg:h-4" />
                  <span className="text-emerald-200/60 text-[11px] lg:text-sm">Brussels, Belgium</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="text-emerald-500 shrink-0 w-3 h-3 lg:w-4 lg:h-4" />
                  <span className="text-emerald-200/60 text-[11px] lg:text-sm">+32 400 00 00 00</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="text-emerald-500 shrink-0 w-3 h-3 lg:w-4 lg:h-4" />
                  <span className="text-emerald-200/60 text-[11px] lg:text-sm">info@hitrex.com</span>
                </div>
              </div>

              {/* Compact Input */}
              <div className="relative">
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full bg-emerald-950/50 border border-emerald-800/50 rounded-lg px-2 py-1.5 text-emerald-100 focus:outline-none focus:border-emerald-500 text-[11px] lg:text-sm placeholder:text-emerald-800"
                />
                <button className="absolute right-1 top-1 bg-emerald-600 hover:bg-emerald-500 text-white p-0.5 rounded-md transition-colors">
                  <Send className="w-3 h-3 lg:w-4 lg:h-4" />
                </button>
              </div>
            </FadeInUp>
          </StaggerItem>

        </StaggerContainer>

        {/* --- BOTTOM BAR --- */}
        <FadeInUp delay={0.4}>
          <div className="mt-4 pt-3 border-t border-emerald-900/50 flex flex-col md:flex-row justify-between items-center gap-2 text-[10px] lg:text-xs">
            <p className="text-emerald-500/30">
              © 2025 HITREX.
            </p>
            <div className="flex gap-4">
              {['Privacy', 'Terms', 'Cookies'].map((link) => (
                <Link key={link} href="#" className="text-emerald-500/30 hover:text-emerald-400 transition-colors">
                  {link}
                </Link>
              ))}
            </div>
          </div>
        </FadeInUp>
      </div>
    </footer>
  );
}