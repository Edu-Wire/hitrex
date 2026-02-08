"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { useAdminAuth } from "@/lib/useAdminAuth";
import { toast } from "react-toastify";
import DatePicker from "@/components/DatePicker";
import React from "react";
import { FaUtensils, FaBed, FaHiking, FaCamera, FaMapMarkedAlt, FaShieldAlt, FaBus, FaTicketAlt } from "react-icons/fa";

// Predefined options for included/excluded items with icons
const PREDEFINED_ITEMS = {
  included: [
    { id: 'meals', label: 'All meals (breakfast, lunch, dinner)', icon: <FaUtensils /> },
    { id: 'accommodation', label: 'Hotel accommodation', icon: <FaBed /> },
    { id: 'guide', label: 'Professional guide', icon: <FaHiking /> },
    { id: 'transport', label: 'Airport transfers', icon: <FaBus /> },
    { id: 'insurance', label: 'Travel insurance', icon: <FaShieldAlt /> },
    { id: 'permits', label: 'Entry permits and fees', icon: <FaTicketAlt /> },
    { id: 'photography', label: 'Photography service', icon: <FaCamera /> },
    { id: 'equipment', label: 'Climbing equipment', icon: <FaHiking /> },
    { id: 'trekking_poles', label: 'Trekking poles', icon: <FaHiking /> },
    { id: 'sleeping_bag', label: 'High-altitude sleeping bag', icon: <FaBed /> },
    { id: 'first_aid', label: 'Medical & First Aid Kit', icon: <FaShieldAlt /> },
    { id: 'oxygen', label: 'Emergency oxygen cylinders', icon: <FaShieldAlt /> },
    { id: 'technical_gear', label: 'Technical climbing gear', icon: <FaHiking /> },
    { id: 'survival_equipment', label: 'Survival equipment', icon: <FaShieldAlt /> }
  ],
  excluded: [
    { id: 'personal_expenses', label: 'Personal expenses', icon: <FaTicketAlt /> },
    { id: 'tips', label: 'Tips and gratuities', icon: <FaTicketAlt /> },
    { id: 'international_flights', label: 'International flights', icon: <FaBus /> },
    { id: 'visa', label: 'Visa fees', icon: <FaTicketAlt /> },
    { id: 'travel_insurance', label: 'Travel insurance', icon: <FaShieldAlt /> },
    { id: 'alcohol', label: 'Alcoholic beverages', icon: <FaUtensils /> },
    { id: 'souvenirs', label: 'Souvenirs and shopping', icon: <FaTicketAlt /> },
    { id: 'additional_activities', label: 'Additional activities', icon: <FaHiking /> },
    { id: 'laundry', label: 'Laundry and phone calls', icon: <FaBus /> },
    { id: 'emergency_evacuation', label: 'Emergency evacuation costs', icon: <FaShieldAlt /> },
    { id: 'extra_insurance', label: 'Extra insurance options', icon: <FaShieldAlt /> },
    { id: 'emergency_evacuation_options', label: 'Emergency evacuation options', icon: <FaShieldAlt /> }
  ],
  activities: [
    { id: 'hiking', label: 'Mountain Hiking', icon: <FaHiking /> },
    { id: 'climbing', label: 'Peak Climbing', icon: <FaHiking /> },
    { id: 'cycling', label: 'Mountain Cycling', icon: <FaBus /> },
    { id: 'camping', label: 'Wilderness Camping', icon: <FaBed /> },
    { id: 'photography', label: 'Landscape Photography', icon: <FaCamera /> },
    { id: 'culture', label: 'Cultural Sightseeing', icon: <FaMapMarkedAlt /> },
    { id: 'safari', label: 'Wildlife Safari', icon: <FaBus /> }
  ]
};

export default function AdminDestinations() {
  const { isAdmin, loading } = useAdminAuth();
  const router = useRouter();

  const [destinations, setDestinations] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedIncluded, setSelectedIncluded] = useState([]);
  const [selectedExcluded, setSelectedExcluded] = useState([]);
  const [customIncluded, setCustomIncluded] = useState('');
  const [customExcluded, setCustomExcluded] = useState('');
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [customActivities, setCustomActivities] = useState('');

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    image: "",
    description: "",
    date: "",
    price: "",
    offer: "",
    duration: "",
    difficulty: "Moderate",
    activities: "",
    included: "",
    excluded: "",
    gallery: "",
  });

  // Helper function to check if destination is completed
  const isDestinationCompleted = (dest) => {
    if (!dest.date) return false;
    try {
      const destDate = new Date(dest.date.replace(/ - \d+,/, ","));
      const today = new Date();
      return destDate < today;
    } catch {
      return false;
    }
  };

  const totalDestinations = useMemo(() => destinations.length, [destinations]);

  useEffect(() => {
    if (!isAdmin || loading) return;
    fetchDestinations();
  }, [isAdmin, loading]);

  const fetchDestinations = async () => {
    setDataLoading(true);
    try {
      const res = await fetch("/api/destinations?admin=true");
      const data = await res.json();
      const allDestinations = [
        ...(Array.isArray(data.destinations) ? data.destinations : []),
        ...(Array.isArray(data.completedDestinations) ? data.completedDestinations : [])
      ];
      setDestinations(allDestinations);
    } catch (error) {
      console.error("Error fetching destinations:", error);
      toast.error("Failed to load destinations");
    } finally {
      setDataLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Calculate discounted price if offer is provided
      const originalPrice = Number(formData.price) || 0;
      const offerPercentage = formData.offer ? Number(formData.offer) : 0;
      const discountedPrice = offerPercentage > 0 ? originalPrice * (1 - offerPercentage / 100) : originalPrice;

      // Combine selected predefined items and custom items
      const selectedIncludedItems = selectedIncluded.map(id =>
        PREDEFINED_ITEMS.included.find(item => item.id === id)?.label
      ).filter(Boolean);
      const selectedExcludedItems = selectedExcluded.map(id =>
        PREDEFINED_ITEMS.excluded.find(item => item.id === id)?.label
      ).filter(Boolean);

      const selectedActivityItems = selectedActivities.map(id =>
        PREDEFINED_ITEMS.activities.find(item => item.id === id)?.label
      ).filter(Boolean);
      const customActivityItems = customActivities.split(',').map(item => item.trim()).filter(Boolean);
      const customIncludedItems = customIncluded.split(',').map(item => item.trim()).filter(Boolean);
      const customExcludedItems = customExcluded.split(',').map(item => item.trim()).filter(Boolean);

      const allIncluded = [...selectedIncludedItems, ...customIncludedItems];
      const allExcluded = [...selectedExcludedItems, ...customExcludedItems];
      const allActivities = [...selectedActivityItems, ...customActivityItems];

      const payload = {
        ...formData,
        price: Number(formData.price) || 0,
        offer: formData.offer ? Number(formData.offer) : 0,
        activities: allActivities,
        tags: allActivities, // Map activities to tags for filtering
        included: allIncluded,
        excluded: allExcluded,
        gallery: typeof formData.gallery === 'string'
          ? formData.gallery.split(",").map((item) => item.trim()).filter(Boolean)
          : Array.isArray(formData.gallery) ? formData.gallery : [],
      };

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
      price: dest.price || "",
      offer: dest.offer || "",
      duration: dest.duration || "",
      difficulty: dest.difficulty || "Moderate",
      gallery: dest.gallery ? dest.gallery.join(", ") : "",
    });

    const activities = dest.activities || [];
    const predefinedActivityLabels = PREDEFINED_ITEMS.activities.map(i => i.label);
    const selectedIds = PREDEFINED_ITEMS.activities
      .filter(i => activities.includes(i.label))
      .map(i => i.id);
    const customAct = activities
      .filter(label => !predefinedActivityLabels.includes(label))
      .join(", ");

    const included = dest.included || [];
    const predefinedIncLabels = PREDEFINED_ITEMS.included.map(i => i.label);
    const selectedIncIds = PREDEFINED_ITEMS.included
      .filter(i => included.includes(i.label))
      .map(i => i.id);
    const customInc = included
      .filter(label => !predefinedIncLabels.includes(label))
      .join(", ");

    const excluded = dest.excluded || [];
    const predefinedExcLabels = PREDEFINED_ITEMS.excluded.map(i => i.label);
    const selectedExcIds = PREDEFINED_ITEMS.excluded
      .filter(i => excluded.includes(i.label))
      .map(i => i.id);
    const customExc = excluded
      .filter(label => !predefinedExcLabels.includes(label))
      .join(", ");

    setSelectedActivities(selectedIds);
    setCustomActivities(customAct);
    setSelectedIncluded(selectedIncIds);
    setCustomIncluded(customInc);
    setSelectedExcluded(selectedExcIds);
    setCustomExcluded(customExc);

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
      price: "",
      offer: "",
      duration: "",
      difficulty: "Moderate",
      activities: "",
      included: "",
      excluded: "",
      gallery: "",
    });
    setSelectedIncluded([]);
    setSelectedExcluded([]);
    setCustomIncluded('');
    setCustomExcluded('');
    setSelectedActivities([]);
    setCustomActivities('');
  };

  if (loading) {
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
              {[
                ["name", "Name"],
                ["location", "Location"],
                ["duration", "Duration (e.g. 7 Days)"],
                ["image", "Image URL"],
                ["offer", "Offer (%)"],
                ["price", "Original Price ($)"],
                ["difficulty", "Difficulty"],
                ["gallery", "Gallery Images (comma separated)"],
              ].map(([key, label]) => (
                <div key={key}>
                  <label className="block text-sm font-medium mb-1">
                    {label} {key !== "offer" && key !== "gallery" ? "*" : "(Optional)"}
                  </label>
                  {key === "difficulty" ? (
                    <select
                      value={formData[key]}
                      onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      required
                    >
                      <option value="Easy">Easy</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Challenging">Challenging</option>
                      <option value="Difficult">Difficult</option>
                    </select>
                  ) : (
                    <input
                      type={key === "offer" ? "number" : "text"}
                      required={key !== "offer" && key !== "gallery"}
                      value={formData[key]}
                      onChange={(e) =>
                        setFormData({ ...formData, [key]: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={key === "offer" ? "e.g., 20" : key === "price" ? "e.g., 1000" : ""}
                    />
                  )}
                </div>
              ))}
              <DatePicker
                value={formData.date}
                onChange={(value) => setFormData({ ...formData, date: value })}
                label="Date"
                required={true}
              />
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
                <label className="block text-sm font-medium mb-1">Activities</label>
                <div className="space-y-2 max-h-40 overflow-y-auto border rounded p-3 bg-gray-50/50">
                  {PREDEFINED_ITEMS.activities.map((item) => (
                    <label key={item.id} className="flex items-center gap-2 cursor-pointer hover:bg-white p-1 rounded transition-colors group">
                      <input
                        type="checkbox"
                        checked={selectedActivities.includes(item.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedActivities([...selectedActivities, item.id]);
                          } else {
                            setSelectedActivities(selectedActivities.filter(id => id !== item.id));
                          }
                        }}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-700 flex items-center gap-2 text-sm group-hover:text-blue-600">
                        <span className="text-blue-500">{item.icon}</span>
                        {item.label}
                      </span>
                    </label>
                  ))}
                </div>
                <textarea
                  rows={2}
                  placeholder="Custom activities (comma separated)"
                  value={customActivities}
                  onChange={(e) => setCustomActivities(e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Included Items</label>
                <div className="space-y-2 max-h-40 overflow-y-auto border rounded p-3">
                  {PREDEFINED_ITEMS.included.map((item) => (
                    <label key={item.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                      <input
                        type="checkbox"
                        checked={selectedIncluded.includes(item.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedIncluded([...selectedIncluded, item.id]);
                          } else {
                            setSelectedIncluded(selectedIncluded.filter(id => id !== item.id));
                          }
                        }}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-700 flex items-center gap-2">
                        <span className="text-green-600">{item.icon}</span>
                        {item.label}
                      </span>
                    </label>
                  ))}
                </div>
                <textarea
                  rows={2}
                  placeholder="Custom included items (comma separated)"
                  value={customIncluded}
                  onChange={(e) => setCustomIncluded(e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Excluded Items</label>
                <div className="space-y-2 max-h-40 overflow-y-auto border rounded p-3">
                  {PREDEFINED_ITEMS.excluded.map((item) => (
                    <label key={item.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                      <input
                        type="checkbox"
                        checked={selectedExcluded.includes(item.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedExcluded([...selectedExcluded, item.id]);
                          } else {
                            setSelectedExcluded(selectedExcluded.filter(id => id !== item.id));
                          }
                        }}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-700 flex items-center gap-2">
                        <span className="text-red-600">{item.icon}</span>
                        {item.label}
                      </span>
                    </label>
                  ))}
                </div>
                <textarea
                  rows={2}
                  placeholder="Custom excluded items (comma separated)"
                  value={customExcluded}
                  onChange={(e) => setCustomExcluded(e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
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
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {destinations.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">No destinations yet. Add your first destination!</p>
          </div>
        )}

        {destinations.map((dest) => {
          const completed = isDestinationCompleted(dest);
          return (
            <div key={dest._id} className={`bg-white rounded-lg shadow-lg overflow-hidden ${completed ? 'border-2 border-red-200' : ''
              }`}>
              <div className="relative h-48">
                <Image
                  src={dest.image}
                  alt={dest.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold">{dest.name}</h3>
                  {completed && (
                    <span className="px-2 py-1 bg-red-600 text-white text-xs font-medium rounded-full">
                      Completed
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm mb-2">{dest.location}</p>
                <p className="text-gray-500 text-sm mb-2">{dest.date}</p>
                <div className="flex gap-2 flex-wrap mb-3">
                  {dest.tags?.map((tag, i) => (
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
                <div className="flex gap-2 text-sm text-gray-600">
                  <span className="font-medium">Difficulty:</span> {dest.difficulty}
                  <span className="ml-4 font-medium">Duration:</span> {dest.duration}
                  <div className="ml-4">
                    {dest.offer ? (
                      <React.Fragment>
                        <span className="font-medium">Original Price:</span>
                        <span className="line-through text-gray-400">${dest.price}</span>
                        <span className="ml-2 font-medium text-green-600">
                          ${Math.round(dest.price * (1 - dest.offer / 100))} ({dest.offer}% OFF)
                        </span>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <span className="font-medium">Price:</span> ${dest.price}
                      </React.Fragment>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
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
          );
        })}
      </section>

      {destinations.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No destinations found. Add your first destination!</p>
        </div>
      )}
    </div>
  );
}
