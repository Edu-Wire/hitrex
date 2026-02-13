"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { PageTransition, FadeInUp, ScaleIn, StaggerContainer, StaggerItem } from "@/components/animations";
import { FaCompass, FaMountain, FaHiking, FaCampground, FaRoute } from "react-icons/fa";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    surname: "",
    gender: "",
    street: "",
    city: "",
    country: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          surname: formData.surname,
          gender: formData.gender,
          address: {
            street: formData.street,
            city: formData.city,
            country: formData.country,
          },
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      // Auto login after successful registration
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Registration successful but login failed. Please login manually.");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        router.push("/");
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
                <FaCampground className="text-lg" /> Join the trail community
              </p>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-xl leading-tight">
                Create your account and start exploring
              </h1>
              <p className="text-gray-100 max-w-xl leading-relaxed">
                Save your favorite routes, book guided treks, and sync gear lists. Your next summit
                is just a sign-up away.
              </p>
            </div>
          </FadeInUp>

          <ScaleIn className="backdrop-blur-md bg-white/10 border border-white/15 rounded-2xl shadow-2xl p-8 md:p-10 space-y-6">
            <FadeInUp>
              <h2 className="text-3xl font-extrabold text-white text-center">Create account</h2>
              <p className="text-sm text-gray-100 text-center">
                Already a member?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-emerald-200 hover:text-emerald-100 transition-colors"
                >
                  Sign in
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
                <StaggerContainer className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <StaggerItem>
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-100 mb-1">
                          First Name
                        </label>
                        <input
                          id="firstName"
                          name="firstName"
                          type="text"
                          required
                          value={formData.firstName}
                          onChange={handleChange}
                          className="appearance-none rounded-lg w-full px-3 py-2 border border-white/20 bg-white/10 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 transition-all font-light"
                          placeholder="First Name"
                        />
                      </div>
                    </StaggerItem>
                    <StaggerItem>
                      <div>
                        <label htmlFor="surname" className="block text-sm font-medium text-gray-100 mb-1">
                          Surname
                        </label>
                        <input
                          id="surname"
                          name="surname"
                          type="text"
                          required
                          value={formData.surname}
                          onChange={handleChange}
                          className="appearance-none rounded-lg w-full px-3 py-2 border border-white/20 bg-white/10 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 transition-all font-light"
                          placeholder="Surname"
                        />
                      </div>
                    </StaggerItem>
                  </div>

                  <StaggerItem>
                    <div>
                      <label htmlFor="gender" className="block text-sm font-medium text-gray-100 mb-1">
                        Gender
                      </label>
                      <select
                        id="gender"
                        name="gender"
                        required
                        value={formData.gender}
                        onChange={handleChange}
                        className="appearance-none rounded-lg w-full px-3 py-2 border border-white/20 bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 transition-all font-light"
                      >
                        <option value="" className="bg-slate-900">Select Gender</option>
                        <option value="Male" className="bg-slate-900">Male</option>
                        <option value="Female" className="bg-slate-900">Female</option>
                        <option value="Other" className="bg-slate-900">Other</option>
                        <option value="Prefer not to say" className="bg-slate-900">Prefer not to say</option>
                      </select>
                    </div>
                  </StaggerItem>

                  <StaggerItem>
                    <div>
                      <label htmlFor="street" className="block text-sm font-medium text-gray-100 mb-1">
                        Street / House Number
                      </label>
                      <input
                        id="street"
                        name="street"
                        type="text"
                        required
                        value={formData.street}
                        onChange={handleChange}
                        className="appearance-none rounded-lg w-full px-3 py-2 border border-white/20 bg-white/10 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 transition-all font-light"
                        placeholder="123 Trail Way"
                      />
                    </div>
                  </StaggerItem>

                  <div className="grid grid-cols-2 gap-4">
                    <StaggerItem>
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-100 mb-1">
                          City
                        </label>
                        <input
                          id="city"
                          name="city"
                          type="text"
                          required
                          value={formData.city}
                          onChange={handleChange}
                          className="appearance-none rounded-lg w-full px-3 py-2 border border-white/20 bg-white/10 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 transition-all font-light"
                          placeholder="City"
                        />
                      </div>
                    </StaggerItem>
                    <StaggerItem>
                      <div>
                        <label htmlFor="country" className="block text-sm font-medium text-gray-100 mb-1">
                          Country
                        </label>
                        <input
                          id="country"
                          name="country"
                          type="text"
                          required
                          value={formData.country}
                          onChange={handleChange}
                          className="appearance-none rounded-lg w-full px-3 py-2 border border-white/20 bg-white/10 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 transition-all font-light"
                          placeholder="Country"
                        />
                      </div>
                    </StaggerItem>
                  </div>

                  <StaggerItem>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-100 mb-1"
                      >
                        Email address (User ID)
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="appearance-none rounded-lg w-full px-3 py-2 border border-white/20 bg-white/10 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 transition-all font-light"
                        placeholder="you@example.com"
                      />
                    </div>
                  </StaggerItem>
                  <div className="grid grid-cols-2 gap-4">
                    <StaggerItem>
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
                          className="appearance-none rounded-lg w-full px-3 py-2 border border-white/20 bg-white/10 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 transition-all font-light"
                          placeholder="Min 6 chars"
                        />
                      </div>
                    </StaggerItem>
                    <StaggerItem>
                      <div>
                        <label
                          htmlFor="confirmPassword"
                          className="block text-sm font-medium text-gray-100 mb-1"
                        >
                          Confirm
                        </label>
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          required
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="appearance-none rounded-lg w-full px-3 py-2 border border-white/20 bg-white/10 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 transition-all font-light"
                          placeholder="Re-enter"
                        />
                      </div>
                    </StaggerItem>
                  </div>
                </StaggerContainer>

                <FadeInUp delay={0.4}>
                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full flex justify-center py-2.5 px-4 text-sm font-bold rounded-lg text-slate-900 bg-emerald-300 hover:bg-emerald-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-200 focus:ring-offset-slate-900/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-lg uppercase"
                  >
                    {loading ? "Creating account..." : "Create Account"}
                  </button>
                </FadeInUp>
              </form>
            </FadeInUp>
          </ScaleIn>
        </div>
      </div>
    </PageTransition>
  );
}
