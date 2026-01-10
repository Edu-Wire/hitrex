"use client";

import { useEffect, useRef, useState } from "react";

export default function VantaBirds({ children, className = "", options = {} }) {
  const containerRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const [{ default: BIRDS }, THREE] = await Promise.all([
        import("vanta/dist/vanta.birds.min.js"),
        import("three"),
      ]);
      if (!mounted || vantaEffect) return;
      const effect = BIRDS({
        el: containerRef.current,
        THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile: 1.0,
        backgroundColor: 0x0c0c0f,
        color1: 0xffffff,
        color2: 0x55ff99,
        quantity: 3.0,
        ...options,
      });
      setVantaEffect(effect);
    };
    load();
    return () => {
      mounted = false;
      if (vantaEffect && typeof vantaEffect.destroy === "function") {
        vantaEffect.destroy();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

