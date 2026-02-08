"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAdminAuth } from "@/lib/useAdminAuth";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";

export default function AdminCompletedTrips() {
  const t = useTranslations("Admin");
  const { isAdmin, loading } = useAdminAuth();
  const router = useRouter();

  const [trips, setTrips] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  /* 🔐 Redirect if not admin */
  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push("/login");
    }
  }, [loading, isAdmin, router]);

  /* 📦 Fetch completed trips */
  useEffect(() => {
    if (!loading && isAdmin) {
      fetchCompletedTrips();
    }
  }, [loading, isAdmin]);

  const fetchCompletedTrips = async () => {
    setDataLoading(true);
    try {
      const res = await fetch("/api/upcoming-trips?admin=true");
      const data = await res.json();
      setTrips(Array.isArray(data.completedTrips) ? data.completedTrips : []);
    } catch (error) {
      console.error("Error fetching completed trips:", error);
      toast.error(t("loading_failed"));
    } finally {
      setDataLoading(false);
    }
  };

  const totalTrips = useMemo(() => trips.length, [trips]);

  /* ⏳ Loading state */
  if (loading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-medium">{t("loading")}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {t("completed_trips_title")}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {t("total_completed_trips")}: {totalTrips}
          </p>
        </div>

        <button
          onClick={() => router.push("/admin")}
          className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-2 rounded-lg transition"
        >
          {t("back_to_dashboard")}
        </button>
      </div>

      {/* Completed Trips List */}
      <section className="bg-white text-gray-900 rounded-lg shadow divide-y divide-gray-200">
        {trips.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            {t("no_completed_trips")}
          </div>
        )}

        {trips.map((trip) => (
          <div
            key={trip._id || trip.id}
            className="p-4 md:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
          >
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">
                {trip.id}
              </p>
              <h3 className="text-lg font-semibold">{trip.name}</h3>
              <p className="text-sm text-gray-600">
                {trip.location} • {trip.date} • {trip.duration} {trip.pickupPoints && `• Pickup: ${trip.pickupPoints}`}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                {t("completed")}
              </span>
              <p className="text-sm text-gray-600 max-w-xl line-clamp-2">
                {trip.description}
              </p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
