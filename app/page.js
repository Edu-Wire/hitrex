"use client";
import DestinationCard from "@/components/DestinationCards";
import HeroSection from "@/components/HeroSection";
import Image from "next/image";
import destinations from "@/data/destinations";
import UpcomingTrips from "@/components/UpcomingTrips";
import { PageTransition, FadeInUp, StaggerContainer, StaggerItem, ScaleIn } from "@/components/animations";

export default function Home() {
  return (
    <PageTransition>
      <main className="flex min-h-screen flex-col items-center justify-between p-5">
        <HeroSection/>

        <section className="py-12 px-6 bg-gray-50">
          <FadeInUp>
            <h2 className="text-3xl font-bold text-center mb-12">Explore Destinations</h2>
          </FadeInUp>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {destinations.map((dest, index) => (
              <StaggerItem key={dest.id}>
                <ScaleIn delay={index * 0.1} whileHover={true}>
                  <DestinationCard destination={dest} />
                </ScaleIn>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>
        <FadeInUp delay={0.2}>
          <UpcomingTrips/>
        </FadeInUp>
        
        <section className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <FadeInUp>
              <h2 className="text-3xl font-bold mb-4">
                🧭 Understanding Hiking Trail Difficulty Levels
              </h2>
              <p className="text-gray-600 mb-10">
                Choosing the right trail starts with knowing its difficulty level. Our hiking routes are typically classified as <strong>easy</strong>, <strong>moderate</strong>, or <strong>challenging</strong> based on the terrain, elevation gain, distance, and technical challenges. Understanding these categories helps you prepare properly, whether you are planning a relaxed nature walk or a demanding mountain trek. Being informed ensures you pack the right gear, manage your energy, and stay safe throughout your adventure. With the right preparation, every hike becomes a rewarding experience.
              </p>
            </FadeInUp>

            {/* Difficulty Cards */}
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Easy */}
              <StaggerItem>
                <ScaleIn whileHover={true} className="bg-white border-l-4 border-green-500 rounded-lg shadow p-6 h-full flex flex-col">
                  <h3 className="text-xl font-bold text-green-600 mb-4">🟢 EASY</h3>
                  <div className="flex-grow">
                    <p className="text-gray-600">
                      Gentle trails with minimal elevation, suitable for beginners and families. Perfect for a relaxing day outdoors.
                    </p>
                  </div>
                </ScaleIn>
              </StaggerItem>

              {/* Moderate */}
              <StaggerItem>
                <ScaleIn whileHover={true} className="bg-white border-l-4 border-yellow-500 rounded-lg shadow p-6 h-full flex flex-col">
                  <h3 className="text-xl font-bold text-yellow-600 mb-4">🟡 MODERATE</h3>
                  <div className="flex-grow">
                    <p className="text-gray-600">
                      Trails with varied terrain and moderate climbs, ideal for hikers with some experience and fitness level.
                    </p>
                  </div>
                </ScaleIn>
              </StaggerItem>

              {/* Challenging */}
              <StaggerItem>
                <ScaleIn whileHover={true} className="bg-white border-l-4 border-red-500 rounded-lg shadow p-6 h-full flex flex-col">
                  <h3 className="text-xl font-bold text-red-600 mb-4">🔴 CHALLENGING</h3>
                  <div className="flex-grow">
                    <p className="text-gray-600">
                      Challenging routes with steep ascents, rough paths, and technical sections for experienced hikers.
                    </p>
                  </div>
                </ScaleIn>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </section>
        
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <FadeInUp>
              <h2 className="text-3xl font-bold text-center mb-10">
                🎒 Hiking Gear Guide by Difficulty Level
              </h2>
            </FadeInUp>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Easy Trails */}
              <StaggerItem>
                <ScaleIn whileHover={true} className="bg-white border-l-4 border-green-500 rounded-lg shadow p-6 h-full flex flex-col">
                  <h3 className="text-xl font-bold text-green-600 mb-4">🟢 Easy Trails</h3>
                  <div className="flex-grow">
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
                </ScaleIn>
              </StaggerItem>

              {/* Moderate Trails */}
              <StaggerItem>
                <ScaleIn whileHover={true} className="bg-white border-l-4 border-yellow-500 rounded-lg shadow p-6 h-full flex flex-col">
                  <h3 className="text-xl font-bold text-yellow-600 mb-4">🟡 Moderate Trails</h3>
                  <div className="flex-grow">
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
                </ScaleIn>
              </StaggerItem>

              {/* Challenging Trails */}
              <StaggerItem>
                <ScaleIn whileHover={true} className="bg-white border-l-4 border-red-500 rounded-lg shadow p-6 h-full flex flex-col">
                  <h3 className="text-xl font-bold text-red-600 mb-4">🔴 Challenging Trails</h3>
                  <div className="flex-grow">
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
                </ScaleIn>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </section>
      </main>
    </PageTransition>
  );
}
