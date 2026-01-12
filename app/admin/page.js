"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  PageTransition,
  FadeInUp,
  StaggerContainer,
  StaggerItem,
  ScaleIn,
} from "@/components/animations";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statValues, setStatValues] = useState({
    destinations: 0,
    users: 0,
    bookings: 0,
    pending: 0,
  });

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
      return;
    }

    setIsAdmin(true);
    setLoading(false);
  }, [session, status, router]);

  useEffect(() => {
    if (status !== "authenticated" || !session) return;

    const controller = new AbortController();

    async function loadStats() {
      try {
        setStatsLoading(true);

        const [destRes, usersRes, bookingsRes] = await Promise.all([
          fetch("/api/destinations", { signal: controller.signal }),
          fetch("/api/users", { signal: controller.signal }),
          fetch("/api/bookings", { signal: controller.signal }),
        ]);

        const [destData, usersData, bookingsData] = await Promise.all([
          destRes.ok ? destRes.json() : Promise.resolve({ destinations: [] }),
          usersRes.ok ? usersRes.json() : Promise.resolve({ users: [] }),
          bookingsRes.ok ? bookingsRes.json() : Promise.resolve({ bookings: [] }),
        ]);

        const bookings = Array.isArray(bookingsData.bookings)
          ? bookingsData.bookings
          : [];

        setStatValues({
          destinations: Array.isArray(destData.destinations)
            ? destData.destinations.length
            : 0,
          users: Array.isArray(usersData.users) ? usersData.users.length : 0,
          bookings: bookings.length,
          pending: bookings.filter((b) => b.status === "pending").length,
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
  }, [status, session]);
  if (loading || status === "loading") {
    return (
      <PageTransition>
        <div className="min-h-screen flex items-center justify-center">
          <FadeInUp>
            <div className="text-xl">Loading...</div>
          </FadeInUp>
        </div>
      </PageTransition>
    );
  }

  if (!isAdmin) {
    return (
      <PageTransition>
        <div className="min-h-screen flex items-center justify-center">
          <FadeInUp>
            <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          </FadeInUp>
        </div>
      </PageTransition>
    );
  }

  const navItems = [
    { name: "Destinations", path: "/admin/destinations" },
    { name: "Blogs", path: "/admin/blogs" },
    { name: "Activities", path: "/admin/activities" },
    { name: "Bookings", path: "/admin/bookings" },
    { name: "Users", path: "/admin/users" },
    { name: "Payments", path: "/admin/payments" },
  ];

  const stats = [
    { label: "Destinations", key: "destinations", color: "blue" },
    { label: "Users", key: "users", color: "green" },
    { label: "Bookings", key: "bookings", color: "purple" },
    { label: "Pending Bookings", key: "pending", color: "orange" },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen flex bg-gray-100">
        <aside
          className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out z-30 md:static md:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-6 text-2xl font-bold border-b flex items-center justify-between">
            <span>Admin Panel</span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-sm text-gray-500 hover:text-gray-700"
            >
              Close
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-600 hover:text-white transition"
                onClick={() => setSidebarOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t">
            <button
              onClick={() => router.push("/")}
              className="w-full text-left px-4 py-2 rounded-lg text-red-600 hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        </aside>

        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="flex-1 p-6 md:p-8 md:ml-0 ml-0">
          <div className="flex items-center justify-between mb-6">
            <FadeInUp delay={0.1}>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            </FadeInUp>
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
            >
              Menu
            </button>
          </div>

          <FadeInUp delay={0.2}>
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((item) => (
                <StaggerItem key={item.label}>
                  <ScaleIn className="bg-white p-6 rounded-lg shadow-lg text-center">
                    <h3 className={`text-3xl font-bold text-${item.color}-600`}>
                      {statsLoading ? "--" : statValues[item.key] ?? 0}
                    </h3>
                    <p className="text-gray-600">{item.label}</p>
                  </ScaleIn>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </FadeInUp>
        </main>
      </div>
    </PageTransition>
  );
}