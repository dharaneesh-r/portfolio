/**
 * Components/ui/SkillsGraph.jsx — 3D Skill Knowledge Graph
 * ─────────────────────────────────────────────────────────────────
 * A force-directed knowledge graph rendered in raw Three.js.
 * Library ownership: Three.js owns the WebGL canvas + physics loop.
 * GSAP / Framer Motion do NOT touch this component.
 *
 * Senior Three.js / graph techniques used here:
 *
 *  • Force-directed layout (n-body repulsion + Hooke spring edges +
 *    centering pull) integrated every frame — the graph self-organises
 *    into category clusters with the developer hub pinned at the origin.
 *  • CanvasTexture pill labels per node (auto-fit font), sized by
 *    proficiency so stronger skills read as larger hubs.
 *  • Single LineSegments mesh for ALL edges with per-vertex colours
 *    (vertexColors) → connected edges brighten on hover with one buffer
 *    update instead of N material swaps.
 *  • Raycaster node picking → hover scales the node, lights its edges,
 *    and shows a DOM tooltip projected from world → screen space.
 *  • Pointer-drag to rotate + idle auto-rotation + subtle mouse parallax.
 *  • Reduced-motion: simulation is settled synchronously, a single frame
 *    is rendered, and the RAF loop + interaction are never started.
 *  • Full disposal on unmount: geometries, materials, textures, renderer,
 *    RAF, and every event listener.
 *
 * Data source: src/data/skillsGraph.js (buildSkillGraph)
 */

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { buildSkillGraph } from "../../data/skillsGraph";
import { useReducedMotion } from "../../context/ReducedMotionContext";

// ── Physics constants ────────────────────────────────────────────────
const K_REP    = 130;    // n-body repulsion strength
const K_SPRING = 0.045;  // edge spring stiffness
const CENTER   = 0.010;  // pull toward origin (keeps graph framed)
const DAMP     = 0.90;   // velocity damping per step
const MAX_V    = 2.2;    // velocity clamp (stability)
const REST = { root: 11, category: 8, related: 9 }; // spring rest lengths

// ── Label texture (rounded pill with auto-fit text) ──────────────────
function makeLabelTexture(text, colorHex, type) {
  const W = 320, H = 84;
  const canvas = document.createElement("canvas");
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d");

  const isHub = type !== "skill";              // root + category nodes
  const bg    = isHub ? colorHex + "33" : "rgba(8,8,8,0.82)";
  const border= colorHex;
  const textColor = isHub ? "#ffffff" : colorHex;

  // Rounded-rect pill
  const r = 22;
  ctx.beginPath();
  ctx.moveTo(r, 0);
  ctx.lineTo(W - r, 0);
  ctx.quadraticCurveTo(W, 0, W, r);
  ctx.lineTo(W, H - r);
  ctx.quadraticCurveTo(W, H, W - r, H);
  ctx.lineTo(r, H);
  ctx.quadraticCurveTo(0, H, 0, H - r);
  ctx.lineTo(0, r);
  ctx.quadraticCurveTo(0, 0, r, 0);
  ctx.closePath();
  ctx.fillStyle = bg;
  ctx.fill();
  ctx.lineWidth = isHub ? 4 : 3;
  ctx.strokeStyle = border + (isHub ? "ff" : "aa");
  ctx.stroke();

  // Accent dot
  ctx.beginPath();
  ctx.arc(30, H / 2, isHub ? 8 : 6, 0, Math.PI * 2);
  ctx.fillStyle = colorHex;
  ctx.fill();

  // Auto-fit text
  let font = isHub ? 44 : 38;
  const maxText = W - 84;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  do {
    ctx.font = `${isHub ? 800 : 700} ${font}px Poppins, 'Segoe UI', sans-serif`;
    if (ctx.measureText(text).width <= maxText) break;
    font -= 2;
  } while (font > 18);

  ctx.fillStyle = textColor;
  ctx.fillText(text, W / 2 + 14, H / 2 + 2);

  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 4;
  return { tex, aspect: W / H };
}

const SkillsGraph = () => {
  const mountRef   = useRef(null);
  const tooltipRef = useRef(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const isMobile = window.innerWidth < 768;
    const { nodes, links } = buildSkillGraph();
    const N = nodes.length;

    // ── id → index lookup, link endpoint indices ──────────────────────
    const idx = new Map(nodes.map((n, i) => [n.id, i]));
    const edges = links
      .map((l) => ({ s: idx.get(l.source), t: idx.get(l.target), kind: l.kind }))
      .filter((e) => e.s !== undefined && e.t !== undefined);

    // ── Physics state (typed arrays — no GC in the loop) ──────────────
    const px = new Float32Array(N), py = new Float32Array(N), pz = new Float32Array(N);
    const vx = new Float32Array(N), vy = new Float32Array(N), vz = new Float32Array(N);
    const fixed = nodes.map((n) => n.type === "root");

    for (let i = 0; i < N; i++) {
      // Seed on a sphere shell; root stays at origin
      if (fixed[i]) { px[i] = py[i] = pz[i] = 0; continue; }
      const r = 6 + Math.random() * 8;
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      px[i] = r * Math.sin(phi) * Math.cos(theta);
      py[i] = r * Math.sin(phi) * Math.sin(theta);
      pz[i] = r * Math.cos(phi);
    }

    // ── One simulation step ───────────────────────────────────────────
    const fx = new Float32Array(N), fy = new Float32Array(N), fz = new Float32Array(N);
    const step = () => {
      fx.fill(0); fy.fill(0); fz.fill(0);

      // n-body repulsion
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          let dx = px[i] - px[j], dy = py[i] - py[j], dz = pz[i] - pz[j];
          let d2 = dx * dx + dy * dy + dz * dz + 0.05;
          const d = Math.sqrt(d2);
          const f = K_REP / d2;
          const ux = dx / d, uy = dy / d, uz = dz / d;
          fx[i] += ux * f; fy[i] += uy * f; fz[i] += uz * f;
          fx[j] -= ux * f; fy[j] -= uy * f; fz[j] -= uz * f;
        }
      }

      // spring edges
      for (const e of edges) {
        const { s, t, kind } = e;
        let dx = px[t] - px[s], dy = py[t] - py[s], dz = pz[t] - pz[s];
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz) + 0.001;
        const f = K_SPRING * (d - REST[kind]);
        const ux = dx / d, uy = dy / d, uz = dz / d;
        fx[s] += ux * f; fy[s] += uy * f; fz[s] += uz * f;
        fx[t] -= ux * f; fy[t] -= uy * f; fz[t] -= uz * f;
      }

      // centering + integrate
      for (let i = 0; i < N; i++) {
        if (fixed[i]) continue;
        fx[i] -= px[i] * CENTER; fy[i] -= py[i] * CENTER; fz[i] -= pz[i] * CENTER;
        vx[i] = (vx[i] + fx[i]) * DAMP;
        vy[i] = (vy[i] + fy[i]) * DAMP;
        vz[i] = (vz[i] + fz[i]) * DAMP;
        // clamp
        const sp = Math.sqrt(vx[i] * vx[i] + vy[i] * vy[i] + vz[i] * vz[i]);
        if (sp > MAX_V) { const k = MAX_V / sp; vx[i] *= k; vy[i] *= k; vz[i] *= k; }
        px[i] += vx[i]; py[i] += vy[i]; pz[i] += vz[i];
      }
    };

    // Pre-settle so the graph opens already organised
    for (let i = 0; i < 220; i++) step();

    // ── Renderer / scene / camera ─────────────────────────────────────
    const W = mount.clientWidth, H = mount.clientHeight || 520;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !isMobile });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 500);
    camera.position.z = isMobile ? 56 : 46;

    const graph = new THREE.Group();
    scene.add(graph);

    // ── Node sprites ──────────────────────────────────────────────────
    const spriteData = nodes.map((n) => {
      const { tex, aspect } = makeLabelTexture(n.label, n.color, n.type);
      const mat = new THREE.SpriteMaterial({
        map: tex, transparent: true, depthWrite: false, depthTest: false,
      });
      const sprite = new THREE.Sprite(mat);
      const baseW = n.type === "root" ? 8.5 : n.type === "category" ? 6 : 3 + n.val;
      const baseH = baseW / aspect;
      sprite.scale.set(baseW, baseH, 1);
      sprite.renderOrder = 2;
      graph.add(sprite);
      return { sprite, mat, tex, baseW, baseH, color: new THREE.Color(n.color) };
    });

    // ── Edge lines (single LineSegments, per-vertex colour) ───────────
    const linePos   = new Float32Array(edges.length * 6);
    const lineColor = new Float32Array(edges.length * 6);
    const baseColor = new Float32Array(edges.length * 6); // resting colours

    edges.forEach((e, k) => {
      const cs = spriteData[e.s].color, ct = spriteData[e.t].color;
      const dim = e.kind === "related" ? 0.35 : 0.55;
      const o = k * 6;
      // source vertex tinted by source colour, target by target colour
      baseColor[o]     = cs.r * dim; baseColor[o + 1] = cs.g * dim; baseColor[o + 2] = cs.b * dim;
      baseColor[o + 3] = ct.r * dim; baseColor[o + 4] = ct.g * dim; baseColor[o + 5] = ct.b * dim;
    });
    lineColor.set(baseColor);

    const lineGeo = new THREE.BufferGeometry();
    const linePosAttr = new THREE.BufferAttribute(linePos, 3);
    linePosAttr.setUsage(THREE.DynamicDrawUsage);
    lineGeo.setAttribute("position", linePosAttr);
    const lineColAttr = new THREE.BufferAttribute(lineColor, 3);
    lineColAttr.setUsage(THREE.DynamicDrawUsage);
    lineGeo.setAttribute("color", lineColAttr);

    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true, transparent: true, opacity: 0.9,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const lineSegs = new THREE.LineSegments(lineGeo, lineMat);
    lineSegs.renderOrder = 1;
    graph.add(lineSegs);

    // Push current node positions into sprite + line buffers
    const syncPositions = () => {
      for (let i = 0; i < N; i++) spriteData[i].sprite.position.set(px[i], py[i], pz[i]);
      edges.forEach((e, k) => {
        const o = k * 6;
        linePos[o]     = px[e.s]; linePos[o + 1] = py[e.s]; linePos[o + 2] = pz[e.s];
        linePos[o + 3] = px[e.t]; linePos[o + 4] = py[e.t]; linePos[o + 5] = pz[e.t];
      });
      linePosAttr.needsUpdate = true;
    };
    syncPositions();

    // ── Hover highlight: brighten edges touching a node ───────────────
    let hovered = -1;
    const applyHighlight = () => {
      if (hovered < 0) {
        lineColor.set(baseColor);
      } else {
        edges.forEach((e, k) => {
          const o = k * 6;
          const on = e.s === hovered || e.t === hovered;
          const cs = spriteData[e.s].color, ct = spriteData[e.t].color;
          const f = on ? 1.0 : 0.12;
          lineColor[o]     = cs.r * f; lineColor[o + 1] = cs.g * f; lineColor[o + 2] = cs.b * f;
          lineColor[o + 3] = ct.r * f; lineColor[o + 4] = ct.g * f; lineColor[o + 5] = ct.b * f;
        });
      }
      lineColAttr.needsUpdate = true;

      // Scale nodes: hovered up, others slightly down
      spriteData.forEach((sd, i) => {
        const k = i === hovered ? 1.28 : hovered < 0 ? 1 : 0.82;
        sd.sprite.scale.set(sd.baseW * k, sd.baseH * k, 1);
        sd.mat.opacity = hovered < 0 || i === hovered ? 1 : 0.5;
      });
    };

    // ════════════════════════════════════════════════════════════════
    //  REDUCED MOTION — static render, no loop, no interaction
    // ════════════════════════════════════════════════════════════════
    if (prefersReduced) {
      graph.rotation.set(-0.15, 0.5, 0);
      renderer.render(scene, camera);
      return () => {
        spriteData.forEach((sd) => { sd.mat.dispose(); sd.tex.dispose(); });
        lineGeo.dispose(); lineMat.dispose();
        renderer.dispose();
        if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      };
    }

    // ── Interaction: drag-rotate + parallax + raycast hover ───────────
    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const pointer = { x: 0, y: 0, inside: false };
    let dragging = false, lastX = 0, lastY = 0;
    let rotVelY = 0.0016;        // idle auto-rotation (y) + drag fling
    let targetTiltX = -0.12;     // parallax tilt target (x)

    const spritesArr = spriteData.map((s) => s.sprite);

    const setPointer = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      ndc.x =  (pointer.x / rect.width)  * 2 - 1;
      ndc.y = -(pointer.y / rect.height) * 2 + 1;
      targetTiltX = -0.12 + ndc.y * 0.2;
    };

    const onPointerDown = (e) => {
      dragging = true; lastX = e.clientX; lastY = e.clientY;
      renderer.domElement.style.cursor = "grabbing";
    };
    const onPointerMove = (e) => {
      pointer.inside = true;
      setPointer(e);
      if (dragging) {
        const dx = e.clientX - lastX, dy = e.clientY - lastY;
        lastX = e.clientX; lastY = e.clientY;
        graph.rotation.y += dx * 0.006;
        graph.rotation.x += dy * 0.006;
        rotVelY = dx * 0.0006; // fling
      }
    };
    const onPointerUp = () => {
      dragging = false;
      renderer.domElement.style.cursor = "grab";
    };
    const onPointerLeave = () => { pointer.inside = false; dragging = false; };

    renderer.domElement.style.cursor = "grab";
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerup", onPointerUp);
    renderer.domElement.addEventListener("pointerleave", onPointerLeave);

    const onResize = () => {
      const w = mount.clientWidth, h = mount.clientHeight || 520;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // ── Animation loop ────────────────────────────────────────────────
    let animId;
    const projV = new THREE.Vector3();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      step();          // keep the layout gently alive / responsive to drag
      syncPositions();

      // Idle auto-rotation when not dragging + eased parallax tilt
      if (!dragging) {
        rotVelY += (0.0016 - rotVelY) * 0.02;
        graph.rotation.y += rotVelY;
        graph.rotation.x += (targetTiltX - graph.rotation.x) * 0.04;
      }

      // ── Raycast hover ───────────────────────────────────────────────
      let nextHover = -1;
      if (pointer.inside && !dragging) {
        raycaster.setFromCamera(ndc, camera);
        const hits = raycaster.intersectObjects(spritesArr, false);
        if (hits.length) nextHover = spritesArr.indexOf(hits[0].object);
      }
      if (nextHover !== hovered) {
        hovered = nextHover;
        applyHighlight();

        const tip = tooltipRef.current;
        if (tip) {
          if (hovered >= 0 && nodes[hovered].type === "skill") {
            tip.style.opacity = "1";
            tip.querySelector("[data-tip-name]").textContent = nodes[hovered].label;
            tip.querySelector("[data-tip-level]").textContent = `${nodes[hovered].level}%`;
          } else {
            tip.style.opacity = "0";
          }
        }
      }

      // Position tooltip near the hovered node (world → screen)
      if (hovered >= 0 && tooltipRef.current) {
        projV.set(px[hovered], py[hovered], pz[hovered]);
        graph.localToWorld(projV);
        projV.project(camera);
        const rect = renderer.domElement.getBoundingClientRect();
        const sx = (projV.x * 0.5 + 0.5) * rect.width;
        const sy = (-projV.y * 0.5 + 0.5) * rect.height;
        tooltipRef.current.style.transform = `translate(-50%, -130%) translate(${sx}px, ${sy}px)`;
      }

      renderer.render(scene, camera);
    };
    animate();

    // ── Cleanup ────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId);
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      renderer.domElement.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", onResize);

      spriteData.forEach((sd) => { sd.mat.dispose(); sd.tex.dispose(); });
      lineGeo.dispose(); lineMat.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, [prefersReduced]);

  return (
    <div className="relative w-full">
      <div
        ref={mountRef}
        className="w-full"
        style={{ height: "clamp(420px, 60vh, 620px)", touchAction: "none" }}
        aria-hidden="true"
      />

      {/* Hover tooltip — positioned by the RAF loop */}
      <div
        ref={tooltipRef}
        className="pointer-events-none absolute top-0 left-0 z-10 px-3 py-1.5 rounded-lg border border-primary-500/40 bg-dark-900/90 backdrop-blur-sm shadow-xl transition-opacity duration-200"
        style={{ opacity: 0 }}
      >
        <span data-tip-name className="block font-heading font-bold text-white text-sm leading-tight" />
        <span data-tip-level className="block font-mono text-[10px] tracking-widest text-primary-500" />
      </div>

      {/* Hint */}
      <p className="mt-4 text-center font-mono text-[10px] tracking-[0.3em] text-white/25 uppercase select-none">
        Drag to rotate · Hover a node to trace connections
      </p>
    </div>
  );
};

export default SkillsGraph;
