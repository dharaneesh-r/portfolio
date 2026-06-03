/**
 * Components/Home.jsx — Editorial Hero
 * ─────────────────────────────────────────────────────────────────
 * Library ownership (strict — no two libs on the same property):
 *   GSAP          → entrance timelines, role rotation, orb drift,
 *                   gradient scroll, stat counter glow
 *   Framer Motion → magnetic spring on CTA wrappers (x/y only)
 *   Three.js      → WebGL canvas (ThreeBackground)
 *
 * Layout: bold editorial grid — left-aligned massive typography,
 * outlined second-name line, bottom stat strip, infinite marquee.
 */

import { useEffect, useRef, useState } from "react";
import { Link }            from "react-router-dom";
import { gsap }            from "gsap";
import { FaGithub, FaLinkedin, FaEnvelope, FaUpRightFromSquare, FaDownload } from "react-icons/fa6";
import { personalInfo }    from "../data/personal";
import ThreeBackground     from "./ThreeBackground";
import MagneticWrapper     from "./ui/MagneticWrapper";
import { useReducedMotion }  from "../context/ReducedMotionContext";
import { EASE, DUR, STAGGER } from "../motion/tokens";

// ── SplitText Hover — GSAP-driven per-character lift + fill ──────────
// Each character of text is wrapped in an inline-block span so GSAP
// can transform them independently.
//
// Library ownership: GSAP owns y, rotation, color on the char spans.
// Framer Motion does NOT touch this component.
//
// Hover enter : chars stagger left→right, lift 18 px, fill orange.
// Hover leave : chars stagger right→left, drop back, return to stroke-only.
//
// The parent wrapper uses overflow:visible (not overflow:hidden) so the
// upward lift is not clipped. The GSAP entrance clipPath is on the h1
// itself, so it doesn't need a clipping parent.
const SplitHoverText = ({ text }) => {
  const charRefs     = useRef([]);
  const prefersReduced = useRef(
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  const onEnter = () => {
    if (prefersReduced.current) return;
    gsap.killTweensOf(charRefs.current);
    gsap.to(charRefs.current, {
      y:        -18,
      // Fill the outlined letters: color overrides the parent transparent
      color:    "#f97316",
      // Slight alternating tilt — makes each char feel alive
      rotation: (i) => (i % 2 === 0 ? -4 : 4),
      duration: 0.32,
      ease:     "power3.out",
      stagger:  { each: 0.04, from: "start" },
    });
  };

  const onLeave = () => {
    if (prefersReduced.current) return;
    gsap.killTweensOf(charRefs.current);
    gsap.to(charRefs.current, {
      y:        0,
      color:    "transparent",  // back to stroke-only
      rotation: 0,
      duration: 0.60,
      ease:     "elastic.out(1, 0.42)",
      stagger:  { each: 0.032, from: "end" }, // reverse cascade on leave
    });
  };

  // Auto-play on first visit.
  // Starts at 2 100 ms (DHARANEESH scramble is mid-way, creating an overlap).
  // After the enter wave has peaked (~1 050 ms) auto-leave fires.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (prefersReduced.current) return;
    let tLeave;
    const tEnter = setTimeout(() => {
      onEnter();
      tLeave = setTimeout(onLeave, 1050);
    }, 2100);
    return () => {
      clearTimeout(tEnter);
      clearTimeout(tLeave);
      gsap.killTweensOf(charRefs.current);
    };
  }, []);

  return (
    <h1
      className="name-line font-heading font-black uppercase tracking-tighter cursor-default select-none"
      style={{
        fontSize:         "clamp(38px, 7.2vw, 110px)",
        lineHeight:       "0.92",
        whiteSpace:       "nowrap",
        WebkitTextStroke: "clamp(1.5px, 0.18vw, 2.5px) #f97316",
        color:            "transparent",
      }}
      aria-label={text}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {text.split("").map((char, i) => (
        <span
          key={i}
          ref={(el) => { charRefs.current[i] = el; }}
          style={{ display: "inline-block" }}
          aria-hidden="true"
        >
          {char}
        </span>
      ))}
    </h1>
  );
};

// ── ScrambleHoverText — decode/hacker scramble effect for DHARANEESH ──
// Library ownership: GSAP handles y/color transforms.
//                    A single setInterval handles the char randomisation.
//
// How it works:
//  1. onMouseEnter: GSAP lifts all chars slightly + tints orange.
//     A single interval ticks every TICK_MS and scrambles each character
//     through random uppercase letters. Each char has a staggered START
//     time so the scramble cascades left→right. After SCRAMBLE_MS each
//     char settles back to its real letter.
//  2. Once all chars have settled, GSAP returns y → 0, color → white.
//  3. onMouseLeave (mid-scramble): interval cleared, chars restored
//     immediately, GSAP snaps back instantly.
//
// Distinct from RAVICHANDRAN: no ordered stagger on exit, no rotation,
// completely different visual register (chaotic → settled vs wave → lift).
const SCRAMBLE_CHARS   = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#@!$%&*?";
const SCRAMBLE_MS      = 420;  // how long each char scrambles
const SCRAMBLE_STAGGER = 55;   // ms between chars starting
const TICK_MS          = 38;   // interval tick (≈26 fps — enough for flicker)

const ScrambleHoverText = ({ text }) => {
  const charRefs    = useRef([]);
  const intervalRef = useRef(null);
  const isOn        = useRef(false);
  const prefersReduced = useRef(
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  const clearScramble = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const restore = () => {
    clearScramble();
    text.split("").forEach((ch, i) => {
      if (charRefs.current[i]) charRefs.current[i].textContent = ch;
    });
  };

  const onEnter = () => {
    if (prefersReduced.current || isOn.current) return;
    isOn.current = true;

    // GSAP: float all chars up + orange tint simultaneously
    gsap.killTweensOf(charRefs.current);
    gsap.to(charRefs.current, {
      y:        -10,
      color:    "#f97316",
      duration: 0.22,
      ease:     "power2.out",
    });

    const chars    = text.split("");
    const now      = Date.now();
    const starts   = chars.map((_, i) => now + i * SCRAMBLE_STAGGER);
    const settled  = chars.map(() => false);

    clearScramble();

    intervalRef.current = setInterval(() => {
      const t = Date.now();
      let allDone = true;

      chars.forEach((original, i) => {
        if (settled[i]) return;
        if (t < starts[i]) { allDone = false; return; }

        const elapsed = t - starts[i];
        if (elapsed >= SCRAMBLE_MS) {
          // Settle to real character
          if (charRefs.current[i]) charRefs.current[i].textContent = original;
          settled[i] = true;
        } else {
          // Scramble with a random glyph
          if (charRefs.current[i]) {
            charRefs.current[i].textContent =
              SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
          }
          allDone = false;
        }
      });

      if (allDone) {
        clearScramble();
        // GSAP: float back down + restore white
        gsap.to(charRefs.current, {
          y:        0,
          color:    "#ffffff",
          duration: 0.55,
          ease:     "elastic.out(1, 0.38)",
          stagger:  { each: 0.025, from: "center" }, // collapse from center
        });
        isOn.current = false;
      }
    }, TICK_MS);
  };

  const onLeave = () => {
    if (prefersReduced.current) return;
    isOn.current = false;
    restore();
    gsap.killTweensOf(charRefs.current);
    gsap.to(charRefs.current, {
      y:        0,
      color:    "#ffffff",
      duration: 0.28,
      ease:     "power3.out",
    });
  };

  // Auto-play on first visit + cleanup on unmount.
  // Delay = 1 600 ms so the page entrance animations finish before scramble starts.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (prefersReduced.current) return () => clearScramble();
    const t = setTimeout(onEnter, 1600);
    return () => { clearTimeout(t); clearScramble(); };
  }, []);

  return (
    <h1
      className="name-line font-heading font-black uppercase tracking-tighter text-white cursor-default select-none"
      style={{ fontSize: "clamp(38px, 7.2vw, 110px)", lineHeight: "0.92", whiteSpace: "nowrap" }}
      aria-label={text}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {text.split("").map((char, i) => (
        <span
          key={i}
          ref={(el) => { charRefs.current[i] = el; }}
          style={{ display: "inline-block" }}
          aria-hidden="true"
        >
          {char}
        </span>
      ))}
    </h1>
  );
};

// ── Tech stack marquee items ─────────────────────────────────────────
const MARQUEE_ITEMS = [
  "REACT", "NODE.JS", "MONGODB", "TYPESCRIPT", "THREE.JS",
  "AWS", "DOCKER", "GSAP", "MERN STACK", "NEXT.JS", "TAILWIND CSS",
  "EXPRESS", "KUBERNETES", "REST API", "FULL STACK",
];

// ── Roles ────────────────────────────────────────────────────────────
const ROLES = [
  "Full-Stack Architect",
  "MERN Stack Engineer",
  "React Performance Wizard",
  "Software Craftsman",
];

// ── Subcomponent: Marquee strip ──────────────────────────────────────
const MarqueeStrip = () => (
  <div
    className="overflow-hidden border-t border-b border-white/8 py-3 cursor-default"
    onMouseEnter={e => e.currentTarget.querySelector(".marquee-track").style.animationPlayState = "paused"}
    onMouseLeave={e => e.currentTarget.querySelector(".marquee-track").style.animationPlayState = "running"}
  >
    <div className="marquee-track flex whitespace-nowrap select-none" aria-hidden="true">
      {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
        <span key={i} className="inline-flex items-center gap-4 px-5">
          <span className="text-primary-500 text-base leading-none">✦</span>
          <span className="text-white/40 font-mono text-xs tracking-[0.25em] uppercase">
            {item}
          </span>
        </span>
      ))}
    </div>
  </div>
);

// ── Main component ───────────────────────────────────────────────────
const Home = () => {
  const [roleIdx, setRoleIdx] = useState(0);
  const heroRef    = useRef(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const d = (v) => prefersReduced ? 0 : v;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: EASE.out } });

      // ── Available badge ─────────────────────────────────────────
      tl.from(".avail-badge", {
        y: -16, opacity: 0, duration: d(DUR.md),
      });

      // ── Name lines — stagger up from below the clip ────────────
      tl.from(".name-line", {
        y: 100, opacity: 0,
        stagger: d(0.14),
        duration: d(DUR.xl),
        ease: EASE.snap,
        clipPath: "inset(0 0 100% 0)",
      }, d(0.15));

      // ── Divider ────────────────────────────────────────────────
      tl.from(".hero-divider", {
        scaleX: 0, transformOrigin: "left",
        duration: d(DUR.lg),
        ease: EASE.cinematic,
      }, d(0.6));

      // ── Tagline + role ─────────────────────────────────────────
      tl.from([".hero-tagline", ".role-label"], {
        y: 24, opacity: 0,
        stagger: d(0.1),
        duration: d(DUR.md),
      }, d(0.75));

      // ── CTAs ───────────────────────────────────────────────────
      tl.from(".cta-item", {
        y: 16, opacity: 0,
        stagger: d(STAGGER.sm.each),
        duration: d(DUR.sm),
      }, d(0.9));

      // ── Socials + scroll hint ──────────────────────────────────
      tl.from([".social-link", ".scroll-hint"], {
        y: 12, opacity: 0,
        stagger: d(0.08),
        duration: d(DUR.sm),
      }, d(1.05));

      // ── Stats ──────────────────────────────────────────────────
      tl.from(".stat-item", {
        y: 10, opacity: 0,
        stagger: d(0.1),
        duration: d(DUR.sm),
      }, d(1.15));

      if (!prefersReduced) {
        // Ambient orb float
        gsap.to(".bg-orb", {
          y: "random(-60,60)", x: "random(-60,60)",
          scale: "random(0.85,1.35)",
          duration: "random(12,20)",
          repeat: -1, yoyo: true,
          ease: EASE.sine, stagger: 0.8,
        });

        // Gradient drift
        gsap.to(".hero-grad", {
          backgroundPosition: "200% 50%",
          duration: 22, repeat: -1, ease: EASE.linear,
        });
      }
    }, heroRef);

    // ── Role rotation ──────────────────────────────────────────────
    if (prefersReduced) return () => ctx.revert();

    const iv = setInterval(() => {
      gsap.to(".role-text", {
        y: -20, opacity: 0, duration: 0.3, ease: EASE.in,
        onComplete: () => {
          setRoleIdx(p => (p + 1) % ROLES.length);
          gsap.fromTo(".role-text",
            { y: 20, opacity: 0 },
            { y: 0,  opacity: 1, duration: 0.38, ease: EASE.out }
          );
        },
      });
    }, 3600);

    return () => { clearInterval(iv); ctx.revert(); };
  }, [prefersReduced]);

  return (
    <section
      ref={heroRef}
      className="relative h-screen flex flex-col overflow-hidden bg-dark-900 select-none"
    >
      {/* ── Three.js nebula ─────────────────────────────────────── */}
      <ThreeBackground />

      {/* ── Gradient overlay ────────────────────────────────────── */}
      <div
        className="hero-grad absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 20% 60%, rgba(249,115,22,0.07) 0%, transparent 65%), " +
            "radial-gradient(ellipse 60% 50% at 80% 30%, rgba(249,115,22,0.05) 0%, transparent 60%), " +
            "linear-gradient(165deg, #050505 0%, #0a0a0a 50%, #080808 100%)",
          backgroundSize: "400% 400%",
          backgroundPosition: "0% 50%",
        }}
      />

      {/* Ambient glow orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="bg-orb absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-primary-600/10 blur-[120px]" />
        <div className="bg-orb absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-primary-500/8  blur-[100px]" />
      </div>

      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(249,115,22,1) 1px,transparent 1px)," +
            "linear-gradient(90deg,rgba(249,115,22,1) 1px,transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* ════════════════════════════════════════════════════════════
          MAIN CONTENT  (fills remaining height, left-aligned)
      ════════════════════════════════════════════════════════════ */}
      <div className="relative z-10 flex-1 flex flex-col justify-between px-6 sm:px-10 lg:px-16 xl:px-24 pt-6 pb-0">

        {/* ── Top bar ─────────────────────────────────────────────── */}
        <div className="flex items-center justify-between">
          {/* Available badge */}
          <div className="avail-badge inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
            </span>
            <span className="text-white/60 text-xs font-mono tracking-widest uppercase">
              Available for work
            </span>
          </div>

          {/* Year */}
          <span className="avail-badge text-white/20 font-mono text-xs tracking-widest">
            © 2025
          </span>
        </div>

        {/* ── Name block ─────────────────────────────────────────── */}
        <div className="mt-auto">
          {/* overflow:visible so scrambled chars can float above the baseline */}
          <div className="leading-none mb-1" style={{ overflow: "visible" }}>
            <ScrambleHoverText text="DHARANEESH" />
          </div>
          {/* overflow:visible — allows chars to lift above the line on hover */}
          <div className="leading-none" style={{ overflow: "visible" }}>
            <SplitHoverText text="RAVICHANDRAN" />
          </div>

          {/* Divider */}
          <div className="hero-divider h-px bg-gradient-to-r from-primary-500/70 via-primary-400/30 to-transparent mt-6 mb-6 max-w-2xl" />

          {/* Role + Tagline row */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            {/* Left: tagline */}
            <div>
              <p className="role-label text-white/30 font-mono text-xs tracking-[0.3em] uppercase mb-3">
                — Role
              </p>
              <p className="hero-tagline text-white/80 font-light text-base sm:text-lg md:text-xl leading-relaxed max-w-md">
                Building scalable web experiences<br className="hidden sm:block" />
                with modern technologies.
              </p>
            </div>

            {/* Right: rotating role */}
            <div className="text-right shrink-0">
              <p className="text-white/20 font-mono text-[10px] tracking-[0.3em] uppercase mb-2">
                Currently
              </p>
              <div className="min-h-[1.6em] overflow-hidden">
                <p className="role-text text-primary-500 font-heading font-bold text-sm sm:text-base md:text-lg tracking-wide">
                  {ROLES[roleIdx]}
                </p>
              </div>
            </div>
          </div>

          {/* ── CTAs ─────────────────────────────────────────────── */}
          <div className="flex flex-wrap items-center gap-5 mt-8">
            <MagneticWrapper strength={0.28}>
              <Link
                to="/projects"
                className="cta-item group inline-flex items-center gap-2 text-white font-heading font-semibold text-sm sm:text-base tracking-wide border-b border-white/20 pb-0.5 hover:border-primary-500 hover:text-primary-400 transition-colors duration-300"
              >
                View My Work
                <FaUpRightFromSquare className="text-sm group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
              </Link>
            </MagneticWrapper>

            <span className="cta-item text-white/15 hidden sm:block">|</span>

            <MagneticWrapper strength={0.28}>
              <Link
                to="/contact"
                className="cta-item group inline-flex items-center gap-2 text-white/60 font-heading font-semibold text-sm sm:text-base tracking-wide border-b border-transparent pb-0.5 hover:border-primary-500/50 hover:text-white transition-colors duration-300"
              >
                Contact
                <FaUpRightFromSquare className="text-sm group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
              </Link>
            </MagneticWrapper>

            <MagneticWrapper strength={0.22}>
              <a
                href={personalInfo.resume.url}
                download={personalInfo.resume.filename}
                className="cta-item group inline-flex items-center gap-2 text-white/40 font-mono text-xs tracking-widest uppercase border border-white/10 hover:border-primary-500/40 hover:text-white/70 px-4 py-2 rounded-sm transition-all duration-300"
              >
                <FaDownload className="text-xs" />
                Resume
              </a>
            </MagneticWrapper>
          </div>
        </div>

        {/* ── Bottom row: socials + stats + scroll hint ─────────── */}
        <div className="flex items-end justify-between pt-6 pb-5 mt-4">
          {/* Social links */}
          <div className="flex items-center gap-5">
            {[
              { href: personalInfo.socialLinks[0].url, icon: <FaGithub />,   label: "GitHub",   ext: true },
              { href: personalInfo.socialLinks[1].url, icon: <FaLinkedin />, label: "LinkedIn", ext: true },
              { href: `mailto:${personalInfo.email}`,  icon: <FaEnvelope />, label: "Email",    ext: false },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target={s.ext ? "_blank" : undefined}
                rel={s.ext ? "noopener noreferrer" : undefined}
                aria-label={s.label}
                className="social-link text-white/30 hover:text-primary-400 transition-colors duration-300 text-base sm:text-lg"
              >
                {s.icon}
              </a>
            ))}
          </div>

          {/* Stat strip */}
          <div className="hidden sm:flex items-center gap-6 lg:gap-10">
            {[
              { value: "15+",  label: "Projects" },
              { value: "1yr",  label: "Experience" },
              { value: "100%", label: "Dedicated" },
            ].map((s) => (
              <div key={s.label} className="stat-item text-center">
                <p className="text-primary-500 font-heading font-black text-lg lg:text-2xl leading-none mb-0.5">
                  {s.value}
                </p>
                <p className="text-white/25 font-mono text-[9px] tracking-[0.25em] uppercase">
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          {/* Scroll hint */}
          <div className="scroll-hint flex flex-col items-center gap-1.5 text-white/20">
            <span className="font-mono text-[9px] tracking-[0.3em] uppercase">Scroll</span>
            <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent relative overflow-hidden">
              <div
                className="absolute inset-x-0 top-0 h-1/2 bg-primary-500/60"
                style={{ animation: "scrollDot 1.6s ease-in-out infinite" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Marquee strip ────────────────────────────────────────── */}
      <MarqueeStrip />
    </section>
  );
};

export default Home;
