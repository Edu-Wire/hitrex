"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAdminAuth } from "@/lib/useAdminAuth";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import DatePicker from "@/components/DatePicker";
import React from "react";
import { FaUtensils, FaBed, FaHiking, FaCamera, FaMapMarkedAlt, FaShieldAlt, FaBus, FaTicketAlt } from "react-icons/fa";

export default function AdminUpcomingTrips() {
  const t = useTranslations("Admin");
  const { isAdmin, loading: authLoading } = useAdminAuth();
  const router = useRouter();

  const [trips, setTrips] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    location: "",
    date: "",
    duration: "",
    image: "",
    description: "",
    pickupPoints: "",
  });

  // Helper function to check if trip is completed
  const isTripCompleted = (trip) => {
    if (!trip.date) return false;
    try {
      const tripDate = new Date(trip.date.replace(/ - \d+,/, ","));
      const today = new Date();
      return tripDate < today;
    } catch {
      return false;
    }
  };

  /* 🔐 Redirect if not admin */
  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.push("/login");
    }
  }, [authLoading, isAdmin, router]);

  /* 📦 Fetch trips */
  useEffect(() => {
    if (!authLoading && isAdmin) {
      fetchTrips();
    }
  }, [authLoading, isAdmin]);

  const fetchTrips = async () => {
    setDataLoading(true);
    try {
      const res = await fetch("/api/upcoming-trips?admin=true");
      const data = await res.json();
      const allTrips = [
        ...(Array.isArray(data.trips) ? data.trips : []),
        ...(Array.isArray(data.completedTrips) ? data.completedTrips : [])
      ];
      setTrips(allTrips);
    } catch (error) {
      console.error("Error fetching trips:", error);
      toast.error(t("loading_failed"));
    } finally {
      setDataLoading(false);
    }
  };

  /* 🗑️ Delete trip */
  const handleDelete = async (id) => {
    if (!confirm(t("delete_confirm") || "Are you sure?")) return;

    try {
      const res = await fetch(`/api/upcoming-trips?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok) {
        toast.success(data.message);
        fetchTrips();
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Delete failed");
    }
  };

  /* ✏️ Edit trip */
  const handleEdit = (trip) => {
    setFormData({
      _id: trip._id,
      id: trip.id,
      name: trip.name,
      location: trip.location,
      date: trip.date,
      duration: trip.duration,
      image: trip.image,
      description: trip.description,
      pickupPoints: trip.pickupPoints || "",
      price: trip.price !== undefined && trip.price !== null ? trip.price : "",
      offer: trip.offer !== undefined && trip.offer !== null ? trip.offer : "",
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.id ||
      !formData.name ||
      !formData.location ||
      !formData.date ||
      !formData.duration ||
      !formData.image ||
      !formData.description
    ) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const isEdit = !!formData._id;

      // Prepare data for submission, handling numbers correctly
      const submissionData = {
        ...formData,
        price: formData.price === "" ? undefined : Number(formData.price),
        offer: formData.offer === "" ? undefined : Number(formData.offer),
      };

      const res = await fetch("/api/upcoming-trips", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || (isEdit ? "Trip updated" : "Trip added"));
        resetForm();
        setShowForm(false);
        fetchTrips();
      } else {
        toast.error(data.error || t("save_failed"));
      }
    } catch (error) {
      console.error("Error saving trip:", error);
      toast.error(t("save_error"));
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
      pickupPoints: "",
      price: "",
      offer: "",
    });
  };

  const totalTrips = useMemo(() => trips.length, [trips]);

  if (authLoading || dataLoading) {
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
            {t("manage_trips")}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {t("total_trips")}: {totalTrips}
          </p>
        </div>

        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg transition"
        >
          {showForm ? t("close_form") : t("add_upcoming_trip")}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white text-gray-900 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">{t("add_upcoming_trip")}</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                ["id", t("trip_id")],
                ["name", t("name")],
                ["location", t("location")],
                ["duration", t("duration")],
                ["price", t("price") || "Price"],
                ["offer", t("offer") || "Offer (%)"],
                ["image", t("image_url")],
                ["pickupPoints", t("pickup_points")],
              ].map(([key, label]) => (
                <div key={key}>
                  <label className="block text-sm font-medium mb-1">
                    {key === "image" ? "Upload Image" : label} {key !== "pickupPoints" && key !== "price" && key !== "offer" ? t("required_field") : t("optional")}
                  </label>
                  {key === "image" ? (
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;

                          const uploadFormData = new FormData();
                          uploadFormData.append("file", file);

                          try {
                            const res = await fetch("/api/upload", {
                              method: "POST",
                              body: uploadFormData,
                            });
                            const data = await res.json();
                            if (data.success) {
                              setFormData(prev => ({ ...prev, image: data.url }));
                              toast.success("Image uploaded successfully");
                            } else {
                              toast.error("Upload failed: " + data.error);
                            }
                          } catch (err) {
                            console.error("Upload error:", err);
                            toast.error("Upload error");
                          }
                        }}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      {formData.image && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-500 mb-1">Preview:</p>
                          <img src={formData.image} alt="Preview" className="h-20 w-auto rounded border" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <input
                      type={key === "price" || key === "offer" ? "number" : "text"}
                      required={key !== "pickupPoints" && key !== "price" && key !== "offer"}
                      value={formData[key]}
                      onChange={(e) =>
                        setFormData({ ...formData, [key]: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  )}
                </div>
              ))}

              <DatePicker
                value={formData.date}
                onChange={(value) => setFormData({ ...formData, date: value })}
                label={t("date")}
                required={true}
              />
            </div>


            <div>
              <label className="block text-sm font-medium mb-1">
                {t("description")} {t("required_field")}
              </label>
              <textarea
                rows={3}
                required
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-500 transition"
              >
                {t("save_trip")}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
              >
                {t("reset")}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Trips List */}
      <section className="bg-white text-gray-900 rounded-lg shadow divide-y divide-gray-200">
        {trips.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            {t("no_trips")}
          </div>
        )}

        {trips.map((trip) => {
          const completed = isTripCompleted(trip);
          return (
            <div
              key={trip._id || trip.id}
              className={`p-4 md:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3 ${completed ? 'bg-red-50 border-red-200' : 'bg-white'
                }`}
            >
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">
                  {trip.id}
                </p>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">{trip.name}</h3>
                  {completed && (
                    <span className="px-2 py-1 bg-red-600 text-white text-xs font-medium rounded-full ml-2">
                      {t("completed")}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  {trip.location} • {trip.date} • {trip.duration} {trip.pickupPoints && `• ${t("pickup_points")}: ${trip.pickupPoints}`}
                  {trip.offer ? (
                    <React.Fragment>
                      <span className="font-medium ml-2">{t("original_price")}:</span>
                      <span className="line-through text-gray-400">${trip.price}</span>
                      <span className="ml-2 font-medium text-green-600">
                        ${Math.round(trip.price * (1 - trip.offer / 100))} ({trip.offer}% OFF)
                      </span>
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <span className="font-medium ml-2">{t("price")}:</span> ${trip.price}
                    </React.Fragment>
                  )}
                </p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <p className="text-sm text-gray-600 max-w-xl line-clamp-2">
                  {trip.description}
                </p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleEdit(trip)}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(trip._id)}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
