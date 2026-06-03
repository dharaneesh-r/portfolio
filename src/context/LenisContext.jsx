/**
 * context/LenisContext.jsx
 * ─────────────────────────────────────────────────────────────────
 * Single Lenis instance for the entire app.
 *
 * Responsibilities:
 *  1. Init Lenis once, using gsap.ticker as the RAF driver so both
 *     systems share the same animation frame (no double-rAF jank).
 *  2. Sync Lenis ↔ GSAP ScrollTrigger via scrollerProxy + scroll event.
 *  3. Respect prefers-reduced-motion (from ReducedMotionContext) —
 *     skip Lenis entirely if set, fall back to native scroll.
 *  4. Expose `lenis` instance via context so any child can subscribe to
 *     scroll events (e.g. ThreeBackground for scroll-driven 3D).
 *  5. Clean up completely on unmount (no leaks across HMR cycles).
 *
 * gsap.registerPlugin is called ONCE in main.jsx — not here.
 */

import { createContext, useContext, useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "./ReducedMotionContext";

const LenisCtx = createContext(null);

/** Returns the live Lenis instance (null when reduced-motion is active). */
export const useLenis = () => useContext(LenisCtx);

export const LenisProvider = ({ children }) => {
  const lenisRef       = useRef(null);
  const prefersReduced = useReducedMotion();   // single listener, no duplication
  const [lenis, setLenis] = useState(null);

  useEffect(() => {
    // Honour the user's OS preference — native scroll only
    if (prefersReduced) {
      setLenis(null);
      return;
    }

    // ── Init Lenis ───────────────────────────────────────────────────
    const l = new Lenis({
      lerp:            0.1,   // smoothing (0 = instant, 1 = never arrives)
      smoothWheel:     true,
      touchMultiplier: 1.5,   // natural feel on touch screens
      infinite:        false,
    });

    lenisRef.current = l;
    setLenis(l);

    // ── Drive Lenis via gsap.ticker (shared RAF) ─────────────────────
    const tick = (time) => l.raf(time * 1000); // gsap time is in seconds
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0); // prevent GSAP from skipping frames

    // ── Sync Lenis → ScrollTrigger ───────────────────────────────────
    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value) {
        if (arguments.length) {
          l.scrollTo(value, { immediate: true });
        }
        return l.scroll;
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
      },
    });

    l.on("scroll", ScrollTrigger.update);

    // ── Cleanup ──────────────────────────────────────────────────────
    return () => {
      gsap.ticker.remove(tick);
      l.destroy();
      lenisRef.current = null;
      setLenis(null);
      ScrollTrigger.scrollerProxy(document.documentElement, null);
    };
  }, [prefersReduced]); // re-init if user toggles the OS setting at runtime

  return <LenisCtx.Provider value={lenis}>{children}</LenisCtx.Provider>;
};
