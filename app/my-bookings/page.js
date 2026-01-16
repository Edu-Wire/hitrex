"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function MyBookings() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
      return;
    }
    fetchBookings();
  }, [session, status, router]);

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/bookings");
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "pending":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "cancelled":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
    }
  };

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-xl font-black text-white animate-pulse uppercase tracking-widest italic">
          Syncing Expeditions...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 px-4 selection:bg-[#ff4d00] relative">

      {/* 🔥 FIX: Black background behind navbar (PAGE ONLY) */}
      <div className="fixed top-0 left-0 w-full h-[128px] bg-[#050505] z-0" />

      <div className="relative z-10 max-w-6xl mx-auto">

        {/* Header */}
        <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <p className="text-[#ff4d00] font-black uppercase tracking-[0.4em] text-[10px]">
              Expedition Log
            </p>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic leading-none">
              Your <span className="text-[#ff4d00]">History</span>
            </h1>
          </div>

          <button
            onClick={() => router.push("/page/destination")}
            className="w-fit bg-white text-black px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#ff4d00] hover:text-white transition-all shadow-xl"
          >
            New Adventure
          </button>
        </header>

        {bookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0f0f0f] rounded-[2.5rem] border border-white/5 p-16 text-center shadow-2xl"
          >
            <h2 className="text-2xl font-black uppercase italic mb-3">
              No Tracks Found
            </h2>
            <p className="text-zinc-500 mb-8 max-w-sm mx-auto">
              Your journal is empty. The wild is calling.
            </p>
            <button
              onClick={() => router.push("/page/destination")}
              className="text-[#ff4d00] font-black uppercase tracking-widest text-xs border-b-2 border-[#ff4d00] pb-1 hover:text-white hover:border-white"
            >
              Start Your Journey
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-10">
            {bookings.map((booking, index) => (
              <motion.div
                key={booking._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#0f0f0f] rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl"
              >
                <div className="md:flex">
                  <div className="md:w-[40%] relative h-72 md:h-auto">
                    <Image
                      src={booking.destination?.image || "/images/default.jpg"}
                      alt={booking.destination?.name || "Destination"}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-6 left-6">
                      <span
                        className={`border px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-xl ${getStatusStyle(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span>
                    </div>
                  </div>

                  <div className="md:w-[60%] p-8 md:p-12">
                    <p className="text-[#ff4d00] text-[10px] font-black uppercase tracking-widest mb-1">
                      {booking.destination?.location}
                    </p>
                    <h2 className="text-3xl md:text-5xl font-black uppercase italic">
                      {booking.destination?.name}
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-8">
                      <div>
                        <p className="text-zinc-600 text-[10px] uppercase">Ref ID</p>
                        <p className="font-mono text-xs text-zinc-400">
                          #{booking._id.slice(-8).toUpperCase()}
                        </p>
                      </div>
                      <div>
                        <p className="text-zinc-600 text-[10px] uppercase">Departure</p>
                        <p className="font-bold">{booking.trekDate}</p>
                      </div>
                      <div>
                        <p className="text-zinc-600 text-[10px] uppercase">Travelers</p>
                        <p className="font-bold">{booking.numberOfPeople}</p>
                      </div>
                      <div>
                        <p className="text-[#ff4d00] text-[10px] uppercase">Amount</p>
                        <p className="text-2xl font-black italic">
                          €{booking.totalAmount}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Decorative Glow */}
      <div className="fixed top-0 right-0 w-[40vw] h-[40vh] bg-[#ff4d00]/5 blur-[120px] pointer-events-none -z-10" />
    </div>
  );
}
