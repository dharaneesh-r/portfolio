/**
 * Components/effects/LiquidGlass.jsx — interactive liquid-glass distortion
 * ─────────────────────────────────────────────────────────────────────
 * A self-contained, additive overlay that refracts the LIVE page content
 * underneath the cursor like moving glass / liquid (cf. lusion.co). It
 * touches no existing markup: it's a transparent, click-through layer.
 *
 * HOW IT DISTORTS REAL CONTENT
 *   A fixed, `pointer-events:none` lens element sits above the page and
 *   uses `backdrop-filter: url(#…)` — an SVG `feDisplacementMap` filter.
 *   `backdrop-filter` samples whatever is painted behind the element and
 *   runs the filter on it, so the actual DOM/canvas underneath is warped
 *   in real time (no DOM cloning, no per-frame snapshots).
 *
 * FEATURES
 *   • Follows the cursor with eased inertia (smooth, fluid).
 *   • Distortion strength scales with mouse velocity, then decays so the
 *     wave gradually dissipates when you stop.
 *   • A pool of expanding/fading ripple lenses trails the cursor →
 *     ripple propagation.
 *   • Chromatic aberration: R/G/B are displaced by slightly different
 *     amounts and screen-blended back together (RGB split at the edges).
 *   • Soft radial mask on each lens → no hard circle edge, natural falloff.
 *   • `pointer-events:none` throughout → never blocks clicks / scroll.
 *   • Idle → the filter is detached so there is zero cost at rest.
 *   • Feature-detects `url()` backdrop-filter; falls back to a blur lens
 *     where unsupported (e.g. Safari). Disabled under reduced-motion.
 *   • Mobile-aware (smaller lens, fewer ripples) and resize-safe (fixed +
 *     viewport-relative; SVG region is in %).
 *
 * REMOVAL: delete this file and the single gated mount in App.jsx.
 */

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useReducedMotion } from "../../context/ReducedMotionContext";

// ── Tunables ──────────────────────────────────────────────────────────
const MAX_SCALE      = 44;    // peak displacement in px (readability cap)
const BASE_SCALE     = 14;    // floor while moving → slow moves still warp clearly
const VEL_TO_SCALE   = 1.0;   // mouse speed → distortion strength
const VEL_DECAY      = 0.9;   // per-frame velocity decay (→ waves fade out)
const FOLLOW_EASE     = 0.16; // lens inertia toward the cursor
const SCALE_EASE     = 0.12;  // distortion strength easing
const CA_RATIO       = 0.28;  // chromatic aberration spread (fraction of scale)
const SPAWN_DIST     = 90;    // px travelled before a trailing ripple spawns

let UID = 0;

const LiquidGlass = () => {
  const prefersReduced = useReducedMotion();

  const layerRef  = useRef(null);
  const lensRef   = useRef(null);
  const turbRef   = useRef(null);
  const dispRRef  = useRef(null);
  const dispGRef  = useRef(null);
  const dispBRef  = useRef(null);
  const rippleRefs = useRef([]);          // [{ outer, inner }]
  const idRef = useRef(`lg-${UID++}`);
  const filterId = `${idRef.current}-filter`;

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const RIPPLE_COUNT = isMobile ? 0 : 4;

  useEffect(() => {
    if (prefersReduced) return;

    const layer = layerRef.current;
    const lens  = lensRef.current;
    if (!layer || !lens) return;

    // ── Feature-detect url() backdrop-filter; else blur fallback ──────
    const probe = document.createElement("div");
    probe.style.backdropFilter = "url(#x)";
    const svgOK = probe.style.backdropFilter.includes("url");
    const filterCSS = svgOK ? `url(#${filterId})` : "blur(5px) saturate(1.12)";

    const lenses = [lens, ...rippleRefs.current.map((r) => r.inner)].filter(Boolean);
    lenses.forEach((el) => {
      el.style.backdropFilter = "none";
      el.style.webkitBackdropFilter = "none";
    });

    // ── Pointer state ─────────────────────────────────────────────────
    let tx = window.innerWidth / 2, ty = window.innerHeight / 2; // target
    let cx = tx, cy = ty;                                        // eased
    let lastX = tx, lastY = ty;
    let vel = 0;                                                 // mouse speed
    let scale = 0;                                               // current strength
    let active = false;
    let lastSpawnX = tx, lastSpawnY = ty;
    let rippleIdx = 0;

    const onPointer = (clientX, clientY) => {
      const dx = clientX - lastX, dy = clientY - lastY;
      vel = Math.min(Math.hypot(dx, dy), 120);
      lastX = clientX; lastY = clientY;
      tx = clientX; ty = clientY;
      active = true;

      // Spawn a trailing ripple after enough travel (desktop only)
      if (RIPPLE_COUNT > 0) {
        const md = Math.hypot(clientX - lastSpawnX, clientY - lastSpawnY);
        if (md > SPAWN_DIST && vel > 6) {
          spawnRipple(clientX, clientY);
          lastSpawnX = clientX; lastSpawnY = clientY;
        }
      }
    };

    const onMouse = (e) => onPointer(e.clientX, e.clientY);
    const onTouch = (e) => { if (e.touches[0]) onPointer(e.touches[0].clientX, e.touches[0].clientY); };

    window.addEventListener("mousemove", onMouse, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });

    // ── Trailing ripple lifecycle (GSAP) ──────────────────────────────
    function spawnRipple(x, y) {
      const r = rippleRefs.current[rippleIdx % RIPPLE_COUNT];
      rippleIdx++;
      if (!r) return;
      gsap.killTweensOf(r.inner);
      r.outer.style.transform = `translate(-50%,-50%) translate(${x}px,${y}px)`;
      r.inner.style.backdropFilter = filterCSS;
      r.inner.style.webkitBackdropFilter = filterCSS;
      r.outer.style.display = "block";
      gsap.fromTo(
        r.inner,
        { scale: 0.45, opacity: 0.9 },
        {
          scale: 1.9, opacity: 0, duration: 1.2, ease: "power2.out",
          onComplete: () => {
            r.outer.style.display = "none";
            r.inner.style.backdropFilter = "none";
            r.inner.style.webkitBackdropFilter = "none";
          },
        }
      );
    }

    // ── Main animation loop ────────────────────────────────────────────
    let raf;
    let lensOn = false;
    const tick = () => {
      raf = requestAnimationFrame(tick);

      // inertia follow
      cx += (tx - cx) * FOLLOW_EASE;
      cy += (ty - cy) * FOLLOW_EASE;

      // velocity → target strength (with a floor while moving), then decay
      vel *= VEL_DECAY;
      const target = active
        ? Math.min(BASE_SCALE + vel * VEL_TO_SCALE, MAX_SCALE)
        : 0;
      scale += (target - scale) * SCALE_EASE;
      if (!active && scale < 0.15) scale = 0;
      active = false;

      // Drive the SVG displacement (with chromatic aberration spread)
      if (svgOK && dispGRef.current) {
        const ca = Math.min(scale * CA_RATIO, 6);
        dispRRef.current.setAttribute("scale", (scale + ca).toFixed(2));
        dispGRef.current.setAttribute("scale", scale.toFixed(2));
        dispBRef.current.setAttribute("scale", Math.max(scale - ca, 0).toFixed(2));
        // Animate the noise field so the glass actively FLOWS like a wave
        // (not just a static lens following the cursor).
        if (turbRef.current && scale > 0.3) {
          const time = performance.now() * 0.001;
          const bf = 0.007 + Math.sin(time * 0.9) * 0.003;   // breathing wave scale
          turbRef.current.setAttribute("baseFrequency", `${bf.toFixed(4)} ${(bf * 1.4).toFixed(4)}`);
          turbRef.current.setAttribute("seed", ((time * 1.6) % 100).toFixed(2));
        }
      }

      // Position the main lens + toggle the filter on/off for perf
      lens.style.transform = `translate(-50%,-50%) translate(${cx}px,${cy}px)`;
      const shouldShow = scale > 0.4;
      if (shouldShow && !lensOn) {
        lens.style.backdropFilter = filterCSS;
        lens.style.webkitBackdropFilter = filterCSS;
        lensOn = true;
      } else if (!shouldShow && lensOn) {
        lens.style.backdropFilter = "none";
        lens.style.webkitBackdropFilter = "none";
        lensOn = false;
      }
      lens.style.opacity = shouldShow ? "1" : "0";

      // For the blur fallback, modulate blur amount with strength
      if (!svgOK && shouldShow) {
        const px = (1.5 + (scale / MAX_SCALE) * 5).toFixed(2);
        lens.style.backdropFilter = `blur(${px}px) saturate(1.12)`;
        lens.style.webkitBackdropFilter = `blur(${px}px) saturate(1.12)`;
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("touchmove", onTouch);
      rippleRefs.current.forEach((r) => r && gsap.killTweensOf(r.inner));
    };
  }, [prefersReduced, filterId, RIPPLE_COUNT]);

  if (prefersReduced) return null;

  const lensSize = isMobile ? 220 : 360;
  const rippleSize = isMobile ? 160 : 240;

  return (
    <>
      {/* Scoped styles — kept in-file so the effect is easy to remove */}
      <style>{`
        .lg-layer{position:fixed;inset:0;z-index:120;pointer-events:none;overflow:hidden;contain:strict;}
        .lg-lens{position:absolute;top:0;left:0;border-radius:50%;pointer-events:none;
          -webkit-mask:radial-gradient(circle,#000 0%,#000 28%,rgba(0,0,0,0.35) 50%,transparent 70%);
                  mask:radial-gradient(circle,#000 0%,#000 28%,rgba(0,0,0,0.35) 50%,transparent 70%);
          will-change:transform,opacity,backdrop-filter;}
        .lg-ripple-outer{position:absolute;top:0;left:0;pointer-events:none;display:none;will-change:transform;}
      `}</style>

      {/* SVG displacement filter (displacement + chromatic aberration) */}
      <svg aria-hidden="true" style={{ position: "absolute", width: 0, height: 0 }}>
        <filter
          id={filterId}
          x="-50%" y="-50%" width="200%" height="200%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            ref={turbRef}
            type="fractalNoise"
            baseFrequency="0.007 0.010"
            numOctaves="3"
            seed="3"
            result="noise"
          />
          <feGaussianBlur in="noise" stdDeviation="1.4" result="map" />

          {/* Red channel — displaced most */}
          <feDisplacementMap ref={dispRRef} in="SourceGraphic" in2="map" scale="0" xChannelSelector="R" yChannelSelector="G" result="dR" />
          <feColorMatrix in="dR" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="cR" />
          {/* Green channel — base */}
          <feDisplacementMap ref={dispGRef} in="SourceGraphic" in2="map" scale="0" xChannelSelector="R" yChannelSelector="G" result="dG" />
          <feColorMatrix in="dG" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="cG" />
          {/* Blue channel — displaced least */}
          <feDisplacementMap ref={dispBRef} in="SourceGraphic" in2="map" scale="0" xChannelSelector="R" yChannelSelector="G" result="dB" />
          <feColorMatrix in="dB" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="cB" />

          <feBlend in="cR" in2="cG" mode="screen" result="rg" />
          <feBlend in="rg" in2="cB" mode="screen" />
        </filter>
      </svg>

      {/* The click-through overlay */}
      <div ref={layerRef} className="lg-layer" aria-hidden="true">
        <div
          ref={lensRef}
          className="lg-lens lg-main"
          style={{ width: lensSize, height: lensSize, opacity: 0 }}
        />
        {Array.from({ length: RIPPLE_COUNT }).map((_, i) => (
          <div
            key={i}
            className="lg-ripple-outer"
            ref={(el) => {
              if (!el) return;
              rippleRefs.current[i] = { outer: el, inner: el.firstChild };
            }}
          >
            <div className="lg-lens" style={{ width: rippleSize, height: rippleSize }} />
          </div>
        ))}
      </div>
    </>
  );
};

export default LiquidGlass;
