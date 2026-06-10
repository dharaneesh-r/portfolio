import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  FaGithub, FaExternalLinkAlt, FaClock, FaUsers,
  FaStar, FaChartLine, FaTimes,
} from "react-icons/fa";
import { projects, projectCategories } from "../data/projects";
import { useReducedMotion } from "../context/ReducedMotionContext";
import GsapButton from "./ui/GsapButton";
import { EASE, DUR } from "../motion/tokens";

// gsap.registerPlugin called once in main.jsx

// ── Scramble heading — GSAP char randomiser on scroll entry ──────────
const ScrambleHeading = ({ children, className = "", delay = 0 }) => {
  const elRef = useRef(null);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#@!$";

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    const original = el.textContent;
    const TICK = 36, DUR_MS = 400, STAG = 45;

    const run = () => {
      const now = Date.now();
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
      start: "top 88%",
      once: true,
      onEnter: () => { iv = run(); },
    });

    return () => { st.kill(); clearInterval(iv); };
  }, []);

  return <h2 ref={elRef} className={className}>{children}</h2>;
};

// ── Tech icon metadata ─────────────────────────────────────────────────
const TECH_META = {
  "Next.js":    { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",      color: "#e2e8f0", invert: true },
  "Node.js":    { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",      color: "#68a063" },
  "Express.js": { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",    color: "#aaa",    invert: true },
  "MongoDB":    { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",    color: "#4db33d" },
  "TailwindCSS":{ icon: "https://cdn.simpleicons.org/tailwindcss/38bdf8",                                      color: "#38bdf8" },
  "Firebase":   { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg",     color: "#ffca28" },
  "React.js":   { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",        color: "#61dafb" },
  "React":      { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",        color: "#61dafb" },
  "TypeScript": { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg", color: "#3178c6" },
  "GSAP":       { icon: null,                                                                                   color: "#88ce02" },
  "CoinGecko API": { icon: null,                                                                                color: "#8dc63f" },
};

// ── 3D tilting tech chip ───────────────────────────────────────────────
const TechChip3D = ({ name }) => {
  const ref = useRef(null);
  const meta = TECH_META[name] ?? { color: "#f97316", icon: null };
  const [imgErr, setImgErr] = useState(false);

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const cy = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    gsap.to(el, {
      rotateY: cx * 18, rotateX: -cy * 18, scale: 1.1,
      duration: 0.25, ease: "power2.out", transformPerspective: 500,
    });
  };

  const onLeave = () =>
    gsap.to(ref.current, { rotateY: 0, rotateX: 0, scale: 1, duration: 0.6, ease: "elastic.out(1, 0.45)" });

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onMouseEnter={onMove}
      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border cursor-default select-none"
      style={{
        borderColor: meta.color + "50",
        backgroundColor: meta.color + "0d",
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
    >
      {meta.icon && !imgErr ? (
        <img
          src={meta.icon} alt={name}
          onError={() => setImgErr(true)}
          className="w-3.5 h-3.5 object-contain flex-shrink-0"
          style={{ filter: meta.invert ? "invert(1) brightness(0.85)" : "none" }}
        />
      ) : (
        <span
          className="w-3.5 h-3.5 rounded-sm flex items-center justify-center text-[7px] font-black flex-shrink-0"
          style={{ backgroundColor: meta.color + "30", color: meta.color }}
        >
          {name[0]}
        </span>
      )}
      <span className="text-[10px] sm:text-xs font-mono font-semibold tracking-wide" style={{ color: meta.color }}>
        {name}
      </span>
    </div>
  );
};

// ── Gradient palettes for card thumbnails ─────────────────────────────
const CARD_GRADIENTS = [
  "from-orange-500/25 via-red-500/15 to-pink-500/10",
  "from-blue-500/25 via-cyan-500/15 to-teal-500/10",
  "from-violet-500/25 via-purple-500/15 to-indigo-500/10",
  "from-green-500/25 via-emerald-500/15 to-teal-500/10",
  "from-yellow-500/25 via-orange-500/15 to-red-500/10",
  "from-pink-500/25 via-rose-500/15 to-red-500/10",
];

// ── 3D tilt project card ───────────────────────────────────────────────
const ProjectCard3D = ({ project, index, onOpen }) => {
  const ref = useRef(null);
  const gradient = CARD_GRADIENTS[index % CARD_GRADIENTS.length];
  const visibleStack = project.techStack.slice(0, 4);
  const extraCount = project.techStack.length - 4;

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const cy = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    gsap.to(el, {
      rotateY: cx * 10, rotateX: -cy * 10, scale: 1.02,
      duration: 0.3, ease: "power2.out", transformPerspective: 800,
    });
  };

  const onLeave = () =>
    gsap.to(ref.current, { rotateY: 0, rotateX: 0, scale: 1, duration: 0.7, ease: "elastic.out(1, 0.4)" });

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="proj-card group relative flex flex-col rounded-2xl border border-white/8 bg-white/[0.02] hover:border-primary-500/30 hover:bg-white/[0.04] overflow-hidden transition-colors duration-500"
      style={{ transformStyle: "preserve-3d", willChange: "transform" }}
    >
      {/* Featured badge */}
      {project.featured && (
        <div className="absolute top-3 right-3 z-20 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-500/90 text-white font-mono text-[9px] tracking-widest uppercase shadow-lg">
          <FaStar className="text-[8px]" /> Featured
        </div>
      )}

      {/* Thumbnail */}
      <div className={`relative h-44 sm:h-48 bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden`}>
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "linear-gradient(#f97316 1px, transparent 1px), linear-gradient(90deg, #f97316 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* Large project number */}
        <span
          className="pointer-events-none select-none font-heading font-black leading-none"
          style={{
            fontSize: "clamp(80px, 14vw, 140px)",
            color: "transparent",
            WebkitTextStroke: "1.5px rgba(249,115,22,0.35)",
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        {/* Category badge */}
        <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-dark-900/70 backdrop-blur-sm border border-white/10 text-white/70 font-mono text-[9px] tracking-widest uppercase">
          {project.category}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col p-5 sm:p-6">
        <h3 className="font-heading font-black text-xl sm:text-2xl text-white mb-1 tracking-tight group-hover:text-primary-300 transition-colors duration-300 line-clamp-1">
          {project.title}
        </h3>
        <p className="text-primary-500 font-mono text-xs tracking-wide mb-3 line-clamp-1">
          {project.tagline}
        </p>
        <p className="text-white/45 text-sm leading-relaxed mb-4 line-clamp-2 flex-1">
          {project.description}
        </p>

        {/* Tech chips */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {visibleStack.map((tech, i) => (
            <TechChip3D key={i} name={tech.name} />
          ))}
          {extraCount > 0 && (
            <div
              className="inline-flex items-center px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/5 cursor-default select-none"
            >
              <span className="text-[10px] sm:text-xs font-mono font-semibold text-white/40">+{extraCount}</span>
            </div>
          )}
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-4 mb-4 text-xs text-white/30 font-mono">
          <span className="flex items-center gap-1.5">
            <FaClock className="text-primary-500/60" />
            {project.duration}
          </span>
          {project.results?.users && (
            <span className="flex items-center gap-1.5">
              <FaUsers className="text-primary-500/60" />
              {project.results.users}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {project.links.live && (
            <GsapButton
              as="a"
              href={project.links.live}
              target="_blank"
              rel="noopener noreferrer"
              variant="solid"
              icon={<FaExternalLinkAlt className="text-[10px]" />}
              className="flex-1 px-4 py-2.5 text-xs font-mono font-bold tracking-widest uppercase rounded-xl hover:shadow-[0_0_30px_rgba(249,115,22,0.4)]"
            >
              Live
            </GsapButton>
          )}
          <GsapButton
            as="button"
            onClick={() => onOpen(project)}
            variant="ghost"
            className="px-4 py-2.5 rounded-xl text-xs font-mono font-bold tracking-widest uppercase"
          >
            Details
          </GsapButton>
        </div>
      </div>
    </div>
  );
};

// ── Modal ──────────────────────────────────────────────────────────────
const ProjectModal = ({ project, onClose }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.94, y: 40 },
        { opacity: 1, scale: 1, y: 0, duration: 0.45, ease: "back.out(1.4)" }
      );
    }
    // Prevent scroll
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleClose = () => {
    if (modalRef.current) {
      gsap.to(modalRef.current, {
        opacity: 0, scale: 0.95, y: 20,
        duration: 0.25, ease: "power2.in",
        onComplete: onClose,
      });
    } else {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6"
      onClick={handleClose}
    >
      <div
        ref={modalRef}
        className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-dark-900"
        style={{ boxShadow: "0 40px 120px rgba(0,0,0,0.8), 0 0 0 1px rgba(249,115,22,0.12)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between p-6 sm:p-8 bg-dark-900/95 backdrop-blur-sm border-b border-white/6">
          <div>
            <p className="font-mono text-[9px] tracking-[0.35em] text-primary-500/60 uppercase mb-2">
              — Project Details
            </p>
            <h2 className="font-heading font-black text-2xl sm:text-3xl md:text-4xl text-white tracking-tight">
              {project.title}
            </h2>
            <p className="text-primary-500 font-mono text-sm tracking-wide mt-1">{project.tagline}</p>
          </div>
          <button
            onClick={handleClose}
            className="flex-shrink-0 ml-4 w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all duration-200"
          >
            <FaTimes />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          {/* Description */}
          <p className="text-white/55 text-sm sm:text-base leading-relaxed">{project.description}</p>

          {/* Problem / Solution */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-red-400" />
                <h3 className="text-white font-heading font-bold text-sm tracking-wide uppercase">Problem</h3>
              </div>
              <p className="text-white/45 text-xs sm:text-sm leading-relaxed">{project.problem}</p>
            </div>
            <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-green-400" />
                <h3 className="text-white font-heading font-bold text-sm tracking-wide uppercase">Solution</h3>
              </div>
              <p className="text-white/45 text-xs sm:text-sm leading-relaxed">{project.solution}</p>
            </div>
          </div>

          {/* Features */}
          {project.features?.length > 0 && (
            <div>
              <p className="font-mono text-[9px] tracking-[0.35em] text-white/30 uppercase mb-4">— Key Features</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {project.features.map((f, i) => (
                  <div key={i} className="flex items-start gap-3 text-white/50 text-xs sm:text-sm">
                    <span className="text-primary-500 mt-0.5 flex-shrink-0">▸</span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tech stack */}
          <div>
            <p className="font-mono text-[9px] tracking-[0.35em] text-white/30 uppercase mb-4">— Technologies Used</p>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((t, i) => (
                <TechChip3D key={i} name={t.name} />
              ))}
            </div>
          </div>

          {/* Results metrics */}
          {project.results?.metrics?.length > 0 && (
            <div>
              <p className="font-mono text-[9px] tracking-[0.35em] text-white/30 uppercase mb-4 flex items-center gap-2">
                <FaChartLine className="text-primary-500" /> — Results & Impact
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {project.results.metrics.map((m, i) => (
                  <div key={i} className="rounded-xl border border-white/6 bg-white/[0.02] p-4 text-center">
                    <div className="font-heading font-black text-2xl sm:text-3xl text-primary-500 mb-1">{m.value}</div>
                    <div className="text-white/35 text-xs font-mono">{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            {project.links.live && (
              <GsapButton
                as="a"
                href={project.links.live}
                target="_blank"
                rel="noopener noreferrer"
                variant="solid"
                className="flex-1 px-6 py-3.5 font-mono font-bold text-xs tracking-widest uppercase rounded-xl hover:shadow-[0_0_50px_rgba(249,115,22,0.45)]"
              >
                <FaExternalLinkAlt className="text-[10px]" /> View Live Project
              </GsapButton>
            )}
            {project.links.github && (
              <GsapButton
                as="a"
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                variant="outline"
                className="px-6 py-3.5 font-mono font-bold text-xs tracking-widest uppercase rounded-xl"
              >
                <FaGithub /> View Code
              </GsapButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ════════════════════════════════════════════════════════════════════
const Projects = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState(null);
  const pageRef = useRef(null);
  const gridRef = useRef(null);
  const reduced = useReducedMotion();

  const filteredProjects =
    selectedCategory === "All"
      ? projects
      : projects.filter((p) => p.category === selectedCategory);

  const featuredCount = projects.filter((p) => p.featured).length;
  const allCategories = ["All", ...projectCategories];

  // ── Page entrance animations ────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero lines clip-path reveal
      gsap.from(".proj-hero-line", {
        clipPath: "inset(0 0 100% 0)",
        y: 80,
        opacity: 0,
        stagger: 0.18,
        duration: reduced ? 0 : DUR.xl,
        ease: EASE.snap,
        delay: 0.1,
      });
      gsap.from(".proj-hero-sub", {
        opacity: 0,
        y: 24,
        duration: reduced ? 0 : DUR.md,
        ease: EASE.out,
        delay: 0.7,
      });

      // Stat cards — individual triggers
      gsap.utils.toArray(".proj-stat").forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 30, scale: 0.85 },
          {
            opacity: 1, y: 0, scale: 1,
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
            duration: reduced ? 0 : 0.6,
            delay: i * 0.1,
            ease: "back.out(1.5)",
          }
        );
      });

      // Filter buttons — individual triggers
      gsap.utils.toArray(".proj-filter-btn").forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 16 },
          {
            opacity: 1, y: 0,
            scrollTrigger: { trigger: el, start: "top 92%", once: true },
            duration: reduced ? 0 : 0.45,
            delay: i * 0.05,
            ease: EASE.out,
          }
        );
      });

      // Project cards — CRITICAL: individual element triggers
      gsap.utils.toArray(".proj-card").forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 60 },
          {
            opacity: 1, y: 0,
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
            duration: reduced ? 0 : 0.8,
            delay: i * 0.06,
            ease: "power3.out",
          }
        );
      });
    }, pageRef);

    return () => ctx.revert();
  }, [reduced]);

  // Re-animate grid when category filter changes
  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll(".proj-card");
    if (!cards.length) return;
    gsap.fromTo(
      cards,
      { opacity: 0, y: 30, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, stagger: 0.07, duration: 0.45, ease: "power2.out" }
    );
  }, [selectedCategory]);

  return (
    <div ref={pageRef} className="min-h-screen bg-dark-900 relative overflow-x-hidden">

      {/* ── Background decoration ──────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-40 -left-20 w-[600px] h-[600px] rounded-full bg-primary-500/5 blur-[140px]" />
        <div className="absolute bottom-1/3 right-0 w-[450px] h-[450px] rounded-full bg-primary-600/4 blur-[110px]" />
        <div
          className="absolute inset-0 opacity-[0.022]"
          style={{
            backgroundImage: "linear-gradient(#f97316 1px,transparent 1px),linear-gradient(90deg,#f97316 1px,transparent 1px)",
            backgroundSize: "70px 70px",
          }}
        />
      </div>

      {/* ════════════════════════════════════════════════════════════
          SECTION 1 — HERO
      ════════════════════════════════════════════════════════════ */}
      <section className="pt-24 pb-16 px-6 sm:px-10 lg:px-20 xl:px-28">
        <div className="max-w-7xl mx-auto">

          <p className="proj-hero-sub font-mono text-[10px] sm:text-xs tracking-[0.35em] text-primary-500/60 uppercase mb-6">
            — Projects
          </p>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 lg:gap-12 mb-8">
            <div className="shrink-0">
              <h1
                className="proj-hero-line font-heading font-black uppercase leading-[0.88] tracking-tighter text-white"
                style={{ fontSize: "clamp(52px, 9vw, 130px)" }}
              >
                FEATURED
              </h1>
              <h1
                className="proj-hero-line font-heading font-black uppercase leading-[0.88] tracking-tighter"
                style={{
                  fontSize: "clamp(52px, 9vw, 130px)",
                  WebkitTextStroke: "clamp(1.5px, 0.18vw, 3px) #f97316",
                  color: "transparent",
                }}
              >
                PROJECTS.
              </h1>
            </div>

            <div className="lg:pb-2 lg:max-w-md">
              <p className="proj-hero-sub text-white/45 text-sm sm:text-base leading-relaxed">
                A curated selection of my best work — full-stack platforms,
                interactive frontends, and everything in between.
              </p>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-primary-500/50 via-primary-400/15 to-transparent mb-10" />

          {/* Stats strip */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 sm:flex sm:flex-wrap sm:justify-start">
            {[
              { value: projects.length,        label: "Total Projects" },
              { value: featuredCount,           label: "Featured"       },
              { value: projectCategories.length, label: "Categories"   },
            ].map((s, i) => (
              <div
                key={i}
                className="proj-stat rounded-xl border border-white/6 bg-white/[0.02] px-5 py-4 text-center sm:text-left sm:px-8 sm:py-5"
              >
                <p className="font-heading font-black text-3xl sm:text-4xl text-primary-500 leading-none mb-1">
                  {s.value}
                </p>
                <p className="text-white/35 font-mono text-[9px] sm:text-[10px] tracking-[0.28em] uppercase">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SECTION 2 — FILTER TABS
      ════════════════════════════════════════════════════════════ */}
      <section className="py-8 px-6 sm:px-10 lg:px-20 xl:px-28">
        <div className="max-w-7xl mx-auto">

          <div className="flex items-end gap-6 mb-7">
            <div>
              <p className="font-mono text-[9px] tracking-[0.35em] text-primary-500/60 uppercase mb-2">— 01</p>
              <ScrambleHeading
                className="font-heading font-black text-xl sm:text-2xl text-white tracking-tight"
              >
                Filter Projects
              </ScrambleHeading>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-primary-500/25 to-transparent mb-1.5" />
          </div>

          <div className="proj-filters flex flex-wrap gap-2 sm:gap-3">
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`proj-filter-btn px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-mono text-[10px] sm:text-xs font-bold tracking-widest uppercase transition-all duration-300 ${
                  selectedCategory === cat
                    ? "bg-primary-500 text-white shadow-[0_0_24px_rgba(249,115,22,0.4)]"
                    : "border border-white/10 text-white/40 hover:text-white/70 hover:border-white/20 bg-white/[0.02]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SECTION 3 — PROJECTS GRID
      ════════════════════════════════════════════════════════════ */}
      <section className="py-8 pb-24 px-6 sm:px-10 lg:px-20 xl:px-28">
        <div className="max-w-7xl mx-auto">

          <div className="flex items-end gap-6 mb-10">
            <div>
              <p className="font-mono text-[9px] tracking-[0.35em] text-primary-500/60 uppercase mb-2">— 02</p>
              <ScrambleHeading
                className="font-heading font-black text-xl sm:text-2xl text-white tracking-tight"
                delay={150}
              >
                {selectedCategory === "All" ? "All Projects" : `${selectedCategory} Projects`}
              </ScrambleHeading>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-primary-500/25 to-transparent mb-1.5" />
            <span className="font-mono text-[9px] tracking-widest text-white/25 uppercase mb-1.5 flex-shrink-0">
              {filteredProjects.length} {filteredProjects.length === 1 ? "project" : "projects"}
            </span>
          </div>

          <div
            ref={gridRef}
            className="proj-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredProjects.map((project, index) => (
              <ProjectCard3D
                key={project.id}
                project={project}
                index={index}
                onOpen={setSelectedProject}
              />
            ))}
          </div>

          {/* Empty state */}
          {filteredProjects.length === 0 && (
            <div className="text-center py-24">
              <p className="font-mono text-white/20 text-sm tracking-widest uppercase">
                No projects in this category yet
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── Modal ──────────────────────────────────────────────────── */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
};

export default Projects;
