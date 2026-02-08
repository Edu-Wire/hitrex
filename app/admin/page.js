"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAdminAuth } from "@/lib/useAdminAuth";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  PageTransition,
  FadeInUp,
  StaggerContainer,
  StaggerItem,
  ScaleIn,
} from "@/components/animations";
import { BarChart } from "@mui/x-charts/BarChart";

export default function AdminDashboard() {
  const t = useTranslations("Admin");
  const { isAdmin, loading, session } = useAdminAuth();
  const router = useRouter();
  const [statsLoading, setStatsLoading] = useState(true);
  const [statValues, setStatValues] = useState({
    destinations: 0,
    upcomingTrips: 0,
    activities: 0,
    blogs: 0,
    users: 0,
    bookings: 0,
    pending: 0,
    heroSlides: 0,
    completedTrips: 0,
    completedDestinations: 0,
  });

  useEffect(() => {
    if (!session || !isAdmin) return;

    const controller = new AbortController();

    async function loadStats() {
      try {
        setStatsLoading(true);

        const [destRes, tripsRes, activitiesRes, blogsRes, usersRes, bookingsRes, slidesRes] = await Promise.all([
          fetch("/api/destinations?admin=true", { signal: controller.signal }),
          fetch("/api/upcoming-trips?admin=true", { signal: controller.signal }),
          fetch("/api/activities", { signal: controller.signal }),
          fetch("/api/blogs", { signal: controller.signal }),
          fetch("/api/users", { signal: controller.signal }),
          fetch("/api/bookings", { signal: controller.signal }),
          fetch("/api/hero-slides", { signal: controller.signal }),
        ]);

        const [destData, tripsData, activitiesData, blogsData, usersData, bookingsData, slidesData] = await Promise.all([
          destRes.ok ? destRes.json() : Promise.resolve({ destinations: [] }),
          tripsRes.ok ? tripsRes.json() : Promise.resolve({ trips: [] }),
          activitiesRes.ok ? activitiesRes.json() : Promise.resolve({ activities: [] }),
          blogsRes.ok ? blogsRes.json() : Promise.resolve({ blogs: [] }),
          usersRes.ok ? usersRes.json() : Promise.resolve({ users: [] }),
          bookingsRes.ok ? bookingsRes.json() : Promise.resolve({ bookings: [] }),
          slidesRes.ok ? slidesRes.json() : Promise.resolve({ slides: [] }),
        ]);

        const bookings = Array.isArray(bookingsData.bookings)
          ? bookingsData.bookings
          : [];
        const trips = Array.isArray(tripsData.trips) ? tripsData.trips : [];
        const activities = Array.isArray(activitiesData.activities) ? activitiesData.activities : [];
        const blogs = Array.isArray(blogsData.blogs) ? blogsData.blogs : [];
        const slides = Array.isArray(slidesData.slides) ? slidesData.slides : [];

        const completedTrips = Array.isArray(tripsData.completedTrips) ? tripsData.completedTrips : [];

        const completedDestinations = Array.isArray(destData.completedDestinations) ? destData.completedDestinations : [];

        setStatValues({
          destinations: Array.isArray(destData.destinations)
            ? destData.destinations.length
            : 0,
          upcomingTrips: trips.length,
          activities: activities.length,
          blogs: blogs.length,
          users: Array.isArray(usersData.users) ? usersData.users.length : 0,
          bookings: bookings.length,
          pending: bookings.filter((b) => b.status === "pending").length,
          heroSlides: slides.length,
          completedTrips: completedTrips.length,
          completedDestinations: completedDestinations.length,
        });
      } catch (error) {
        console.error("Failed to load admin stats:", error);
      } finally {
        if (!controller.signal.aborted) {
          setStatsLoading(false);
        }
      }
    }

    loadStats();
    return () => controller.abort();
  }, [session, isAdmin]);

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen flex items-center justify-center">
          <FadeInUp>
            <div className="text-xl">{t("loading")}</div>
          </FadeInUp>
        </div>
      </PageTransition>
    );
  }

  if (!isAdmin) {
    return (
      <PageTransition>
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <FadeInUp>
            <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
              <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
              <p className="text-gray-600 mb-6">
                You do not have permission to access the admin panel. Only users with admin role can access this page.
              </p>
              <button
                onClick={() => router.push("/")}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                Back to Home
              </button>
            </div>
          </FadeInUp>
        </div>
      </PageTransition>
    );
  }


  const stats = [
    { label: t("stats_destinations"), key: "destinations", color: "blue" },
    { label: t("stats_upcoming_trips"), key: "upcomingTrips", color: "emerald" },
    { label: t("stats_activities"), key: "activities", color: "orange" },
    { label: t("stats_blogs"), key: "blogs", color: "indigo" },
    { label: t("stats_users"), key: "users", color: "green" },
    { label: t("stats_bookings"), key: "bookings", color: "purple" },
    { label: t("stats_pending_bookings"), key: "pending", color: "orange" },
    { label: t("stats_hero_slides"), key: "heroSlides", color: "pink" },
    { label: t("stats_completed_trips"), key: "completedTrips", color: "red" },
    { label: t("stats_completed_destinations"), key: "completedDestinations", color: "gray" },
  ];

  const chartData = stats.map((item) => ({
    label: item.label,
    value: statValues[item.key] ?? 0,
    color: item.color,
  }));

  const maxValue = Math.max(...chartData.map((d) => d.value), 1);

  return (
    <PageTransition>
      <div className="space-y-6">
        <FadeInUp delay={0.1}>
          <h1 className="text-3xl font-bold">{t("dashboard")}</h1>
        </FadeInUp>

        <FadeInUp delay={0.2}>
          <StaggerContainer className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {stats.map((item) => (
              <StaggerItem key={item.label}>
                <ScaleIn className="bg-white p-3 md:p-6 rounded-lg shadow-lg text-center">
                  <h3 className="text-2xl md:text-3xl font-bold text-emerald-600">
                    {statsLoading ? "--" : statValues[item.key] ?? 0}
                  </h3>
                  <p className="text-xs md:text-base text-gray-600">{item.label}</p>
                </ScaleIn>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </FadeInUp>

        <FadeInUp delay={0.25}>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">{t("management")}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/admin/destinations" className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition text-center">
                <div className="text-blue-600 font-semibold">{t("stats_destinations")}</div>
              </Link>
              <Link href="/admin/upcoming-trips" className="p-4 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition text-center">
                <div className="text-emerald-600 font-semibold">{t("stats_upcoming_trips")}</div>
              </Link>
              <Link href="/admin/activities" className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition text-center">
                <div className="text-orange-600 font-semibold">{t("stats_activities")}</div>
              </Link>
              <Link href="/admin/blogs" className="p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition text-center">
                <div className="text-indigo-600 font-semibold">{t("stats_blogs")}</div>
              </Link>
              <Link href="/admin/users" className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition text-center">
                <div className="text-green-600 font-semibold">{t("stats_users")}</div>
              </Link>
              <Link href="/admin/bookings" className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition text-center">
                <div className="text-purple-600 font-semibold">{t("stats_bookings")}</div>
              </Link>
              <Link href="/admin/hero-slides" className="p-4 bg-pink-50 rounded-lg hover:bg-pink-100 transition text-center">
                <div className="text-pink-600 font-semibold">{t("stats_hero_slides")}</div>
              </Link>
              <Link href="/admin/completed-trips" className="p-4 bg-red-50 rounded-lg hover:bg-red-100 transition text-center">
                <div className="text-red-600 font-semibold">{t("stats_completed_trips")}</div>
              </Link>
              <Link href="/admin/completed-destinations" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition text-center">
                <div className="text-gray-600 font-semibold">{t("stats_completed_destinations")}</div>
              </Link>

            </div>
          </div>
        </FadeInUp>

        <FadeInUp delay={0.3}>
          {/* MUI Bar Chart analytics */}
          <div className="mt-10 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">{t("portfolio_overview")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-2 overflow-x-auto">
                <BarChart
                  height={360}
                  slotProps={{ legend: { hidden: true } }}
                  series={[
                    {
                      data: chartData.map((d) => d.value),
                      label: "Count",
                      color: "#10b981",
                    },
                  ]}
                  xAxis={[
                    {
                      data: chartData.map((d) => d.label),
                      scaleType: "band",
                    },
                  ]}
                  margin={{ left: 60, right: 20, top: 20, bottom: 60 }}
                />
              </div>
              <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 text-sm text-gray-700">
                <p className="font-semibold mb-2 text-gray-900">{t("summary")}</p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>{t("summary_api_info")}</li>
                  <li>{t("summary_chart_info")}</li>
                  <li>{t("summary_pending_info")}</li>
                </ul>
              </div>
            </div>
          </div>
        </FadeInUp>
      </div>
    </PageTransition>
  );
}