/**
 * Components/Home.jsx — Cinematic 100vh Hero (non-scrollable)
 * ─────────────────────────────────────────────────────────────────
 * Awwwards-grade locked hero. The page does NOT scroll: the hero is a
 * `fixed inset-0` layer and body scroll is locked while Home is mounted,
 * so it fills exactly one viewport regardless of the sticky navbar's
 * flow height.
 *
 * Library ownership (strict — no two libs on the same property):
 *   D3 + Three.js → ConstellationField centerpiece (force-driven points)
 *   GSAP          → entrance timeline, role rotation, ambient orb/gradient
 *   Framer Motion → magnetic spring on the primary CTA (x/y only)
 *
 * Layout: minimal editorial — availability badge + year up top, a full
 * bleed constellation through the middle, massive name lock + one CTA +
 * socials anchored to the bottom. No marquee, no stat strip, no scroll.
 */

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import SEO from "./SEO";
import { gsap } from "gsap";
import { FaGithub, FaLinkedin, FaEnvelope, FaArrowRightLong } from "react-icons/fa6";
import { personalInfo } from "../data/personal";
import MagneticWrapper from "./ui/MagneticWrapper";
import GsapButton from "./ui/GsapButton";
import SocialIcon from "./ui/SocialIcon";
import { useReducedMotion } from "../context/ReducedMotionContext";
import { useLenis } from "../context/LenisContext";
import { EASE, DUR, STAGGER } from "../motion/tokens";

// ── ScrambleHoverText — decode/hacker scramble for DHARANEESH ─────────
// GSAP owns y/colour transforms; a single interval scrambles the glyphs.
const SCRAMBLE_CHARS   = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#@!$%&*?";
const SCRAMBLE_MS      = 420;
const SCRAMBLE_STAGGER = 55;
const TICK_MS          = 38;

const ScrambleHoverText = ({ text }) => {
  const charRefs    = useRef([]);
  const intervalRef = useRef(null);
  const isOn        = useRef(false);
  const prefersReduced = useRef(
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  const clearScramble = () => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
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

    gsap.killTweensOf(charRefs.current);
    gsap.to(charRefs.current, { y: -10, color: "#f97316", duration: 0.22, ease: "power2.out" });

    const chars   = text.split("");
    const now     = Date.now();
    const starts  = chars.map((_, i) => now + i * SCRAMBLE_STAGGER);
    const settled = chars.map(() => false);

    clearScramble();
    intervalRef.current = setInterval(() => {
      const t = Date.now();
      let allDone = true;
      chars.forEach((original, i) => {
        if (settled[i]) return;
        if (t < starts[i]) { allDone = false; return; }
        const elapsed = t - starts[i];
        if (elapsed >= SCRAMBLE_MS) {
          if (charRefs.current[i]) charRefs.current[i].textContent = original;
          settled[i] = true;
        } else {
          if (charRefs.current[i]) {
            charRefs.current[i].textContent =
              SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
          }
          allDone = false;
        }
      });
      if (allDone) {
        clearScramble();
        gsap.to(charRefs.current, {
          y: 0, color: "#ffffff", duration: 0.55,
          ease: "elastic.out(1, 0.38)", stagger: { each: 0.025, from: "center" },
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
    gsap.to(charRefs.current, { y: 0, color: "#ffffff", duration: 0.28, ease: "power3.out" });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (prefersReduced.current) return () => clearScramble();
    const t = setTimeout(onEnter, 1600);
    return () => { clearTimeout(t); clearScramble(); };
  }, []);

  return (
    <h1
      className="name-line font-heading font-black uppercase tracking-tighter text-white cursor-default select-none"
      style={{ fontSize: "clamp(40px, 8vw, 124px)", lineHeight: "0.9", whiteSpace: "nowrap" }}
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

// ── SplitHoverText — per-character lift + fill for RAVICHANDRAN ───────
const SplitHoverText = ({ text }) => {
  const charRefs = useRef([]);
  const prefersReduced = useRef(
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  const onEnter = () => {
    if (prefersReduced.current) return;
    gsap.killTweensOf(charRefs.current);
    gsap.to(charRefs.current, {
      y: -16, color: "#f97316",
      rotation: (i) => (i % 2 === 0 ? -4 : 4),
      duration: 0.32, ease: "power3.out",
      stagger: { each: 0.04, from: "start" },
    });
  };

  const onLeave = () => {
    if (prefersReduced.current) return;
    gsap.killTweensOf(charRefs.current);
    gsap.to(charRefs.current, {
      y: 0, color: "transparent", rotation: 0,
      duration: 0.6, ease: "elastic.out(1, 0.42)",
      stagger: { each: 0.032, from: "end" },
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (prefersReduced.current) return;
    let tLeave;
    const tEnter = setTimeout(() => { onEnter(); tLeave = setTimeout(onLeave, 1050); }, 2100);
    return () => { clearTimeout(tEnter); clearTimeout(tLeave); gsap.killTweensOf(charRefs.current); };
  }, []);

  return (
    <h1
      className="name-line font-heading font-black uppercase tracking-tighter cursor-default select-none"
      style={{
        fontSize: "clamp(40px, 8vw, 124px)",
        lineHeight: "0.9",
        whiteSpace: "nowrap",
        WebkitTextStroke: "clamp(1.5px, 0.18vw, 2.5px) #f97316",
        color: "transparent",
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

// ── Rotating role labels ──────────────────────────────────────────────
const ROLES = [
  "Full-Stack Engineer",
  "MERN Stack Architect",
  "React Performance Specialist",
  "Cloud-Native Builder",
];

const Home = () => {
  const [roleIdx, setRoleIdx] = useState(0);
  const heroRef = useRef(null);
  const prefersReduced = useReducedMotion();
  const lenis = useLenis();

  // ── Lock the page to a single non-scrollable viewport ───────────────
  useEffect(() => {
    const htmlEl = document.documentElement;
    const prevHtml = htmlEl.style.overflow;
    const prevBody = document.body.style.overflow;
    htmlEl.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    lenis?.stop();
    return () => {
      htmlEl.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
      lenis?.start();
    };
  }, [lenis]);

  // ── Entrance choreography + ambient motion ──────────────────────────
  useEffect(() => {
    const d = (v) => (prefersReduced ? 0 : v);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: EASE.out } });

      tl.from(".hero-top", { y: -16, opacity: 0, duration: d(DUR.md), stagger: d(0.1) });

      tl.from(".name-line", {
        y: 110, opacity: 0,
        stagger: d(0.14),
        duration: d(DUR.xl),
        ease: EASE.snap,
        clipPath: "inset(0 0 100% 0)",
      }, d(0.2));

      tl.from(".hero-divider", {
        scaleX: 0, transformOrigin: "left",
        duration: d(DUR.lg), ease: EASE.cinematic,
      }, d(0.65));

      tl.from([".hero-tagline", ".role-wrap"], {
        y: 24, opacity: 0, stagger: d(0.1), duration: d(DUR.md),
      }, d(0.8));

      tl.from(".cta-item", {
        y: 16, opacity: 0, stagger: d(STAGGER.sm.each), duration: d(DUR.sm),
      }, d(0.95));

      tl.from(".social-link", {
        y: 12, opacity: 0, stagger: d(0.08), duration: d(DUR.sm),
      }, d(1.1));

      if (!prefersReduced) {
        gsap.to(".bg-orb", {
          y: "random(-50,50)", x: "random(-50,50)", scale: "random(0.85,1.3)",
          duration: "random(12,20)", repeat: -1, yoyo: true, ease: EASE.sine, stagger: 0.8,
        });
        gsap.to(".hero-grad", {
          backgroundPosition: "200% 50%", duration: 22, repeat: -1, ease: EASE.linear,
        });
      }
    }, heroRef);

    if (prefersReduced) return () => ctx.revert();

    const iv = setInterval(() => {
      gsap.to(".role-text", {
        y: -18, opacity: 0, duration: 0.3, ease: EASE.in,
        onComplete: () => {
          setRoleIdx((p) => (p + 1) % ROLES.length);
          gsap.fromTo(".role-text",
            { y: 18, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.4, ease: EASE.out });
        },
      });
    }, 3600);

    return () => { clearInterval(iv); ctx.revert(); };
  }, [prefersReduced]);

  return (
    <section
      ref={heroRef}
      className="fixed inset-0 z-0 overflow-hidden bg-dark-900 select-none"
    >
      <SEO 
        title="Dharaneesh R | Full-Stack Engineer" 
        description="Portfolio of Dharaneesh R, a Full-Stack Engineer building scalable web experiences with modern technologies." 
      />
      {/* ── Gradient overlay ──────────────────────────────────────── */}
      <div
        className="hero-grad absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 45%, rgba(249,115,22,0.05) 0%, transparent 60%), " +
            "linear-gradient(180deg, rgba(5,5,5,0.55) 0%, transparent 30%, transparent 55%, rgba(5,5,5,0.85) 100%)",
          backgroundSize: "400% 400%",
          backgroundPosition: "0% 50%",
        }}
      />

      {/* Ambient glow orbs */}
      <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
        <div className="bg-orb absolute top-1/4 left-1/4 w-[480px] h-[480px] rounded-full bg-primary-600/10 blur-[130px]" />
        <div className="bg-orb absolute bottom-1/4 right-1/4 w-[380px] h-[380px] rounded-full bg-primary-500/8 blur-[110px]" />
      </div>

      {/* ════════════════════════════════════════════════════════════
          CONTENT — top bar / spacer / name lock
      ════════════════════════════════════════════════════════════ */}
      <div className="relative z-10 h-full flex flex-col justify-between px-6 sm:px-10 lg:px-16 xl:px-24 pt-20 sm:pt-24 pb-8 sm:pb-10">

        {/* ── Top bar ─────────────────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <div className="hero-top inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
            </span>
            <span className="text-white/60 text-xs font-mono tracking-widest uppercase">
              Available for work
            </span>
          </div>
          <span className="hero-top text-white/20 font-mono text-xs tracking-widest">© 2026</span>
        </div>

        {/* ── Name lock + meta (anchored bottom) ──────────────────── */}
        <div>
          <div className="leading-none mb-1" style={{ overflow: "visible" }}>
            <ScrambleHoverText text="DHARANEESH" />
          </div>
          <div className="leading-none" style={{ overflow: "visible" }}>
            <SplitHoverText text="RAVICHANDRAN" />
          </div>

          {/* Divider */}
          <div className="hero-divider h-px bg-gradient-to-r from-primary-500/70 via-primary-400/30 to-transparent mt-6 mb-6 max-w-2xl" />

          {/* Tagline + rotating role */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
            <p className="hero-tagline text-white/75 font-light text-base sm:text-lg md:text-xl leading-relaxed max-w-md">
              Building scalable web experiences
              <br className="hidden sm:block" /> with modern technologies.
            </p>

            <div className="role-wrap text-left sm:text-right shrink-0">
              <p className="text-white/25 font-mono text-[10px] tracking-[0.3em] uppercase mb-2">
                Currently
              </p>
              <div className="min-h-[1.6em] overflow-hidden">
                <p className="role-text text-primary-500 font-heading font-bold text-base sm:text-lg md:text-xl tracking-wide">
                  {ROLES[roleIdx]}
                </p>
              </div>
            </div>
          </div>

          {/* ── CTA + socials ───────────────────────────────────────── */}
          <div className="flex flex-wrap items-center gap-x-7 gap-y-4 mt-9">
            <MagneticWrapper strength={0.3}>
              <GsapButton
                as={Link}
                to="/projects"
                variant="solid"
                icon={<FaArrowRightLong className="text-sm" />}
                className="cta-item px-7 py-3.5 rounded-full font-heading font-bold text-sm sm:text-base tracking-wide"
              >
                View My Work
              </GsapButton>
            </MagneticWrapper>

            <div className="flex items-center gap-3">
              {[
                { href: personalInfo.socialLinks[0].url, icon: FaGithub,   label: "GitHub",   ext: true },
                { href: personalInfo.socialLinks[1].url, icon: FaLinkedin, label: "LinkedIn", ext: true },
                { href: `mailto:${personalInfo.email}`,  icon: FaEnvelope, label: "Email",    ext: false },
              ].map((s) => (
                <SocialIcon
                  key={s.label}
                  className="social-link"
                  href={s.href}
                  icon={s.icon}
                  label={s.label}
                  external={s.ext}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
