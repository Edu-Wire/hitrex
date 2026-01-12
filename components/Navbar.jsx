"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  
  const lastScrollY = useRef(0);
  const navLinksContainerRef = useRef(null); 
  const [highlight, setHighlight] = useState({ width: 0, left: 0, opacity: 0 });

  const menuLinks = [
    { href: "/", label: "Home" },
    { href: "/page/activities", label: "Activities" },
    { href: "/page/destination", label: "Destinations" },
    { href: "/page/blog", label: "Journal" },
    { href: "/page/about", label: "About" },
  ];

  // --- Scroll Behavior ---
  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;
      setScrolled(current > 50);
      
      // Hide navbar on scroll down, show on scroll up
      if (current > lastScrollY.current && current > 150) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastScrollY.current = current;
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // --- Smooth Underline Logic ---
  const moveHighlight = (e) => {
    const link = e.currentTarget;
    const rect = link.getBoundingClientRect();
    const containerRect = navLinksContainerRef.current.getBoundingClientRect();
    
    // Width is text width (approx rect.width minus horizontal padding)
    // Left is relative to the start of the container
    setHighlight({
      width: rect.width - 24, // Matches the text width better by removing padding
      left: rect.left - containerRect.left + 12, // Offsets the line to center it
      opacity: 1,
    });
  };

  const hideHighlight = () => setHighlight((prev) => ({ ...prev, opacity: 0 }));

  return (
    <nav
      className={`font-sans fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out px-4 py-4 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div 
        className={`max-w-7xl mx-auto transition-all duration-500 rounded-full border border-white/10 ${
          scrolled 
            ? "bg-black/80 backdrop-blur-xl py-2 shadow-2xl border-white/20" 
            : "bg-white/5 backdrop-blur-md py-4"
        }`}
      >
        <div className="grid grid-cols-3 items-center px-6">
          
          {/* 1. BRAND LOGO */}
          <Link href="/" className="flex items-center gap-2 group w-fit">
            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg shadow-emerald-500/20">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 21l2-2m0 0l7-7 7 7M5 10l7-7 7 7" />
              </svg>
            </div>
            <span className="font-bold text-xl tracking-tighter text-white uppercase">Hitrex</span>
          </Link>

          {/* 2. DESKTOP NAV (THE HOVER FIX) */}
          <div 
            ref={navLinksContainerRef}
            className="hidden lg:flex relative items-center justify-center h-10"
          >
            {/* The Floating Line */}
            <div
              className="absolute bottom-1 h-[2px] bg-emerald-500 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] pointer-events-none"
              style={{
                width: highlight.width,
                left: highlight.left,
                opacity: highlight.opacity,
              }}
            />
            
            {menuLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onMouseEnter={moveHighlight}
                onMouseLeave={hideHighlight}
                className={`relative px-4 py-2 text-sm font-medium tracking-wide transition-colors duration-300 z-10 ${
                  pathname === link.href ? "text-emerald-400" : "text-gray-200 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* 3. AUTH & CTA */}
          <div className="flex items-center gap-4 justify-end">
            {!session ? (
              <Link href="/login" className="hidden md:block text-sm font-medium text-gray-300 hover:text-emerald-400 transition">
                Login
              </Link>
            ) : (
              <button 
                onClick={() => signOut()} 
                className="hidden md:block text-xs font-bold text-gray-400 hover:text-red-400 transition tracking-widest"
              >
                LOGOUT
              </button>
            )}
            
            <Link
              href="/page/destination"
              className="bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
            >
              Book Now
            </Link>

            {/* Mobile Burger Toggle */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="lg:hidden p-2 text-white z-50"
            >
              <div className="space-y-1.5">
                <span className={`block h-0.5 w-6 bg-current transition-all duration-300 ${isMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
                <span className={`block h-0.5 w-6 bg-current transition-all duration-300 ${isMenuOpen ? "opacity-0" : ""}`} />
                <span className={`block h-0.5 w-6 bg-current transition-all duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* --- MOBILE OVERLAY --- */}
      <div className={`fixed inset-0 bg-black/95 backdrop-blur-2xl transition-all duration-500 lg:hidden flex flex-col items-center justify-center space-y-8 text-3xl font-bold ${
        isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}>
        {menuLinks.map((link) => (
          <Link 
            key={link.href} 
            href={link.href} 
            onClick={() => setIsMenuOpen(false)} 
            className="hover:text-emerald-500 transition-colors uppercase tracking-tighter"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}