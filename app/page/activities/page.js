"use client";
import Image from "next/image";

const trips = [
  {
    id: "day-trips",
    title: "Day Trips",
    subtitle: "Adventure",
    description:
      "Experience the thrill of outdoor adventure in just one day with Hitrex’s carefully curated day trips, designed to bring you closer to nature, explore stunning landscapes, and create lasting memories—all within a single, unforgettable excursion.",
    images: [
      "/images/trip-1.avif",
      "/images/trip-2.avif",
      "/images/trip-3.avif",
    ],
  },
  {
    id: "weekend-trips",
    title: "Weekend Trips",
    subtitle: "Weekend Adventure",
    description:
      "Make the most of your weekend with Hitrex’s exciting weekend and long weekend trips, offering the perfect balance of adventure, relaxation, and exploration - all while reconnecting with nature and creating unforgettable memories.",
    images: [
      "/images/trip-4.avif",
      "/images/trip-5.avif",
      "/images/trip-6.avif",
    ],
  },
  {
    id: "camping-trips",
    title: "Camping Trips",
    subtitle: "Long Tours",
    description:
      "Embark on a journey of discovery with Hitrex’s long tours, combining exhilarating hiking adventures and immersive camping experiences, where you can explore remote landscapes, challenge yourself, and create memories that will last a lifetime.",
    images: [
      "/images/trip-7.avif",
      "/images/trip-8.avif",
      "/images/trip-9.avif",
    ],
  },
];

export default function TripsPage() {
  return (
    <div>
      {/* Hero */}
      <div className="relative h-80 w-full p-10">
        <Image
          src="/images/trip-hero.avif"
          alt="Trips banner"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white">Our Trips</h1>
        </div>
      </div>

      {/* Sections */}
      <div className="max-w-6xl mx-auto px-6 py-16 space-y-16">
        {trips.map((trip) => (
          <div key={trip.id}>
            <h3 className="text-sm font-semibold text-green-700 uppercase tracking-wide mb-4">
              {trip.subtitle}
            </h3>
            <h2 className="text-4xl font-bold mb-4">{trip.title}</h2>
            <p className="text-gray-600 mb-6">{trip.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {trip.images.map((src, idx) => (
                <div key={idx} className="relative h-64 w-full rounded-lg overflow-hidden">
                  <Image
                    src={src}
                    alt={`${trip.title} ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
