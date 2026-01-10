"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { PageTransition } from "@/components/animations";
import { gsap } from "gsap";

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
  const titleRef = useRef(null);
  const sectionRefs = useRef([]);

  useEffect(() => {
    if (!titleRef.current) return;

    const letters = titleRef.current.querySelectorAll('.letter');
    
    // Set initial state - letters start from bottom with clip-path
    gsap.set(letters, {
      opacity: 0,
      y: 30,
      clipPath: "inset(100% 0 0 0)"
    });

    // Animate each letter emerging from bottom
    letters.forEach((letter, index) => {
      gsap.to(letter, {
        opacity: 1,
        y: 0,
        clipPath: "inset(0% 0 0 0)",
        duration: 0.8,
        ease: "power2.out",
        delay: index * 0.08
      });
    });
  }, []);

  // GSAP ScrollTrigger animations for sections
  useEffect(() => {
    let ScrollTriggerInstance;
    
    const initAnimations = async () => {
      try {
        const module = await import("gsap/ScrollTrigger");
        ScrollTriggerInstance = module.ScrollTrigger;
        gsap.registerPlugin(ScrollTriggerInstance);

        const sections = sectionRefs.current.filter(Boolean);
        
        sections.forEach((section, index) => {
          const titleElement = section.querySelector('.section-title');
          const contentElement = section.querySelector('.section-content');
          const barElement = section.querySelector('.section-bar');
          if (!titleElement || !contentElement || !barElement) return;

          const isEven = index % 2 === 0;
          const titleFromX = isEven ? -100 : 100;
          const contentFromX = isEven ? 100 : -100;
          const barOrigin = isEven ? "left center" : "right center";

          // Set initial states
          gsap.set(titleElement, {
            opacity: 0,
            x: titleFromX
          });
          gsap.set(contentElement, {
            opacity: 0,
            x: contentFromX
          });
          gsap.set(barElement, {
            scaleX: 0,
            transformOrigin: barOrigin
          });

          // Create timeline for simultaneous animation
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top 75%",
              toggleActions: "play none none reverse"
            }
          });

          tl.to(barElement, {
            scaleX: 1,
            duration: 0.7,
            ease: "power2.out"
          })
          .to([titleElement, contentElement], {
            opacity: 1,
            x: 0,
            duration: 0.9,
            ease: "power3.out"
          }, "-=0.4"); // overlap with bar animation for smoothness
        });
      } catch (error) {
        console.error("Error loading ScrollTrigger:", error);
      }
    };

    initAnimations();

    return () => {
      // Cleanup ScrollTriggers
      if (ScrollTriggerInstance) {
        ScrollTriggerInstance.getAll().forEach(trigger => trigger.kill());
      }
    };
  }, []);

  return (
    <PageTransition>
      <div>
        {/* Hero */}
        <div className="relative h-[80vh] w-full p-10">
          <Image
            src="/images/trip-hero.avif"
            alt="Trips banner"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <h1 
              ref={titleRef}
              className="text-5xl md:text-7xl font-bold text-white flex items-center justify-center"
            >
              {"OUR TRIPS".split("").map((letter, index) => (
                <span
                  key={index}
                  className="letter inline-block"
                  style={{ letterSpacing: "0.1em" }}
                >
                  {letter === " " ? "\u00A0" : letter}
                </span>
              ))}
            </h1>
          </div>
        </div>

        {/* Sections */}
        <div className="w-full py-0 space-y-0">
          {trips.map((trip, index) => {
            const isEven = index % 2 === 0;
            return (
              <div
                key={trip.id}
                ref={(el) => (sectionRefs.current[index] = el)}
                className="relative overflow-hidden w-full"
              >
                <div
                  className={`section-bar absolute -inset-y-32 inset-x-0 -z-10 ${isEven ? "bg-gradient-to-r" : "bg-gradient-to-l"} from-blue-500/30 via-blue-400/15 to-transparent`}
                  style={{
                    transformOrigin: isEven ? "left center" : "right center",
                    transform: "scaleX(0)"
                  }}
                />
                <div className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-10 md:gap-16 items-center max-w-7xl mx-auto px-8 md:px-12 py-6`}>
                {/* Title Section */}
                <div className="section-title flex-1">
                  <h3 className="text-sm font-semibold text-green-700 uppercase tracking-wide mb-4">
                    {trip.subtitle}
                  </h3>
                  <h2 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
                    {trip.title.split(" ").map((word, idx) => (
                      <span key={idx} className="block">
                        {word}
                      </span>
                    ))}
                  </h2>
                </div>

                {/* Content Section */}
                <div className="section-content flex-1 w-full">
                  <p className="text-gray-600 mb-6 text-lg">{trip.description}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {trip.images.map((src, idx) => (
                      <div
                        key={idx}
                        className="relative h-64 w-full rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow group"
                      >
                        <Image
                          src={src}
                          alt={`${trip.title} ${idx + 1}`}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </PageTransition>
  );
}
