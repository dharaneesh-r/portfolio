/**
 * Skills.jsx — Enhanced Skills page
 * Matches the editorial design language of Aboutme.jsx
 */

import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { skillCategories } from "../data/skills";
import { FaCode, FaServer, FaCloud, FaTools } from "react-icons/fa";
import { useReducedMotion } from "../context/ReducedMotionContext";
import SkillsGraph from "./ui/SkillsGraph";
import SEO from "./SEO";

gsap.registerPlugin(ScrollTrigger);

// ── Scramble heading (copied from Aboutme.jsx) ────────────────────────
const ScrambleHeading = ({ children, className = "", delay = 0 }) => {
  const elRef = useRef(null);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#@!$";
  const TICK = 36; const DUR_MS = 400; const STAG = 45;
  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    const original = el.textContent;
    const run = () => {
      const now = Date.now();
      const starts = original.split("").map((_, i) => now + i * STAG + delay);
      const settled = original.split("").map(() => false);
      const iv = setInterval(() => {
        const t = Date.now(); let all = true;
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
    const st = ScrollTrigger.create({ trigger: el, start: "top 88%", once: true, onEnter: () => { iv = run(); } });
    return () => { st.kill(); clearInterval(iv); };
  }, []);
  return <h2 ref={elRef} className={className}>{children}</h2>;
};

// ── Tech icon metadata ────────────────────────────────────────────────
const TECH_META = {
  "HTML": { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg", color: "#e34f26" },
  "CSS": { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg", color: "#1572b6" },
  "JavaScript": { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg", color: "#f7df1e" },
  "React.js": { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg", color: "#61dafb" },
  "Next.js": { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg", color: "#e2e8f0", invert: true },
  "TailwindCSS": { icon: "https://cdn.simpleicons.org/tailwindcss/38bdf8", color: "#38bdf8" },
  "Node.js": { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg", color: "#68a063" },
  "Express.js": { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg", color: "#aaaaaa", invert: true },
  "MongoDB": { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg", color: "#4db33d" },
  "Firebase": { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg", color: "#ffca28" },
  "AWS": { icon: "https://cdn.simpleicons.org/amazonaws/ff9900", color: "#ff9900" },
  "Docker": { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg", color: "#2496ed" },
  "Kubernetes": { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg", color: "#326ce5" },
  "Git/GitHub": { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg", color: "#f34f29" },
  "Postman": { icon: "https://cdn.simpleicons.org/postman/ef5b25", color: "#ef5b25" },
  "GSAP": { icon: "https://cdn.worldvectorlogo.com/logos/gsap-greensock.svg", color: "#88ce02" },
};

// ── Circular progress ring ────────────────────────────────────────────
const CircleProgress = ({ pct, label, icon: Icon, color }) => {
  const circleRef = useRef(null);
  const R = 54; const C = 2 * Math.PI * R;
  useEffect(() => {
    const el = circleRef.current;
    if (!el) return;
    const st = ScrollTrigger.create({
      trigger: el, start: "top 85%", once: true,
      onEnter: () => gsap.fromTo(el,
        { strokeDashoffset: C },
        { strokeDashoffset: C - (pct / 100) * C, duration: 1.6, ease: "power2.out" }
      ),
    });
    return () => st.kill();
  }, [pct]);
  return (
    <div className="text-center group">
      <div className="relative w-32 h-32 mx-auto mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={R} fill="none" stroke="rgba(249,115,22,0.1)" strokeWidth="8" />
          <circle ref={circleRef} cx="60" cy="60" r={R} fill="none" stroke={color || "#f97316"} strokeWidth="8"
            strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Icon className="text-2xl text-primary-500 mb-1" />
          <span className="font-heading font-black text-lg text-white">{pct}%</span>
        </div>
      </div>
      <p className="text-white/70 font-semibold text-sm">{label}</p>
    </div>
  );
};

// ── Category config ───────────────────────────────────────────────────
const CATEGORY_ICONS = {
  frontend: FaCode,
  backend: FaServer,
  devops: FaCloud,
  tools: FaTools,
};

// ── Skill Card (extracted to keep re-render scope clean) ─────────────
const SkillCard = ({ skill, meta, profLabel, profColor }) => {
  const iconRef = useRef(null);
  const [imgErr, setImgErr] = useState(false);

  const iconUrl = meta.icon || skill.icon;

  const onMove = (e) => {
    const el = iconRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const cy = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    gsap.to(el, {
      rotateY: cx * 22,
      rotateX: -cy * 22,
      scale: 1.15,
      duration: 0.25,
      ease: "power2.out",
      transformPerspective: 500,
      transformOrigin: "center center",
    });
  };

  const onLeave = () => {
    if (!iconRef.current) return;
    gsap.to(iconRef.current, {
      rotateY: 0, rotateX: 0, scale: 1,
      duration: 0.6,
      ease: "elastic.out(1, 0.45)",
    });
  };

  return (
    <div className="skills-card group relative border border-white/5 rounded-2xl p-6 bg-white/[0.02] hover:border-primary-500/20 transition-colors duration-300 overflow-hidden">
      {/* Subtle glow on hover */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(circle at 30% 40%, ${meta.color}08 0%, transparent 70%)` }}
      />

      {/* Header row */}
      <div className="flex items-start justify-between mb-5">
        {/* 3D icon */}
        <div
          ref={iconRef}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 cursor-default"
          style={{
            background: `${meta.color}15`,
            border: `1px solid ${meta.color}30`,
            transformStyle: "preserve-3d",
            willChange: "transform",
          }}
        >
          {iconUrl && !imgErr ? (
            <img
              src={iconUrl}
              alt={skill.name}
              onError={() => setImgErr(true)}
              className="w-7 h-7 object-contain"
              style={{ filter: meta.invert ? "invert(1) brightness(0.85)" : "none" }}
            />
          ) : (
            <span className="font-heading font-black text-xl" style={{ color: meta.color }}>
              {skill.name[0]}
            </span>
          )}
        </div>

        {/* Proficiency badge */}
        <span
          className="font-mono text-[10px] tracking-[0.2em] uppercase px-2.5 py-1 rounded-full"
          style={{ color: profColor, backgroundColor: profColor + "18", border: `1px solid ${profColor}30` }}
        >
          {profLabel}
        </span>
      </div>

      {/* Skill name */}
      <h3 className="font-heading font-black text-2xl text-white mb-1 leading-tight">{skill.name}</h3>
      {skill.description ? (
        <p className="text-white/40 text-xs font-mono mb-5 leading-relaxed line-clamp-2">{skill.description}</p>
      ) : (
        <div className="mb-5" />
      )}

      {/* Progress bar */}
      <div className="mb-5">
        <div className="flex justify-between mb-1.5">
          <span className="font-mono text-[10px] tracking-[0.2em] text-white/30 uppercase">Proficiency</span>
          <span className="font-mono text-[10px] text-white/50">{skill.level}%</span>
        </div>
        <div className="h-1 w-full rounded-full bg-white/5 overflow-hidden">
          <div
            className="skills-progress-bar h-full rounded-full"
            data-pct={skill.level}
            style={{
              width: "0%",
              background: `linear-gradient(90deg, ${meta.color}80, ${meta.color})`,
            }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex gap-4 pt-4 border-t border-white/5">
        <div>
          <p className="font-mono text-[10px] tracking-[0.2em] text-white/25 uppercase mb-0.5">Exp</p>
          <p className="font-heading font-black text-sm text-white/70">{skill.yearsExp}yr</p>
        </div>
        <div>
          <p className="font-mono text-[10px] tracking-[0.2em] text-white/25 uppercase mb-0.5">Projects</p>
          <p className="font-heading font-black text-sm text-white/70">{skill.projects}+</p>
        </div>
      </div>
    </div>
  );
};

// ── Main Skills component ─────────────────────────────────────────────
const Skills = () => {
  const prefersReducedMotion = useReducedMotion();
  const [activeCategory, setActiveCategory] = useState("frontend");

  // Computed stats
  const allSkillsFlat = Object.values(skillCategories).flatMap(c => c.skills);
  const totalSkills = allSkillsFlat.length;
  const avgProficiency = Math.round(allSkillsFlat.reduce((s, sk) => s + sk.level, 0) / totalSkills);
  const totalCategories = Object.keys(skillCategories).length;

  const stats = [
    { value: totalSkills, suffix: "+", label: "Total Skills" },
    { value: avgProficiency, suffix: "%", label: "Avg Proficiency" },
    { value: totalCategories, suffix: "", label: "Categories" },
    { value: "1yr", suffix: "+", label: "Experience" },
  ];

  // Hero animation on mount
  useEffect(() => {
    if (prefersReducedMotion) return;
    gsap.from(".skills-hero-line", {
      clipPath: "inset(0 0 100% 0)",
      y: 80,
      opacity: 0,
      stagger: 0.18,
      duration: 1.1,
      ease: "back.out(1.7)",
      delay: 0.1,
    });
  }, []);

  // Stat cards — individual scroll triggers
  useEffect(() => {
    if (prefersReducedMotion) return;
    gsap.utils.toArray(".skills-stat-card").forEach((el, i) => {
      gsap.fromTo(el,
        { y: 40, opacity: 0 },
        {
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
          y: 0,
          opacity: 1,
          duration: 0.7,
          delay: i * 0.1,
          ease: "power3.out",
        }
      );
    });
  }, []);

  // Category tab buttons — individual scroll triggers
  useEffect(() => {
    if (prefersReducedMotion) return;
    gsap.utils.toArray(".skills-cat-btn").forEach((el, i) => {
      gsap.fromTo(el,
        { x: -30, opacity: 0 },
        {
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
          x: 0,
          opacity: 1,
          duration: 0.6,
          delay: i * 0.08,
          ease: "power3.out",
        }
      );
    });
  }, []);

  // Skill cards — animate in when category changes
  useEffect(() => {
    if (prefersReducedMotion) return;
    // Use RAF to ensure DOM has updated after state change
    const raf = requestAnimationFrame(() => {
      const cards = document.querySelectorAll(".skills-card");
      gsap.utils.toArray(cards).forEach((el, i) => {
        gsap.fromTo(el,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
            delay: i * 0.06,
            ease: "power3.out",
          }
        );
        // Animate progress bar inside this card
        const bar = el.querySelector(".skills-progress-bar");
        if (bar) {
          const target = bar.dataset.pct;
          gsap.fromTo(bar, { width: "0%" }, { width: target + "%", duration: 1, ease: "power2.out", delay: i * 0.06 + 0.25 });
        }
      });
    });
    return () => cancelAnimationFrame(raf);
  }, [activeCategory]);

  // Summary circles — individual scroll triggers
  useEffect(() => {
    if (prefersReducedMotion) return;
    gsap.utils.toArray(".skills-summary-item").forEach((el, i) => {
      gsap.fromTo(el,
        { y: 40, opacity: 0 },
        {
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
          y: 0,
          opacity: 1,
          duration: 0.7,
          delay: i * 0.12,
          ease: "power3.out",
        }
      );
    });
  }, []);

  const currentCat = skillCategories[activeCategory];

  const getProficiencyLabel = (level) => {
    if (level >= 88) return { label: "Expert", color: "#22c55e" };
    if (level >= 75) return { label: "Advanced", color: "#f97316" };
    return { label: "Intermediate", color: "#3b82f6" };
  };

  const getCategoryAvg = (key) => {
    const cat = skillCategories[key];
    return Math.round(cat.skills.reduce((s, sk) => s + sk.level, 0) / cat.skills.length);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0a0a0a" }}>
      <SEO 
        title="Skills & Tech Stack | Dharaneesh R" 
        description="Explore the technical skills, tools, and technologies used by Dharaneesh R." 
      />
      {/* ── HERO ───────────────────────────────────────────────────── */}
      <section className="pt-24 pb-16 px-6 sm:px-10 lg:px-20 xl:px-28">
        <div className="max-w-7xl mx-auto">

          {/* Section label */}
          <div className="overflow-hidden mb-8">
            <p className="skills-hero-line font-mono text-[10px] tracking-[0.35em] text-primary-500/60 uppercase mb-2">
              — Skills
            </p>
          </div>

          {/* Hero title line 1 */}
          <div className="overflow-hidden mb-3">
            <h1
              className="skills-hero-line font-heading font-black uppercase leading-none text-white"
              style={{ fontSize: "clamp(52px, 9vw, 130px)" }}
            >
              TECHNICAL
            </h1>
          </div>

          {/* Hero title line 2 */}
          <div className="overflow-hidden mb-8">
            <h1
              className="skills-hero-line font-heading font-black uppercase leading-none"
              style={{
                fontSize: "clamp(52px, 9vw, 130px)",
                WebkitTextStroke: "2px #f97316",
                color: "transparent",
              }}
            >
              ARSENAL.
            </h1>
          </div>

          {/* Subtitle */}
          <div className="overflow-hidden mb-14">
            <p className="skills-hero-line text-white/50 text-lg font-mono max-w-xl">
              Tools, frameworks, and technologies I craft with — refined through real-world projects.
            </p>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="skills-stat-card border border-white/5 rounded-2xl p-6 bg-white/[0.02] backdrop-blur-sm hover:border-primary-500/30 transition-colors duration-300"
              >
                <p className="font-heading font-black text-4xl text-white mb-1">
                  {stat.value}
                  <span className="text-primary-500">{stat.suffix}</span>
                </p>
                <p className="font-mono text-[10px] tracking-[0.25em] text-white/40 uppercase">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DIVIDER ─────────────────────────────────────────────────── */}
      <div className="px-6 sm:px-10 lg:px-20 xl:px-28">
        <div className="max-w-7xl mx-auto border-t border-white/5" />
      </div>

      {/* ── CATEGORY TABS ───────────────────────────────────────────── */}
      <section className="py-12 px-6 sm:px-10 lg:px-20 xl:px-28">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.35em] text-primary-500/60 uppercase mb-2">— 02</p>
          <ScrambleHeading className="font-heading font-black text-3xl sm:text-4xl text-white mb-10 uppercase">
            Choose Category
          </ScrambleHeading>

          <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
            {Object.entries(skillCategories).map(([key, cat]) => {
              const Icon = CATEGORY_ICONS[key];
              const isActive = activeCategory === key;
              const shortTitle = cat.title.replace(" Development", "").replace(" & Cloud", "");
              return (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  className={`skills-cat-btn group flex items-center gap-3 px-6 py-4 rounded-xl border font-mono text-sm tracking-wider uppercase transition-all duration-300 ${
                    isActive
                      ? "border-primary-500 bg-primary-500/10 text-primary-500"
                      : "border-white/10 bg-white/[0.02] text-white/50 hover:border-white/20 hover:text-white/80"
                  }`}
                >
                  <Icon className={`text-base flex-shrink-0 ${isActive ? "text-primary-500" : "text-white/30 group-hover:text-white/50"}`} />
                  <span>{shortTitle}</span>
                  <span
                    className={`ml-auto text-[10px] px-2 py-0.5 rounded-full font-black ${
                      isActive ? "bg-primary-500/20 text-primary-500" : "bg-white/5 text-white/30"
                    }`}
                  >
                    {cat.skills.length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SKILLS GRID ─────────────────────────────────────────────── */}
      <section className="py-8 px-6 sm:px-10 lg:px-20 xl:px-28">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.35em] text-primary-500/60 uppercase mb-2">— 03</p>
          <ScrambleHeading
            key={activeCategory}
            className="font-heading font-black text-3xl sm:text-4xl text-white mb-10 uppercase"
          >
            {currentCat.title}
          </ScrambleHeading>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentCat.skills.map((skill, i) => {
              const meta = TECH_META[skill.name] ?? { color: "#f97316", icon: skill.icon };
              const { label: profLabel, color: profColor } = getProficiencyLabel(skill.level);
              return (
                <SkillCard
                  key={`${activeCategory}-${skill.name}`}
                  skill={skill}
                  meta={meta}
                  profLabel={profLabel}
                  profColor={profColor}
                  index={i}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* ── DIVIDER ─────────────────────────────────────────────────── */}
      <div className="px-6 sm:px-10 lg:px-20 xl:px-28 pt-8">
        <div className="max-w-7xl mx-auto border-t border-white/5" />
      </div>

      {/* ── KNOWLEDGE GRAPH ─────────────────────────────────────────── */}
      <section className="py-16 px-6 sm:px-10 lg:px-20 xl:px-28">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.35em] text-primary-500/60 uppercase mb-2">— 04</p>
          <ScrambleHeading className="font-heading font-black text-3xl sm:text-4xl text-white mb-3 uppercase">
            Knowledge Graph
          </ScrambleHeading>
          <p className="text-white/40 text-sm sm:text-base font-mono max-w-xl mb-8 leading-relaxed">
            An interactive map of how my skills connect — categories branch from the
            full-stack core, and related technologies link across the web.
          </p>

          {/* Category legend */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 mb-6">
            {Object.entries(skillCategories).map(([key, cat]) => (
              <div key={key} className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/40">
                  {cat.title.replace(" Development", "").replace(" & Cloud", "")}
                </span>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-white/5 bg-white/[0.015] overflow-hidden">
            <SkillsGraph />
          </div>
        </div>
      </section>

      {/* ── DIVIDER ─────────────────────────────────────────────────── */}
      <div className="px-6 sm:px-10 lg:px-20 xl:px-28">
        <div className="max-w-7xl mx-auto border-t border-white/5" />
      </div>

      {/* ── PROFICIENCY OVERVIEW ─────────────────────────────────────── */}
      <section className="py-16 px-6 sm:px-10 lg:px-20 xl:px-28">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.35em] text-primary-500/60 uppercase mb-2">— 05</p>
          <ScrambleHeading className="font-heading font-black text-3xl sm:text-4xl text-white mb-12 uppercase">
            Proficiency Overview
          </ScrambleHeading>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
            {Object.entries(skillCategories).map(([key, cat]) => {
              const Icon = CATEGORY_ICONS[key];
              const avg = getCategoryAvg(key);
              const shortTitle = cat.title.replace(" Development", "").replace(" & Cloud", "");
              return (
                <div key={key} className="skills-summary-item">
                  <CircleProgress pct={avg} label={shortTitle} icon={Icon} color={cat.color} />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="pb-12" />
    </div>
  );
};

export default Skills;
