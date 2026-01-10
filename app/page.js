"use client";
import DestinationCard from "@/components/DestinationCards";
import HeroSection from "@/components/HeroSection";
import Image from "next/image";
import destinations from "@/data/destinations";
import UpcomingTrips from "@/components/UpcomingTrips";
import { PageTransition, FadeInUp, StaggerContainer, StaggerItem, ScaleIn } from "@/components/animations";
import { motion } from "framer-motion";
import { Playfair_Display } from "next/font/google";
import { FaCompass, FaHiking, FaCampground, FaMountain, FaRoute } from "react-icons/fa";

const displaySerif = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
});

export default function Home() {
  return (
    <PageTransition>
      <main className="flex min-h-screen flex-col items-stretch justify-between w-full">
        <HeroSection />

        <section
          id="destinations"
          className="relative w-full overflow-hidden py-16"
          style={{
            backgroundColor: "#f3f4f6",
            backgroundImage: `
              linear-gradient( to bottom, rgba(0,0,0,0.08), rgba(0,0,0,0.02) 35%, rgba(0,0,0,0) 100%),
              linear-gradient(
                120deg,
                transparent 0%,
                transparent 10%,
                #d7d9dc 10%,
                #d7d9dc 28%,
                transparent 28%,
                transparent 36%,
                #d0d3d6 36%,
                #d0d3d6 60%,
                transparent 60%,
                transparent 100%
              ),
              linear-gradient(
                -110deg,
                transparent 0%,
                transparent 14%,
                #c8cbcf 14%,
                #c8cbcf 38%,
                transparent 38%,
                transparent 50%,
                #dfe2e5 50%,
                #dfe2e5 78%,
                transparent 78%,
                transparent 100%
              )
            `,
            backgroundSize: "100% 100%, 180% 60%, 180% 70%",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center bottom, center bottom, center bottom",
          }}
        >

          {/* Heading container (centered & padded) */}
          <div className="relative px-6 w-full z-10">
            <FadeInUp>
              <h2 className="text-3xl mt-[40px] font-bold text-center mb-12 text-gray-900">
                Explore Destinations
              </h2>
            </FadeInUp>
          </div>

          {/* Full-width grid */}
          <StaggerContainer
            className="
              relative
              z-10
              w-full
              max-w-full
              grid
              grid-cols-1
              sm:grid-cols-2
              md:grid-cols-3
              lg:grid-cols-5
              gap-10
              px-4
              sm:px-8
              lg:px-16
            "
          >
            {destinations.map((dest, index) => (
              <motion.div
                key={dest.id}
                className="w-full"
                initial={{ opacity: 0, x: -80 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.08 }}
              >
                <ScaleIn delay={0} whileHover={false}>
                  <div className="group [perspective:1400px] h-[420px] w-full">
                    <div className="relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">

                      {/* Front */}
                      <div className="absolute inset-0 rounded-xl overflow-hidden bg-gray-200 [backface-visibility:hidden] shadow-2xl shadow-emerald-500/15">
                        <div className="relative h-full w-full">
                          <Image
                            src={dest.image}
                            alt={dest.name}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
                            <h3 className={`${displaySerif.className} text-lg font-bold text-white drop-shadow`}>
                              {dest.name}
                            </h3>
                            <p className={`${displaySerif.className} text-sm text-gray-100 drop-shadow`}>
                              {dest.location}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Back */}
                      <div className="absolute inset-0 rounded-xl bg-white/75 backdrop-blur-lg border border-white/50 p-5 flex flex-col justify-center gap-3 text-center shadow-2xl shadow-emerald-500/15 [backface-visibility:hidden] [transform:rotateY(180deg)] overflow-hidden">
                        <div className="absolute inset-0 opacity-10 pointer-events-none">
                          <FaHiking className="absolute -10 left-4 text-6xl" />
                          <FaMountain className="absolute bottom-6 right-6 text-5xl" />
                          <FaCompass className="absolute top-8 right-16 text-5xl" />
                        </div>
                        <h3 className={`${displaySerif.className} text-xl font-bold text-gray-900 relative`}>
                          {dest.name}
                        </h3>
                        <p className={`${displaySerif.className} text-sm font-semibold text-gray-600 relative`}>
                          {dest.location}
                        </p>
                        <p className="text-sm text-gray-700 leading-relaxed line-clamp-5 relative">
                          {dest.description}
                        </p>
                      </div>

                    </div>
                  </div>
                </ScaleIn>
              </motion.div>
            ))}
          </StaggerContainer>

        </section>

        <FadeInUp delay={0.2}>
          <div id="trips">
            <UpcomingTrips/>
          </div>
        </FadeInUp>
        
        <section id="difficulty" className="relative py-16 bg-white overflow-hidden">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-10 top-10 h-28 w-28 rounded-full bg-emerald-100/60 blur-3xl" />
            <div className="absolute right-0 top-1/3 h-32 w-32 rounded-full bg-amber-100/60 blur-3xl" />
            <div className="absolute left-1/3 bottom-0 h-28 w-28 rounded-full bg-rose-100/60 blur-3xl" />
            <FaHiking className="absolute left-6 bottom-8 text-5xl opacity-20" />
            <FaCampground className="absolute right-10 top-8 text-5xl opacity-20" />
            <FaCompass className="absolute right-1/3 bottom-12 text-5xl opacity-20" />
          </div>
          <div className="max-w-6xl mx-auto px-6 relative">
            <div className="grid md:grid-cols-[0.8fr_1.2fr] gap-10 items-start">
              <div className="flex flex-col gap-3">
                {[
                  { title: "EASY", color: "bg-green-100", dot: "bg-green-500", text: "Gentle trails with minimal elevation, suitable for beginners and families." },
                  { title: "MODERATE", color: "bg-yellow-100", dot: "bg-yellow-500", text: "Varied terrain with moderate climbs; great for improving fitness." },
                  { title: "CHALLENGING", color: "bg-red-100", dot: "bg-red-500", text: "Steep ascents and technical sections for experienced hikers." },
                ].map((card, idx) => (
                  <motion.div
                    key={card.title}
                    initial={{ opacity: 0, x: -15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.35, delay: idx * 0.08, ease: "easeOut" }}
                    className={`group flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-300 shadow-sm ${card.color} cursor-pointer`}
                  >
                    <span className={`h-3 w-3 rounded-full ${card.dot}`} />
                    <div className="flex flex-col items-start">
                      <span className="font-semibold text-gray-800">{card.title}</span>
                      <span className="text-sm text-gray-700 max-h-0 opacity-0 group-hover:max-h-16 group-hover:opacity-100 transition-all duration-300 ease-out">
                        {card.text}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="space-y-3">
                <h2 className={`${displaySerif.className} text-4xl md:text-5xl font-bold text-gray-900`}>
                  Understanding Hiking Trail Difficulty Levels
                </h2>
              </div>
            </div>
          </div>
        </section>
        
        <section id="insights" className="relative py-16 bg-gray-50 overflow-hidden">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-0 top-12 h-28 w-28 rounded-full bg-sky-200/50 blur-3xl" />
            <div className="absolute right-6 bottom-10 h-32 w-32 rounded-full bg-lime-200/50 blur-3xl" />
            <div className="absolute left-1/2 top-1/2 h-24 w-24 rounded-full bg-orange-200/50 blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <FaCampground className="absolute left-10 top-6 text-5xl opacity-15" />
            <FaRoute className="absolute right-12 top-12 text-5xl opacity-15" />
            <FaMountain className="absolute left-1/3 bottom-8 text-5xl opacity-15" />
          </div>
          <div className="max-w-6xl mx-auto px-6 relative">
            <div className="grid md:grid-cols-[1.2fr_0.8fr] gap-10 items-start">
              <div className="space-y-4">
                <h2 className={`${displaySerif.className} text-4xl md:text-5xl font-bold text-gray-900`}>
                  Understanding Hiking Trail Difficulty Levels
                </h2>
              </div>

              <div className="flex flex-col gap-3">
                {[
                  { title: "EASY", color: "bg-green-100", dot: "bg-green-500", text: "Gentle trails with minimal elevation, suitable for beginners and families. Perfect for a relaxing day outdoors." },
                  { title: "MODERATE", color: "bg-yellow-100", dot: "bg-yellow-500", text: "Varied terrain with moderate climbs; best for hikers with some experience and fitness. Expect mixed surfaces and steady gains." },
                  { title: "CHALLENGING", color: "bg-red-100", dot: "bg-red-500", text: "Steep ascents, rough paths, and technical sections for experienced hikers. Requires strong fitness, gear, and preparation." },
                ].map((card, idx) => (
                  <motion.div
                    key={card.title}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.4, delay: idx * 0.08 }}
                    className={`group flex flex-col gap-1 px-4 py-3 rounded-xl border border-gray-300 shadow-sm ${card.color} cursor-pointer`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`h-3 w-3 rounded-full ${card.dot}`} />
                      <span className="font-semibold text-gray-800">{card.title}</span>
                    </div>
                    <div className="overflow-hidden max-h-0 opacity-0 transition-all duration-300 ease-out group-hover:max-h-16 group-hover:opacity-100">
                      <p className="text-sm text-gray-700 leading-snug">{card.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </PageTransition>
  );
}
