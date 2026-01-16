"use client";
import { useEffect, useRef, useState } from "react";
import DestinationCardFlip from "./DestinationCardFlip";

export default function DestinationsMarquee({ destinations }) {
    const scrollRef = useRef(null);
    const [isPaused, setIsPaused] = useState(false);

    // Only duplicate for marquee effect if we have enough items
    const shouldMarquee = destinations.length > 3;

    const displayDestinations = shouldMarquee
        ? [...destinations, ...destinations, ...destinations, ...destinations]
        : destinations;

    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer || !shouldMarquee) return;

        let animationFrameId;
        let speed = 0.8; // Adjusted speed for better readability

        const animate = () => {
            if (!isPaused) {
                // Increment scroll position
                scrollContainer.scrollLeft += speed;

                // Calculate the width of one full set of items
                // Since we have 4 sets, one set is roughly 1/4 of total scrollWidth
                const totalWidth = scrollContainer.scrollWidth;
                const oneSetWidth = totalWidth / 4;

                // If we have scrolled past the first set, seamlessly jump back
                // This creates the infinite loop illusion
                if (scrollContainer.scrollLeft >= oneSetWidth) {
                    scrollContainer.scrollLeft -= oneSetWidth;
                }
            }
            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrameId);
        return () => cancelAnimationFrame(animationFrameId);
    }, [isPaused, destinations, shouldMarquee]);

    return (
        <div
            className="w-full relative group"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
        >
            {/* 
        Container allowing native scroll. 
        'no-scrollbar' utility handles hiding the bar visually.
      */}
            <div
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto no-scrollbar py-4"
                style={{
                    scrollBehavior: isPaused ? "smooth" : "auto", // Smooth when user scrolls, instant-ish when auto
                    WebkitOverflowScrolling: "touch", // Smooth momentum on iOS
                }}
            >
                {displayDestinations.map((dest, index) => (
                    <div
                        // Use index in key because IDs are duplicated
                        key={`${dest.id}-${index}`}
                        className="relative shrink-0 w-[85vw] sm:w-[300px] h-full"
                    >

                        <div className="w-full">
                            <DestinationCardFlip dest={dest} index={index} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
