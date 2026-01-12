"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const cardClass =
  "bg-white rounded-2xl shadow p-4 sm:p-6 border border-gray-100 flex flex-col gap-1";

export default function UserDashboard() {
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
      const res = await fetch("/api/bookings", { cache: "no-store" });
      const data = await res.json();
      setBookings(Array.isArray(data.bookings) ? data.bookings : []);
    } catch (err) {
      console.error("Failed to load bookings", err);
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const total = bookings.length;
    const pending = bookings.filter((b) => b.status === "pending").length;
    const confirmed = bookings.filter((b) => b.status === "confirmed").length;
    const completed = bookings.filter((b) => b.status === "completed").length;
    const totalPaid = bookings
      .filter((b) => b.paymentStatus === "paid")
      .reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0);
    return { total, pending, confirmed, completed, totalPaid };
  }, [bookings]);

  const statusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      case "completed":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg font-semibold text-gray-700">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500">Welcome back{session?.user?.name ? `, ${session.user.name}` : ""}</p>
            <h1 className="text-3xl font-bold text-gray-900">Your Dashboard</h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push("/page/destination")}
              className="px-4 py-2 rounded-full bg-emerald-600 text-white text-sm font-semibold shadow hover:bg-emerald-500"
            >
              Book new trip
            </button>
            <button
              onClick={() => router.push("/my-bookings")}
              className="px-4 py-2 rounded-full bg-white border text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-100"
            >
              View all bookings
            </button>
          </div>
        </header>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatCard label="Total" value={stats.total} />
          <StatCard label="Pending" value={stats.pending} />
          <StatCard label="Confirmed" value={stats.confirmed} />
          <StatCard label="Completed" value={stats.completed} />
          <StatCard label="Paid (₹)" value={stats.totalPaid.toLocaleString("en-IN")} />
        </div>

        {/* Recent bookings */}
        <div className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent bookings</h2>
            <span className="text-xs text-gray-500">Showing latest {Math.min(bookings.length, 5)} records</span>
          </div>
          {bookings.length === 0 ? (
            <div className="p-6 text-sm text-gray-600">No bookings yet. Book your first trip to see it here.</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {bookings.slice(0, 5).map((b) => (
                <div key={b._id} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-gray-900">{b.destination?.name || "Destination"}</p>
                    <p className="text-xs text-gray-500">{b.destination?.location || "—"}</p>
                    <p className="text-xs text-gray-500">Trek: {b.trekDate || "—"}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor(b.status)}`}>
                      {b.status || "status"}
                    </span>
                    <span className="text-sm font-semibold text-emerald-600">₹{b.totalAmount}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className={cardClass}>
      <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold">{label}</p>
      <p className="text-2xl font-bold text-emerald-700">{value}</p>
    </div>
  );
}
