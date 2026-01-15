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

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  const moveHighlight = (e) => {
    if (!navLinksContainerRef.current) return;
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
        className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-500 ease-in-out px-3 py-2 sm:px-4 sm:py-4 ${
          hidden ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div 
          // REMOVED: 'border', 'border-white/10', 'border-white/20'
          className={`max-w-7xl mx-auto transition-all duration-500 rounded-full ${
            scrolled || isAdminPage
              ? "bg-black/90 backdrop-blur-2xl py-1.5 sm:py-2 shadow-2xl" 
              : "bg-black/40 backdrop-blur-md py-2 sm:py-3"
          }`}
        >
          <div className="flex items-center justify-between px-4 sm:px-6">
            
            {/* 1. BRAND LOGO */}
            <Link href="/" className="flex items-center gap-2 group z-50">
              <div className="h-9 sm:h-[56px] flex items-center transition-all duration-300">
                <img
                  src="/logo.png"
                  alt="Hitrex Logo"
                  className="h-full w-auto object-contain transition-transform group-hover:scale-105"
                />
              </div>
            </Link>

            {/* 2. DESKTOP NAV - Hidden on Mobile/Tablet */}
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

            {/* 3. RIGHT SECTION */}
            <div className="flex items-center gap-3 sm:gap-4">
              
              {/* DESKTOP ONLY GROUP */}
              <div className="hidden lg:flex items-center gap-4">
                {session ? (
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all group"
                    >
                      <div className="w-7 h-7 rounded-full bg-[#1a1a1a] border border-white/20 flex items-center justify-center group-hover:border-[#00c985] transition-colors">
                        <svg className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#00c985] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                      </div>
                      <span className="text-[11px] font-black uppercase tracking-widest text-white hidden sm:block">Profile</span>
                      <svg className={`w-3.5 h-3.5 text-[#00c985] transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {isProfileOpen && (
                      <div className="absolute right-0 mt-4 w-56 bg-[#0f0f0f]/95 border border-white/10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-5 border-b border-white/5">
                          <p className="text-[10px] font-black text-[#00c985] uppercase tracking-widest mb-1">Authenticated</p>
                          <p className="text-white font-bold truncate text-sm uppercase italic tracking-tighter">{session.user?.name}</p>
                        </div>
                        <div className="p-2">
                          <Link href={session.user?.role === "admin" ? "/admin" : "/user/dashboard"} onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-300 hover:bg-white/5 hover:text-[#00c985] transition-all">
                            Dashboard
                          </Link>
                          <button onClick={() => signOut()} className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 transition-all">
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="px-6 py-2.5 rounded-full border border-[#00c985] text-[#00c985] hover:bg-[#00c985] hover:text-black transition-all text-[11px] font-black uppercase tracking-widest shadow-[0_0_10px_rgba(0,201,133,0.2)]"
                  >
                    Login
                  </Link>
                )}

                <Link
                  href="/page/destination"
                  className="bg-[#00c985] hover:bg-[#00e094] text-black px-7 py-2.5 rounded-full text-[12px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-[0_10px_20px_rgba(0,201,133,0.3)]"
                >
                  Book Now
                </Link>
              </div>

              {/* Mobile Menu Toggle */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                className="p-1.5 text-white hover:bg-white/10 rounded-full transition-colors lg:hidden"
              >
                <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* --- MOBILE SIDEBAR --- */}
      <div className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-[70] transition-opacity duration-300 lg:hidden ${isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`} onClick={() => setIsMenuOpen(false)} />
      
      <aside className={`fixed top-0 right-0 h-[100dvh] w-[300px] bg-[#0a0a0a] z-[80] shadow-2xl transform transition-transform duration-500 ease-out border-l border-white/5 lg:hidden ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex flex-col h-full p-8 overflow-y-auto">
           <button onClick={() => setIsMenuOpen(false)} className="self-end p-2 text-gray-400 hover:text-white transition-colors bg-white/5 rounded-full">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          
          <div className="mt-8 flex flex-col space-y-6">
            <p className="text-[10px] font-black text-[#ff4d00] uppercase tracking-[0.3em] mb-2 border-b border-white/10 pb-2">Explore</p>
            {menuLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setIsMenuOpen(false)} className={`text-2xl font-black italic uppercase tracking-tighter transition-colors ${pathname === link.href ? "text-[#00c985]" : "text-white hover:text-[#00c985]"}`}>
                {link.label}
              </Link>
            ))}
          </div>

          <div className="mt-auto pt-8">
            
            {/* SIDEBAR BOOK NOW: Green Border, Transparent BG */}
            <Link 
              href="/page/destination" 
              onClick={() => setIsMenuOpen(false)} 
              className="block w-full text-center border border-[#00c985] text-[#00c985] py-4 rounded-xl text-[12px] font-black uppercase tracking-widest hover:bg-[#00c985] hover:text-black mb-4 transition-all"
            >
               Book Now
             </Link>

            <div className="border-t border-white/10 pt-6">
              {session ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-white/20 flex items-center justify-center text-[#00c985]">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
                    </div>
                    <div>
                      <p className="text-white text-xs font-bold uppercase tracking-wide">Hi, {session.user?.name?.split(" ")[0]}</p>
                      <Link href={session.user?.role === "admin" ? "/admin" : "/user/dashboard"} onClick={() => setIsMenuOpen(false)} className="text-[10px] text-[#00c985] font-black uppercase tracking-widest hover:underline">
                        Dashboard
                      </Link>
                    </div>
                  </div>
                  <button onClick={() => signOut()} className="w-full py-3 rounded-xl bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-colors">
                    Sign Out
                  </button>
                </div>
              ) : (
                
                // SIDEBAR LOGIN: Solid Emerald Color
                <Link 
                  href="/login" 
                  onClick={() => setIsMenuOpen(false)} 
                  className="block w-full text-center py-4 rounded-full bg-[#00c985] text-black text-[12px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(0,201,133,0.4)] hover:scale-105 transition-all duration-300"
                >
                  Login / Sign Up
                </Link>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}