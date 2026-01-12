"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  
  const lastScrollY = useRef(0);
  const containerRef = useRef(null);
  const linkRefs = useRef([]);
  const [highlight, setHighlight] = useState({ width: 0, left: 0, opacity: 0 });

  const menuLinks = [
    { href: "/", label: "Home" },
    { href: "/page/activities", label: "Activities" },
    { href: "/page/destination", label: "Destinations" },
    { href: "/page/blog", label: "Journal" },
    { href: "/page/about", label: "Our Story" },
  ];

  // Scroll logic
  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;
      setScrolled(current > 50);
      
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

  // Sliding Highlight Logic
  const moveHighlight = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    setHighlight({
      width: rect.width,
      left: rect.left - containerRect.left,
      opacity: 1,
    });
  };

  const hideHighlight = () => setHighlight((prev) => ({ ...prev, opacity: 0 }));

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out px-4 py-4 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div 
        ref={containerRef}
        className={`max-w-7xl mx-auto transition-all duration-300 rounded-full border border-white/10 ${
          scrolled 
            ? "bg-black/60 backdrop-blur-xl py-2 shadow-2xl border-white/20" 
            : "bg-white/5 backdrop-blur-md py-4"
        }`}
      >
        <div className="flex items-center justify-between px-6">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg shadow-emerald-500/20">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 21l2-2m0 0l7-7 7 7M5 10l7-7 7 7" />
              </svg>
            </div>
            <span className="font-bold text-xl tracking-tighter text-white">HITREX</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex relative items-center gap-1">
            {/* Sliding Background */}
            <div
              className="absolute h-10 bg-white/10 rounded-full transition-all duration-300 ease-out pointer-events-none"
              style={{
                width: highlight.width,
                left: highlight.left,
                opacity: highlight.opacity,
              }}
            />
            
            {menuLinks.map((link, idx) => (
              <Link
                key={link.href}
                href={link.href}
                onMouseEnter={moveHighlight}
                onMouseLeave={hideHighlight}
                className={`relative px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                  pathname === link.href ? "text-emerald-400" : "text-gray-200 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Section: Auth & CTA */}
          <div className="flex items-center gap-4">
            {session ? (
              <div className="hidden md:flex items-center gap-4 border-l border-white/10 pl-4">
                <span className="text-xs text-gray-400 uppercase tracking-widest">Hi, {session.user?.name?.split(' ')[0]}</span>
                <button 
                  onClick={() => signOut()}
                  className="text-xs font-bold hover:text-emerald-400 transition"
                >
                  LOGOUT
                </button>
              </div>
            ) : (
              <Link href="/login" className="hidden md:block text-sm font-medium hover:text-emerald-400 transition">
                Login
              </Link>
            )}
            
            <Link
              href="/page/destination"
              className="bg-emerald-500 hover:bg-emerald-400 text-white px-5 py-2 rounded-full text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/20"
            >
              Book Adventure
            </Link>

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-white"
            >
              <div className="space-y-1.5">
                <span className={`block h-0.5 w-6 bg-current transition-transform ${isMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
                <span className={`block h-0.5 w-6 bg-current transition-opacity ${isMenuOpen ? "opacity-0" : ""}`} />
                <span className={`block h-0.5 w-6 bg-current transition-transform ${isMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-black/95 backdrop-blur-2xl transition-all duration-500 lg:hidden ${
        isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}>
        <div className="flex flex-col items-center justify-center h-full space-y-8 text-2xl font-bold">
           {menuLinks.map((link) => (
             <Link key={link.href} href={link.href} onClick={() => setIsMenuOpen(false)} className="hover:text-emerald-500 transition">
                {link.label}
             </Link>
           ))}
           {session?.user.role === 'admin' && (
             <Link href="/admin" className="text-purple-400">Admin Dashboard</Link>
           )}
        </div>
      </div>
    </nav>
  );
}