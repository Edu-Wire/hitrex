"use client";
import Image from "next/image";
import upcomingTrips from "../data/upcomingTrips";

export default function UpcomingTrips() {
  return (
    <section className="py-16 px-6 bg-white">
      <h2 className="text-3xl font-bold text-center mb-10">
        Upcoming Trips 
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {upcomingTrips.map((trip) => (
          <div
            key={trip.id}
            className="bg-gray-50 rounded-2xl shadow-md hover:shadow-lg transition duration-300 overflow-hidden"
          >
            <div className="relative h-56 w-full">
              <Image
                src={trip.image}
                alt={trip.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-5">
              <h3 className="text-xl font-semibold">{trip.name}</h3>
              <p className="text-gray-600 text-sm">{trip.location}</p>
              <p className="mt-2 text-gray-700 text-sm">
                📅 {trip.date} | ⏱ {trip.duration}
              </p>
              <p className="mt-3 text-gray-600 text-sm">{trip.description}</p>

              <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                Join Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
