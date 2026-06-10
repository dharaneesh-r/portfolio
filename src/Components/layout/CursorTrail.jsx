/**
 * CursorTrail.jsx — minimal dot cursor
 * ─────────────────────────────────────────────────────────────────
 * Library owner: GSAP (dot position + hover scale).
 *
 * The previous tech-badge gravity-fall effect was removed in favour of
 * the interactive WaveField on the hero — the page's cursor reaction is
 * now the ripple wave, not falling icons. This component keeps only the
 * small custom dot that snaps to the pointer and grows over interactive
 * elements (a, button, [data-cursor]).
 *
 * Hidden on touch / coarse pointers via CSS (.cursor-dot) and disabled
 * entirely under prefers-reduced-motion.
 */

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useReducedMotion } from "../../context/ReducedMotionContext";

const CursorTrail = () => {
  const dotRef = useRef(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const dot = dotRef.current;
    if (!dot) return;

    // Snap dot to the pointer — GSAP owns x/y
    const onMove = (e) => {
      gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0.12, ease: "power2.out", overwrite: true });
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    if (prefersReduced) {
      return () => window.removeEventListener("mousemove", onMove);
    }

    // Grow + dim over interactive targets
    const onEnter = () =>
      gsap.to(dot, { scale: 4, opacity: 0.45, duration: 0.25, ease: "power2.out" });
    const onLeave = () =>
      gsap.to(dot, { scale: 1, opacity: 1, duration: 0.3, ease: "power2.out" });

    const targets = document.querySelectorAll("a,button,[data-cursor]");
    targets.forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    return () => {
      window.removeEventListener("mousemove", onMove);
      targets.forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
    };
  }, [prefersReduced]);

  if (prefersReduced) return null;

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      className="cursor-dot fixed pointer-events-none z-[9999] rounded-full bg-primary-500"
      style={{ left: 0, top: 0, width: 7, height: 7, transform: "translate(-50%,-50%)" }}
    />
  );
};

export default CursorTrail;
