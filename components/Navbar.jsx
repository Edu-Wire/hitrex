"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white text-black p-4 shadow-md">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <Link href="/">
            <Image
              src={"/Hitrex-logo.jpg"}
              alt="HITREX Logo"
              width={150}
              height={30}
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
            {session && (
              <Link href="/my-bookings" className="hover:text-blue-600 transition">
                My Bookings
              </Link>
            )}

            {status === "loading" ? (
              <div className="px-4 py-2 text-gray-500 text-xs">Loading...</div>
            ) : session ? (
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-700 hidden xl:block">
                  Welcome, {session.user.name}
                </span>
                {session.user.role === "admin" && (
                  <Link
                    href="/admin"
                    className="bg-purple-600 text-white px-3 py-2 rounded hover:bg-purple-700 transition text-xs"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition text-xs"
                >
                  Logout
                </button>
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
            {session && (
              <Link
                href="/my-bookings"
                className="block py-2 px-4 hover:bg-gray-100 rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                My Bookings
              </Link>
            )}

            <div className="border-t pt-2 mt-2">
              {status === "loading" ? (
                <div className="px-4 py-2 text-gray-500">Loading...</div>
              ) : session ? (
                <div className="space-y-2">
                  <div className="px-4 py-2 text-sm text-gray-700">
                    Welcome, {session.user.name}
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
