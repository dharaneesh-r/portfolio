/**
 * Components/layout/PageTransition.jsx
 * ─────────────────────────────────────────────────────────────────
 * Cinematic full-screen orange wipe that fires on every route change.
 * Library ownership: Framer Motion owns this animation entirely.
 * GSAP does NOT touch this component.
 *
 * Technique: a fixed <motion.div> that sweeps left→right across the
 * viewport on each navigation. The keyframe sequence is:
 *   [off-left] → [full cover] → [hold] → [off-right]
 *
 * The wipe sits at z-[200] — above page content, below the cursor.
 * It is pointer-events:none so it can never block clicks.
 *
 * Reduced-motion: wipe is skipped; a simple opacity cross-dissolve
 * plays instead (much shorter duration).
 *
 * Also exports <PageWrapper> — a thin motion.div each page wraps
 * itself in, providing a subtle fade-up on mount + ScrollTrigger
 * refresh coordination.
 */

import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "../../context/LenisContext";
import { useReducedMotion } from "../../context/ReducedMotionContext";
import { DUR, FM_EASE } from "../../motion/tokens";

// ── Wipe overlay ─────────────────────────────────────────────────────
const PageTransition = () => {
  const location       = useLocation();
  const lenis          = useLenis();
  const prefersReduced = useReducedMotion();
  const controls       = useAnimation();
  const isFirst        = useRef(true);

  useEffect(() => {
    // Skip on the very first load — page is already visible
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }

    const runTransition = async () => {
      if (prefersReduced) {
        // Soft opacity flash only
        await controls.start({
          opacity: [0.6, 0],
          transition: { duration: DUR.xs, ease: "easeOut" },
        });
        return;
      }

      // Full orange wipe: slide in → hold → slide out
      await controls.start({
        x: ["-101%", "0%", "0%", "101%"],
        transition: {
          duration: DUR.lg,
          times:    [0, 0.38, 0.62, 1],
          ease:     "easeInOut",
        },
      });
    };

    runTransition();

    // Scroll-to-top + ScrollTrigger.refresh run in parallel with the wipe
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }

    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(raf);
  }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <motion.div
      initial={{ x: "101%" }}   // starts off-screen right (invisible)
      animate={controls}
      className="fixed inset-0 z-[200] pointer-events-none bg-primary-500"
      aria-hidden="true"
    />
  );
};

// ── Per-page wrapper ─────────────────────────────────────────────────
// Each page component wraps its root element with this for a subtle
// fade-up on mount. FM owns opacity + y here.
// GSAP scroll animations run on child elements — no property conflict.
export const PageWrapper = ({ children, className = "" }) => {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: prefersReduced ? 0 : 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: prefersReduced ? 0 : DUR.sm,
        ease: FM_EASE.out,
        delay: prefersReduced ? 0 : 0.05,
      }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
