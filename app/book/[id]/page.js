"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function BookDestination() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    userName: "",
    userPhone: "",
    numberOfPeople: 1,
    trekDate: "",
    specialRequests: "",
  });

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
      return;
    }
    fetchDestination();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status, router, params.id]);

  const fetchDestination = async () => {
    try {
      const res = await fetch(`/api/destinations/${params.id}`);
      const data = await res.json();
      if (data.destination) {
        setDestination(data.destination);
        setFormData({
          ...formData,
          userName: session?.user?.name || "",
          trekDate: data.destination.date || "",
        });
      }
    } catch (error) {
      console.error("Error fetching destination:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const totalAmount = (destination.price || 5000) * formData.numberOfPeople;

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination: params.id,
          ...formData,
          totalAmount,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Booking created successfully! Our team will contact you soon.");
        router.push("/my-bookings");
      } else {
        alert(data.error || "Failed to create booking");
      }
    } catch (error) {
      alert("Error creating booking");
      console.error(error);
    }
  };

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Destination not found
          </h1>
          <button
            onClick={() => router.push("/page/destination")}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Back to Destinations
          </button>
        </div>
      </div>
    );
  }

  const totalAmount = (destination.price || 5000) * formData.numberOfPeople;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-2xl md:text-4xl font-bold mb-8">Book Your Trek</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Destination Details */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative h-64">
              <Image
                src={destination.image}
                alt={destination.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2">{destination.name}</h2>
              <p className="text-gray-600 mb-2">{destination.location}</p>
              <p className="text-gray-700 mb-4">{destination.description}</p>
              <div className="flex gap-2 flex-wrap mb-4">
                {destination.tags?.map((tag, i) => (
                  <span
                    key={i}
                    className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-semibold">{destination.date}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-semibold">
                    {destination.duration || "5 days"}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Difficulty:</span>
                  <span className="font-semibold">
                    {destination.difficulty || "Moderate"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price per person:</span>
                  <span className="font-bold text-lg text-green-600">
                    ₹{destination.price || 5000}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-2xl font-bold mb-6">Booking Details</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.userName}
                  onChange={(e) =>
                    setFormData({ ...formData, userName: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 1234567890"
                  value={formData.userPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, userPhone: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Number of People *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="20"
                  value={formData.numberOfPeople}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      numberOfPeople: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Preferred Trek Date *
                </label>
                <input
                  type="text"
                  required
                  value={formData.trekDate}
                  onChange={(e) =>
                    setFormData({ ...formData, trekDate: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Special Requests (Optional)
                </label>
                <textarea
                  rows={3}
                  value={formData.specialRequests}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specialRequests: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Any dietary requirements, medical conditions, etc."
                />
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between mb-4">
                  <span className="text-lg font-semibold">Total Amount:</span>
                  <span className="text-2xl font-bold text-green-600">
                    ₹{totalAmount}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  * Payment will be collected after confirmation
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                Confirm Booking
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
