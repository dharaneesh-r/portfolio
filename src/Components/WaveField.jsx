/**
 * WaveField.jsx — interactive flowing-line wave (hero centerpiece)
 * ─────────────────────────────────────────────────────────────────
 * Pure-black background. A set of horizontal lines flows gently, and
 * moving the cursor sends concentric ripple waves travelling through
 * them — the calm, premium "disturbed surface" interaction (cf.
 * lusion.co). No dots, no grid of points — just light, flowing lines.
 *
 * Library ownership: Three.js owns the WebGL render + per-frame wave
 * math. No D3 / GSAP / Framer here.
 *
 * Technique:
 *  • L horizontal lines, each P samples wide; vertical (y) displacement.
 *  • Ambient: layered travelling sines → the lines always flow.
 *  • Ripples: each cursor move spawns {x,y,t0}; every frame each sample
 *    sums a cosine wave windowed on the expanding front (exp envelope)
 *    so rings race outward and fade.
 *  • Per-vertex colour: dim cool at rest → glowing ember exactly where a
 *    ripple is passing, so the cursor "paints" light waves into the lines.
 *  • Reduced-motion: one static ambient frame, no RAF / listeners.
 *  • Full disposal of every line geometry + material on unmount.
 */

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useReducedMotion } from "../context/ReducedMotionContext";

// ── Ripple constants ──────────────────────────────────────────────────
const RIPPLE_SPEED = 30;    // world units / sec the wave front travels
const RIPPLE_K     = 0.5;   // ring frequency
const RIPPLE_AMP   = 5.5;   // peak vertical displacement
const RIPPLE_LIFE  = 2.4;   // seconds before a ripple fades
const RIPPLE_SIGMA = 8;     // width of the travelling front
const MAX_RIPPLES  = 7;

// Colours: dim cool resting line → ember where a ripple passes
const COOL = [0.20, 0.24, 0.33];
const WARM = [1.0, 0.52, 0.18];

const WaveField = () => {
  const mountRef = useRef(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const isMobile = window.innerWidth < 768;
    const LINES = isMobile ? 34 : 52;   // horizontal lines
    const SEG   = isMobile ? 90 : 150;  // samples per line
    const Wp = 150, Hp = 92;            // covered world size

    // ── Renderer / scene / camera ─────────────────────────────────────
    const W = mount.clientWidth, H = mount.clientHeight;
    const renderer = new THREE.WebGLRenderer({
      alpha: true, antialias: !isMobile, powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 500);
    camera.position.set(0, 0, 70);

    const group = new THREE.Group();
    group.rotation.x = -0.14;          // slight tilt for depth
    scene.add(group);

    const mat = new THREE.LineBasicMaterial({
      vertexColors: true, transparent: true, opacity: 0.92,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });

    // ── Build lines (base x along width, fixed row y) ─────────────────
    const dxStep = Wp / (SEG - 1);
    const dyStep = Hp / (LINES - 1);
    const rows = [];
    for (let li = 0; li < LINES; li++) {
      const y0 = -Hp / 2 + li * dyStep;
      const posArr = new Float32Array(SEG * 3);
      const colArr = new Float32Array(SEG * 3);
      for (let s = 0; s < SEG; s++) {
        posArr[s * 3] = -Wp / 2 + s * dxStep;
        posArr[s * 3 + 1] = y0;
        posArr[s * 3 + 2] = 0;
        colArr[s * 3] = COOL[0]; colArr[s * 3 + 1] = COOL[1]; colArr[s * 3 + 2] = COOL[2];
      }
      const geo = new THREE.BufferGeometry();
      const pAttr = new THREE.BufferAttribute(posArr, 3); pAttr.setUsage(THREE.DynamicDrawUsage);
      const cAttr = new THREE.BufferAttribute(colArr, 3); cAttr.setUsage(THREE.DynamicDrawUsage);
      geo.setAttribute("position", pAttr);
      geo.setAttribute("color", cAttr);
      const line = new THREE.Line(geo, mat);
      group.add(line);
      rows.push({ y0, posArr, colArr, pAttr, cAttr });
    }

    const ripples = [];   // {x, y, t0}

    // ── Recompute every sample's y + colour ───────────────────────────
    const updateField = (t) => {
      for (let li = 0; li < LINES; li++) {
        const row = rows[li];
        const y0 = row.y0;
        const { posArr, colArr } = row;
        for (let s = 0; s < SEG; s++) {
          const x = posArr[s * 3];

          // ambient flow (lines always breathe)
          const ambient =
            Math.sin(x * 0.06 + t * 0.7 + y0 * 0.05) * 1.3 +
            Math.sin(x * 0.03 - t * 0.5 + y0 * 0.02) * 0.9 +
            Math.cos(y0 * 0.09 + t * 0.4) * 0.6;

          // travelling ripples (the cursor wave)
          let rip = 0;
          for (let k = 0; k < ripples.length; k++) {
            const rp = ripples[k];
            const age = t - rp.t0;
            if (age < 0 || age > RIPPLE_LIFE) continue;
            const ddx = x - rp.x, ddy = y0 - rp.y;
            const d = Math.sqrt(ddx * ddx + ddy * ddy);
            const front = age * RIPPLE_SPEED;
            const diff = d - front;
            const env = Math.exp(-(diff * diff) / (2 * RIPPLE_SIGMA * RIPPLE_SIGMA));
            if (env < 0.001) continue;
            rip += Math.cos(diff * RIPPLE_K) * RIPPLE_AMP * env * (1 - age / RIPPLE_LIFE);
          }

          posArr[s * 3 + 1] = y0 + ambient + rip;

          // ripple magnitude → ember glow
          let inten = Math.abs(rip) / RIPPLE_AMP;
          inten = inten > 1 ? 1 : inten;
          const sm = inten * inten * (3 - 2 * inten);
          colArr[s * 3]     = COOL[0] + (WARM[0] - COOL[0]) * sm;
          colArr[s * 3 + 1] = COOL[1] + (WARM[1] - COOL[1]) * sm;
          colArr[s * 3 + 2] = COOL[2] + (WARM[2] - COOL[2]) * sm;
        }
        row.pAttr.needsUpdate = true;
        row.cAttr.needsUpdate = true;
      }
    };

    // ── Reduced motion: one static frame, no loop / listeners ─────────
    if (prefersReduced) {
      updateField(0);
      renderer.render(scene, camera);
      return () => {
        group.children.forEach((c) => c.geometry?.dispose());
        mat.dispose(); renderer.dispose();
        if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      };
    }

    // ── Cursor → plane coords; spawn ripples on movement ──────────────
    const parallax = { x: 0, y: 0 };
    let lastX = 1e9, lastY = 1e9, lastAt = 0;
    const clock = new THREE.Clock();

    const onMove = (e) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      const wx = nx * Wp;
      const wy = -ny * Hp;
      parallax.x = nx; parallax.y = ny;

      const now = clock.getElapsedTime();
      const moved = Math.hypot(wx - lastX, wy - lastY);
      if (moved > 4 && now - lastAt > 0.05) {
        ripples.push({ x: wx, y: wy, t0: now });
        if (ripples.length > MAX_RIPPLES) ripples.shift();
        lastX = wx; lastY = wy; lastAt = now;
      }
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const onResize = () => {
      const w = mount.clientWidth, h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // ── Animation loop ────────────────────────────────────────────────
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      for (let k = ripples.length - 1; k >= 0; k--) {
        if (t - ripples[k].t0 > RIPPLE_LIFE) ripples.splice(k, 1);
      }

      updateField(t);

      group.rotation.y += (parallax.x * 0.18 - group.rotation.y) * 0.04;
      group.rotation.x += (-0.14 - parallax.y * 0.14 - group.rotation.x) * 0.04;

      renderer.render(scene, camera);
    };
    animate();

    // ── Cleanup ────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      group.children.forEach((c) => c.geometry?.dispose());
      mat.dispose(); renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, [prefersReduced]);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="absolute inset-0 z-0"
      style={{ pointerEvents: "none" }}
    />
  );
};

export default WaveField;
