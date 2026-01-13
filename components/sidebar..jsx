"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminSidebar() {
  const pathname = usePathname();

  const menu = [
    { label: "Dashboard", href: "/admin" },
    { label: "Destinations", href: "/admin/destinations" },
    { label: "Upcoming Trips", href: "/admin/upcoming-trips" },
    { label: "Activities", href: "/admin/activities" },
    { label: "Blogs", href: "/admin/blog" },
    { label: "Bookings", href: "/admin/bookings" },
    { label: "Users", href: "/admin/users" },
  ];

  return (
    <div className="h-full flex flex-col p-6">
      <h2 className="text-2xl font-bold mb-8 text-emerald-400">
        Admin Panel
      </h2>

      <nav className="space-y-2">
        {menu.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-2 rounded-lg transition ${
                active
                  ? "bg-emerald-600 text-white"
                  : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
