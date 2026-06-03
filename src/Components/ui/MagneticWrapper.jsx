/**
 * Components/ui/MagneticWrapper.jsx
 * ─────────────────────────────────────────────────────────────────
 * Magnetic hover effect using Framer Motion springs.
 * Library ownership: Framer Motion owns x/y transform on the wrapper.
 * GSAP does NOT animate x/y on this element.
 *
 * Usage:
 *   <MagneticWrapper>
 *     <button>Click me</button>
 *   </MagneticWrapper>
 *
 * Props:
 *   strength  (0–1)   — how far the element moves toward the cursor.
 *                        Default 0.35. Use 0.2 for subtle, 0.5 for strong.
 *   springConfig      — override Framer Motion spring params.
 *   className         — applied to the wrapper div.
 *   disabled          — bypass magnetic effect (e.g. on mobile).
 *
 * How it works:
 *   useMotionValue tracks raw offset from element centre.
 *   useSpring smooths it with configurable stiffness/damping.
 *   On mouseleave, both values snap back to 0 via the spring.
 */

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useReducedMotion } from "../../context/ReducedMotionContext";

const DEFAULT_SPRING = {
  stiffness: 220,
  damping:   22,
  mass:      0.6,
};

const MagneticWrapper = ({
  children,
  strength    = 0.35,
  springConfig = DEFAULT_SPRING,
  className   = "",
  disabled    = false,
}) => {
  const ref = useRef(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, springConfig);
  const y = useSpring(rawY, springConfig);

  const prefersReduced = useReducedMotion();

  // Bypass on touch devices or reduced-motion
  if (disabled || prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  const handleMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    rawX.set((e.clientX - cx) * strength);
    rawY.set((e.clientY - cy) * strength);
  };

  const handleLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default MagneticWrapper;
