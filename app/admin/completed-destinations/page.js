"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAdminAuth } from "@/lib/useAdminAuth";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import Image from "next/image";

export default function AdminCompletedDestinations() {
  const t = useTranslations("Admin");
  const { isAdmin, loading } = useAdminAuth();
  const router = useRouter();

  const [destinations, setDestinations] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  /* 🔐 Redirect if not admin */
  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push("/login");
    }
  }, [loading, isAdmin, router]);

  /* 📦 Fetch completed destinations */
  useEffect(() => {
    if (!loading && isAdmin) {
      fetchCompletedDestinations();
    }
  }, [loading, isAdmin]);

  const fetchCompletedDestinations = async () => {
    setDataLoading(true);
    try {
      const res = await fetch("/api/destinations?admin=true");
      const data = await res.json();
      setDestinations(Array.isArray(data.completedDestinations) ? data.completedDestinations : []);
    } catch (error) {
      console.error("Error fetching completed destinations:", error);
      toast.error(t("loading_failed"));
    } finally {
      setDataLoading(false);
    }
  };

  const totalDestinations = useMemo(() => destinations.length, [destinations]);

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
            {t("completed_destinations_title")}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {t("total_completed_destinations")}: {totalDestinations}
          </p>
        </div>

        <button
          onClick={() => router.push("/admin")}
          className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-2 rounded-lg transition"
        >
          {t("back_to_dashboard")}
        </button>
      </div>

      {/* Completed Destinations List */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {destinations.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">{t("no_completed_destinations")}</p>
          </div>
        )}

        {destinations.map((dest) => (
          <div key={dest._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative h-48">
              <Image
                src={dest.image}
                alt={dest.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-bold mb-2">{dest.name}</h3>
              <p className="text-gray-600 text-sm mb-2">{dest.location}</p>
              <p className="text-gray-500 text-sm mb-2">{dest.date}</p>
              <div className="flex gap-2 flex-wrap mb-3">
                {dest.tags?.map((tag, i) => (
                  <span
                    key={i}
                    className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                {dest.description}
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="font-medium">{t("difficulty")}:</span> {dest.difficulty}
                <span className="ml-4 font-medium">{t("duration")}:</span> {dest.duration}
                <span className="ml-4 font-medium">{t("price")}:</span> ${dest.price}
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
