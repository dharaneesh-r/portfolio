/**
 * Components/layout/Cursor.jsx
 * ─────────────────────────────────────────────────────────────────
 * Custom cursor — extracted from App.jsx.
 * Library ownership: GSAP owns ALL cursor motion (position, scale,
 * color transitions). Framer Motion does NOT touch this component.
 *
 * Behaviours:
 *  - Outer ring: follows with lag (duration 0.55, power2.out)
 *  - Inner dot:  snaps tightly (duration 0.10)
 *  - On hover over a, button, [data-cursor]: ring expands + dims,
 *    dot disappears → gives a "selection" feel
 *  - Hides on pointer:coarse (touch) via CSS
 *  - Hides when the pointer leaves the document
 *  - Re-binds interactive targets on every route change (location dep)
 */

import { useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { gsap } from "gsap";
import { useReducedMotion } from "../../context/ReducedMotionContext";

const Cursor = () => {
  const ringRef = useRef(null);
  const dotRef  = useRef(null);
  const location = useLocation();
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    // Hide entirely when OS prefers reduced motion
    if (prefersReduced) return;

    const ring = ringRef.current;
    const dot  = dotRef.current;
    if (!ring || !dot) return;

    // ── Position tracking ──────────────────────────────────────────
    const onMove = (e) => {
      gsap.to(ring, { x: e.clientX, y: e.clientY, duration: 0.55, ease: "power2.out", overwrite: true });
      gsap.to(dot,  { x: e.clientX, y: e.clientY, duration: 0.10, ease: "power2.out", overwrite: true });
    };

    // ── Hover states ───────────────────────────────────────────────
    const onEnter = () => {
      gsap.to(ring, {
        scale: 2.8,
        opacity: 0.45,
        borderColor: "rgba(249,115,22,0.8)",
        backgroundColor: "rgba(249,115,22,0.07)",
        duration: 0.3,
        ease: "power2.out",
      });
      gsap.to(dot, { scale: 0, duration: 0.2 });
    };

    const onLeave = () => {
      gsap.to(ring, {
        scale: 1,
        opacity: 1,
        borderColor: "rgba(249,115,22,1)",
        backgroundColor: "transparent",
        duration: 0.4,
        ease: "power2.out",
      });
      gsap.to(dot, { scale: 1, duration: 0.25 });
    };

    // ── Visibility ─────────────────────────────────────────────────
    const onHide = () => gsap.to([ring, dot], { opacity: 0, duration: 0.2 });
    const onShow = () => gsap.to([ring, dot], { opacity: 1, duration: 0.2 });

    // ── Bind interactive targets ───────────────────────────────────
    const targets = document.querySelectorAll("a, button, [data-cursor]");
    targets.forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    window.addEventListener("mousemove",   onMove);
    document.addEventListener("mouseleave", onHide);
    document.addEventListener("mouseenter", onShow);

    return () => {
      window.removeEventListener("mousemove",   onMove);
      document.removeEventListener("mouseleave", onHide);
      document.removeEventListener("mouseenter", onShow);
      targets.forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
    };
  }, [location.pathname, prefersReduced]);

  if (prefersReduced) return null;

  return (
    <>
      {/* Outer ring — lags behind pointer */}
      <div
        ref={ringRef}
        className="cursor-ring fixed pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2"
        aria-hidden="true"
        style={{
          left: 0, top: 0,
          width: 36, height: 36,
          border: "2px solid rgba(249,115,22,1)",
          borderRadius: "50%",
          mixBlendMode: "difference",
        }}
      />
      {/* Inner dot — snaps to pointer */}
      <div
        ref={dotRef}
        className="cursor-dot fixed pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 bg-primary-500 rounded-full"
        aria-hidden="true"
        style={{ left: 0, top: 0, width: 8, height: 8 }}
      />
    </>
  );
};

export default Cursor;
