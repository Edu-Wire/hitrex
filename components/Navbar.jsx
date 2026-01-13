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
  const [isProfileOpen, setIsProfileOpen] = useState(false); // Dropdown state
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  
  const lastScrollY = useRef(0);
  const dropdownRef = useRef(null); // Ref for outside click detection
  const navLinksContainerRef = useRef(null); 
  const [highlight, setHighlight] = useState({ width: 0, left: 0, opacity: 0 });

  const menuLinks = [
    { href: "/", label: "Home" },
    { href: "/page/activities", label: "Activities" },
    { href: "/page/destination", label: "Destinations" },
    { href: "/page/blog", label: "Journal" },
    { href: "/page/about", label: "About" },
  ];

  // Handle click outside to close dropdown
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
              : "bg-black/50 backdrop-blur-md py-4"
          }`}
        >
          <div className="flex items-center justify-between px-6">
            
            {/* 1. BRAND LOGO */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-500 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg shadow-emerald-500/20">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 21l2-2m0 0l7-7 7 7M5 10l7-7 7 7" />
                </svg>
              </div>
              <span className="font-black text-lg sm:text-xl tracking-tighter text-white uppercase italic">Hitrex</span>
            </Link>

            {/* 2. DESKTOP NAV */}
            <div 
              ref={navLinksContainerRef}
              className="hidden lg:flex relative items-center justify-center h-10"
            >
              <div
                className="absolute bottom-1 h-[2px] bg-emerald-500 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] pointer-events-none"
                style={{ width: highlight.width, left: highlight.left, opacity: highlight.opacity }}
              />
              {menuLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onMouseEnter={moveHighlight}
                  onMouseLeave={hideHighlight}
                  className={`relative px-4 py-2 text-[15px] font-black uppercase tracking-widest transition-colors duration-300 z-10 ${
                    pathname === link.href ? "text-emerald-400" : "text-gray-300 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* 3. RIGHT SECTION (Profile & Buttons) */}
            <div className="flex items-center gap-3">
              {session ? (
                <div className="relative" ref={dropdownRef}>
                  {/* Profile Avatar Trigger */}
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-emerald-500/50 hover:border-emerald-500 transition-all overflow-hidden bg-[#1a1a1a]"
                  >
                    {session.user?.image ? (
                      <img src={session.user.image} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-emerald-500 font-black text-sm uppercase">
                        {session.user?.name?.[0]}
                      </span>
                    )}
                  </button>

                  {/* Profile Dropdown Menu */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-4 w-56 bg-[#0f0f0f] border border-white/10 rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                      <div className="p-5 border-b border-white/5">
                        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Signed in as</p>
                        <p className="text-white font-bold truncate">{session.user?.name}</p>
                      </div>
                      
                      <div className="p-2">
                        <Link
                          href={session.user?.role === "admin" ? "/admin" : "/user/dashboard"}
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-300 hover:bg-white/5 hover:text-white transition-all group"
                        >
                          <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Dashboard
                        </Link>
                        
                        <button
                          onClick={() => signOut()}
                          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold text-red-400 hover:bg-red-500/10 transition-all group"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden sm:block bg-white/5 hover:bg-white/10 text-white px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-widest transition-all active:scale-95 border border-white/10"
                >
                  Login
                </Link>
              )}

              <Link
                href="/page/destination"
                className="hidden sm:block bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
              >
                Book Now
              </Link>

              {/* Menu Toggle */}
               <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-white hover:bg-white/10 rounded-full transition-colors"
              >
                {isMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                  </svg>
                )}
               </button> 
            </div>
          </div>
        </div>
      </nav>

      {/* --- SIDEBAR DRAWER --- */}
      <div
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-[70] transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      <aside className={`fixed top-0 right-0 h-full w-[300px] bg-[#0a0a0a] z-[80] shadow-2xl transform transition-transform duration-500 ease-out border-l border-white/5 ${
        isMenuOpen ? "translate-x-0" : "translate-x-full"
      }`}>
        <div className="flex flex-col h-full p-8">
          <button 
            onClick={() => setIsMenuOpen(false)}
            className="self-end p-2 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="mt-12 flex flex-col space-y-6">
            <p className="text-[10px] font-black text-[#ff4d00] uppercase tracking-[0.3em] mb-2">Explore</p>
            {menuLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                onClick={() => setIsMenuOpen(false)} 
                className={`text-3xl font-black italic uppercase tracking-tighter transition-colors ${
                  pathname === link.href ? "text-emerald-400" : "text-white hover:text-emerald-400"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="mt-auto pt-8 border-t border-white/5">
            {session ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                  <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white font-black text-xl italic">
                    {session.user?.name?.[0]}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-white font-black uppercase text-sm truncate">{session.user?.name}</p>
                    <Link 
                      href={session.user?.role === "admin" ? "/admin" : "/user/dashboard"}
                      onClick={() => setIsMenuOpen(false)}
                      className="text-[10px] text-emerald-400 font-black uppercase tracking-widest"
                    >
                      View Dashboard
                    </Link>
                  </div>
                </div>
                <button 
                  onClick={() => signOut()}
                  className="w-full py-4 rounded-2xl bg-red-500/10 text-red-500 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-red-500 hover:text-white transition-all"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link 
                href="/login" 
                onClick={() => setIsMenuOpen(false)}
                className="block w-full text-center py-4 rounded-2xl bg-emerald-500 text-white font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}