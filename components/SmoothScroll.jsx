"use client";
import { useEffect } from "react";

export default function SmoothScroll({ children }) {
    useEffect(() => {
        let scroll;
        import("locomotive-scroll").then((locomotiveModule) => {
            scroll = new locomotiveModule.default({
                el: document.querySelector("[data-scroll-container]"),
                smooth: true,
                smoothMobile: true,
                resetNativeScroll: true,
                multiplier: 1.2, // Adjust speed
                class: "is-reveal", // Animation class
            });
        });

        return () => {
            if (scroll) scroll.destroy();
        };
    }, []);

    return (
        <div data-scroll-container className="min-h-screen flex flex-col">
            {children}
        </div>
    );
}
