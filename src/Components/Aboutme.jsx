/**
 * Aboutme.jsx — Enhanced About page
 * ─────────────────────────────────────────────────────────────────
 * Library ownership per section:
 *   Three.js      → TechGlobe (tech-stack sprites on Fibonacci sphere)
 *   GSAP          → ALL scroll choreography: clip reveals, counters,
 *                   timeline draw, card entrances, parallax, scramble headings
 *   Framer Motion → MagneticWrapper on CTA / highlight cards
 */

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import SEO from "./SEO";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  FaBriefcase, FaGraduationCap, FaMapMarkerAlt, FaCalendarAlt,
  FaAward, FaDownload, FaCode, FaGithub, FaLinkedin, FaEnvelope,
} from "react-icons/fa";
import { personalInfo } from "../data/personal";
import { education }    from "../data/education";
import { experiences }  from "../data/experience";
import MagneticWrapper  from "./ui/MagneticWrapper";
import GsapButton       from "./ui/GsapButton";
import SocialIcon       from "./ui/SocialIcon";
import { useReducedMotion } from "../context/ReducedMotionContext";
import { EASE, DUR }    from "../motion/tokens";

// ── Tech stack items shown on the 3D globe ────────────────────────────
const TECH_ITEMS = [
  { label: "React.js",       color: "#61dafb" },
  { label: "Node.js",        color: "#68a063" },
  { label: "MongoDB",        color: "#4db33d" },
  { label: "Express.js",     color: "#68a063" },
  { label: "AWS",            color: "#ff9900" },
  { label: "Docker",         color: "#2496ed" },
  { label: "Kubernetes",     color: "#326ce5" },
  { label: "TypeScript",     color: "#3178c6" },
  { label: "Next.js",        color: "#e2e8f0" },
  { label: "TailwindCSS",    color: "#38bdf8" },
  { label: "DynamoDB",       color: "#ff9900" },
  { label: "Git",            color: "#f34f29" },
  { label: "GSAP",           color: "#88ce02" },
  { label: "Three.js",       color: "#e2e8f0" },
  { label: "REST API",       color: "#f97316" },
  { label: "GraphQL",        color: "#e535ab" },
  { label: "Firebase",       color: "#ffca28" },
  { label: "JavaScript",     color: "#f7df1e" },
  { label: "Redux",          color: "#764abc" },
  { label: "Elasticsearch",  color: "#4eb6b2" },
  { label: "GitHub Actions", color: "#2088ff" },
  { label: "Postman",        color: "#ef5b25" },
  { label: "AWS S3",         color: "#ff9900" },
  { label: "AWS ECS",        color: "#ff9900" },
  { label: "CI/CD",          color: "#f97316" },
  { label: "Grommet",        color: "#7d4cdb" },
  { label: "Kibana",         color: "#e8488a" },
  { label: "CloudWatch",     color: "#ff4f8b" },
];

// ── SVG icon map for tech chips in the experience cards ──────────────
const TECH_META = {
  "Node.js":       { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",           color: "#68a063" },
  "Express.js":    { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",         color: "#aaaaaa", invert: true },
  "React.js":      { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",             color: "#61dafb" },
  "Redux":         { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg",             color: "#764abc" },
  "MongoDB":       { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",         color: "#4db33d" },
  "DynamoDB":      { icon: "https://cdn.simpleicons.org/amazondynamodb/ff9900",                                        color: "#ff9900" },
  "AWS EC2":       { icon: "https://cdn.simpleicons.org/amazonec2/ff9900",                                             color: "#ff9900" },
  "AWS S3":        { icon: "https://cdn.simpleicons.org/amazons3/ff9900",                                              color: "#ff9900" },
  "AWS ECS":       { icon: "https://cdn.simpleicons.org/amazonaws/ff9900",                                             color: "#ff9900" },
  "CloudWatch":    { icon: "https://cdn.simpleicons.org/amazoncloudwatch/ff4f8b",                                      color: "#ff4f8b" },
  "Elasticsearch": { icon: "https://cdn.simpleicons.org/elastic/4eb6b2",                                               color: "#4eb6b2" },
  "Kibana":        { icon: "https://cdn.simpleicons.org/kibana/e8488a",                                                color: "#e8488a" },
  "Docker":        { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",           color: "#2496ed" },
  "Kubernetes":    { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg",      color: "#326ce5" },
  "GitHub Actions":{ icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",          color: "#e2e8f0", invert: true },
  "Jenkins":       { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jenkins/jenkins-original.svg",        color: "#d33833" },
  "CircleCI":      { icon: "https://cdn.simpleicons.org/circleci/e2e8f0",                                              color: "#e2e8f0" },
  "Grommet":       { icon: null,                                                                                        color: "#7d4cdb" },
  "REST APIs":     { icon: null,                                                                                        color: "#f97316" },
  "Authentication & Authorization": { icon: null,                                                                      color: "#10b981" },
  "TypeScript":    { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",  color: "#3178c6" },
  "Next.js":       { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",          color: "#e2e8f0", invert: true },
  "TailwindCSS":   { icon: "https://cdn.simpleicons.org/tailwindcss/38bdf8",                                           color: "#38bdf8" },
  "PostgreSQL":    { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",  color: "#336791" },
  "Git":           { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",                color: "#f34f29" },
};

// ── 3D tilting tech chip with SVG icon ───────────────────────────────
// GSAP owns rotateX/rotateY/scale. The chip tilts toward the cursor
// on hover, creating a parallax card-flip feel.
const TechChip3D = ({ name }) => {
  const ref     = useRef(null);
  const meta    = TECH_META[name] ?? { color: "#f97316", icon: null };
  const [imgErr, setImgErr] = useState(false);

  const onMove = (e) => {
    const el   = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx   = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
    const cy   = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;
    gsap.to(el, {
      rotateY:             cx * 18,
      rotateX:             -cy * 18,
      scale:               1.12,
      duration:            0.25,
      ease:                "power2.out",
      transformPerspective: 500,
      transformOrigin:     "center center",
    });
  };

  const onLeave = () => {
    gsap.to(ref.current, {
      rotateY: 0, rotateX: 0, scale: 1,
      duration: 0.6,
      ease:     "elastic.out(1, 0.45)",
    });
  };

  const hasIcon = meta.icon && !imgErr;

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="tech-chip inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border cursor-default select-none"
      style={{
        borderColor:      meta.color + "50",
        backgroundColor:  meta.color + "0d",
        transformStyle:   "preserve-3d",
        willChange:       "transform",
        boxShadow:        `0 0 0 0 ${meta.color}00`,
        transition:       "box-shadow 0.3s",
      }}
      onMouseEnter={(e) => {
        onMove(e);
        if (ref.current) ref.current.style.boxShadow = `0 4px 24px ${meta.color}35`;
      }}
    >
      {hasIcon && (
        <img
          src={meta.icon}
          alt={name}
          onError={() => setImgErr(true)}
          className="w-4 h-4 object-contain flex-shrink-0"
          style={{ filter: meta.invert ? "invert(1) brightness(0.85)" : "none" }}
        />
      )}
      {!hasIcon && (
        <span
          className="w-4 h-4 rounded-sm flex items-center justify-center text-[8px] font-black flex-shrink-0"
          style={{ backgroundColor: meta.color + "30", color: meta.color }}
        >
          {name[0]}
        </span>
      )}
      <span
        className="text-[10px] sm:text-xs font-mono font-semibold tracking-wide"
        style={{ color: meta.color }}
      >
        {name}
      </span>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════
//  THREE.JS — Tech Stack Globe
//  Each tech label is a canvas-textured Sprite positioned on a
//  Fibonacci sphere. The sphere rotates slowly and tilts to mouse.
// ════════════════════════════════════════════════════════════════════
const TechGlobe = ({ reduced }) => {
  const mountRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const W = mount.clientWidth  || 420;
    const H = mount.clientHeight || 420;

    // ── Renderer ─────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 100);
    camera.position.z = 16;

    // ── Helper: glow circle texture ──────────────────────────────────
    const makeGlowTex = (hex, size = 128) => {
      const c = document.createElement("canvas");
      c.width = size; c.height = size;
      const ctx = c.getContext("2d");
      const g = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
      g.addColorStop(0,    hex + "ff");
      g.addColorStop(0.35, hex + "cc");
      g.addColorStop(0.7,  hex + "44");
      g.addColorStop(1,    hex + "00");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, size, size);
      return new THREE.CanvasTexture(c);
    };

    // ── Helper: text-label sprite ─────────────────────────────────────
    const makeLabel = (text, colorHex) => {
      const cw = 320, ch = 72;
      const c = document.createElement("canvas");
      c.width = cw; c.height = ch;
      const ctx = c.getContext("2d");

      // pill background
      const r = 14;
      ctx.beginPath();
      ctx.moveTo(r, 0);
      ctx.lineTo(cw - r, 0);
      ctx.quadraticCurveTo(cw, 0, cw, r);
      ctx.lineTo(cw, ch - r);
      ctx.quadraticCurveTo(cw, ch, cw - r, ch);
      ctx.lineTo(r, ch);
      ctx.quadraticCurveTo(0, ch, 0, ch - r);
      ctx.lineTo(0, r);
      ctx.quadraticCurveTo(0, 0, r, 0);
      ctx.closePath();
      ctx.fillStyle   = colorHex + "22";
      ctx.fill();
      ctx.strokeStyle = colorHex + "99";
      ctx.lineWidth   = 2.5;
      ctx.stroke();

      // dot accent
      ctx.beginPath();
      ctx.arc(22, ch / 2, 5, 0, Math.PI * 2);
      ctx.fillStyle = colorHex;
      ctx.fill();

      // text
      ctx.font         = "bold 28px 'Inter', 'Segoe UI', sans-serif";
      ctx.fillStyle    = colorHex;
      ctx.textAlign    = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, cw / 2 + 8, ch / 2);

      const tex = new THREE.CanvasTexture(c);
      const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false });
      const sprite = new THREE.Sprite(mat);
      sprite.scale.set(3.6, 0.81, 1);
      return { sprite, tex };
    };

    // ── Central glowing core sphere ───────────────────────────────────
    const coreGeo = new THREE.SphereGeometry(1.6, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xf97316, wireframe: false, transparent: true, opacity: 0,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    scene.add(core);

    // Inner glow sprite
    const innerGlowTex = makeGlowTex("#f97316");
    const innerGlow = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: innerGlowTex, transparent: true, depthWrite: false, opacity: 0.6 })
    );
    innerGlow.scale.set(5, 5, 1);
    scene.add(innerGlow);

    // Outer glow halo
    const outerGlowTex = makeGlowTex("#fb923c", 256);
    const outerGlow = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: outerGlowTex, transparent: true, depthWrite: false, opacity: 0.25 })
    );
    outerGlow.scale.set(12, 12, 1);
    scene.add(outerGlow);

    // Orbiting rings
    const makeRing = (radius, tube, rx, ry, color, opacity) => {
      const geo = new THREE.TorusGeometry(radius, tube, 6, 120);
      const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.rotation.x = rx; mesh.rotation.y = ry;
      scene.add(mesh);
      return { mesh, geo, mat };
    };
    const ring1 = makeRing(5.8, 0.025, Math.PI / 2,    0,           0xf97316, 0.30);
    const ring2 = makeRing(6.2, 0.018, Math.PI / 3.5,  Math.PI / 4, 0xfb923c, 0.15);
    const ring3 = makeRing(6.0, 0.012, Math.PI * 0.65, Math.PI * 0.6, 0xfcd34d, 0.10);

    // ── Tech label sprites on Fibonacci sphere ────────────────────────
    const RADIUS = 5.4;
    const PHI    = Math.PI * (3 - Math.sqrt(5));
    const group  = new THREE.Group();
    const spriteMeta = [];

    TECH_ITEMS.forEach(({ label, color }, i) => {
      const y     = 1 - (i / (TECH_ITEMS.length - 1)) * 2;
      const r     = Math.sqrt(1 - y * y) * RADIUS;
      const theta = PHI * i;
      const x     = r * Math.cos(theta);
      const z     = r * Math.sin(theta);

      const { sprite, tex } = makeLabel(label, color);
      sprite.position.set(x, y * RADIUS, z);
      group.add(sprite);
      spriteMeta.push({ sprite, tex, baseY: y * RADIUS, phase: i * 0.4 });
    });
    scene.add(group);

    // Mouse tracking
    const onMove = (e) => {
      const rect = mount.getBoundingClientRect();
      mouseRef.current.x =  ((e.clientX - rect.left) / W - 0.5) * 2;
      mouseRef.current.y = -((e.clientY - rect.top)  / H - 0.5) * 2;
    };
    mount.addEventListener("mousemove", onMove);

    const onResize = () => {
      const w = mount.clientWidth, h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // ── Animate ───────────────────────────────────────────────────────
    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (reduced) { cancelAnimationFrame(animId); return; }

      const t = clock.getElapsedTime();

      // Rotate globe
      group.rotation.y  = t * 0.12;
      group.rotation.x += (mouseRef.current.y * 0.15 - group.rotation.x) * 0.04;
      group.rotation.y += (mouseRef.current.x * 0.15) * 0.04;

      // Ring orbits
      ring1.mesh.rotation.z  = t * 0.06;
      ring2.mesh.rotation.z  = -t * 0.09;
      ring3.mesh.rotation.y  = t * 0.11;

      // Inner glow pulse
      innerGlow.material.opacity = 0.45 + Math.sin(t * 1.2) * 0.15;
      const s = 1 + Math.sin(t * 0.9) * 0.06;
      innerGlow.scale.set(5 * s, 5 * s, 1);

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      mount.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      spriteMeta.forEach(({ tex }) => tex.dispose());
      innerGlowTex.dispose();
      outerGlowTex.dispose();
      coreGeo.dispose(); coreMat.dispose();
      [ring1, ring2, ring3].forEach(({ geo, mat }) => { geo.dispose(); mat.dispose(); });
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, [reduced]);

  return (
    <div
      ref={mountRef}
      className="w-full h-full"
      aria-hidden="true"
      style={{ minHeight: "460px" }}
    />
  );
};

// ── 3D Profile Photo — GSAP mouse-tracking perspective tilt ──────────
// The outer wrapper uses CSS perspective. GSAP interpolates rotateX/Y
// based on cursor position relative to the card centre on mousemove,
// and springs back elastically on mouseleave.
// A specular highlight layer moves counter to the tilt to fake a
// glossy surface reflection.
const ProfilePhoto3D = () => {
  const wrapRef      = useRef(null);
  const glareRef     = useRef(null);
  const badgeRef     = useRef(null);

  const onMove = (e) => {
    const el   = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx   = ((e.clientX - rect.left)  / rect.width  - 0.5) * 2;   // -1 → 1
    const cy   = ((e.clientY - rect.top)   / rect.height - 0.5) * 2;

    gsap.to(el, {
      rotateY:             cx * 20,
      rotateX:            -cy * 20,
      duration:            0.4,
      ease:                "power2.out",
      transformPerspective: 900,
      transformOrigin:     "center center",
    });

    // Glare follows cursor inversely
    if (glareRef.current) {
      gsap.to(glareRef.current, {
        x:        cx * -28,
        y:        cy * -28,
        opacity:  0.18 + Math.abs(cx) * 0.12 + Math.abs(cy) * 0.12,
        duration: 0.4,
        ease:     "power2.out",
      });
    }

    // Badge floats forward slightly
    if (badgeRef.current) {
      gsap.to(badgeRef.current, {
        x:        cx * -8,
        y:        cy * -8,
        duration: 0.4,
        ease:     "power2.out",
      });
    }
  };

  const onLeave = () => {
    gsap.to(wrapRef.current, {
      rotateY: 0, rotateX: 0,
      duration: 1.0,
      ease:     "elastic.out(1, 0.4)",
    });
    gsap.to(glareRef.current,  { opacity: 0, x: 0, y: 0, duration: 0.6 });
    gsap.to(badgeRef.current,  { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
  };

  return (
    <div className="sphere-wrap lg:col-span-2 flex items-center justify-center">
      <div className="relative w-full max-w-xs lg:max-w-sm mx-auto" style={{ perspective: "900px" }}>

        {/* Ambient glow behind the card */}
        <div
          className="absolute -inset-6 rounded-3xl pointer-events-none"
          style={{
            background:  "radial-gradient(ellipse 80% 80% at 50% 60%, rgba(249,115,22,0.28) 0%, transparent 70%)",
            filter:      "blur(18px)",
          }}
        />

        {/* 3D tilt card */}
        <div
          ref={wrapRef}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          className="relative rounded-2xl overflow-hidden cursor-none select-none"
          style={{
            transformStyle: "preserve-3d",
            willChange:     "transform",
            boxShadow:
              "0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(249,115,22,0.18), 0 8px 32px rgba(249,115,22,0.12)",
          }}
        >
          {/* Photo */}
          <img
            src="/profile.jpg"
            alt="Dharaneesh R"
            draggable={false}
            className="w-full block object-cover object-top"
            style={{ aspectRatio: "3/4", minHeight: "340px", display: "block" }}
          />

          {/* Gradient overlay — bottom fade */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, rgba(5,5,5,0.92) 0%, rgba(5,5,5,0.30) 40%, transparent 70%)",
            }}
          />

          {/* Specular glare layer */}
          <div
            ref={glareRef}
            className="absolute inset-0 pointer-events-none rounded-2xl opacity-0"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 50% 30%, rgba(255,255,255,0.22) 0%, transparent 70%)",
              mixBlendMode: "screen",
            }}
          />

          {/* Name tag — translateZ lifts it above the photo */}
          <div
            className="absolute bottom-5 left-5 right-5 pointer-events-none"
            style={{ transform: "translateZ(30px)" }}
          >
            <p className="font-mono text-[9px] tracking-[0.32em] text-primary-400/80 uppercase mb-1">
              Full Stack Developer
            </p>
            <p className="font-heading font-black text-white text-base sm:text-lg tracking-wide leading-tight">
              Dharaneesh R
            </p>
          </div>

          {/* Top-right experience tag */}
          <div
            className="absolute top-4 right-4 px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-sm border border-primary-500/30 pointer-events-none"
            style={{ transform: "translateZ(20px)" }}
          >
            <p className="font-mono text-[9px] tracking-widest text-primary-400 uppercase">1yr+ exp</p>
          </div>
        </div>

        {/* Available badge — floats above the card via ref */}
        <div
          ref={badgeRef}
          className="absolute -top-3.5 left-5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-dark-900/95 border border-green-500/40 shadow-xl"
          style={{ backdropFilter: "blur(8px)" }}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
          </span>
          <span className="text-green-400 font-mono text-[9px] tracking-widest uppercase">Available for work</span>
        </div>

        {/* Corner brackets */}
        {[
          "top-0 left-0 border-t-2 border-l-2 rounded-tl-lg",
          "top-0 right-0 border-t-2 border-r-2 rounded-tr-lg",
          "bottom-0 left-0 border-b-2 border-l-2 rounded-bl-lg",
          "bottom-0 right-0 border-b-2 border-r-2 rounded-br-lg",
        ].map((cls, i) => (
          <div
            key={i}
            className={`absolute w-7 h-7 border-primary-500/60 pointer-events-none ${cls}`}
            style={{ transform: "translateZ(8px)" }}
          />
        ))}
      </div>
    </div>
  );
};

// ── Animated stat counter ─────────────────────────────────────────────
const StatCounter = ({ value, label, suffix = "" }) => {
  const elRef  = useRef(null);
  const numRef = useRef(null);

  useEffect(() => {
    const trigger = elRef.current;
    const display = numRef.current;
    if (!trigger || !display) return;

    const numeric = parseFloat(value);
    const obj = { val: 0 };

    const st = ScrollTrigger.create({
      trigger,
      start: "top 88%",
      once:  true,
      onEnter: () => {
        gsap.to(obj, {
          val:      numeric,
          duration: 1.8,
          ease:     "power2.out",
          snap:     { val: 1 },
          onUpdate: () => {
            display.textContent = Math.ceil(obj.val) + suffix;
          },
        });
      },
    });

    return () => st.kill();
  }, [value, suffix]);

  return (
    <div ref={elRef} className="text-center sm:text-left">
      <p className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-primary-500 leading-none mb-1">
        <span ref={numRef}>0</span>
      </p>
      <p className="text-white/40 font-mono text-[10px] sm:text-xs tracking-[0.25em] uppercase">{label}</p>
    </div>
  );
};

// ── Scramble heading — GSAP char randomiser on scroll entry ───────────
const ScrambleHeading = ({ children, className = "", delay = 0 }) => {
  const elRef  = useRef(null);
  const chars  = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#@!$";
  const TICK   = 36;
  const DUR_MS = 400;
  const STAG   = 45;

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    const original = el.textContent;

    const run = () => {
      const now   = Date.now();
      const starts = original.split("").map((_, i) => now + i * STAG + delay);
      const settled = original.split("").map(() => false);

      const iv = setInterval(() => {
        const t = Date.now();
        let all = true;
        const result = original.split("").map((ch, i) => {
          if (ch === " ") return " ";
          if (settled[i]) return ch;
          if (t < starts[i]) { all = false; return ch; }
          const elapsed = t - starts[i];
          if (elapsed >= DUR_MS) { settled[i] = true; return ch; }
          all = false;
          return chars[Math.floor(Math.random() * chars.length)];
        });
        el.textContent = result.join("");
        if (all) clearInterval(iv);
      }, TICK);

      return iv;
    };

    let iv;
    const st = ScrollTrigger.create({
      trigger: el,
      start:   "top 88%",
      once:    true,
      onEnter: () => { iv = run(); },
    });

    return () => { st.kill(); clearInterval(iv); };
  }, []);

  return (
    <h2 ref={elRef} className={className}>
      {children}
    </h2>
  );
};

// ════════════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ════════════════════════════════════════════════════════════════════
const AboutMe = () => {
  const pageRef = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const ctx = gsap.context(() => {

      // ── 1. Hero display text ──────────────────────────────────────
      gsap.from(".about-hero-line", {
        clipPath: "inset(0 0 100% 0)",
        y:        80,
        opacity:  0,
        stagger:  0.18,
        duration: reduced ? 0 : DUR.xl,
        ease:     EASE.snap,
        delay:    0.1,
      });
      gsap.from(".about-hero-sub", {
        opacity:  0,
        y:        24,
        duration: reduced ? 0 : DUR.md,
        ease:     EASE.out,
        delay:    0.7,
      });

      // ── 2. Identity bio lines ─────────────────────────────────────
      gsap.utils.toArray(".bio-line").forEach((el, i) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
          clipPath: "inset(0 100% 0 0)",
          opacity:  0,
          duration: reduced ? 0 : 0.75,
          delay:    i * 0.06,
          ease:     EASE.cinematic,
        });
      });

      // ── 3. Globe fade / scale ─────────────────────────────────────
      gsap.from(".sphere-wrap", {
        scrollTrigger: { trigger: ".identity-section", start: "top 78%", once: true },
        opacity:  0,
        scale:    0.8,
        rotateY:  -15,
        duration: reduced ? 0 : DUR.xl,
        ease:     EASE.snap,
      });

      // ── 4. Experience timeline line draw ──────────────────────────
      gsap.from(".exp-timeline-line", {
        scrollTrigger: { trigger: ".exp-section", start: "top 78%", once: true },
        scaleY:   0,
        transformOrigin: "top center",
        duration: reduced ? 0 : 1.4,
        ease:     EASE.cinematic,
      });

      // ── 5. Experience cards — alternating slide ───────────────────
      gsap.utils.toArray(".exp-card").forEach((el, i) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
          opacity: 0,
          x:       i % 2 === 0 ? -60 : 60,
          y:       40,
          duration: reduced ? 0 : DUR.lg,
          delay:   i * 0.12,
          ease:    EASE.out,
        });
      });

      // ── 7. Education cards ────────────────────────────────────────
      gsap.utils.toArray(".edu-card").forEach((el, i) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
          opacity: 0,
          x:       i % 2 === 0 ? -70 : 70,
          duration: reduced ? 0 : DUR.lg,
          ease:    EASE.out,
        });
      });

      // ── 8. Highlight cards ────────────────────────────────────────
      gsap.utils.toArray(".highlight-card").forEach((el, i) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
          opacity: 0,
          scale:   0.72,
          y:       24,
          duration: reduced ? 0 : 0.55,
          delay:   i * 0.08,
          ease:    EASE.snap,
        });
      });

      // ── 9. Resume CTA block ───────────────────────────────────────
      gsap.from(".resume-cta-block", {
        scrollTrigger: { trigger: ".resume-cta-block", start: "top 85%", once: true },
        opacity: 0,
        y:       60,
        duration: reduced ? 0 : DUR.lg,
        ease:    EASE.out,
      });

      // ── 10. Ambient orb parallax ──────────────────────────────────
      gsap.to(".about-orb", {
        scrollTrigger: {
          trigger: pageRef.current,
          start:   "top top",
          end:     "bottom bottom",
          scrub:   2.5,
        },
        y: -200, ease: "none",
      });

      // ── 11. Floating glow orb behind experience section ───────────
      gsap.to(".exp-orb", {
        scrollTrigger: {
          trigger: ".exp-section",
          start:   "top bottom",
          end:     "bottom top",
          scrub:   1.5,
        },
        y: -100, x: 40, ease: "none",
      });

    }, pageRef);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <div ref={pageRef} className="min-h-screen bg-dark-900 relative overflow-x-hidden">
      <SEO 
        title="About Me | Dharaneesh R" 
        description="Learn more about Dharaneesh R's background, skills, and experience as a Full-Stack developer." 
      />
      {/* ── Background decoration ──────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="about-orb absolute top-40 -left-20 w-[600px] h-[600px] rounded-full bg-primary-500/5 blur-[140px]" />
        <div className="absolute bottom-1/3 right-0 w-[450px] h-[450px] rounded-full bg-primary-600/4 blur-[110px]" />
        <div className="absolute inset-0 opacity-[0.022]"
          style={{
            backgroundImage: "linear-gradient(#f97316 1px,transparent 1px),linear-gradient(90deg,#f97316 1px,transparent 1px)",
            backgroundSize:  "70px 70px",
          }} />
      </div>

      {/* ════════════════════════════════════════════════════════════
          SECTION 1 — HERO
      ════════════════════════════════════════════════════════════ */}
      <section className="pt-24 pb-12 sm:pt-28 sm:pb-16 px-6 sm:px-10 lg:px-20 xl:px-28">
        <div className="max-w-7xl mx-auto">

          <p className="about-hero-sub font-mono text-[10px] sm:text-xs tracking-[0.35em] text-primary-500/60 uppercase mb-6">
            — About Me
          </p>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 lg:gap-12">
            <div className="shrink-0">
              <h1
                className="about-hero-line font-heading font-black uppercase leading-[0.88] tracking-tighter text-white whitespace-nowrap"
                style={{ fontSize: "clamp(52px, 9vw, 130px)" }}
              >
                ABOUT
              </h1>
              <h1
                className="about-hero-line font-heading font-black uppercase leading-[0.88] tracking-tighter whitespace-nowrap"
                style={{
                  fontSize:         "clamp(52px, 9vw, 130px)",
                  WebkitTextStroke: "clamp(1.5px, 0.18vw, 3px) #f97316",
                  color:            "transparent",
                }}
              >
                ME.
              </h1>
            </div>

            <div className="lg:pb-2 lg:max-w-md">
              <p className="about-hero-sub text-white/45 text-sm sm:text-base leading-relaxed mb-5">
                Full-Stack Developer specialising in MERN, AWS &amp; Docker —
                crafting enterprise-grade SaaS platforms that scale.
              </p>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
                </span>
                <span className="text-green-400 font-mono text-xs tracking-widest uppercase">
                  Available for work
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 h-px bg-gradient-to-r from-primary-500/50 via-primary-400/15 to-transparent" />

          {/* Stats */}
          <div className="about-hero-sub mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {[
              { value: "1",   suffix: "yr+", label: "Experience" },
              { value: "15",  suffix: "+",   label: "Projects"   },
              { value: "2",   suffix: "",    label: "Companies"  },
              { value: "100", suffix: "%",   label: "Dedicated"  },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-white/6 bg-white/[0.02] px-4 py-3 sm:px-5 sm:py-4">
                <StatCounter value={s.value} suffix={s.suffix} label={s.label} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SECTION 2 — IDENTITY (3D Tech Globe + Bio)
      ════════════════════════════════════════════════════════════ */}
      <section className="identity-section py-16 sm:py-24 px-6 sm:px-10 lg:px-20 xl:px-28">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16 items-center">

            {/* ── 3D Profile Photo ──────────────────────────────────── */}
            <ProfilePhoto3D />

            {/* ── Bio ───────────────────────────────────────────────── */}
            <div className="lg:col-span-3 space-y-8">
              <div>
                <p className="bio-line font-mono text-[10px] tracking-[0.35em] text-white/30 uppercase mb-3">
                  — Identity
                </p>
                <h2 className="bio-line font-heading font-black text-3xl sm:text-4xl md:text-5xl text-white mb-2 tracking-tight">
                  {personalInfo.fullName}
                </h2>
                <p className="bio-line text-primary-500 font-semibold text-base sm:text-lg tracking-wide flex items-center gap-2">
                  <FaCode className="opacity-70" /> {personalInfo.role}
                </p>
              </div>

              <div className="bio-line h-px bg-gradient-to-r from-primary-500/40 to-transparent" />

              <div className="space-y-3">
                {personalInfo.bio.long.slice(0, 3).map((para, i) => (
                  <p key={i} className="bio-line text-white/60 text-sm sm:text-base leading-relaxed">
                    {para}
                  </p>
                ))}
              </div>

              <div className="bio-line flex flex-wrap gap-x-6 gap-y-2 text-xs sm:text-sm text-white/40 font-mono">
                <span className="flex items-center gap-1.5">
                  <FaMapMarkerAlt className="text-primary-500" />
                  {personalInfo.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <FaEnvelope className="text-primary-500" />
                  {personalInfo.email}
                </span>
              </div>

              <div className="bio-line flex items-center gap-3">
                {[
                  { href: personalInfo.socialLinks[0].url, icon: FaGithub,   label: "GitHub"   },
                  { href: personalInfo.socialLinks[1].url, icon: FaLinkedin, label: "LinkedIn" },
                  { href: `mailto:${personalInfo.email}`,  icon: FaEnvelope, label: "Email"    },
                ].map((s) => (
                  <SocialIcon
                    key={s.label}
                    href={s.href}
                    icon={s.icon}
                    label={s.label}
                    external={s.href.startsWith("http")}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SECTION 3 — PROFESSIONAL JOURNEY
      ════════════════════════════════════════════════════════════ */}
      <section className="exp-section py-16 sm:py-24 px-6 sm:px-10 lg:px-20 xl:px-28 relative">

        {/* floating orb behind this section */}
        <div className="exp-orb pointer-events-none absolute -right-40 top-1/3 w-[500px] h-[500px] rounded-full bg-primary-500/5 blur-[120px] -z-10" />

        <div className="max-w-7xl mx-auto">

          {/* Section heading — scramble on scroll */}
          <div className="flex items-end gap-6 mb-14 sm:mb-20">
            <div>
              <p className="font-mono text-[10px] tracking-[0.35em] text-primary-500/60 uppercase mb-2">— 02</p>
              <ScrambleHeading
                className="font-heading font-black text-3xl sm:text-4xl md:text-5xl text-white tracking-tight"
              >
                Professional Journey
              </ScrambleHeading>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-primary-500/30 to-transparent mb-3" />
          </div>

          {/* Timeline + cards */}
          <div className="relative">
            {/* Animated vertical timeline line */}
            <div
              className="exp-timeline-line hidden lg:block absolute left-7 top-0 bottom-0 w-px origin-top"
              style={{ background: "linear-gradient(to bottom, #f97316, #f9731640, transparent)" }}
            />

            <div className="space-y-8 sm:space-y-10 lg:pl-20">
              {experiences.map((exp, i) => (
                <div
                  key={exp.id}
                  className="exp-card group relative rounded-2xl border border-white/6 bg-white/[0.02] hover:bg-white/[0.04] hover:border-primary-500/20 transition-all duration-500 overflow-hidden"
                >
                  {/* Timeline dot */}
                  <div className="hidden lg:flex absolute -left-[3.15rem] top-10 w-4 h-4 rounded-full border-2 border-primary-500 bg-dark-900 items-center justify-center z-10">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                  </div>

                  {/* Large index number — decorative */}
                  <div
                    className="pointer-events-none absolute -right-4 top-1/2 -translate-y-1/2 font-heading font-black leading-none select-none"
                    style={{
                      fontSize:         "clamp(100px, 16vw, 220px)",
                      color:            "transparent",
                      WebkitTextStroke: "1px rgba(249,115,22,0.07)",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>

                  <div className="relative z-10 p-6 sm:p-8 lg:p-10">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 md:gap-8 mb-8">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3 flex-wrap">
                          <span className="font-mono text-[10px] tracking-[0.3em] text-primary-500/60 uppercase">
                            {String(i + 1).padStart(2, "0")} / {String(experiences.length).padStart(2, "0")}
                          </span>
                          {exp.current && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/12 border border-green-500/30 text-green-400 font-mono text-[9px] tracking-widest uppercase">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                              Current
                            </span>
                          )}
                        </div>
                        <h3 className="font-heading font-black text-2xl sm:text-3xl lg:text-4xl text-white mb-2 tracking-tight group-hover:text-primary-300 transition-colors duration-300">
                          {exp.company}
                        </h3>
                        <p className="text-primary-500 font-semibold text-base sm:text-lg tracking-wide">
                          {exp.role}
                        </p>
                        {exp.client && (
                          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary-500/10 border border-primary-500/20">
                            <span className="text-primary-400/60 text-[9px] font-mono tracking-widest uppercase">Client</span>
                            <span className="text-primary-300 font-semibold text-xs sm:text-sm">{exp.client}</span>
                          </div>
                        )}
                      </div>
                      <div className="shrink-0 space-y-2 md:text-right">
                        <p className="flex items-center gap-2 md:justify-end text-sm text-white/70 font-medium">
                          <FaCalendarAlt className="text-primary-500 text-xs" />
                          {exp.duration}
                        </p>
                        <p className="flex items-center gap-2 md:justify-end text-sm text-white/40">
                          <FaMapMarkerAlt className="text-primary-500 text-xs" />
                          {exp.location}
                        </p>
                      </div>
                    </div>

                    <p className="text-white/50 text-sm sm:text-base leading-relaxed mb-8 max-w-3xl">
                      {exp.description}
                    </p>

                    {/* Two-column responsibilities + achievements */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                      <div>
                        <h4 className="flex items-center gap-2 text-white font-semibold text-sm mb-4 pb-2 border-b border-white/6">
                          <span className="w-3 h-px bg-primary-500" />
                          Key Responsibilities
                        </h4>
                        <ul className="space-y-2">
                          {exp.responsibilities.slice(0, 5).map((r, idx) => (
                            <li key={idx} className="flex items-start gap-2.5 text-white/50 text-xs sm:text-sm">
                              <span className="text-primary-500 mt-1 text-xs flex-shrink-0">▸</span>
                              {r}
                            </li>
                          ))}
                        </ul>
                      </div>
                      {exp.achievements?.length > 0 && (
                        <div>
                          <h4 className="flex items-center gap-2 text-white font-semibold text-sm mb-4 pb-2 border-b border-white/6">
                            <span className="w-3 h-px bg-green-500" />
                            <FaAward className="text-green-400 text-xs" />
                            Key Achievements
                          </h4>
                          <ul className="space-y-2">
                            {exp.achievements.map((a, idx) => (
                              <li key={idx} className="flex items-start gap-2.5 text-white/50 text-xs sm:text-sm">
                                <span className="text-green-400 mt-0.5 flex-shrink-0">✓</span>
                                {a}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* 3D Tech chips */}
                    <div>
                      <h4 className="font-mono text-[9px] tracking-[0.3em] text-white/40 uppercase mb-3">Stack</h4>
                      <div className="flex flex-wrap gap-2 sm:gap-2.5">
                        {exp.technologies.map((tech, idx) => (
                          <TechChip3D key={idx} name={tech} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SECTION 4 — ACADEMIC PATH
      ════════════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 px-6 sm:px-10 lg:px-20 xl:px-28">
        <div className="max-w-7xl mx-auto">

          <div className="flex items-end gap-6 mb-14 sm:mb-20">
            <div>
              <p className="font-mono text-[10px] tracking-[0.35em] text-primary-500/60 uppercase mb-2">— 03</p>
              <ScrambleHeading
                className="font-heading font-black text-3xl sm:text-4xl md:text-5xl text-white tracking-tight"
                delay={200}
              >
                Academic Path
              </ScrambleHeading>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-primary-500/30 to-transparent mb-3" />
          </div>

          <div className="space-y-8 sm:space-y-10">
            {education.map((edu, i) => (
              <div key={edu.id} className={`edu-card relative group ${i % 2 !== 0 ? "lg:ml-24" : ""}`}>
                <div
                  className="pointer-events-none absolute -left-2 sm:-left-4 top-1/2 -translate-y-1/2 font-heading font-black select-none leading-none"
                  style={{
                    fontSize: "clamp(80px, 15vw, 180px)",
                    color: "transparent",
                    WebkitTextStroke: "1px rgba(249,115,22,0.10)",
                  }}
                >
                  {edu.startYear}
                </div>

                <div className="relative z-10 rounded-2xl border border-white/6 bg-white/[0.02] hover:bg-white/[0.04] hover:border-primary-500/20 transition-all duration-500 p-6 sm:p-8 lg:p-10 ml-16 sm:ml-20 lg:ml-28">
                  <div className="flex items-center gap-3 flex-wrap mb-4">
                    <span className={`px-3 py-1 rounded-full font-mono text-[9px] tracking-widest uppercase border ${
                      edu.status.includes("Pursuing")
                        ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                        : "bg-green-500/10 text-green-400 border-green-500/30"
                    }`}>
                      {edu.status}
                    </span>
                    <span className="text-white/25 font-mono text-xs">{edu.startYear} – {edu.endYear}</span>
                  </div>

                  <h3 className="font-heading font-bold text-xl sm:text-2xl lg:text-3xl text-white mb-1 group-hover:text-primary-300 transition-colors duration-300">
                    {edu.degree}
                  </h3>
                  <p className="text-primary-500 font-semibold text-sm sm:text-base mb-1 flex items-center gap-2 flex-wrap">
                    <FaGraduationCap className="text-xs opacity-70" />
                    {edu.institution}
                  </p>
                  <p className="text-white/30 text-xs sm:text-sm mb-5 flex items-center gap-1.5">
                    <FaMapMarkerAlt className="text-primary-500/60 text-xs" />
                    {edu.location}
                  </p>

                  <p className="text-white/45 text-sm sm:text-base leading-relaxed mb-6">{edu.description}</p>

                  {edu.coursework?.length > 0 && (
                    <div>
                      <p className="font-mono text-[9px] tracking-[0.3em] text-white/25 uppercase mb-3">Coursework</p>
                      <div className="flex flex-wrap gap-1.5">
                        {edu.coursework.map((c, idx) => (
                          <span key={idx} className="px-2.5 py-1 text-[10px] sm:text-xs font-mono text-white/40 bg-white/4 border border-white/8 rounded hover:border-primary-500/30 hover:text-primary-400 transition-all">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SECTION 5 — CAREER HIGHLIGHTS
      ════════════════════════════════════════════════════════════ */}
      <section className="highlights-section py-16 sm:py-20 px-6 sm:px-10 lg:px-20 xl:px-28">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end gap-6 mb-10 sm:mb-14">
            <div>
              <p className="font-mono text-[10px] tracking-[0.35em] text-primary-500/60 uppercase mb-2">— 04</p>
              <ScrambleHeading
                className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight"
                delay={100}
              >
                Career Highlights
              </ScrambleHeading>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-primary-500/30 to-transparent mb-3" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5">
            {personalInfo.highlights.map((h, i) => (
              <MagneticWrapper key={i} strength={0.2}>
                <div className="highlight-card h-full rounded-xl border border-white/6 bg-white/[0.02] hover:bg-primary-500/6 hover:border-primary-500/25 transition-all duration-400 p-5 sm:p-6 group cursor-default">
                  <div className="text-2xl sm:text-3xl mb-3 group-hover:scale-110 transition-transform duration-300 select-none">
                    {["🚀", "💼", "☁️", "🏗️", "⚡"][i] ?? "✦"}
                  </div>
                  <p className="text-white/65 text-xs sm:text-sm leading-snug font-medium group-hover:text-white/90 transition-colors duration-300">
                    {h}
                  </p>
                </div>
              </MagneticWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SECTION 6 — RESUME CTA
      ════════════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 px-6 sm:px-10 lg:px-20 xl:px-28">
        <div className="max-w-7xl mx-auto">
          <div className="resume-cta-block relative rounded-2xl border border-primary-500/15 bg-gradient-to-br from-primary-500/6 via-transparent to-primary-600/4 p-8 sm:p-12 lg:p-16 overflow-hidden">
            <div
              className="pointer-events-none absolute inset-0 flex items-center justify-center select-none"
              style={{
                fontSize: "clamp(60px, 18vw, 220px)",
                fontWeight: 900,
                fontFamily: "Poppins, sans-serif",
                color: "transparent",
                WebkitTextStroke: "1px rgba(249,115,22,0.06)",
                lineHeight: 1,
                letterSpacing: "-0.05em",
              }}
            >
              RESUME
            </div>

            <div className="relative z-10 text-center">
              <p className="font-mono text-[10px] tracking-[0.35em] text-primary-500/60 uppercase mb-4">— Download</p>
              <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-white mb-4 tracking-tight">
                Want to know more?
              </h2>
              <p className="text-white/40 text-sm sm:text-base max-w-md mx-auto mb-10 leading-relaxed">
                Download my resume for a comprehensive overview of my experience, skills, and accomplishments.
              </p>

              <MagneticWrapper strength={0.25}>
                <GsapButton
                  as="a"
                  href={personalInfo.resume?.url ?? "#"}
                  download={personalInfo.resume?.filename}
                  variant="solid"
                  className="px-8 sm:px-12 py-4 sm:py-5 rounded-full font-heading font-bold text-sm sm:text-base hover:shadow-[0_0_60px_rgba(249,115,22,0.5)]"
                >
                  <FaDownload className="text-sm" />
                  Download Resume
                </GsapButton>
              </MagneticWrapper>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutMe;
