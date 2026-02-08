"use client";

import { useState, useEffect } from "react";
import { useAdminAuth } from "@/lib/useAdminAuth";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { PageTransition, FadeInUp, StaggerContainer, StaggerItem } from "@/components/animations";

export default function HeroSlidesAdmin() {
  const t = useTranslations("Admin");
  const { isAdmin, loading, session } = useAdminAuth();
  const router = useRouter();
  const [slides, setSlides] = useState([]);
  const [loadingSlides, setLoadingSlides] = useState(true);
  const [formData, setFormData] = useState({
    url: "",
    location: "",
    elevation: "",
    order: 0
  });
  const [editingSlide, setEditingSlide] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!session || !isAdmin) return;
    fetchSlides();
  }, [session, isAdmin]);

  const fetchSlides = async () => {
    try {
      setLoadingSlides(true);
      const response = await fetch("/api/hero-slides");
      const data = await response.json();
      if (data.success) {
        setSlides(data.slides);
      }
    } catch (error) {
      console.error("Failed to fetch slides:", error);
    } finally {
      setLoadingSlides(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const url = editingSlide ? "/api/hero-slides" : "/api/hero-slides";
      const method = editingSlide ? "PUT" : "POST";
      const payload = editingSlide ? { ...formData, id: editingSlide._id } : formData;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(editingSlide ? t("slide_updated") : t("slide_created"));
        setFormData({ url: "", location: "", elevation: "", order: 0 });
        setEditingSlide(null);
        fetchSlides();
      } else {
        setMessage(data.error || "Failed to save slide");
      }
    } catch (error) {
      setMessage("Error: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (slide) => {
    setEditingSlide(slide);
    setFormData({
      url: slide.url,
      location: slide.location,
      elevation: slide.elevation,
      order: slide.order
    });
  };

  const handleDelete = async (slideId) => {
    if (!confirm(t("delete_confirm"))) return;

    try {
      const response = await fetch(`/api/hero-slides?id=${slideId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        setMessage(t("slide_deleted"));
        fetchSlides();
      } else {
        setMessage(data.error || "Failed to delete slide");
      }
    } catch (error) {
      setMessage("Error: " + error.message);
    }
  };

  const handleCancel = () => {
    setEditingSlide(null);
    setFormData({ url: "", location: "", elevation: "", order: 0 });
    setMessage("");
  };

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen flex items-center justify-center">
          <FadeInUp>
            <div className="text-xl">{t("loading")}</div>
          </FadeInUp>
        </div>
      </PageTransition>
    );
  }

  if (!isAdmin) {
    return (
      <PageTransition>
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <FadeInUp>
            <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
              <h1 className="text-3xl font-bold text-red-600 mb-4">{t("access_denied")}</h1>
              <p className="text-gray-600 mb-6">
                {t("access_denied_desc")}
              </p>
              <button
                onClick={() => router.push("/admin")}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                {t("back_to_home")}
              </button>
            </div>
          </FadeInUp>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        <FadeInUp delay={0.1}>
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">{t("manage_hero_slides")}</h1>
            <button
              onClick={() => router.push("/admin")}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              {t("back_to_dashboard")}
            </button>
          </div>
        </FadeInUp>

        <FadeInUp delay={0.2}>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingSlide ? t("edit_slide") : t("add_new_slide")}
            </h2>

            {message && (
              <div className={`p-3 rounded mb-4 ${message.includes("successfully")
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
                }`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("image_url")} {t("required_field")}
                </label>
                <input
                  type="url"
                  required
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("location")} {t("required_field")}
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g., Karakoram Range"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("elevation")} {t("required_field")}
                </label>
                <input
                  type="text"
                  required
                  value={formData.elevation}
                  onChange={(e) => setFormData({ ...formData, elevation: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g., 6,500m"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("order")}
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Display order (0 = first)"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
                >
                  {isSubmitting
                    ? (editingSlide ? t("updating") : t("creating"))
                    : (editingSlide ? t("update_slide") : t("create_slide"))
                  }
                </button>
                {editingSlide && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                  >
                    {t("cancel")}
                  </button>
                )}
              </div>
            </form>
          </div>
        </FadeInUp>

        <FadeInUp delay={0.3}>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">{t("existing_slides")}</h2>

            {loadingSlides ? (
              <div className="text-center py-8">{t("loading")}</div>
            ) : slides.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {t("no_slides_found")}
              </div>
            ) : (
              <StaggerContainer className="space-y-4">
                {slides.map((slide, index) => (
                  <StaggerItem key={slide._id}>
                    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-shrink-0">
                          <img
                            src={slide.url}
                            alt={slide.location}
                            className="w-24 h-24 object-cover rounded-lg"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/96x96?text=No+Image";
                            }}
                          />
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-semibold text-lg">{slide.location}</h3>
                          <p className="text-gray-600">{t("elevation")}: {slide.elevation}</p>
                          <p className="text-sm text-gray-500">{t("order")}: {slide.order}</p>
                        </div>
                        <div className="flex gap-2 items-center">
                          <button
                            onClick={() => handleEdit(slide)}
                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
                          >
                            {t("edit")}
                          </button>
                          <button
                            onClick={() => handleDelete(slide._id)}
                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm"
                          >
                            {t("delete")}
                          </button>
                        </div>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            )}
          </div>
        </FadeInUp>
      </div>
    </PageTransition>
  );
}
