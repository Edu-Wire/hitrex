"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function AdminBlogs() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    subtitle: "",
    title: "",
    description: "",
    images: "",
  });

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
      return;
    }
    fetchBlogs();
  }, [session, status, router]);

  const fetchBlogs = async () => {
    try {
      const res = await fetch("/api/blogs");
      const data = await res.json();
      setBlogs(Array.isArray(data.blogs) ? data.blogs : []);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        alert(data.message || "Blog created");
        resetForm();
        setShowForm(false);
        fetchBlogs();
      } else {
        alert(data.error || "Failed to create blog");
      }
    } catch (error) {
      console.error("Error creating blog:", error);
      alert("Error creating blog");
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
            <h1 className="text-2xl md:text-4xl font-bold">Manage Blogs</h1>
            <p className="text-sm text-slate-300 mt-1">Total blogs: {totalBlogs}</p>
          </div>
          <button
            onClick={() => setShowForm((prev) => !prev)}
            className="self-start bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-3xl transition"
          >
            {showForm ? "Close Form" : "Add Blog"}
          </button>
        </header>

        {showForm && (
          <div className="bg-white text-gray-900 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Add Blog</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Blog ID *</label>
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
                  <label className="block text-sm font-medium mb-1">Subtitle *</label>
                  <input
                    type="text"
                    required
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Images (comma separated) *</label>
                  <input
                    type="text"
                    required
                    value={formData.images}
                    onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                    placeholder="/images/one.avif, /images/two.avif"
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
                  Save Blog
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
          {blogs.map((blog) => (
            <div
              key={blog._id || blog.id}
              className="p-4 md:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
            >
              <div className="space-y-1">
                <p className="text-xs text-gray-400 uppercase tracking-wide">{blog.id}</p>
                <h3 className="text-lg font-semibold text-gray-900">{blog.title}</h3>
                <p className="text-sm text-gray-600">{blog.subtitle}</p>
              </div>
              <div className="text-sm text-gray-600 line-clamp-2 max-w-xl">
                {blog.description}
              </div>
            </div>
          ))}

          {blogs.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No blogs yet. Add your first blog.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
