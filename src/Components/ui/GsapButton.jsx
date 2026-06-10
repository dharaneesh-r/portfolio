/**
 * Components/ui/GsapButton.jsx — premium hover button
 * ─────────────────────────────────────────────────────────────────
 * The awwwards "ink fill from cursor" interaction.
 * Library ownership: GSAP owns the fill expand, label/icon colour, and
 * icon nudge. Framer Motion's MagneticWrapper (composed around this)
 * owns the magnetic x/y pull — no two libs touch the same property.
 *
 * On hover-in : a circular fill grows from the exact point the cursor
 *               entered until it covers the button; the label + icon
 *               colour invert and the icon slides forward.
 * On hover-out: the fill collapses back toward the cursor's exit point
 *               and the label returns to its base colour.
 *
 * Polymorphic: render as a <button>, <a>, or React-Router <Link> via
 * the `as` prop. All extra props (to, href, target, type, disabled,
 * onClick…) pass straight through.
 *
 * Reduced-motion: no JS animation; a CSS colour transition fallback is
 * applied via the variant's base classes.
 */

import { useRef } from "react";
import { gsap } from "gsap";
import { useReducedMotion } from "../../context/ReducedMotionContext";

// ── Variant palette ───────────────────────────────────────────────────
// base       → static element classes (colour/border only; the consumer
//              supplies padding / radius / font via `className`)
// fill       → colour of the expanding ink
// labelBase  → resting text+icon colour
// labelHover → text+icon colour once the fill covers the button
const VARIANTS = {
  solid: {
    base:       "bg-primary-500 text-white",
    fill:       "#ffffff",
    labelBase:  "#ffffff",
    labelHover: "#0a0a0a",
  },
  outline: {
    base:       "border border-white/15 bg-white/[0.02] text-white/80",
    fill:       "#f97316",
    labelBase:  "rgba(255,255,255,0.80)",
    labelHover: "#ffffff",
  },
  ghost: {
    base:       "border border-white/10 bg-white/[0.03] text-white/85",
    fill:       "#f97316",
    labelBase:  "rgba(255,255,255,0.85)",
    labelHover: "#ffffff",
  },
};

const GsapButton = ({
  as: Comp = "button",
  variant = "solid",
  icon = null,
  iconOnly = false,
  children,
  className = "",
  disabled = false,
  ...rest
}) => {
  const rootRef  = useRef(null);
  const fillRef  = useRef(null);
  const labelRef = useRef(null);
  const iconRef  = useRef(null);
  const prefersReduced = useReducedMotion();
  const cfg = VARIANTS[variant] ?? VARIANTS.solid;

  // Diameter needed to cover the button from point (x, y)
  const coverDiameter = (rect, x, y) => {
    const dx = Math.max(x, rect.width - x);
    const dy = Math.max(y, rect.height - y);
    return 2 * Math.hypot(dx, dy) + 4;
  };

  const onEnter = (e) => {
    if (prefersReduced || disabled) return;
    const rect = rootRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const d = coverDiameter(rect, x, y);

    gsap.set(fillRef.current, { left: x, top: y, xPercent: -50, yPercent: -50, opacity: 1 });
    gsap.to(fillRef.current, { width: d, height: d, duration: 0.55, ease: "power3.out", overwrite: true });
    gsap.to(labelRef.current, { color: cfg.labelHover, duration: 0.25, ease: "power2.out" });
    if (iconRef.current) gsap.to(iconRef.current, { x: 5, duration: 0.4, ease: "power2.out" });
  };

  const onLeave = (e) => {
    if (prefersReduced || disabled) return;
    const rect = rootRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    gsap.to(fillRef.current, {
      left: x, top: y, width: 0, height: 0,
      duration: 0.45, ease: "power3.in", overwrite: true,
    });
    gsap.to(labelRef.current, { color: cfg.labelBase, duration: 0.35, ease: "power2.out" });
    if (iconRef.current) gsap.to(iconRef.current, { x: 0, duration: 0.5, ease: "elastic.out(1, 0.5)" });
  };

  return (
    <Comp
      ref={rootRef}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      disabled={Comp === "button" ? disabled : undefined}
      className={`gsap-btn relative inline-flex items-center justify-center overflow-hidden isolate transition-colors duration-300 ${cfg.base} ${className}`}
      {...rest}
    >
      {/* Expanding ink — GSAP owned */}
      <span
        ref={fillRef}
        aria-hidden="true"
        className="absolute rounded-full pointer-events-none -z-0"
        style={{ background: cfg.fill, width: 0, height: 0, top: 0, left: 0, willChange: "width,height" }}
      />
      {/* Label + icon — sits above the ink */}
      <span
        ref={labelRef}
        className={`relative z-10 inline-flex items-center ${iconOnly ? "" : "gap-2.5"}`}
        style={{ color: cfg.labelBase }}
      >
        {children}
        {icon && (
          <span ref={iconRef} className="inline-flex shrink-0">
            {icon}
          </span>
        )}
      </span>
    </Comp>
  );
};

export default GsapButton;
