"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useAdminAuth } from "@/lib/useAdminAuth";
import { toast } from "react-toastify";

export default function AdminDestinations() {
  const { isAdmin, loading } = useAdminAuth();
  const router = useRouter();
  const [destinations, setDestinations] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    image: "",
    description: "",
    date: "",
    tags: "",
    price: "",
    duration: "",
    difficulty: "Moderate",
    activities: "",
    included: "",
    excluded: "",
    gallery: "",
  });

  useEffect(() => {
    if (!isAdmin || loading) return;
    fetchDestinations();
  }, [isAdmin, loading]);

  const fetchDestinations = async () => {
    try {
      const res = await fetch("/api/destinations");
      const data = await res.json();
      setDestinations(data.destinations || []);
    } catch (error) {
      console.error("Error fetching destinations:", error);
    } finally {
      setDataLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      tags: formData.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      activities: formData.activities.split(",").map((item) => item.trim()).filter(Boolean),
      included: formData.included.split(",").map((item) => item.trim()).filter(Boolean),
      excluded: formData.excluded.split(",").map((item) => item.trim()).filter(Boolean),
      gallery: formData.gallery.split(",").map((item) => item.trim()).filter(Boolean),
      price: Number(formData.price) || 0,
    };

    try {
      const url = editingId
        ? `/api/destinations/${editingId}`
        : "/api/destinations";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message);
        setShowForm(false);
        setEditingId(null);
        resetForm();
        fetchDestinations();
      } else {
        toast.error(data.error || "Failed to save destination");
      }
    } catch (error) {
      toast.error("Error saving destination");
      console.error(error);
    }
  };

  const handleEdit = (dest) => {
    setEditingId(dest._id);
    setFormData({
      name: dest.name,
      location: dest.location,
      image: dest.image,
      description: dest.description,
      date: dest.date,
      tags: dest.tags.join(", "),
      price: dest.price || "",
      duration: dest.duration || "",
      difficulty: dest.difficulty || "Moderate",
      activities: dest.activities ? dest.activities.join(", ") : "",
      included: dest.included ? dest.included.join(", ") : "",
      excluded: dest.excluded ? dest.excluded.join(", ") : "",
      gallery: dest.gallery ? dest.gallery.join(", ") : "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this destination?")) return;

    try {
      const res = await fetch(`/api/destinations/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message);
        fetchDestinations();
      } else {
        toast.error(data.error || "Failed to delete destination");
      }
    } catch (error) {
      toast.error("Error deleting destination");
      console.error(error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      location: "",
      image: "",
      description: "",
      date: "",
      tags: "",
      price: "",
      duration: "",
      difficulty: "Moderate",
      activities: "",
      included: "",
      excluded: "",
      gallery: "",
    });
  };

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Manage Destinations</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            resetForm();
          }}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {showForm ? "Cancel" : "Add New Destination"}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8 text-gray-900">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">
            {editingId ? "Edit Destination" : "Add New Destination"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Location *</label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Image URL *</label>
                <input
                  type="text"
                  required
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Oct 15 - 19, 2025"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Tags (comma separated) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Hiking, Snow & Ice, Walking"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Price</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Duration</label>
                <input
                  type="text"
                  placeholder="e.g., 5 days"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Difficulty</label>
                <select
                  value={formData.difficulty}
                  onChange={(e) =>
                    setFormData({ ...formData, difficulty: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Easy">Easy</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Challenging">Challenging</option>
                  <option value="Difficult">Difficult</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description *</label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* New Fields Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Activities (comma separated)</label>
                <textarea
                  rows={3}
                  placeholder="e.g., Hiking, Camping"
                  value={formData.activities}
                  onChange={(e) =>
                    setFormData({ ...formData, activities: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Included (comma separated)</label>
                <textarea
                  rows={3}
                  placeholder="e.g., Meals, Guide"
                  value={formData.included}
                  onChange={(e) =>
                    setFormData({ ...formData, included: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Excluded (comma separated)</label>
                <textarea
                  rows={3}
                  placeholder="e.g., Flights, Personal Gear"
                  value={formData.excluded}
                  onChange={(e) =>
                    setFormData({ ...formData, excluded: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-3">
                <label className="block text-sm font-medium mb-1">Gallery Images (comma separated)</label>
                <textarea
                  rows={2}
                  placeholder="https://image1.jpg, https://image2.jpg"
                  value={formData.gallery}
                  onChange={(e) =>
                    setFormData({ ...formData, gallery: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
            >
              {editingId ? "Update Destination" : "Create Destination"}
            </button>
          </form>
        </div>
      )}

      {/* Destinations List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {destinations.map((dest) => (
          <div key={dest._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative h-48">
              <Image
                src={dest.image}
                alt={dest.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-bold mb-2">{dest.name}</h3>
              <p className="text-gray-600 text-sm mb-2">{dest.location}</p>
              <p className="text-gray-500 text-sm mb-2">{dest.date}</p>
              <div className="flex gap-2 flex-wrap mb-3">
                {dest.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                {dest.description}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(dest)}
                  className="flex-1 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(dest._id)}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {destinations.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No destinations found. Add your first destination!</p>
        </div>
      )}
    </div>
  );
}