"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="bg-white text-black p-4 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Image
          src={"/Hitrex-Logo.jpg"}
          alt="HITREX Logo"
          width={150}
          height={30}
          priority={true}
          className="object-cover"
        />
        <div className="flex items-center space-x-4 font-semibold">
          <Link href="/" className="hover:text-blue-600 transition">Home</Link>
          <Link href="/page/activities" className="hover:text-blue-600 transition">Activities</Link>
          <Link href="/page/destination" className="hover:text-blue-600 transition">Destinations</Link>
          <Link href="/page/blog" className="hover:text-blue-600 transition">Blog</Link>
          <Link href="/page/about" className="hover:text-blue-600 transition">About Us</Link>
          <Link href="/page/contact" className="hover:text-blue-600 transition">Contact Us</Link>
          {session && (
            <Link href="/my-bookings" className="hover:text-blue-600 transition">My Bookings</Link>
          )}
          
          {status === "loading" ? (
            <div className="px-4 py-2 text-gray-500">Loading...</div>
          ) : session ? (
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-700">
                Welcome, {session.user.name}
              </span>
              {session.user.role === "admin" && (
                <Link
                  href="/admin"
                  className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
                >
                  Admin
                </Link>
              )}
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
