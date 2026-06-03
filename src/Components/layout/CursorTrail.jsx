/**
 * CursorTrail.jsx — Codrops tech-badge gravity physics cursor
 * ─────────────────────────────────────────────────────────────────
 * Library owner: GSAP ticker (physics loop) + direct style writes
 *
 * Physics model:
 *  1. Cursor moves fast → badge spawns at cursor, tossed slightly upward
 *     with a small horizontal nudge from cursor direction.
 *  2. Each frame: vy += GRAVITY (falls down), vx *= FRICTION (slows).
 *  3. Hits viewport bottom → vy flips × BOUNCE_ENERGY (bounces).
 *  4. After MAX_BOUNCES or vy too small → badge fades out via GSAP.
 *
 * Background fix:
 *  backdrop-filter is unreliable inside GSAP-transformed containers.
 *  We use a solid dark + brand-colour gradient background instead.
 *
 * Performance:
 *  - Single GSAP ticker drives all active physics states.
 *  - Direct element.style.transform writes (no gsap.set overhead).
 *  - Pool of 12 reusable DOM nodes (one per tech brand).
 *  - gsap.killTweensOf only called on fade-out.
 */

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useReducedMotion } from "../../context/ReducedMotionContext";

// ── Physics constants ─────────────────────────────────────────────────
const GRAVITY        = 0.58;   // px / frame²  — pull strength
const BOUNCE_ENERGY  = 0.44;   // 0–1: how much vy survives each bounce
const FRICTION       = 0.976;  // horizontal damping per frame
const ROT_DAMPING    = 0.972;  // rotation speed damping per frame
const MAX_BOUNCES    = 5;      // after this many bounces, settle + fade
const MIN_SETTLE_VY  = 1.8;    // if |vy| < this after bounce, also settle
const BADGE_SIZE     = 88;     // px — fixed pool-element square
const FLOOR_MARGIN   = 14;     // px from viewport bottom where floor sits

// ── Tech badge definitions (brand SVG + colors) ───────────────────────
const BADGES = [
  {
    name: "REACT", color: "#61DAFB", rgb: "97,218,251",
    svg: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="7" fill="#61DAFB"/>
      <ellipse cx="40" cy="40" rx="36" ry="13.5" stroke="#61DAFB" stroke-width="2.8"/>
      <ellipse cx="40" cy="40" rx="36" ry="13.5" stroke="#61DAFB" stroke-width="2.8" transform="rotate(60 40 40)"/>
      <ellipse cx="40" cy="40" rx="36" ry="13.5" stroke="#61DAFB" stroke-width="2.8" transform="rotate(120 40 40)"/>
    </svg>`,
  },
  {
    name: "DOCKER", color: "#2496ED", rgb: "36,150,237",
    svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <rect x="14" y="26" width="11" height="9" rx="2" fill="#2496ED"/>
      <rect x="28" y="26" width="11" height="9" rx="2" fill="#2496ED"/>
      <rect x="42" y="26" width="11" height="9" rx="2" fill="#2496ED"/>
      <rect x="28" y="14" width="11" height="9" rx="2" fill="#2496ED" opacity="0.7"/>
      <rect x="42" y="14" width="11" height="9" rx="2" fill="#2496ED" opacity="0.7"/>
      <path d="M8 40 Q12 54 28 57 L58 57 Q72 57 74 46 Q76 36 64 34 Q62 24 54 25 L54 36 L8 36 Z" fill="#2496ED"/>
      <path d="M64 35 Q72 24 66 16" stroke="#2496ED" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <circle cx="65" cy="15" r="2.5" fill="#2496ED"/>
    </svg>`,
  },
  {
    name: "GITHUB", color: "#e6edf3", rgb: "230,237,243",
    svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" fill="#e6edf3"
        d="M40 6C21.2 6 6 21.2 6 40c0 15 9.7 27.7 23.1 32.2 1.7.3 2.3-.7 2.3-1.6
        0-.8 0-3-.1-5.8C21.6 67 19.3 60 19.3 60c-1.7-4.2-4.1-5.3-4.1-5.3
        -3.3-2.3.2-2.2.2-2.2 3.7.3 5.6 3.8 5.6 3.8 3.3 5.6 8.6 4 10.7 3
        .3-2.3 1.3-4 2.3-4.9-8.1-.9-16.6-4-16.6-18 0-4 1.4-7.3 3.8-9.8
        -.4-.9-1.6-4.6.4-9.6 0 0 3.1-1 10 3.8 2.9-.8 6-1.2 9-1.2
        3.1 0 6.2.4 9 1.2 6.9-4.7 10-3.8 10-3.8 2 5 .8 8.7.4 9.6
        2.4 2.5 3.8 5.8 3.8 9.8 0 14-8.5 17.1-16.6 18 1.3 1.1 2.4 3.3
        2.4 6.7 0 4.9-.1 8.8-.1 10 0 1 .6 2.1 2.4 1.7C64.3 67.7 74 55 74 40
        74 21.2 58.8 6 40 6Z"/>
    </svg>`,
  },
  {
    name: "K8S", color: "#326CE5", rgb: "50,108,229",
    svg: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="34" stroke="#326CE5" stroke-width="3" fill="rgba(50,108,229,0.12)"/>
      <circle cx="40" cy="40" r="8.5" fill="#326CE5"/>
      <g stroke="#326CE5" stroke-width="3.5" stroke-linecap="round">
        <line x1="40" y1="31.5" x2="40" y2="8"/>
        <line x1="40" y1="48.5" x2="40" y2="72"/>
        <line x1="47"  y1="35.5" x2="69" y2="23"/>
        <line x1="33"  y1="44.5" x2="11" y2="57"/>
        <line x1="47"  y1="44.5" x2="69" y2="57"/>
        <line x1="33"  y1="35.5" x2="11" y2="23"/>
      </g>
      <circle cx="40" cy="7"  r="4.5" fill="#326CE5"/>
      <circle cx="40" cy="73" r="4.5" fill="#326CE5"/>
      <circle cx="70" cy="22" r="4.5" fill="#326CE5"/>
      <circle cx="10" cy="58" r="4.5" fill="#326CE5"/>
      <circle cx="70" cy="58" r="4.5" fill="#326CE5"/>
      <circle cx="10" cy="22" r="4.5" fill="#326CE5"/>
    </svg>`,
  },
  {
    name: "AWS", color: "#FF9900", rgb: "255,153,0",
    svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <text x="40" y="38" font-size="22" fill="#FF9900" font-family="Arial,sans-serif"
            font-weight="900" text-anchor="middle" letter-spacing="1">AWS</text>
      <path d="M16 52 Q40 66 64 52" stroke="#FF9900" stroke-width="3.5"
            fill="none" stroke-linecap="round"/>
      <polyline points="57,46 64,52 57,59" fill="none" stroke="#FF9900"
                stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
  },
  {
    name: "MONGODB", color: "#47A248", rgb: "71,162,72",
    svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <path d="M40 6 C40 6 54 22 54 42 C54 58 48 70 40 76 C32 70 26 58 26 42 C26 22 40 6 40 6Z"
            fill="#47A248"/>
      <line x1="40" y1="48" x2="40" y2="78" stroke="#47A248" stroke-width="3"
            stroke-linecap="round" opacity="0.55"/>
    </svg>`,
  },
  {
    name: "TS", color: "#3178C6", rgb: "49,120,198",
    svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="6" width="68" height="68" rx="10" fill="#3178C6"/>
      <text x="40" y="58" font-size="36" fill="white" font-family="Arial,sans-serif"
            font-weight="900" text-anchor="middle">TS</text>
    </svg>`,
  },
  {
    name: "GRAFANA", color: "#F46800", rgb: "244,104,0",
    svg: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="40,4 73,22 73,58 40,76 7,58 7,22"
               fill="rgba(244,104,0,0.15)" stroke="#F46800" stroke-width="2.5"/>
      <path d="M50 34 L34 34 L34 46 L44 46" stroke="#F46800" stroke-width="3.5"
            fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M34 34 Q34 24 40 24 Q50 24 50 34 L50 46 Q50 56 40 56 Q30 56 30 46"
            stroke="#F46800" stroke-width="3.5" fill="none"
            stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
  },
  {
    name: "PROM", color: "#E6522C", rgb: "230,82,44",
    svg: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M40 4 C40 4 58 22 54 40 C62 30 60 16 54 12
               C70 28 65 52 55 62 C51 67 46 72 40 74
               C34 72 29 67 25 62 C15 52 10 28 26 12
               C20 16 18 30 26 40 C22 22 40 4 40 4Z" fill="#E6522C"/>
      <path d="M40 28 C40 28 47 36 45 46 C48 41 47 35 44 32
               C50 40 48 55 44 60 C42 63 40 65 40 65
               C40 65 38 63 36 60 C32 55 30 40 36 32
               C33 35 32 41 35 46 C33 36 40 28 40 28Z"
            fill="#FFA05C" opacity="0.85"/>
    </svg>`,
  },
  {
    name: "NODE.JS", color: "#8CC84B", rgb: "140,200,75",
    svg: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="40,4 73,22 73,58 40,76 7,58 7,22"
               fill="rgba(140,200,75,0.12)" stroke="#8CC84B" stroke-width="2.5"/>
      <text x="40" y="44" font-size="14" fill="#8CC84B" font-family="monospace"
            font-weight="700" text-anchor="middle" letter-spacing="0.5">node</text>
      <text x="40" y="58" font-size="12" fill="#8CC84B" font-family="monospace"
            text-anchor="middle" opacity="0.8">.js</text>
    </svg>`,
  },
  {
    name: "NEXT.JS", color: "#ffffff", rgb: "255,255,255",
    svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="34" fill="rgba(255,255,255,0.08)" stroke="white" stroke-width="2"/>
      <path d="M26 56 L26 24 L40 48 L54 24 L54 56" fill="none" stroke="white"
            stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M46 28 L56 46 L46 46 Z" fill="white" opacity="0.35"/>
    </svg>`,
  },
  {
    name: "REDIS", color: "#FF4438", rgb: "255,68,56",
    svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="40" cy="24" rx="28" ry="10" fill="#FF4438" opacity="0.9"/>
      <ellipse cx="40" cy="40" rx="28" ry="10" fill="#FF4438" opacity="0.65"/>
      <ellipse cx="40" cy="56" rx="28" ry="10" fill="#FF4438" opacity="0.4"/>
      <rect x="12" y="24" width="2.5" height="32" fill="#FF4438" opacity="0.65"/>
      <rect x="65.5" y="24" width="2.5" height="32" fill="#FF4438" opacity="0.65"/>
    </svg>`,
  },
];

// ── Badge HTML — solid dark background (backdrop-filter won't work ────
// inside GSAP-transformed containers, so we use an opaque dark gradient)
function buildBadgeHTML(badge) {
  return `
    <div style="
      width:100%;height:100%;box-sizing:border-box;
      display:flex;flex-direction:column;align-items:center;
      justify-content:center;gap:4px;padding:10px 8px 7px;
      border-radius:18px;
      background:linear-gradient(145deg,rgba(6,6,6,0.94) 0%,rgba(${badge.rgb},0.18) 100%);
      border:1.5px solid rgba(${badge.rgb},0.72);
      box-shadow:
        0 12px 40px rgba(0,0,0,0.75),
        0  4px 16px rgba(0,0,0,0.55),
        0  0  18px rgba(${badge.rgb},0.28),
        inset 0 1px 0 rgba(255,255,255,0.07);
    ">
      ${badge.svg}
      <span style="
        font-family:'Courier New',monospace;font-size:7.5px;font-weight:800;
        letter-spacing:0.20em;color:${badge.color};line-height:1;
        white-space:nowrap;text-shadow:0 0 8px rgba(${badge.rgb},0.8);
      ">${badge.name}</span>
    </div>
  `;
}

const POOL_SIZE       = BADGES.length;  // 12
const THROW_THRESHOLD = 12;             // px/frame velocity gate
const COOLDOWN_MS     = 85;             // min ms between spawns

const CursorTrail = () => {
  const dotRef         = useRef(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const dot = dotRef.current;
    if (!dot) return;

    // ── Dot: snap to cursor (GSAP owns x/y) ──────────────────────
    const onMoveDot = (e) => {
      gsap.to(dot, {
        x: e.clientX, y: e.clientY,
        duration: 0.08, ease: "none", overwrite: true,
      });
    };
    window.addEventListener("mousemove", onMoveDot, { passive: true });

    if (prefersReduced) {
      return () => window.removeEventListener("mousemove", onMoveDot);
    }

    // ── Fixed overlay container ───────────────────────────────────
    const container = document.createElement("div");
    container.setAttribute("aria-hidden", "true");
    Object.assign(container.style, {
      position:      "fixed",
      inset:         "0",
      pointerEvents: "none",
      zIndex:        "9990",
    });
    document.body.appendChild(container);

    // ── Physics state per pool slot ───────────────────────────────
    const states = BADGES.map((badge, i) => {
      const el = document.createElement("div");
      Object.assign(el.style, {
        position:   "absolute",
        top:        "0",
        left:       "0",
        width:      BADGE_SIZE + "px",
        height:     BADGE_SIZE + "px",
        opacity:    "0",
        willChange: "transform,opacity",
        pointerEvents: "none",
      });
      el.innerHTML = buildBadgeHTML(badge);
      container.appendChild(el);

      return {
        el,
        active:  false,
        x:       0,
        y:       0,
        vx:      0,
        vy:      0,
        rot:     0,
        rotV:    0,
        bounces: 0,
      };
    });

    // ── Single GSAP ticker — drives all physics ───────────────────
    const tick = () => {
      const floor = window.innerHeight - BADGE_SIZE - FLOOR_MARGIN;

      states.forEach((s) => {
        if (!s.active) return;

        // Integrate velocity
        s.vy   += GRAVITY;
        s.vx   *= FRICTION;
        s.rotV *= ROT_DAMPING;
        s.x    += s.vx;
        s.y    += s.vy;
        s.rot  += s.rotV;

        // ── Floor collision ───────────────────────────────────────
        if (s.y >= floor) {
          s.y  = floor;
          s.vy *= -BOUNCE_ENERGY;   // flip + attenuate
          s.vx *= 0.65;             // lose some horizontal on impact
          s.rotV *= -0.35;          // slight spin reversal on bounce
          s.bounces++;

          // Squash-and-stretch flash (cheap visual feedback)
          s.el.style.transition = "transform 0.06s";

          // Settle condition
          if (s.bounces >= MAX_BOUNCES || Math.abs(s.vy) < MIN_SETTLE_VY) {
            s.active = false;
            gsap.to(s.el, {
              opacity:  0,
              y:        s.y + 6,
              duration: 0.55,
              ease:     "power2.in",
              onComplete: () => {
                s.el.style.transition = "";
                s.el.style.transform  = "translate3d(0,0,0)";
              },
            });
            return;
          }
        }

        // Write transform directly — faster than gsap.set
        s.el.style.transform =
          `translate3d(${s.x}px,${s.y}px,0) rotate(${s.rot}deg)`;
      });
    };

    gsap.ticker.add(tick);

    // ── Spawn a badge at cursor with upward toss ──────────────────
    let poolIdx     = 0;
    let lastX       = 0;
    let lastY       = 0;
    let lastSpawnAt = 0;

    const spawnBadge = (cx, cy, cursorVx) => {
      // Find a free slot first; fall back to oldest
      let s = states.find((st) => !st.active);
      if (!s) {
        s = states[poolIdx % POOL_SIZE];
        poolIdx++;
      }

      // Kill any residual GSAP fade tween on this element
      gsap.killTweensOf(s.el);
      s.el.style.transition = "";

      // Initial position — centred on cursor
      s.x = cx - BADGE_SIZE / 2;
      s.y = cy - BADGE_SIZE / 2;

      // Toss: mostly upward + slight horizontal bias from cursor direction
      s.vx    = cursorVx * 0.18 + (Math.random() - 0.5) * 5;
      s.vy    = -(7 + Math.random() * 9);   // negative = up
      s.rot   = (Math.random() - 0.5) * 28;
      s.rotV  = (Math.random() - 0.5) * 10;
      s.bounces = 0;
      s.active  = true;

      // Show immediately — opacity owned by GSAP on settle
      gsap.set(s.el, {
        x:       0, y: 0,   // clear any GSAP x/y (we use style.transform)
        opacity: 0.95,
        clearProps: "x,y",
      });

      // Apply starting position via style (avoids GSAP x/y conflict)
      s.el.style.transform =
        `translate3d(${s.x}px,${s.y}px,0) rotate(${s.rot}deg)`;
    };

    const onMove = (e) => {
      const dx  = e.clientX - lastX;
      const dy  = e.clientY - lastY;
      const vel = Math.hypot(dx, dy);
      const now = Date.now();

      lastX = e.clientX;
      lastY = e.clientY;

      if (vel > THROW_THRESHOLD && now - lastSpawnAt > COOLDOWN_MS) {
        lastSpawnAt = now;
        spawnBadge(e.clientX, e.clientY, dx);
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });

    // ── Dot hover states ──────────────────────────────────────────
    const onEnter = () =>
      gsap.to(dot, { scale: 4, opacity: 0.4, duration: 0.25, ease: "power2.out" });
    const onLeave = () =>
      gsap.to(dot, { scale: 1, opacity: 1, duration: 0.3,  ease: "power2.out" });

    const targets = document.querySelectorAll("a,button,[data-cursor]");
    targets.forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("mousemove", onMoveDot);
      window.removeEventListener("mousemove", onMove);
      targets.forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
      container.remove();
    };
  }, [prefersReduced]);

  if (prefersReduced) return null;

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      className="cursor-dot fixed pointer-events-none z-[9999] rounded-full bg-primary-500"
      style={{ left: 0, top: 0, width: 7, height: 7,
               transform: "translate(-50%,-50%)" }}
    />
  );
};

export default CursorTrail;
