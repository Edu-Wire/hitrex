"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "react-toastify";

export default function BookDestination() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    userEmail: "",
    userPhone: "",
    numberOfPeople: 1,
    trekDate: "",
    specialRequests: "",
  });

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push(`/login?callbackUrl=/book/${params.id}`);
      return;
    }
    fetchDestination();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status, router, params.id]);

  const fetchDestination = async () => {
    try {
      const res = await fetch(`/api/destinations/${params.id}`);
      const data = await res.json();
      if (data.destination) {
        setDestination(data.destination);
        setFormData({
          ...formData,
          userName: session?.user?.name || "",
          userEmail: session?.user?.email || "",
          trekDate: data.destination.date || "",
        });
      }
    } catch (error) {
      console.error("Error fetching destination:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const totalAmount = (destination.price || 5000) * formData.numberOfPeople;

    try {
      setSubmitting(true);

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination: params.id,
          ...formData,
          totalAmount,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        console.log("Booking created, user email:", session?.user?.email);

        const paymentRes = await fetch("/api/payments/stripe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: totalAmount,
            currency: "eur",
            customerEmail: session?.user?.email,
            metadata: {
              destinationId: params.id,
              destinationName: destination.name,
              userEmail: session?.user?.email,
            },
            successPath: "/my-bookings",
            cancelPath: `/book/${params.id}`,
            productName: `Booking for ${destination.name}`,
          }),
        });

        const paymentData = await paymentRes.json();

        if (!paymentRes.ok || !paymentData.checkoutUrl) {
          throw new Error(paymentData.error || "Payment setup failed");
        }

        // send confirmation email with detailed template
        console.log("Sending booking email to:", session?.user?.email);
        try {
          const emailRes = await fetch("/api/notifications/booking", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userEmail: session?.user?.email,
              userName: formData.userName,
              userPhone: formData.userPhone,
              destinationName: destination.name,
              destinationImage: destination.image,
              trekDate: formData.trekDate,
              totalAmount,
              numberOfPeople: formData.numberOfPeople,
              specialRequests: formData.specialRequests,
              duration: destination.duration,
              difficulty: destination.difficulty,
              pricePerPerson: destination.price || undefined,
              manageUrl: "/my-bookings",
            }),
          });
          const emailData = await emailRes.json();
          console.log("Email API response:", emailRes.status, emailData);
        } catch (err) {
          console.error("Email send error:", err);
          // don't block payment flow
        }

        const stripe = await loadStripe(
          paymentData.publishableKey || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
        );

        if (!stripe) {
          throw new Error("Stripe failed to initialize");
        }

        window.location.href = paymentData.checkoutUrl;
      } else {
        toast.error(data.error || "Failed to create booking");
      }
    } catch (error) {
      toast.error(error.message || "Error creating booking/payment");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center -mt-24">
        <div className="text-xl font-black text-white animate-pulse uppercase tracking-widest">Loading...</div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center -mt-24">
        <div className="text-center p-8 bg-[#1a1a1a] rounded-[2rem] border border-white/10">
          <h1 className="text-2xl font-black text-[#ff4d00] mb-4 uppercase italic">Destination not found</h1>
          <button
            onClick={() => router.push("/page/destination")}
            className="bg-white text-black px-8 py-3 rounded-full font-black uppercase transition-transform hover:scale-105"
          >
            Back to Destinations
          </button>
        </div>
      </div>
    );
  }

  const totalAmount = (destination.price || 5000) * formData.numberOfPeople;

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#ff4d00] -mt-24">
      <div className="max-w-6xl mx-auto px-6 pt-32 pb-12">

        {/* Header Section */}
        <div className="mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <p className="text-[#ff4d00] font-black uppercase tracking-widest mb-2 text-sm">Adventure Ready</p>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic leading-[0.9]">
            Book Your <span className="text-[#ff4d00]">Trek</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Left Side: Destination Preview */}
          <div className="lg:col-span-5 space-y-8 animate-in fade-in slide-in-from-left-4 duration-700 delay-100">
            <div className="group relative h-[500px] w-full rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl">
              <Image
                src={destination.image}
                alt={destination.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute top-6 left-6 bg-white/10 backdrop-blur-xl border border-white/20 px-4 py-1.5 rounded-full">
                <span className="text-[10px] uppercase font-black tracking-[0.2em]">{destination.location}</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <h2 className="text-4xl font-black uppercase italic leading-none">{destination.name}</h2>
              </div>
            </div>

            <div className="space-y-6 px-2">
              <p className="text-gray-400 font-medium leading-relaxed">{destination.description}</p>

              <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-8">
                <div>
                  <p className="text-[#ff4d00] text-[10px] font-black uppercase mb-1">Duration</p>
                  <p className="font-bold text-lg">{destination.duration || "5 DAYS"}</p>
                </div>
                <div>
                  <p className="text-[#ff4d00] text-[10px] font-black uppercase mb-1">Difficulty</p>
                  <p className="font-bold text-lg uppercase">{destination.difficulty || "MODERATE"}</p>
                </div>
                <div>
                  <p className="text-[#ff4d00] text-[10px] font-black uppercase mb-1">Per Person</p>
                  <p className="font-bold text-lg">€{destination.price || 5000}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Booking Form */}
          <div className="lg:col-span-7 animate-in fade-in slide-in-from-right-4 duration-700 delay-200">
            <div className="bg-[#0f0f0f] rounded-[2.5rem] p-8 md:p-12 border border-white/5 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]">
              <h3 className="text-2xl font-black uppercase italic mb-8 tracking-tight">Reservation Details</h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[#ff4d00] text-[10px] font-black uppercase ml-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.userName}
                      onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                      className="w-full bg-[#1a1a1a] border border-white/5 rounded-2xl p-4 text-white focus:ring-2 focus:ring-[#ff4d00] focus:bg-[#222] outline-none transition-all duration-300"
                      placeholder="Your Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[#ff4d00] text-[10px] font-black uppercase ml-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.userEmail}
                      onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
                      className="w-full bg-[#1a1a1a] border border-white/5 rounded-2xl p-4 text-white focus:ring-2 focus:ring-[#ff4d00] focus:bg-[#222] outline-none transition-all duration-300"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[#ff4d00] text-[10px] font-black uppercase ml-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={formData.userPhone}
                      onChange={(e) => setFormData({ ...formData, userPhone: e.target.value })}
                      className="w-full bg-[#1a1a1a] border border-white/5 rounded-2xl p-4 text-white focus:ring-2 focus:ring-[#ff4d00] focus:bg-[#222] outline-none transition-all duration-300"
                      placeholder="+91 00000 00000"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[#ff4d00] text-[10px] font-black uppercase ml-1">No. of People</label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="20"
                      value={formData.numberOfPeople}
                      onChange={(e) => setFormData({ ...formData, numberOfPeople: parseInt(e.target.value) })}
                      className="w-full bg-[#1a1a1a] border border-white/5 rounded-2xl p-4 text-white focus:ring-2 focus:ring-[#ff4d00] outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[#ff4d00] text-[10px] font-black uppercase ml-1">Trek Date</label>
                  <input
                    type="text"
                    required
                    value={formData.trekDate}
                    onChange={(e) => setFormData({ ...formData, trekDate: e.target.value })}
                    className="w-full bg-[#1a1a1a] border border-white/5 rounded-2xl p-4 text-white focus:ring-2 focus:ring-[#ff4d00] outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[#ff4d00] text-[10px] font-black uppercase ml-1">Special Requests</label>
                  <textarea
                    rows={2}
                    value={formData.specialRequests}
                    onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                    className="w-full bg-[#1a1a1a] border border-white/5 rounded-2xl p-4 text-white focus:ring-2 focus:ring-[#ff4d00] outline-none resize-none"
                    placeholder="Dietary or medical requirements?"
                  />
                </div>

                <div className="pt-6 border-t border-white/10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Total Investment</p>
                      <p className="text-4xl font-black italic text-white tracking-tighter mt-1">€{totalAmount}</p>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="relative group bg-[#ff4d00] hover:bg-white text-white hover:text-black px-12 py-5 rounded-2xl font-black uppercase tracking-widest transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_10px_30px_-10px_#ff4d00]"
                    >
                      <span className="relative z-10">
                        {submitting ? "Processing..." : "Confirm & Pay"}
                      </span>
                      <div className="absolute inset-0 rounded-2xl bg-white scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-600 mt-6 uppercase font-bold tracking-tight">
                    * Final confirmation will be sent to your registered email address.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
