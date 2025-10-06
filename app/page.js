import DestinationCard from "@/components/DestinationCards";
import HeroSection from "@/components/HeroSection";
import Image from "next/image";
import destinations from "@/data/destinations";
import UpcomingTrips from "@/components/UpcomingTrips";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-5">
      <HeroSection/>

        <section className="py-12 px-6 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-12">Explore Destinations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {destinations.map((dest) => (
            <DestinationCard key={dest.id} destination={dest} />
          ))}
        </div>
      </section>
      <UpcomingTrips/>
      <section className="py-16 bg-white">
  <div className="max-w-5xl mx-auto px-6 text-center">
    <h2 className="text-3xl font-bold mb-4">
      🧭 Understanding Hiking Trail Difficulty Levels
    </h2>
    <p className="text-gray-600 mb-10">
      Choosing the right trail starts with knowing its difficulty level. Our hiking routes are typically classified as <strong>easy</strong>, <strong>moderate</strong>, or <strong>challenging</strong> based on the terrain, elevation gain, distance, and technical challenges. Understanding these categories helps you prepare properly, whether you are planning a relaxed nature walk or a demanding mountain trek. Being informed ensures you pack the right gear, manage your energy, and stay safe throughout your adventure. With the right preparation, every hike becomes a rewarding experience.
    </p>

    {/* Difficulty Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Easy */}
      <div className="bg-green-50 p-6 rounded-2xl shadow hover:shadow-lg transition">
        <h3 className="text-xl font-bold text-green-700 mb-3">EASY</h3>
        <p className="text-gray-600">
          Gentle trails with minimal elevation, suitable for beginners and families.
        </p>
      </div>

      {/* Moderate */}
      <div className="bg-yellow-50 p-6 rounded-2xl shadow hover:shadow-lg transition">
        <h3 className="text-xl font-bold text-yellow-700 mb-3">MODERATE</h3>
        <p className="text-gray-600">
          Trails with varied terrain and moderate climbs, ideal for hikers with some experience.
        </p>
      </div>

      {/* Challenging */}
      <div className="bg-red-50 p-6 rounded-2xl shadow hover:shadow-lg transition">
        <h3 className="text-xl font-bold text-red-700 mb-3">CHALLENGING</h3>
        <p className="text-gray-600">
          Challenging routes with steep ascents, rough paths, and some technical sections for experienced hikers.
        </p>
      </div>
    </div>
  </div>
</section>
<section className="py-16 bg-gray-50">
  <div className="max-w-6xl mx-auto px-6">
    <h2 className="text-3xl font-bold text-center mb-10">
      🎒 Hiking Gear Guide by Difficulty Level
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Easy Trails */}
      <div className="bg-white border-l-4 border-green-500 rounded-lg shadow p-6">
        <h3 className="text-xl font-bold text-green-600 mb-4">🟢 Easy Trails</h3>
        <p className="font-semibold">Required:</p>
        <ul className="list-disc list-inside text-gray-600 mb-4">
          <li>Comfortable walking shoes</li>
          <li>Water bottle or hydration pack</li>
          <li>Weather-appropriate clothing (layers)</li>
        </ul>
        <p className="font-semibold">Recommended:</p>
        <ul className="list-disc list-inside text-gray-600">
          <li>Sun protection (hat, sunglasses, sunscreen)</li>
          <li>Light snacks</li>
        </ul>
      </div>

      {/* Moderate Trails */}
      <div className="bg-white border-l-4 border-yellow-500 rounded-lg shadow p-6">
        <h3 className="text-xl font-bold text-yellow-600 mb-4">🟡 Moderate Trails</h3>
        <p className="font-semibold">Required:</p>
        <ul className="list-disc list-inside text-gray-600 mb-4">
          <li>Sturdy hiking boots with good grip</li>
          <li>Daypack with water and food</li>
          <li>Layered clothing (including rain jacket)</li>
        </ul>
        <p className="font-semibold">Recommended:</p>
        <ul className="list-disc list-inside text-gray-600">
          <li>Trekking poles</li>
          <li>Map or GPS device</li>
          <li>Emergency whistle and flashlight</li>
          <li>Basic first aid kit</li>
        </ul>
      </div>

      {/* Challenging Trails */}
      <div className="bg-white border-l-4 border-red-500 rounded-lg shadow p-6">
        <h3 className="text-xl font-bold text-red-600 mb-4">🔴 Challenging Trails</h3>
        <p className="font-semibold">Required:</p>
        <ul className="list-disc list-inside text-gray-600 mb-4">
          <li>High-quality hiking boots with ankle support</li>
          <li>Technical backpack with hydration system</li>
          <li>Weatherproof and thermal clothing</li>
        </ul>
        <p className="font-semibold">Recommended:</p>
        <ul className="list-disc list-inside text-gray-600">
          <li>Climbing gear (if applicable)</li>
          <li>Headlamp, compass, and detailed trail map</li>
          <li>Advanced first aid kit and survival blanket</li>
        </ul>
      </div>
    </div>
  </div>
</section>

       
      </main>
  );
}
