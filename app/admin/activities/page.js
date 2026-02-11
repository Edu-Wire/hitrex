"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAdminAuth } from "@/lib/useAdminAuth";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";

export default function AdminActivities() {
  const t = useTranslations("Admin");
  const { isAdmin, loading } = useAdminAuth();
  const router = useRouter();

  const [activities, setActivities] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    id: "",
    title: "",
    subtitle: "",
    coordinates: "",
    description: "",
    images: "",
  });

  /* 🔐 Redirect if not admin */
  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push("/");
    }
  }, [loading, isAdmin, router]);

  /* 📦 Fetch activities */
  useEffect(() => {
    if (!loading && isAdmin) {
      fetchActivities();
    }
  }, [loading, isAdmin]);

  const fetchActivities = async () => {
    setDataLoading(true);
    try {
      const res = await fetch("/api/activities");
      const data = await res.json();
      setActivities(Array.isArray(data.activities) ? data.activities : []);
    } catch (error) {
      console.error("Error fetching activities:", error);
      toast.error(t("loading_failed"));
    } finally {
      setDataLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.id ||
      !formData.title ||
      !formData.subtitle ||
      !formData.coordinates ||
      !formData.description ||
      !formData.images
    ) {
      toast.error("Please fill all fields");
      return;
    }

    const payload = {
      ...formData,
      images: formData.images
        .split(",")
        .map((img) => img.trim())
        .filter(Boolean),
    };

    try {
      const res = await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Activity created");
        resetForm();
        setShowForm(false);
        fetchActivities();
      } else {
        toast.error(data.error || t("save_failed"));
      }
    } catch (error) {
      console.error("Error creating activity:", error);
      toast.error(t("save_error"));
    }
  };

  const resetForm = () => {
    setFormData({
      id: "",
      title: "",
      subtitle: "",
      coordinates: "",
      description: "",
      images: "",
    });
  };

  const totalActivities = useMemo(() => activities.length, [activities]);

  /* ⏳ Loading state */
  if (loading || dataLoading) {
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
            {t("manage_activities")}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {t("total_activities")}: {totalActivities}
          </p>
        </div>

        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg transition"
        >
          {showForm ? t("close_form") : t("add_activity")}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white text-gray-900 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">{t("add_activity")}</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                ["id", t("activity_id")],
                ["title", t("title")],
                ["subtitle", t("subtitle")],
                ["coordinates", t("coordinates")],
              ].map(([key, label]) => (
                <div key={key}>
                  <label className="block text-sm font-medium mb-1">
                    {label} {t("required_field")}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData[key]}
                    onChange={(e) =>
                      setFormData({ ...formData, [key]: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              ))}

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  {t("gallery_images")} {t("required_field")}
                </label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={async (e) => {
                        const files = Array.from(e.target.files || []);
                        if (files.length === 0) return;

                        const newUrls = [];
                        for (const file of files) {
                          const uploadFormData = new FormData();
                          uploadFormData.append("file", file);

                          try {
                            const res = await fetch("/api/upload", {
                              method: "POST",
                              body: uploadFormData,
                            });
                            const data = await res.json();
                            if (data.success) {
                              newUrls.push(data.url);
                            } else {
                              toast.error(`Failed to upload ${file.name}: ${data.error}`);
                            }
                          } catch (err) {
                            console.error("Upload error:", err);
                            toast.error(`Error uploading ${file.name}`);
                          }
                        }

                        if (newUrls.length > 0) {
                          const currentImages = formData.images ? formData.images.split(",").map(s => s.trim()).filter(Boolean) : [];
                          const updatedImages = [...currentImages, ...newUrls].join(", ");
                          setFormData(prev => ({ ...prev, images: updatedImages }));
                          toast.success(`${newUrls.length} image(s) uploaded`);
                        }
                      }}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                    />
                  </div>
                  {formData.images && (
                    <div className="flex flex-wrap gap-2">
                      {formData.images.split(",").map((imgUrl, idx) => (
                        <div key={idx} className="relative group">
                          <img src={imgUrl.trim()} alt="" className="h-20 w-20 object-cover rounded border" />
                          <button
                            type="button"
                            onClick={() => {
                              const currentImages = formData.images.split(",").map(s => s.trim()).filter(Boolean);
                              const newImages = currentImages.filter((_, i) => i !== idx).join(", ");
                              setFormData(prev => ({ ...prev, images: newImages }));
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
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
                {t("save_activity")}
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

      {/* Activities List */}
      <section className="bg-white text-gray-900 rounded-lg shadow divide-y divide-gray-200">
        {activities.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            {t("no_activities")}
          </div>
        )}

        {activities.map((activity) => (
          <div
            key={activity._id || activity.id}
            className="p-4 md:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
          >
            <div className="space-y-1">
              <p className="text-xs text-gray-400 uppercase tracking-wide">
                {activity.id}
              </p>
              <h3 className="text-lg font-semibold">{activity.title}</h3>
              <p className="text-sm text-gray-600">{activity.subtitle}</p>
              <p className="text-xs text-gray-500">{activity.coordinates}</p>
            </div>

            <p className="text-sm text-gray-600 max-w-xl line-clamp-2">
              {activity.description}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
