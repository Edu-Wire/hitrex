"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith("/admin");
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false); 
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  
  const lastScrollY = useRef(0);
  const dropdownRef = useRef(null); 
  const navLinksContainerRef = useRef(null); 
  const [highlight, setHighlight] = useState({ width: 0, left: 0, opacity: 0 });

  const menuLinks = [
    { href: "/", label: "Home" },
    { href: "/page/activities", label: "Activities" },
    { href: "/page/destination", label: "Destinations" },
    { href: "/page/blog", label: "Journal" },
    { href: "/page/about", label: "About" },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;
      setScrolled(current > 50);
      if (current > lastScrollY.current && current > 150 && !isMenuOpen) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastScrollY.current = current;
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [isMenuOpen]);

  const moveHighlight = (e) => {
    const link = e.currentTarget;
    const rect = link.getBoundingClientRect();
    const containerRect = navLinksContainerRef.current.getBoundingClientRect();
    setHighlight({
      width: rect.width - 24,
      left: rect.left - containerRect.left + 12,
      opacity: 1,
    });
  };

  const hideHighlight = () => setHighlight((prev) => ({ ...prev, opacity: 0 }));

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-500 ease-in-out px-4 py-4 ${
          hidden ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div 
          className={`max-w-7xl mx-auto transition-all duration-500 rounded-full border border-white/10 ${
            scrolled || isAdminPage
              ? "bg-black/90 backdrop-blur-2xl py-2 shadow-2xl border-white/20" 
              : "bg-black/40 backdrop-blur-md py-3"
          }`}
        >
          <div className="flex items-center justify-between px-6">
            
            {/* 1. BRAND LOGO */}
          <Link href="/" className="flex items-center gap-2 group">
  {/* Full Logo Image */}
  <div className="h-[56px] sm:h-[62px] flex items-center">
    <img
      src="/logo.png"
      alt="Hitrex Logo"
      className="h-full w-auto object-contain transition-transform group-hover:scale-105"
    />
  </div>

  {/* Brand Text (optional – keep or remove) */}

</Link>


            {/* 2. DESKTOP NAV */}
            <div 
              ref={navLinksContainerRef}
              className="hidden lg:flex relative items-center justify-center h-10"
            >
              <div
                className="absolute bottom-1 h-[2px] bg-[#00c985] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] pointer-events-none"
                style={{ width: highlight.width, left: highlight.left, opacity: highlight.opacity }}
              />
              {menuLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onMouseEnter={moveHighlight}
                  onMouseLeave={hideHighlight}
                  className={`relative px-4 py-2 text-[13px] font-black uppercase tracking-widest transition-colors duration-300 z-10 ${
                    pathname === link.href ? "text-[#00c985]" : "text-gray-300 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* 3. RIGHT SECTION - (MODIFIED BASED ON IMAGE) */}
            <div className="flex items-center gap-4">
              {session ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all group"
                  >
                    {/* Circle around Icon as seen in your screenshot */}
                    <div className="w-7 h-7 rounded-full bg-[#1a1a1a] border border-white/20 flex items-center justify-center group-hover:border-[#00c985] transition-colors">
                      <svg className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#00c985] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                    
                    <span className="text-[11px] font-black uppercase tracking-widest text-white hidden sm:block">
                      Profile
                    </span>

                    {/* Dropdown Arrow */}
                    <svg 
                      className={`w-3.5 h-3.5 text-[#00c985] transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} 
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Profile Dropdown Menu */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-4 w-56 bg-[#0f0f0f]/95 border border-white/10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                      <div className="p-5 border-b border-white/5">
                        <p className="text-[10px] font-black text-[#00c985] uppercase tracking-widest mb-1">Authenticated</p>
                        <p className="text-white font-bold truncate text-sm uppercase italic tracking-tighter">{session.user?.name}</p>
                      </div>
                      
                      <div className="p-2">
                        <Link
                          href={session.user?.role === "admin" ? "/admin" : "/user/dashboard"}
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-300 hover:bg-white/5 hover:text-[#00c985] transition-all"
                        >
                          Dashboard
                        </Link>
                        <button
                          onClick={() => signOut()}
                          className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 transition-all"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden sm:block text-white px-5 py-2 text-[11px] font-black uppercase tracking-widest hover:text-[#00c985] transition-all"
                >
                  Login
                </Link>
              )}

              {/* Book Now Button styled as per image colors */}
              <Link
                href="/page/destination"
                className="bg-[#00c985] hover:bg-[#00e094] text-black px-7 py-2.5 rounded-full text-[12px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-[0_10px_20px_rgba(0,201,133,0.3)]"
              >
                Book Now
              </Link>

              {/* Mobile Menu Icon */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                className="p-2 text-white hover:bg-white/10 rounded-full transition-colors lg:hidden"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* --- SIDEBAR DRAWER (KEEP UNTOUCHED) --- */}
      <div className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-[70] transition-opacity duration-300 ${isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`} onClick={() => setIsMenuOpen(false)} />
      <aside className={`fixed top-0 right-0 h-full w-[300px] bg-[#0a0a0a] z-[80] shadow-2xl transform transition-transform duration-500 ease-out border-l border-white/5 ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex flex-col h-full p-8">
           <button onClick={() => setIsMenuOpen(false)} className="self-end p-2 text-gray-400 hover:text-white transition-colors">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <div className="mt-12 flex flex-col space-y-6">
            <p className="text-[10px] font-black text-[#ff4d00] uppercase tracking-[0.3em] mb-2">Explore</p>
            {menuLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setIsMenuOpen(false)} className={`text-3xl font-black italic uppercase tracking-tighter transition-colors ${pathname === link.href ? "text-emerald-400" : "text-white hover:text-emerald-400"}`}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}