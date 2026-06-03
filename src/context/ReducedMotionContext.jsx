/**
 * context/ReducedMotionContext.jsx
 * ─────────────────────────────────────────────────────────────────
 * Provides a single `prefersReduced` boolean that every component
 * can read without creating its own matchMedia listener.
 *
 * Rules when prefersReduced === true:
 *  - Skip / freeze Three.js RAF loop (already handled in ThreeBackground)
 *  - Pass `duration: 0` to all GSAP tweens
 *  - Disable Framer Motion via the global `MotionConfig reducedMotion="user"`
 *  - Stop text-scramble and marquee animations
 *  - Still render content — never hide or lock it behind motion
 */

import { createContext, useContext, useEffect, useState } from "react";

const ReducedMotionCtx = createContext(false);

export const useReducedMotion = () => useContext(ReducedMotionCtx);

export const ReducedMotionProvider = ({ children }) => {
  const [prefersReduced, setPrefersReduced] = useState(() => {
    // Read on first render so initial state is correct (no flash)
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e) => setPrefersReduced(e.matches);

    // Modern browsers
    if (mq.addEventListener) {
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }
    // Legacy fallback
    mq.addListener(handler);
    return () => mq.removeListener(handler);
  }, []);

  return (
    <ReducedMotionCtx.Provider value={prefersReduced}>
      {children}
    </ReducedMotionCtx.Provider>
  );
};
