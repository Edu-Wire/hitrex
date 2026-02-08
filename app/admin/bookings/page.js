"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useAdminAuth } from "@/lib/useAdminAuth";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";

export default function AdminBookings() {
  const t = useTranslations("Admin");
  const { isAdmin, loading } = useAdminAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!isAdmin || loading) return;
    fetchBookings();
  }, [isAdmin, loading]);

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/bookings");
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setDataLoading(false);
    }
  };

  const updateBookingStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message);
        fetchBookings();
      } else {
        toast.error(data.error || t("save_failed"));
      }
    } catch (error) {
      toast.error(t("save_error"));
      console.error(error);
    }
  };

  const updatePaymentStatus = async (id, paymentStatus) => {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message);
        fetchBookings();
      } else {
        toast.error(data.error || t("save_failed"));
      }
    } catch (error) {
      toast.error(t("save_error"));
      console.error(error);
    }
  };

  const deleteBooking = async (id) => {
    if (!confirm(t("delete_confirm"))) return;

    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message);
        fetchBookings();
      } else {
        toast.error(data.error || t("delete_failed"));
      }
    } catch (error) {
      toast.error(t("delete_error"));
      console.error(error);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    if (filter === "all") return true;
    return booking.status === filter;
  });

  const getStatusColor = (status) => {
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

  const getPaymentColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "refunded":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">{t("loading")}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{t("manage_bookings")}</h1>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 md:px-4 py-2 rounded-3xl text-sm ${filter === "all"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700"
              }`}
          >
            {t("all")} ({bookings.length})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-3 md:px-4 py-2 rounded-3xl text-sm ${filter === "pending"
                ? "bg-yellow-600 text-white"
                : "bg-white text-gray-700"
              }`}
          >
            {t("pending")}
          </button>
          <button
            onClick={() => setFilter("confirmed")}
            className={`px-3 md:px-4 py-2 rounded-3xl text-sm ${filter === "confirmed"
                ? "bg-green-600 text-white"
                : "bg-white text-gray-700"
              }`}
          >
            {t("confirmed")}
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-3 md:px-4 py-2 rounded-3xl text-sm ${filter === "completed"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700"
              }`}
          >
            {t("completed")}
          </button>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("booking_id")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("customer")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("stats_destinations")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("trek_date")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("people")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("amount")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("status")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("payment")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("actions")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    #{booking._id.slice(-6)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {booking.userName}
                    </div>
                    <div className="text-sm text-gray-500">{booking.userEmail}</div>
                    <div className="text-sm text-gray-500">{booking.userPhone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {booking.destination?.name || "N/A"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {booking.destination?.location || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {booking.trekDate}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {booking.numberOfPeople}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    ₹{booking.totalAmount}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={booking.status}
                      onChange={(e) =>
                        updateBookingStatus(booking._id, e.target.value)
                      }
                      className={`text-xs px-2 py-1 rounded ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      <option value="pending">{t("pending")}</option>
                      <option value="confirmed">{t("confirmed")}</option>
                      <option value="completed">{t("completed")}</option>
                      <option value="cancelled">{t("cancelled")}</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={booking.paymentStatus}
                      onChange={(e) =>
                        updatePaymentStatus(booking._id, e.target.value)
                      }
                      className={`text-xs px-2 py-1 rounded ${getPaymentColor(
                        booking.paymentStatus
                      )}`}
                    >
                      <option value="pending">{t("pending")}</option>
                      <option value="paid">{t("paid")}</option>
                      <option value="refunded">{t("refunded")}</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => deleteBooking(booking._id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      {t("delete")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBookings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">{t("no_bookings_found")}</p>
          </div>
        )}
      </div>
    </div>
  );
}