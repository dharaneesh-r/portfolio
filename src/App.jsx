/**
 * App.jsx
 * ─────────────────────────────────────────────────────────────────
 * Root layout. Library ownership per component:
 *
 *  Cursor           → GSAP (position + scale)
 *  PageTransition   → Framer Motion (wipe overlay + scroll reset)
 *  Route content    → see each component
 *
 * NOTE: gsap.registerPlugin is called ONCE in main.jsx.
 *       Do NOT call it here or in any component.
 */

import { Routes, Route, useLocation } from "react-router-dom";
import { MotionConfig }  from "framer-motion";
import CursorTrail      from "./Components/layout/CursorTrail";
import PageTransition    from "./Components/layout/PageTransition";
import LiquidGlass       from "./Components/effects/LiquidGlass";
import VoiceGreeting     from "./Components/effects/VoiceGreeting";
import GlassShatterTransition from "./Components/effects/glassShatter/GlassShatterTransition";
import DoubleClickHint    from "./Components/effects/DoubleClickHint";
import Navbar            from "./Components/Navbar";
import Home              from "./Components/Home";
import Aboutme           from "./Components/Aboutme";
import Skills            from "./Components/Skills";
import Projects          from "./Components/Projects";
import Contact           from "./Components/Contact";
import { useReducedMotion } from "./context/ReducedMotionContext";

const App = () => {
  const prefersReduced = useReducedMotion();
  const isHome = useLocation().pathname === "/";

  return (
    /*
     * MotionConfig reducedMotion="user" makes Framer Motion
     * automatically disable all animations when the OS flag is set.
     * Our manual prefersReduced checks handle GSAP + Three.js.
     */
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-dark-900">
        {/* Spoken welcome on first visitor interaction (once per session) */}
        <VoiceGreeting />

        {/* 3D glass-shatter transition: double-click advances to the next page.
            Additive overlay; see Components/effects/glassShatter/ */}
        <GlassShatterTransition />

        {/* Homepage hint toast (after 10s): "double-click to shatter" */}
        {isHome && <DoubleClickHint />}

        {/* Codrops SVG-throw trail cursor — GSAP owned, hides on reduced-motion */}
        <CursorTrail />

        {/*
         * Orange full-screen wipe that fires on every route change.
         * Also handles scroll-to-top + ScrollTrigger.refresh.
         * Framer Motion owned. Must be a sibling of <Routes>, not a
         * wrapper, so it overlays the content without re-mounting it.
         */}
        <PageTransition />

        {/* Liquid-glass distortion — homepage only, additive, removable.
            Click-through overlay; see Components/effects/LiquidGlass.jsx */}
        {isHome && <LiquidGlass />}

        <Navbar />

        <main className="w-full">
          <Routes>
            <Route path="/"         element={<Home />}    />
            <Route path="/aboutme"  element={<Aboutme />} />
            <Route path="/skills"   element={<Skills />}  />
            <Route path="/projects" element={<Projects />}/>
            <Route path="/contact"  element={<Contact />} />
          </Routes>
        </main>
      </div>
    </MotionConfig>
  );
};

export default App;
