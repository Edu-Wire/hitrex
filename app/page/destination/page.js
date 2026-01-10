"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";

export default function DestinationsPage() {
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedActivity, setSelectedActivity] = useState("");
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState(["All"]);
  const [activities, setActivities] = useState(["All"]);
  const scrollContainerRef = useRef(null);
  const autoScrollIntervalRef = useRef(null);
  const resumeTimeoutRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const cardsRef = useRef([]);

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const res = await fetch("/api/destinations");
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      
      if (data.error) {
        console.error("API returned error:", data.error);
        setDestinations([]);
        setLoading(false);
        return;
      }
      
      const destinationsList = data.destinations || [];
      setDestinations(destinationsList);
      
      // Extract unique locations and activities
      const uniqueLocations = new Set(["All"]);
      const uniqueActivities = new Set(["All"]);
      
      destinationsList.forEach((dest) => {
        // Extract country names from location
        if (dest.location) {
          const locationParts = dest.location.split("/");
          locationParts.forEach((loc) => {
            const trimmedLoc = loc.trim();
            if (trimmedLoc) uniqueLocations.add(trimmedLoc);
          });
        }
        
        // Add all tags as activities
        if (dest.tags && Array.isArray(dest.tags)) {
          dest.tags.forEach((tag) => {
            if (tag) uniqueActivities.add(tag);
          });
        }
      });
      
      setLocations(Array.from(uniqueLocations));
      setActivities(Array.from(uniqueActivities));
    } catch (error) {
      console.error("Error fetching destinations:", error);
      setDestinations([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = destinations.filter((dest) => {
    return (
      (selectedLocation === "" || selectedLocation === "All" || dest.location.includes(selectedLocation)) &&
      (selectedActivity === "" || selectedActivity === "All" || dest.tags.includes(selectedActivity))
    );
  });

  // GSAP ScrollTrigger animations for cards
  useEffect(() => {
    if (filtered.length === 0 || loading) {
      cardsRef.current = [];
      return;
    }

    let ScrollTriggerInstance;
    let timer;

    const initAnimations = async () => {
      try {
        // Dynamically import ScrollTrigger
        const module = await import("gsap/ScrollTrigger");
        ScrollTriggerInstance = module.ScrollTrigger;
        gsap.registerPlugin(ScrollTriggerInstance);

        // Wait for DOM to update
        timer = setTimeout(() => {
          const cards = cardsRef.current.filter(Boolean);
          
          if (cards.length === 0) return;

          // Find the container (parent of cards)
          const container = cards[0]?.parentElement;
          if (!container) return;

          // Set initial state for all cards
          gsap.set(cards, {
            opacity: 0,
            y: 50
          });

          // Create a timeline that animates cards sequentially
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: container,
              start: "top 80%",
              toggleActions: "play none none reverse",
              once: false
            }
          });

          // Add each card animation to the timeline sequentially
          cards.forEach((card, index) => {
            tl.to(card, {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: "power2.out"
            }, index * 0.1); // Each card starts 0.1s after the previous one
          });
        }, 100);
      } catch (error) {
        console.error("Error loading ScrollTrigger:", error);
      }
    };

    initAnimations();

    return () => {
      if (timer) clearTimeout(timer);
      // Cleanup all ScrollTriggers
      if (ScrollTriggerInstance) {
        ScrollTriggerInstance.getAll().forEach(trigger => trigger.kill());
      }
    };
  }, [filtered.length, loading]);

  // Auto-scroll effect
  useEffect(() => {
    if (filtered.length === 0 || isPaused || loading) return;

    const smoothScrollTo = (element, target, duration = 800) => {
      const start = element.scrollLeft;
      const distance = target - start;
      let startTime = null;

      const easeInOutCubic = (t) => {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      };

      const animation = (currentTime) => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        
        element.scrollLeft = start + distance * easeInOutCubic(progress);
        
        if (progress < 1) {
          requestAnimationFrame(animation);
        }
      };

      requestAnimationFrame(animation);
    };

    const startAutoScroll = () => {
      autoScrollIntervalRef.current = setInterval(() => {
        if (scrollContainerRef.current) {
          const container = scrollContainerRef.current;
          const containerWidth = container.offsetWidth;
          const gap = 24;
          const cardWidth = (containerWidth - 2 * gap) / 3;
          const scrollAmount = cardWidth + gap;
          
          // Check if we've reached the end
          const maxScroll = container.scrollWidth - container.offsetWidth;
          const currentScroll = container.scrollLeft;
          
          if (currentScroll + scrollAmount >= maxScroll - 10) {
            // Loop back to the beginning
            smoothScrollTo(container, 0);
          } else {
            smoothScrollTo(container, currentScroll + scrollAmount);
          }
        }
      }, 3500); // Scroll every 3.5 seconds (allowing time for animation)
    };

    startAutoScroll();

    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
      }
      if (resumeTimeoutRef.current) {
        clearTimeout(resumeTimeoutRef.current);
      }
    };
  }, [filtered.length, isPaused, loading]);

  const smoothScrollTo = (element, target, duration = 800) => {
    const start = element.scrollLeft;
    const distance = target - start;
    let startTime = null;

    const easeInOutCubic = (t) => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    const animation = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      
      element.scrollLeft = start + distance * easeInOutCubic(progress);
      
      if (progress < 1) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      setIsPaused(true);
      if (resumeTimeoutRef.current) {
        clearTimeout(resumeTimeoutRef.current);
      }
      const container = scrollContainerRef.current;
      const containerWidth = container.offsetWidth;
      const gap = 24; // gap-6 = 1.5rem = 24px
      const cardWidth = (containerWidth - 2 * gap) / 3;
      const targetScroll = container.scrollLeft - (cardWidth + gap);
      smoothScrollTo(container, targetScroll);
      // Resume auto-scroll after 5 seconds
      resumeTimeoutRef.current = setTimeout(() => setIsPaused(false), 5000);
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      setIsPaused(true);
      if (resumeTimeoutRef.current) {
        clearTimeout(resumeTimeoutRef.current);
      }
      const container = scrollContainerRef.current;
      const containerWidth = container.offsetWidth;
      const gap = 24; // gap-6 = 1.5rem = 24px
      const cardWidth = (containerWidth - 2 * gap) / 3;
      const targetScroll = container.scrollLeft + (cardWidth + gap);
      smoothScrollTo(container, targetScroll);
      // Resume auto-scroll after 5 seconds
      resumeTimeoutRef.current = setTimeout(() => setIsPaused(false), 5000);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative w-full h-screen -mt-24 md:-mt-28 flex items-center justify-center text-white">
        <Image
          src="/images/samrat-khadka-wrfl3DeoTIw-unsplash.jpg"
          alt="Trekking Hero"
          fill
          priority
          className="absolute object-cover"
        />
        <div className="absolute inset-0 bg-black/30 z-10"></div>
        <div className="relative z-20 px-4 w-full max-w-4xl">
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes slideUpLetter {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}} />
          <h1 className="text-5xl md:text-7xl font-extrabold mb-16 text-center mt-8 flex justify-center items-center flex-wrap">
            {"DESTINATIONS".split("").map((letter, index) => (
              <span
                key={index}
                className="inline-block tracking-wider"
                style={{
                  animation: `slideUpLetter 0.6s ease-out forwards`,
                  animationDelay: `${index * 0.05}s`,
                  opacity: 0,
                  transform: "translateY(20px)",
                  letterSpacing: "0.15em"
                }}
              >
                {letter === " " ? "\u00A0" : letter}
              </span>
            ))}
          </h1>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-4 py-3 rounded-xl bg-white/40 backdrop-blur-md border-2 border-white/80 text-white w-full md:w-auto min-w-[280px] focus:outline-none focus:ring-2 focus:ring-white/90 focus:border-white/90"
            >
              <option value="" disabled className="text-gray-400">
                Location
              </option>
              {locations.map((loc) => (
                <option key={loc} value={loc} className="text-gray-800">
                  {loc}
                </option>
              ))}
            </select>
            <select
              value={selectedActivity}
              onChange={(e) => setSelectedActivity(e.target.value)}
              className="px-4 py-3 rounded-xl bg-white/40 backdrop-blur-md border-2 border-white/80 text-white w-full md:w-auto min-w-[280px] focus:outline-none focus:ring-2 focus:ring-white/90 focus:border-white/90"
            >
              <option value="" disabled className="text-gray-400">
                Activity
              </option>
              {activities.map((act) => (
                <option key={act} value={act} className="text-gray-800">
                  {act}
                </option>
              ))}
            </select>
            <button className="px-8 py-3 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 transition w-full md:w-auto whitespace-nowrap">
              Find
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="mt-8">
        {/* Destinations List */}
        <main className="p-6">
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes slideInFromLeft {
              from {
                opacity: 0;
                transform: translateX(-50px);
              }
              to {
                opacity: 1;
                transform: translateX(0);
              }
            }
            .slide-in-left {
              animation: slideInFromLeft 0.8s ease-out forwards;
              animation-delay: 0.3s;
              opacity: 0;
            }
          `}} />
          <h2 className="text-3xl font-bold mb-6 slide-in-left">Upcoming Trips</h2>
          
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Loading destinations...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No destinations found.</p>
            </div>
          ) : (
            <div className="relative px-16">
              <button
                onClick={scrollLeft}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-blue-500 rounded-full p-3 shadow-lg hover:bg-blue-600 hover:scale-110 hover:shadow-xl transition-all duration-300"
                aria-label="Previous"
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <div
                ref={scrollContainerRef}
                className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
                style={{ 
                  scrollbarWidth: "none", 
                  msOverflowStyle: "none",
                  scrollBehavior: "smooth"
                }}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                {filtered.map((dest, index) => (
                  <div
                    key={dest._id}
                    ref={(el) => (cardsRef.current[index] = el)}
                    className="group flex-shrink-0 snap-center bg-white rounded-lg shadow hover:shadow-lg transition"
                    style={{ 
                      width: "calc((100% - 3rem) / 3)"
                    }}
                  >
                    <div className="overflow-hidden rounded-t-lg">
                      <Image
                        src={dest.image}
                        alt={dest.name}
                        width={600}
                        height={400}
                        className="rounded-t-lg object-cover w-full h-64 transition-transform duration-500 ease-in-out group-hover:scale-110"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-xl font-bold">{dest.name}</h3>
                      <p className="text-gray-600">{dest.location}</p>
                      <p className="text-sm text-gray-500">{dest.date}</p>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {dest.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded"
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
                          className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={scrollRight}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-blue-500 rounded-full p-3 shadow-lg hover:bg-blue-600 hover:scale-110 hover:shadow-xl transition-all duration-300"
                aria-label="Next"
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
