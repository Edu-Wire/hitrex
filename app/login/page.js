"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { PageTransition, FadeInUp, ScaleIn } from "@/components/animations";
import { FaCompass, FaMountain, FaHiking } from "react-icons/fa";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <PageTransition>
      <div
        className="relative min-h-screen w-full bg-cover bg-center bg-fixed text-white -mt-24 pt-24"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(6,24,38,0.65), rgba(12,38,52,0.75)), url('/abooutBg.jpg')",
        }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <FaMountain className="absolute left-6 top-10 text-6xl opacity-20" />
          <FaCompass className="absolute right-10 top-16 text-5xl opacity-20" />
          <FaHiking className="absolute left-1/3 bottom-10 text-6xl opacity-20" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center py-16 px-6">
          <FadeInUp>
            <div className="space-y-4">
              <p className="inline-flex items-center gap-2 text-emerald-300 font-semibold">
                <FaMountain className="text-lg" /> Adventure Awaits
              </p>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-xl leading-tight">
                Sign in and start your next trek
              </h1>
              <p className="text-gray-100 max-w-xl leading-relaxed">
                Track your bookings, plan expeditions, and connect with trail experts. The mountains
                are calling—gear up and step in.
              </p>
            </div>
          </FadeInUp>

          <ScaleIn className="backdrop-blur-md bg-white/10 border border-white/15 rounded-2xl shadow-2xl p-8 md:p-10 space-y-6">
            <FadeInUp>
              <h2 className="text-3xl font-extrabold text-white text-center">Sign in</h2>
              <p className="text-sm text-gray-100 text-center">
                Or{" "}
                <Link
                  href="/signup"
                  className="font-semibold text-emerald-200 hover:text-emerald-100 transition-colors"
                >
                  create a new account
                </Link>
              </p>
            </FadeInUp>

            <FadeInUp delay={0.2}>
              <form className="space-y-5" onSubmit={handleSubmit}>
                {error && (
                  <div className="bg-red-50/90 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                    {error}
                  </div>
                )}
                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-100 mb-1">
                      Email address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="appearance-none rounded-lg w-full px-3 py-2 border border-white/20 bg-white/10 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 transition-all"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-100 mb-1"
                    >
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="appearance-none rounded-lg w-full px-3 py-2 border border-white/20 bg-white/10 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full flex justify-center py-2.5 px-4 text-sm font-semibold rounded-lg text-slate-900 bg-emerald-300 hover:bg-emerald-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-200 focus:ring-offset-slate-900/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-lg"
                  >
                    {loading ? "Signing in..." : "Sign in"}
                  </button>
                </div>
              </form>
            </FadeInUp>
          </ScaleIn>
        </div>
      </div>
    </PageTransition>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#061826]" />}>
      <LoginForm />
    </Suspense>
  );
}
