"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAdminAuth } from "@/lib/useAdminAuth";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";

export default function AdminBlogs() {
  const t = useTranslations("Admin");
  const { isAdmin, loading } = useAdminAuth();
  const router = useRouter();

  const [blogs, setBlogs] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    id: "",
    subtitle: "",
    title: "",
    description: "",
    images: "",
  });

  /* 🔐 Redirect if not admin */
  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push("/");
    }
  }, [loading, isAdmin, router]);

  /* 📦 Fetch blogs */
  useEffect(() => {
    if (!loading && isAdmin) {
      fetchBlogs();
    }
  }, [loading, isAdmin]);

  const fetchBlogs = async () => {
    setDataLoading(true);
    try {
      const res = await fetch("/api/blogs");
      const data = await res.json();
      setBlogs(Array.isArray(data.blogs) ? data.blogs : []);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast.error(t("loading_failed"));
    } finally {
      setDataLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.id ||
      !formData.subtitle ||
      !formData.title ||
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
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Blog created");
        resetForm();
        setShowForm(false);
        fetchBlogs();
      } else {
        toast.error(data.error || t("save_failed"));
      }
    } catch (error) {
      console.error("Error creating blog:", error);
      toast.error(t("save_error"));
    }
  };

  const resetForm = () => {
    setFormData({
      id: "",
      subtitle: "",
      title: "",
      description: "",
      images: "",
    });
  };

  const totalBlogs = useMemo(() => blogs.length, [blogs]);

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
            {t("manage_blogs")}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {t("total_blogs")}: {totalBlogs}
          </p>
        </div>

        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg transition"
        >
          {showForm ? t("close_form") : t("add_blog")}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white text-gray-900 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">{t("add_blog")}</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                ["id", t("blog_id")],
                ["subtitle", t("subtitle")],
                ["title", t("title")],
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

              <div>
                <label className="block text-sm font-medium mb-1">
                  {t("gallery_images")} {t("required_field")}
                </label>
                <input
                  type="text"
                  required
                  value={formData.images}
                  onChange={(e) =>
                    setFormData({ ...formData, images: e.target.value })
                  }
                  placeholder="/images/one.avif, /images/two.avif"
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
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
                {t("save_blog")}
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

      {/* Blogs List */}
      <section className="bg-white text-gray-900 rounded-lg shadow divide-y divide-gray-200">
        {blogs.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            {t("no_blogs")}
          </div>
        )}

        {blogs.map((blog) => (
          <div
            key={blog._id || blog.id}
            className="p-4 md:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
          >
            <div className="space-y-1">
              <p className="text-xs text-gray-400 uppercase tracking-wide">
                {blog.id}
              </p>
              <h3 className="text-lg font-semibold">{blog.title}</h3>
              <p className="text-sm text-gray-600">{blog.subtitle}</p>
            </div>

            <p className="text-sm text-gray-600 max-w-xl line-clamp-2">
              {blog.description}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
