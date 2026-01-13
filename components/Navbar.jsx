"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  
  // Check if we are currently on an admin route
  const isAdminPage = pathname.startsWith("/admin");
  
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

  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;
      setScrolled(current > 50);
      
      // Keep navbar visible on admin pages or handle scroll hide
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
            // FORCE BLACK BLUR: if scrolled OR if on an admin page
            scrolled || isAdminPage
              ? "bg-black/80 backdrop-blur-xl py-2 shadow-2xl border-white/20" 
              : "bg-white/5 backdrop-blur-md py-4"
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
              <span className="font-bold text-lg sm:text-xl tracking-tighter text-white uppercase">Hitrex</span>
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
                  className={`relative px-4 py-2 text-sm font-medium transition-colors duration-300 z-10 ${
                    pathname === link.href ? "text-emerald-400" : "text-gray-200 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* 3. RIGHT SECTION (Admin Badge & Buttons) */}
            <div className="flex items-center gap-3">
              {/* Desktop Admin/User Badge */}
              {session && (
                <div className="hidden md:flex items-center gap-3 border-r border-white/10 pr-3 mr-1">
                   <Link
                    href={session.user?.role === "admin" ? "/admin" : "/user/dashboard"}
                    className={`text-[10px] font-bold px-3 py-1.5 rounded-full transition border ${
                        isAdminPage 
                        ? "bg-emerald-500 text-white border-emerald-400" 
                        : "bg-white/10 text-white border-white/5 hover:bg-emerald-500/20"
                    }`}
                  >
                    HI, {session.user?.name?.split(" ")[0].toUpperCase()}
                  </Link>
                  <button 
                    onClick={() => signOut()} 
                    className="text-[10px] font-bold text-gray-400 hover:text-red-400 transition tracking-widest"
                  >
                    LOGOUT
                  </button>
                </div>
              )}

              <Link
                href="/page/destination"
                className="hidden sm:block bg-emerald-500 hover:bg-emerald-400 text-white px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-widest transition-all active:scale-95"
              >
                Book Now
              </Link>

              {/* Mobile Menu Toggle */}
              <button 
                onClick={() => setIsMenuOpen(true)} 
                className="p-2 text-emerald-900 hover:bg-white/10 rounded-full transition-colors lg:hidden"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* --- MOBILE SIDEBAR DRAWER --- */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] transition-opacity duration-300 lg:hidden ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      <aside className={`fixed top-0 right-0 h-full w-[280px] bg-[#0a0a0a] z-[80] shadow-2xl transform transition-transform duration-500 ease-out lg:hidden border-l border-white/10 ${
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
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2">Navigation</p>
            {menuLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                onClick={() => setIsMenuOpen(false)} 
                className={`text-2xl font-semibold tracking-tight transition-colors ${
                  pathname === link.href ? "text-emerald-400" : "text-white hover:text-emerald-400"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="mt-auto pt-8 border-t border-white/10">
            {session ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold">
                    {session.user?.name?.[0]}
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">Hi, {session.user?.name?.split(" ")[0]}</p>
                    <Link 
                      href={session.user?.role === "admin" ? "/admin" : "/user/dashboard"}
                      onClick={() => setIsMenuOpen(false)}
                      className="text-xs text-emerald-400 font-bold uppercase tracking-wider"
                    >
                      Dashboard
                    </Link>
                  </div>
                </div>
                <button 
                  onClick={() => signOut()}
                  className="w-full py-3 rounded-xl bg-red-500/10 text-red-500 text-xs font-bold tracking-widest hover:bg-red-500"
                >
                  LOGOUT
                </button>
              </div>
            ) : (
              <Link 
                href="/login" 
                onClick={() => setIsMenuOpen(false)}
                className="block w-full text-center py-4 rounded-xl bg-emerald-500 text-white font-bold"
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