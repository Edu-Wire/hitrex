"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect, useRef } from "react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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

  return (
    <nav className="bg-white text-black p-4 shadow-md">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <Link href="/">
            <Image
              src={"/Hitrex-logo.png"}
              alt="HITREX Logo"
              width={100}
              height={20}
              priority={true}
              className="object-cover"
            />
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
          >
            <svg
              className="w-6 h-6"
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

          {/* Desktop menu */}
          <div className="hidden lg:flex items-center space-x-4 font-semibold text-sm">
            <Link href="/" className="hover:text-blue-600 transition">
              Home
            </Link>
            <Link href="/page/activities" className="hover:text-blue-600 transition">
              Activities
            </Link>
            <Link href="/page/destination" className="hover:text-blue-600 transition">
              Destinations
            </Link>
            <Link href="/page/blog" className="hover:text-blue-600 transition">
              Blog
            </Link>
            <Link href="/page/about" className="hover:text-blue-600 transition">
              About Us
            </Link>
            <Link href="/page/contact" className="hover:text-blue-600 transition">
              Contact Us
            </Link>

            {status === "loading" ? (
              <div className="px-4 py-2 text-gray-500 text-xs">Loading...</div>
            ) : session ? (
              <div className="flex items-center space-x-2">
                {/* User Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="flex items-center space-x-2 text-sm text-gray-700 hover:text-blue-600 transition-all duration-200 px-3 py-2 rounded-lg hover:bg-blue-50 border border-transparent hover:border-blue-200"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {session.user.name ? session.user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="font-medium">{session.user.name ? session.user.name.split(' ')[0] : 'User'}</span>
                    <svg 
                      className={`w-4 h-4 transition-transform duration-200 ${isUserDropdownOpen ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* Dropdown Menu */}
                  {isUserDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                      {/* User Info Header */}
                      <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          {/* <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                            {session.user.name ? session.user.name.charAt(0).toUpperCase() : 'U'}
                          </div> */}
                          <div>
                            <p className="font-semibold text-gray-800">{session.user.name || 'User'}</p>
                            <p className="text-xs text-gray-500">{session.user.email || 'No email'}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Menu Items */}
                      <div className="py-2">
                        {session.user.role === "admin" && (
                          <Link
                            href="/admin"
                            className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-all duration-200 group"
                            onClick={() => setIsUserDropdownOpen(false)}
                          >
                            <svg className="w-5 h-5 mr-3 text-purple-500 group-hover:text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>Admin Panel</span>
                          </Link>
                        )}
                        
                        <Link
                          href="/my-bookings"
                          className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group"
                          onClick={() => setIsUserDropdownOpen(false)}
                        >
                          <svg className="w-5 h-5 mr-3 text-blue-500 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                          </svg>
                          <span>My Bookings</span>
                        </Link>
                        
                        <Link
                          href="/profile"
                          className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-all duration-200 group"
                          onClick={() => setIsUserDropdownOpen(false)}
                        >
                          <svg className="w-5 h-5 mr-3 text-green-500 group-hover:text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span>Profile</span>
                        </Link>
                        
                        <hr className="my-2 border-gray-100" />
                        
                        <button
                          onClick={() => {
                            signOut({ callbackUrl: "/" });
                            setIsUserDropdownOpen(false);
                          }}
                          className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-all duration-200 group"
                        >
                          <svg className="w-5 h-5 mr-3 text-red-500 group-hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-xs"
              >
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 space-y-2">
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
              Destinations
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
              href="/page/contact"
              className="block py-2 px-4 hover:bg-gray-100 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact Us
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
                <Link
                  href="/login"
                  className="block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
