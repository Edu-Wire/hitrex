"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function AdminUpcomingTrips() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    location: "",
    date: "",
    duration: "",
    image: "",
    description: "",
  });

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
      return;
    }
    fetchTrips();
  }, [session, status, router]);

  const fetchTrips = async () => {
    try {
      const res = await fetch("/api/upcoming-trips");
      const data = await res.json();
      setTrips(Array.isArray(data.trips) ? data.trips : []);
    } catch (error) {
      console.error("Error fetching trips:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/upcoming-trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message || "Trip added");
        resetForm();
        setShowForm(false);
        fetchTrips();
      } else {
        alert(data.error || "Failed to add trip");
      }
    } catch (error) {
      console.error("Error creating trip:", error);
      alert("Error creating trip");
    }
  };

  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      location: "",
      date: "",
      duration: "",
      image: "",
      description: "",
    });
  };

  const totalTrips = useMemo(() => trips.length, [trips]);

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white pt-0 pb-24 -mt-24 md:-mt-28 -mb-24 md:-mb-28">
      <div className="max-w-6xl mx-auto px-4 pt-28 md:pt-32 space-y-8">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold">Manage Upcoming Trips</h1>
            <p className="text-sm text-slate-300 mt-1">Total trips: {totalTrips}</p>
          </div>
          <button
            onClick={() => setShowForm((prev) => !prev)}
            className="self-start bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-3xl transition"
          >
            {showForm ? "Close Form" : "Add Upcoming Trip"}
          </button>
        </header>

        {showForm && (
          <div className="bg-white text-gray-900 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Add Upcoming Trip</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Trip ID *</label>
                  <input
                    type="text"
                    required
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    placeholder="unique-id"
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Location *</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Oct 15 - 19, 2025"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Duration *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., 7 Days"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Image URL *</label>
                  <input
                    type="text"
                    required
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-500 transition"
                >
                  Save Trip
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        )}

        <section className="bg-white text-gray-900 rounded-lg shadow divide-y divide-gray-200">
          {trips.map((trip) => (
            <div key={trip._id || trip.id} className="p-4 md:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">
                  {trip.id || "no-id"}
                </p>
                <h3 className="text-lg font-semibold text-gray-900">{trip.name}</h3>
                <p className="text-sm text-gray-600">
                  {trip.location} • {trip.date} • {trip.duration}
                </p>
              </div>
              <div className="text-sm text-gray-600 line-clamp-2 max-w-xl">
                {trip.description}
              </div>
            </div>
          ))}

          {trips.length === 0 && (
            <div className="p-8 text-center text-gray-500">No upcoming trips yet. Add one to get started.</div>
          )}
        </section>
      </div>
    </div>
  );
}
