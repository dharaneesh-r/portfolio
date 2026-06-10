/**
 * ConstellationField.jsx — D3-force × Three.js hero centerpiece
 * ─────────────────────────────────────────────────────────────────
 * A 3D particle constellation whose layout is driven by a real D3
 * force simulation (d3-force-3d) and rendered with Three.js.
 *
 * Library ownership (strict):
 *   D3 (d3-force-3d) → owns particle POSITIONS via the force sim
 *                      (manyBody repulsion, radial shell, custom
 *                      time-wander + cursor-repel forces).
 *   Three.js         → owns the WebGL render: additive Points field +
 *                      dynamic near-neighbour connection lines + camera.
 *   GSAP / Framer    → do NOT touch this component.
 *
 * Senior techniques:
 *  • Manual `simulation.tick()` inside the Three RAF → one clock, no
 *    competing d3-timer, perfect sync between physics and render.
 *  • alphaDecay(0) + a custom time-wander force → the constellation
 *    drifts forever instead of cooling to a frozen layout.
 *  • Custom d3 cursor force projects the pointer to world space and
 *    pushes nearby nodes — the field parts around the cursor.
 *  • Near-neighbour lines rebuilt each frame into a single preallocated
 *    LineSegments buffer (draw-range capped) — constellation effect with
 *    one draw call, zero per-frame allocation.
 *  • Reduced-motion: sim is settled synchronously, one frame rendered,
 *    RAF + listeners never start.
 *  • Full disposal on unmount (geometry, material, texture, renderer).
 */

import { useEffect, useRef } from "react";
import * as THREE from "three";
import {
  forceSimulation, forceManyBody, forceRadial, forceX, forceY, forceZ,
} from "d3-force-3d";
import { useReducedMotion } from "../context/ReducedMotionContext";

// ── Crisp dot sprite — tight bright core + soft halo (white so the ───
// per-vertex colour tints it cleanly). Drawn at high res for sharpness.
function createGlowTexture() {
  const S = 128;
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const ctx = c.getContext("2d");
  const g = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  g.addColorStop(0.00, "rgba(255,255,255,1)");
  g.addColorStop(0.18, "rgba(255,255,255,0.85)");  // crisp solid core
  g.addColorStop(0.38, "rgba(255,255,255,0.18)");  // quick falloff
  g.addColorStop(0.70, "rgba(255,255,255,0.04)");  // faint halo
  g.addColorStop(1.00, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, S, S);
  return new THREE.CanvasTexture(c);
}

// ── Custom D3 force: perpetual organic drift (curl-like wander) ──────
function forceWander() {
  let nodes = [];
  let t = 0;
  function force() {
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      n.vx += Math.sin(n.y * 0.02 + t + n.seed) * 0.05;
      n.vy += Math.cos(n.z * 0.02 + t * 1.1 + n.seed) * 0.05;
      n.vz += Math.sin(n.x * 0.02 + t * 0.9 + n.seed * 1.3) * 0.04;
    }
  }
  force.initialize = (n) => { nodes = n; };
  force.time = (v) => { t = v; return force; };
  return force;
}

// ── Custom D3 force: cursor repulsion (reads a shared world vector) ──
function forceCursor(mouse) {
  let nodes = [];
  const R = 16, F = 1.4;
  function force() {
    if (!mouse.active) return;
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      const dx = n.x - mouse.x, dy = n.y - mouse.y, dz = n.z - mouse.z;
      const d2 = dx * dx + dy * dy + dz * dz;
      if (d2 < R * R && d2 > 0.05) {
        const d = Math.sqrt(d2);
        const f = (1 - d / R) * F;
        n.vx += (dx / d) * f; n.vy += (dy / d) * f; n.vz += (dz / d) * f;
      }
    }
  }
  force.initialize = (n) => { nodes = n; };
  return force;
}

const ConstellationField = () => {
  const mountRef = useRef(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const isMobile = window.innerWidth < 768;
    const COUNT     = isMobile ? 90 : 180;
    const MAX_LINES = isMobile ? 280 : 680;
    const SHELL_R   = 22;          // radial force target radius
    const LINK_DIST = isMobile ? 7.5 : 8.5;

    // ── Nodes (D3 owns x/y/z + vx/vy/vz) ──────────────────────────────
    const nodes = [];
    const colors = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const r = 6 + Math.random() * SHELL_R;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      nodes.push({
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.sin(phi) * Math.sin(theta),
        z: r * Math.cos(phi),
        seed: Math.random() * Math.PI * 2,
      });
      // Refined palette — mostly soft warm-white starfield (varied
      // brightness reads as depth), with ~1-in-5 warm ember accents.
      if (Math.random() < 0.2) {
        const tt = Math.random();
        colors[i * 3]     = 1.0;
        colors[i * 3 + 1] = 0.52 + tt * 0.18;
        colors[i * 3 + 2] = 0.22 + tt * 0.12;
      } else {
        const b = 0.45 + Math.random() * 0.42;   // 0.45–0.87
        colors[i * 3]     = b;
        colors[i * 3 + 1] = b * 0.95;
        colors[i * 3 + 2] = b * 0.88;             // subtle warm tint
      }
    }

    // ── Shared cursor world vector (updated by pointer handler) ───────
    const mouse = { x: 0, y: 0, z: 0, active: false };
    const wander = forceWander();

    // ── D3 force simulation in 3 dimensions ───────────────────────────
    const sim = forceSimulation(nodes, 3)
      .alphaDecay(0)          // never cool — the constellation lives forever
      .velocityDecay(0.45)    // damping so it doesn't explode
      .alpha(0.35)
      .force("charge", forceManyBody().strength(-9).distanceMax(46))
      .force("shell",  forceRadial(SHELL_R, 0, 0, 0).strength(0.045))
      .force("x", forceX(0).strength(0.004))
      .force("y", forceY(0).strength(0.004))
      .force("z", forceZ(0).strength(0.004))
      .force("wander", wander)
      .force("cursor", forceCursor(mouse))
      .stop();

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
    camera.position.z = isMobile ? 64 : 56;

    const group = new THREE.Group();
    scene.add(group);

    const glowTex = createGlowTexture();

    // ── Points field ──────────────────────────────────────────────────
    const posArr = new Float32Array(COUNT * 3);
    const pGeo = new THREE.BufferGeometry();
    const posAttr = new THREE.BufferAttribute(posArr, 3);
    posAttr.setUsage(THREE.DynamicDrawUsage);
    pGeo.setAttribute("position", posAttr);
    pGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const pMat = new THREE.PointsMaterial({
      size: isMobile ? 1.5 : 1.9,
      map: glowTex,
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      opacity: 0.85,
    });
    const points = new THREE.Points(pGeo, pMat);
    group.add(points);

    // ── Connection lines (single preallocated LineSegments) ───────────
    const linePos = new Float32Array(MAX_LINES * 2 * 3);
    const lineCol = new Float32Array(MAX_LINES * 2 * 3);
    const lGeo = new THREE.BufferGeometry();
    const lPosAttr = new THREE.BufferAttribute(linePos, 3);
    const lColAttr = new THREE.BufferAttribute(lineCol, 3);
    lPosAttr.setUsage(THREE.DynamicDrawUsage);
    lColAttr.setUsage(THREE.DynamicDrawUsage);
    lGeo.setAttribute("position", lPosAttr);
    lGeo.setAttribute("color", lColAttr);
    const lMat = new THREE.LineBasicMaterial({
      vertexColors: true, transparent: true, opacity: 0.32,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const lines = new THREE.LineSegments(lGeo, lMat);
    group.add(lines);

    // Copy node positions → point buffer + rebuild neighbour lines
    const sync = () => {
      for (let i = 0; i < COUNT; i++) {
        const n = nodes[i];
        posArr[i * 3] = n.x; posArr[i * 3 + 1] = n.y; posArr[i * 3 + 2] = n.z;
      }
      posAttr.needsUpdate = true;

      let li = 0;
      const maxV = MAX_LINES * 6;
      for (let i = 0; i < COUNT && li < maxV; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < COUNT; j++) {
          const b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y, dz = a.z - b.z;
          const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (d < LINK_DIST) {
            // Smoothstep fade so links dissolve gently at max distance
            const f = 1 - d / LINK_DIST;
            const inten = f * f * (3 - 2 * f);
            linePos[li]     = a.x; linePos[li + 1] = a.y; linePos[li + 2] = a.z;
            linePos[li + 3] = b.x; linePos[li + 4] = b.y; linePos[li + 5] = b.z;
            // cool neutral filament, brighter when nodes are closer
            for (let v = 0; v < 2; v++) {
              const o = li + v * 3;
              lineCol[o] = 0.42 * inten; lineCol[o + 1] = 0.48 * inten; lineCol[o + 2] = 0.58 * inten;
            }
            li += 6;
            if (li >= maxV) break;
          }
        }
      }
      lPosAttr.needsUpdate = true;
      lColAttr.needsUpdate = true;
      lGeo.setDrawRange(0, li / 3);
    };

    // ── Reduced motion: settle synchronously, render one static frame ─
    if (prefersReduced) {
      for (let i = 0; i < 120; i++) sim.tick();
      sync();
      group.rotation.set(-0.1, 0.4, 0);
      renderer.render(scene, camera);
      return () => {
        pGeo.dispose(); pMat.dispose(); lGeo.dispose(); lMat.dispose();
        glowTex.dispose(); renderer.dispose();
        sim.stop();
        if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      };
    }

    // Warm-start a little so it opens organised, not as a tight ball
    for (let i = 0; i < 40; i++) { wander.time(i * 0.05); sim.tick(); }

    // ── Pointer → world-space cursor (z=0 plane approximation) ────────
    const target = { x: 0, y: 0 };   // camera parallax target
    const onMove = (e) => {
      const nx =  (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = -(e.clientY / window.innerHeight - 0.5) * 2;
      // map normalised cursor into the constellation's world volume
      mouse.x = nx * 30; mouse.y = ny * 22; mouse.z = 0;
      mouse.active = true;
      target.x = nx; target.y = ny;
    };
    const onLeave = () => { mouse.active = false; };
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseout", onLeave);

    const onResize = () => {
      const w = mount.clientWidth, h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // ── Animation loop ────────────────────────────────────────────────
    let animId;
    const clock = new THREE.Clock();
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      wander.time(t * 0.6);
      sim.tick();         // D3 advances positions
      sync();             // push to GPU buffers + rebuild lines

      // Slow idle rotation + cursor parallax
      group.rotation.y += 0.0009;
      group.rotation.x += 0.0004;
      camera.position.x += (target.x * 6 - camera.position.x) * 0.03;
      camera.position.y += (target.y * 4 - camera.position.y) * 0.03;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };
    animate();

    // ── Cleanup ────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId);
      sim.stop();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
      window.removeEventListener("resize", onResize);
      pGeo.dispose(); pMat.dispose(); lGeo.dispose(); lMat.dispose();
      glowTex.dispose(); renderer.dispose();
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

export default ConstellationField;
