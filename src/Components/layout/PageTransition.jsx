/**
 * Components/layout/PageTransition.jsx
 * ─────────────────────────────────────────────────────────────────
 * Route-change housekeeping only. The full-screen orange "wipe" slide
 * that played on every navigation was removed per request — pages now
 * change with no transition overlay.
 *
 * On each route change this still:
 *   • scrolls to top (via Lenis when present, else native), and
 *   • refreshes GSAP ScrollTrigger so scroll animations recalc.
 *
 * Also exports <PageWrapper> — a thin motion.div for a subtle fade-up
 * on mount (kept for any page that opts into it).
 */

import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "../../context/LenisContext";
import { useReducedMotion } from "../../context/ReducedMotionContext";
import { DUR, FM_EASE } from "../../motion/tokens";

const PageTransition = () => {
  const location = useLocation();
  const lenis    = useLenis();
  const isFirst  = useRef(true);

  useEffect(() => {
    // Skip on the very first load — page is already at the top.
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }

    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }

    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(raf);
  }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  // No overlay — the wipe was removed.
  return null;
};

// ── Per-page wrapper ─────────────────────────────────────────────────
// Optional: wrap a page's root for a subtle fade-up on mount.
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
