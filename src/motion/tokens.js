/**
 * motion/tokens.js
 * ─────────────────────────────────────────────────────────────────
 * Single source of truth for animation constants.
 * Every GSAP ease string, Framer Motion easing array, and duration
 * value across the app must reference this file — never magic numbers.
 *
 * Library ownership reminder (see Phase 0 plan):
 *  GSAP          → scroll-linked timelines, parallax, Three.js uniforms
 *  Framer Motion → mount/exit, route transitions, magnetic springs, hover/tap
 */

// ── Durations (seconds) ──────────────────────────────────────────────
export const DUR = {
  xs:   0.20,
  sm:   0.35,
  md:   0.55,
  lg:   0.80,
  xl:   1.10,
  xxl:  1.50,
};

// ── GSAP ease strings ────────────────────────────────────────────────
export const EASE = {
  // General purpose
  out:       "power3.out",
  inOut:     "power3.inOut",
  in:        "power3.in",

  // Entrances
  snap:      "back.out(1.7)",
  snapSoft:  "back.out(1.2)",

  // Exits
  snapIn:    "back.in(1.4)",

  // Organic / elastic
  elastic:   "elastic.out(1, 0.4)",

  // Infinite / ambient
  sine:      "sine.inOut",
  linear:    "linear",

  // Cinematic — custom cubic bezier as GSAP CustomEase string
  // Equivalent to CSS cubic-bezier(0.76, 0, 0.24, 1) — sharp in, sharp out
  cinematic: "power4.inOut",
};

// ── Framer Motion easing arrays (cubic-bezier) ───────────────────────
export const FM_EASE = {
  out:       [0.25, 0.46, 0.45, 0.94],
  inOut:     [0.76,  0.00, 0.24, 1.00],
  spring:    { type: "spring", stiffness: 260, damping: 22, mass: 0.6 },
  springFast:{ type: "spring", stiffness: 400, damping: 28, mass: 0.5 },
  springSlug:{ type: "spring", stiffness: 120, damping: 18, mass: 0.8 },
};

// ── Framer Motion transition presets ────────────────────────────────
export const FM_TRANSITION = {
  page: {
    duration: DUR.md,
    ease: FM_EASE.out,
  },
  wipe: {
    duration: DUR.lg,
    times:    [0, 0.38, 0.62, 1],
    ease:     ["easeInOut", "linear", "easeInOut"],
  },
  mount: {
    duration: DUR.sm,
    ease: FM_EASE.out,
  },
  exit: {
    duration: DUR.xs,
    ease: "easeIn",
  },
};

// ── Stagger helpers (GSAP) ───────────────────────────────────────────
export const STAGGER = {
  xs:   { each: 0.04, from: "start" },
  sm:   { each: 0.07, from: "start" },
  md:   { each: 0.10, from: "start" },
  lg:   { each: 0.15, from: "start" },
  // For grids — stagger from center outward
  center: { each: 0.08, from: "center" },
};

// ── ScrollTrigger shared defaults ───────────────────────────────────
export const ST_DEFAULTS = {
  start:         "top 88%",
  toggleActions: "play none none none",
  once:          true,
};
