"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function DestinationsPage() {
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [selectedActivity, setSelectedActivity] = useState("All");
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState(["All"]);
  const [activities, setActivities] = useState(["All"]);

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const res = await fetch("/api/destinations");
      const data = await res.json();
      
      if (data.destinations) {
        setDestinations(data.destinations);
        
        // Extract unique locations and activities
        const uniqueLocations = new Set(["All"]);
        const uniqueActivities = new Set(["All"]);
        
        data.destinations.forEach((dest) => {
          // Extract country names from location
          const locationParts = dest.location.split("/");
          locationParts.forEach((loc) => uniqueLocations.add(loc.trim()));
          
          // Add all tags as activities
          dest.tags.forEach((tag) => uniqueActivities.add(tag));
        });
        
        setLocations(Array.from(uniqueLocations));
        setActivities(Array.from(uniqueActivities));
      }
    } catch (error) {
      console.error("Error fetching destinations:", error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = destinations.filter((dest) => {
    return (
      (selectedLocation === "All" || dest.location.includes(selectedLocation)) &&
      (selectedActivity === "All" || dest.tags.includes(selectedActivity))
    );
  });

  return (
    <div>
      {/* Hero Section */}
      <section className="relative w-full h-96  flex items-center justify-center text-center text-white">
        <Image
          src="/images/mountains.avif" // Replace with your hero image
          alt="Trekking Hero"
          fill
          className="absolute object-cover  "
        />
        <div className="relative z-10 px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 animate-fadeIn">
            Destinations 
          </h1>
          {/* <p className="text-lg md:text-2xl animate-fadeIn delay-200">
            Find the perfect trekking adventure for your next journey.
          </p>
          <button className="mt-6 bg-white text-green-700 px-6 py-3 rounded-full font-semibold hover:bg-green-100 transition">
            Discover Trips
          </button> */}
        </div>
      </section>

      {/* Main Content */}
      <div className="flex mt-8">
        {/* Sidebar Filters */}
        <aside className="w-64 bg-white border-r p-6 hidden md:block">
          <h3 className="font-bold text-lg mb-4">Filters</h3>
          <div className="mb-6">
            <h4 className="font-semibold">Location</h4>
            {locations.map((loc) => (
              <div key={loc}>
                <label>
                  <input
                    type="radio"
                    name="location"
                    value={loc}
                    checked={selectedLocation === loc}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                  />{" "}
                  {loc}
                </label>
              </div>
            ))}
          </div>

          <div>
            <h4 className="font-semibold">Activity</h4>
            {activities.map((act) => (
              <div key={act}>
                <label>
                  <input
                    type="radio"
                    name="activity"
                    value={act}
                    checked={selectedActivity === act}
                    onChange={(e) => setSelectedActivity(e.target.value)}
                  />{" "}
                  {act}
                </label>
              </div>
            ))}
          </div>
        </aside>

        {/* Destinations List */}
        <main className="flex-1 p-6">
          <h2 className="text-3xl font-bold mb-6">Upcoming Trips</h2>
          
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Loading destinations...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No destinations found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filtered.map((dest) => (
                <div
                  key={dest._id}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition transform hover:scale-105"
                >
                  <Image
                    src={dest.image}
                    alt={dest.name}
                    width={600}
                    height={400}
                    className="rounded-t-lg object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-bold">{dest.name}</h3>
                    <p className="text-gray-600">{dest.location}</p>
                    <p className="text-sm text-gray-500">{dest.date}</p>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {dest.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                      {dest.description}
                    </p>
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => router.push(`/book/${dest._id}`)}
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
