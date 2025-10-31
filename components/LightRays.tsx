// components/LightRays.tsx
"use client";

import React, { useEffect, useRef } from "react";

type Props = {
  raysOrigin?: string;
  raysColor?: string;
  raysSpeed?: number;
  lightSpread?: number;
  rayLength?: number;
  followMouse?: boolean;
};

export default function LightRays({
  raysOrigin = "top-center-offset",
  raysColor = "#5dfeca",
  raysSpeed = 0.5,
  lightSpread = 0.9,
  rayLength = 1.4,
  followMouse = true,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let raf = 0;
    let t = 0;
    function loop() {
      t += raysSpeed * 0.03;
      if (ref.current) ref.current.style.transform = `translateY(${Math.sin(t) * 6}px)`;
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [raysSpeed]);

  return (
    <div ref={ref} aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: raysOrigin === "top-center-offset" ? "-20%" : "50%",
          width: "100vw", // Adjusted to viewport width to prevent horizontal overflow
          height: "150%",
          transform: "translateX(-50%)",
          background: `radial-gradient(ellipse at center, ${raysColor} 0%, rgba(0,0,0,0) 55%)`,
          opacity: 0.35,
          filter: "blur(30px)",
          mixBlendMode: "screen",
        }}
      />
    </div>
  );
}