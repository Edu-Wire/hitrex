"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { PageTransition, FadeInUp, StaggerContainer, StaggerItem, ScaleIn } from "@/components/animations";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
      return;
    }

    // Check if user is admin (you'll need to add this check)
    // For now, we'll assume logged in users can access
    setIsAdmin(true);
    setLoading(false);
  }, [session, status, router]);

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
            <div className="text-center">
              <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
              <p>You don&apos;t have permission to access this page.</p>
            </div>
          </FadeInUp>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <FadeInUp delay={0.2} once={false}>
            <h1 className="text-2xl md:text-4xl font-bold mb-8">Admin Dashboard</h1>
          </FadeInUp>
          
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Destinations Management */}
            <StaggerItem>
              <ScaleIn 
                whileHover={true} 
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition cursor-pointer"
                delay={0.1}
                once={false}
              >
                <Link href="/admin/destinations">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-semibold">Destinations</h2>
                    <svg
                      className="w-8 h-8 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-600">Manage trekking destinations</p>
                  <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all transform hover:scale-105">
                    Manage
                  </button>
                </Link>
              </ScaleIn>
            </StaggerItem>

            {/* Users Management */}
            <StaggerItem>
              <ScaleIn 
                whileHover={true} 
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition cursor-pointer"
                delay={0.2}
                once={false}
              >
                <Link href="/admin/users">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-semibold">Users</h2>
                    <svg
                      className="w-8 h-8 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-600">Manage users and roles</p>
                  <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-all transform hover:scale-105">
                    Manage
                  </button>
                </Link>
              </ScaleIn>
            </StaggerItem>

            {/* Bookings Management */}
            <StaggerItem>
              <ScaleIn 
                whileHover={true} 
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition cursor-pointer"
                delay={0.3}
                once={false}
              >
                <Link href="/admin/bookings">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-semibold">Bookings</h2>
                    <svg
                      className="w-8 h-8 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-600">Manage trek bookings</p>
                  <button className="mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-all transform hover:scale-105">
                    Manage
                  </button>
                </Link>
              </ScaleIn>
            </StaggerItem>
          </StaggerContainer>

          {/* Additional Stats Section */}
          <FadeInUp delay={0.5} once={false} className="mt-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <h3 className="text-3xl font-bold text-blue-600">25</h3>
                <p className="text-gray-600">Total Destinations</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <h3 className="text-3xl font-bold text-green-600">150</h3>
                <p className="text-gray-600">Active Users</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <h3 className="text-3xl font-bold text-purple-600">89</h3>
                <p className="text-gray-600">Total Bookings</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <h3 className="text-3xl font-bold text-orange-600">12</h3>
                <p className="text-gray-600">Pending Reviews</p>
              </div>
            </div>
          </FadeInUp>
        </div>
      </div>
    </PageTransition>
  );
}
