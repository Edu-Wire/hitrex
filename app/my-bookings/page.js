"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

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
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">My Bookings</h1>
          <button
            onClick={() => router.push("/page/destination")}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Book New Trek
          </button>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">
              No Bookings Yet
            </h2>
            <p className="text-gray-600 mb-6">
              Start your adventure by booking your first trek!
            </p>
            <button
              onClick={() => router.push("/page/destination")}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Explore Destinations
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <div className="md:flex">
                  {/* Destination Image */}
                  <div className="md:w-1/3 relative h-64 md:h-auto">
                    <Image
                      src={booking.destination?.image || "/images/default.jpg"}
                      alt={booking.destination?.name || "Destination"}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Booking Details */}
                  <div className="md:w-2/3 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-2xl font-bold mb-1">
                          {booking.destination?.name || "N/A"}
                        </h2>
                        <p className="text-gray-600">
                          {booking.destination?.location || "N/A"}
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-block px-3 py-1 rounded text-sm font-semibold ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          {booking.status.toUpperCase()}
                        </span>
                        <span
                          className={`inline-block px-3 py-1 rounded text-sm font-semibold ml-2 ${getPaymentColor(
                            booking.paymentStatus
                          )}`}
                        >
                          {booking.paymentStatus.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Booking ID</p>
                        <p className="font-semibold">#{booking._id.slice(-6)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Trek Date</p>
                        <p className="font-semibold">{booking.trekDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">People</p>
                        <p className="font-semibold">{booking.numberOfPeople}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total Amount</p>
                        <p className="font-bold text-green-600">
                          ₹{booking.totalAmount}
                        </p>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Contact Name</p>
                          <p className="font-medium">{booking.userName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="font-medium">{booking.userPhone}</p>
                        </div>
                      </div>
                      {booking.specialRequests && (
                        <div className="mt-4">
                          <p className="text-sm text-gray-500">Special Requests</p>
                          <p className="text-gray-700">{booking.specialRequests}</p>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm text-gray-500">
                        Booked on:{" "}
                        {new Date(booking.createdAt).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
