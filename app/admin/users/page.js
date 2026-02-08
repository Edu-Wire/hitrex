"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useAdminAuth } from "@/lib/useAdminAuth";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";

export default function AdminUsers() {
  const t = useTranslations("Admin");
  const { isAdmin, loading } = useAdminAuth();
  const { data: session } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!isAdmin || loading) return;
    fetchUsers();
  }, [isAdmin, loading]);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setDataLoading(false);
    }
  };

  const updateUserRole = async (id, role) => {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message);
        fetchUsers();
      } else {
        toast.error(data.error || t("save_failed"));
      }
    } catch (error) {
      toast.error(t("save_error"));
      console.error(error);
    }
  };

  const deleteUser = async (id) => {
    if (!confirm(t("delete_confirm"))) return;

    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message);
        fetchUsers();
      } else {
        toast.error(data.error || t("delete_failed"));
      }
    } catch (error) {
      toast.error(t("delete_error"));
      console.error(error);
    }
  };

  const filteredUsers = users.filter((user) => {
    if (filter === "all") return true;
    return user.role === filter;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">{t("loading")}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{t("manage_users")}</h1>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-3xl ${filter === "all"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700"
              }`}
          >
            {t("all_users")} ({users.length})
          </button>
          <button
            onClick={() => setFilter("admin")}
            className={`px-4 py-2 rounded-3xl ${filter === "admin"
                ? "bg-purple-600 text-white"
                : "bg-white text-gray-700"
              }`}
          >
            {t("admins")}
          </button>
          <button
            onClick={() => setFilter("user")}
            className={`px-4 py-2 rounded-3xl ${filter === "user"
                ? "bg-green-600 text-white"
                : "bg-white text-gray-700"
              }`}
          >
            {t("regular_users")}
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("user_id")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("name")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("email")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("status")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("joined_date")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("actions")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    #{user._id.slice(-6)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {user.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {user.email}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={user.role}
                      onChange={(e) => updateUserRole(user._id, e.target.value)}
                      className={`text-xs px-3 py-1 rounded ${user.role === "admin"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-green-100 text-green-700"
                        }`}
                    >
                      <option value="user">{t("user")}</option>
                      <option value="admin">{t("admin")}</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => deleteUser(user._id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                      disabled={user._id === session?.user?.id}
                    >
                      {user._id === session?.user?.id ? t("you") : t("delete")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-300 text-lg">{t("no_users_found")}</p>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mt-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">{t("total_users")}</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {users.length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">{t("admins")}</h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">
            {users.filter((u) => u.role === "admin").length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">{t("regular_users")}</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {users.filter((u) => u.role === "user").length}
          </p>
        </div>
      </div>
    </div>
  );
}