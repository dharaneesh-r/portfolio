/**
 * Components/ui/SocialIcon.jsx — premium social icon button
 * ─────────────────────────────────────────────────────────────────
 * Library ownership: GSAP owns the hover (fill, icon roll, lift, glow).
 *
 * On hover:
 *   • a brand-orange disc expands from the centre to fill the tile,
 *   • the icon does a vertical "roll" — it rises out the top while an
 *     identical copy rolls up from below into its place,
 *   • the whole tile lifts and gains an orange glow,
 *   • the icon colour inverts to white over the fill.
 *
 * Renders an <a>. Pass `external={false}` for mailto/tel links.
 * Reduced-motion: JS animation is skipped; a CSS hover fallback applies.
 */

import { useRef } from "react";
import { gsap } from "gsap";
import { useReducedMotion } from "../../context/ReducedMotionContext";

// `icon` is the icon box size in px — the roll shifts by exactly this
// many px so the two stacked copies always land dead-centre (no clip).
const SIZES = {
  md: { box: "w-11 h-11", icon: 18 },
  lg: { box: "w-12 h-12", icon: 20 },
};

const SocialIcon = ({
  href,
  icon: Icon,
  label,
  external = true,
  size = "md",
  className = "",
}) => {
  const rootRef = useRef(null);
  const fillRef = useRef(null);
  const colRef  = useRef(null);
  const prefersReduced = useReducedMotion();
  const dim = SIZES[size] ?? SIZES.md;

  const onEnter = () => {
    if (prefersReduced) return;
    gsap.to(rootRef.current, {
      y: -5, color: "#ffffff",
      borderColor: "rgba(249,115,22,0.55)",
      boxShadow: "0 12px 30px rgba(249,115,22,0.35)",
      duration: 0.4, ease: "power3.out", overwrite: true,
    });
    gsap.to(fillRef.current, { scale: 1, duration: 0.45, ease: "power3.out", overwrite: true });
    gsap.to(colRef.current, { yPercent: -50, duration: 0.5, ease: "power3.inOut", overwrite: true });
  };

  const onLeave = () => {
    if (prefersReduced) return;
    gsap.to(rootRef.current, {
      y: 0, color: "rgba(255,255,255,0.5)",
      borderColor: "rgba(255,255,255,0.10)",
      boxShadow: "0 0px 0px rgba(249,115,22,0)",
      duration: 0.45, ease: "power3.out", overwrite: true,
    });
    gsap.to(fillRef.current, { scale: 0, duration: 0.4, ease: "power3.in", overwrite: true });
    gsap.to(colRef.current, { yPercent: 0, duration: 0.5, ease: "power3.inOut", overwrite: true });
  };

  return (
    <a
      ref={rootRef}
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      aria-label={label}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={`social-icon relative inline-flex items-center justify-center rounded-xl overflow-hidden border border-white/10 bg-white/[0.04] backdrop-blur-sm transition-colors ${dim.box} ${className}`}
      style={{ color: "rgba(255,255,255,0.5)", willChange: "transform" }}
    >
      {/* Expanding brand disc — GSAP owned */}
      <span
        ref={fillRef}
        aria-hidden="true"
        className="absolute rounded-full bg-primary-500 pointer-events-none"
        style={{ width: "150%", height: "150%", left: "-25%", top: "-25%", transform: "scale(0)", transformOrigin: "center" }}
      />
      {/* Rolling icon column (two identical copies, pixel-exact clip) */}
      <span
        className="relative z-10 overflow-hidden block"
        style={{ height: dim.icon, width: dim.icon, lineHeight: 0 }}
      >
        <span ref={colRef} className="flex flex-col" style={{ willChange: "transform" }}>
          <span className="flex items-center justify-center shrink-0" style={{ height: dim.icon, width: dim.icon, fontSize: dim.icon }}><Icon /></span>
          <span className="flex items-center justify-center shrink-0" style={{ height: dim.icon, width: dim.icon, fontSize: dim.icon }}><Icon /></span>
        </span>
      </span>
    </a>
  );
};

export default SocialIcon;
