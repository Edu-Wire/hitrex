"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect, useRef } from "react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const dropdownRef = useRef(null);
  const lastScrollY = useRef(0);
  const containerRef = useRef(null);
  const linkRefs = useRef([]);
  const [highlight, setHighlight] = useState({ width: 0, left: 0 });
  const [activeIdx, setActiveIdx] = useState(0);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Change navbar background on scroll
  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;
      setScrolled(current > 80);

      // Hide on scroll down, show on scroll up
      if (current < 12) {
        setHidden(false);
      } else if (current > lastScrollY.current + 4) {
        setHidden(true);
      } else if (current < lastScrollY.current - 4) {
        setHidden(false);
      }

      lastScrollY.current = current;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Keep nav visible when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) setHidden(false);
  }, [isMenuOpen]);

  const menuLinks = [
    { href: "/", label: "Home" },
    { href: "/page/activities", label: "Activities" },
    { href: "/page/destination", label: "Destination" },
    { href: "/page/blog", label: "Blog" },
    { href: "/page/about", label: "About Us" },
    { href: "/login", label: "Login" },
  ];

  const updateHighlight = (index) => {
    const container = containerRef.current;
    const el = linkRefs.current[index];
    if (!container || !el) return;
    const containerRect = container.getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    setHighlight({
      width: rect.width,
      left: rect.left - containerRect.left,
    });
    setActiveIdx(index);
  };

  useEffect(() => {
    // set initial highlight to first link after layout
    const id = requestAnimationFrame(() => updateHighlight(0));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 p-4 transition-all duration-300 will-change-transform ${
        hidden ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
      } bg-transparent text-white`}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center">
          <div
            ref={containerRef}
            className="relative flex w-full items-center justify-between rounded-full bg-white/10 text-white shadow-xl border border-white/20 px-4 sm:px-6 py-3 gap-3 backdrop-blur-md overflow-hidden"
          >
            <div className="flex items-center gap-3 flex-1">
              <div className="relative hidden lg:flex items-center justify-evenly gap-4 w-full text-sm font-semibold">
                {menuLinks.map((link, idx) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    ref={(el) => (linkRefs.current[idx] = el)}
                    onMouseEnter={() => updateHighlight(idx)}
                    onFocus={() => updateHighlight(idx)}
                    className="relative px-3 py-1 z-10 group/link"
                  >
                    <span
                      className={`
                        absolute inset-0 mx-auto h-full w-0
                        bg-gray-200/90 rounded-lg
                        transition-all duration-200 ease-out
                        group-hover/link:w-full
                        ${activeIdx === idx ? "w-full" : "w-0"}
                      `}
                      aria-hidden="true"
                    />
                    <span
                      className={`
                        relative transition-colors duration-200 ease-out
                        ${activeIdx === idx ? "text-gray-800" : "text-white"}
                        group-hover/link:text-gray-800
                      `}
                    >
                      {link.label}
                    </span>
                  </Link>
                ))}
              </div>

              <div className="flex items-center gap-3">
                {status === "loading" ? (
                  <div className="px-4 py-2 text-gray-500 text-xs">Loading...</div>
                ) : session ? (
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-semibold text-gray-700">
                      {session.user?.name || "User"}
                    </div>
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="text-sm text-gray-600 hover:text-red-600 transition"
                    >
                      Logout
                    </button>
                  </div>
                ) : null}

                {/* Mobile menu toggle */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="lg:hidden p-2 rounded-full border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {isMenuOpen ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    )}
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 space-y-2 bg-white text-gray-900 rounded-xl shadow-lg">
            <Link
              href="/"
              className="block py-2 px-4 hover:bg-gray-100 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/page/activities"
              className="block py-2 px-4 hover:bg-gray-100 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              Activities
            </Link>
            <Link
              href="/page/destination"
              className="block py-2 px-4 hover:bg-gray-100 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              Destination
            </Link>
            <Link
              href="/page/blog"
              className="block py-2 px-4 hover:bg-gray-100 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              href="/page/about"
              className="block py-2 px-4 hover:bg-gray-100 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>
            <Link
              href="/login"
              className="block py-2 px-4 hover:bg-gray-100 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>

            <Link
              href="/page/destination"
              className="block bg-green-500 text-white px-4 py-2 rounded-full text-center font-semibold hover:bg-green-600 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Explore ↗
            </Link>

            <div className="border-t pt-2 mt-2">
              {status === "loading" ? (
                <div className="px-4 py-2 text-gray-500">Loading...</div>
              ) : session ? (
                <div className="space-y-2">
                  <div className="px-4 py-2 text-sm text-gray-700">
                    👤 {session.user.name ? session.user.name.split(' ')[0] : 'User'}
                  </div>
                  {session.user.role === "admin" && (
                    <Link
                      href="/admin"
                      className="block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      signOut({ callbackUrl: "/" });
                      setIsMenuOpen(false);
                    }}
                    className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
