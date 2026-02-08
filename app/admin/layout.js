"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAdminAuth } from "@/lib/useAdminAuth";
import { useTranslations } from "next-intl";

const SIDEBAR_WIDTH = "w-56"; // 14rem
const SIDEBAR_MARGIN = "md:ml-56";

export default function AdminLayout({ children }) {
  const t = useTranslations("Admin");
  const { isAdmin, loading } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push("/");
    }
  }, [isAdmin, loading, router]);

  const navItems = [
    { name: t("stats_dashboard"), path: "/admin" },
    { name: t("stats_destinations"), path: "/admin/destinations" },
    { name: t("stats_upcoming_trips"), path: "/admin/upcoming-trips" },
    { name: t("stats_blogs"), path: "/admin/blogs" },
    { name: t("stats_activities"), path: "/admin/activities" },
    { name: t("stats_bookings"), path: "/admin/bookings" },
    { name: t("stats_users"), path: "/admin/users" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {t("loading")}
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 ${SIDEBAR_WIDTH} bg-white shadow-lg
        transform transition-transform duration-200
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="p-4 font-bold border-b">{t("admin_panel")}</div>

        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`block px-4 py-2 rounded-lg text-sm transition
                  ${active
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-blue-600 hover:text-white"
                  }
                `}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t">
          <button
            onClick={() => router.push("/")}
            className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
          >
            ← {t("back_to_site")}
          </button>
        </div>
      </aside>

      {/* OVERLAY (MOBILE) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* MAIN CONTENT */}
      <main
        className={`relative min-h-screen ${SIDEBAR_MARGIN}`}
      >
        {/* Mobile top bar */}
        <div className="md:hidden p-4 bg-white shadow border-b">
          <button
            onClick={() => setSidebarOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            ☰ Menu
          </button>
        </div>

        {/* Page content */}
        <div className="p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
