/**
 * ThreeBackground.jsx — Ember Nebula particle field
 * ─────────────────────────────────────────────────────────────────
 * Senior Three.js technique stack used here:
 *
 *  • CanvasTexture (64×64 radial-gradient sprite) → soft glow per particle
 *  • THREE.AdditiveBlending → overlapping particles GLOW (fire/star look)
 *  • vertexColors → per-particle colour gradient (orange-white core → purple rim)
 *  • depthWrite: false → correct transparency layering without sorting artefacts
 *  • Float32Array position + velocity stores → update BufferAttribute each frame
 *    (avoids new Float32Array allocations in the hot loop)
 *  • Flow-field motion: 3-D sin/cos vector field drives particle velocities
 *  • Mouse repulsion: projects cursor to world-space, pushes nearby particles
 *  • Lenis scroll → camera Z drift + field speed multiplier
 *  • Reduced-motion: single frame rendered then RAF cancelled
 *  • Mobile (<768): 1 200 particles, no large glow orbs, no antialias
 *  • Full disposal on unmount: geometry, material, texture, renderer, RAF
 */

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useLenis } from "../context/LenisContext";
import { useReducedMotion } from "../context/ReducedMotionContext";

// ── Glow sprite texture (64×64 radial gradient canvas) ───────────────
function createGlowTexture() {
  const SIZE = 64;
  const canvas = document.createElement("canvas");
  canvas.width = SIZE; canvas.height = SIZE;
  const ctx = canvas.getContext("2d");
  const g = ctx.createRadialGradient(SIZE / 2, SIZE / 2, 0, SIZE / 2, SIZE / 2, SIZE / 2);
  g.addColorStop(0.00, "rgba(255,210,120,1)");    // hot yellow-white core
  g.addColorStop(0.15, "rgba(249,115,22,0.95)");  // orange
  g.addColorStop(0.40, "rgba(234,88,12,0.45)");   // dark orange
  g.addColorStop(0.70, "rgba(180,50,10,0.12)");   // ember glow rim
  g.addColorStop(1.00, "rgba(0,0,0,0)");           // transparent edge
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, SIZE, SIZE);
  return new THREE.CanvasTexture(canvas);
}

// ── Simple inline simplex-like noise (no external dep needed) ────────
function noise(x, y, z) {
  return (
    Math.sin(x * 1.23 + z * 0.7) * Math.cos(y * 0.97 + z * 1.1) +
    Math.sin(y * 1.51 + x * 0.5) * 0.5 +
    Math.cos(z * 1.33 + y * 0.8) * 0.35
  ) / 1.85;
}

const ThreeBackground = () => {
  const mountRef  = useRef(null);
  const scrollRef = useRef(0);
  const mouseRef  = useRef({ x: 0, y: 0 });
  const lenis     = useLenis();
  const prefersReduced = useReducedMotion();

  // Track Lenis scroll
  useEffect(() => {
    if (!lenis) return;
    const onScroll = (e) => { scrollRef.current = e.scroll; };
    lenis.on("scroll", onScroll);
    return () => lenis.off("scroll", onScroll);
  }, [lenis]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const isMobile = window.innerWidth < 768;

    // ── Renderer ────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      alpha:     true,
      antialias: !isMobile,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // ── Scene + Camera ───────────────────────────────────────────────
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      55,
      mount.clientWidth / mount.clientHeight,
      0.1,
      500
    );
    camera.position.set(0, 0, 42);

    // ── Glow texture (shared) ────────────────────────────────────────
    const glowTex = createGlowTexture();

    // ═══════════════════════════════════════════════════════════════
    // LAYER 1 — Large ambient glow blobs (desktop only)
    // ═══════════════════════════════════════════════════════════════
    let blobPoints = null, blobGeo = null, blobMat = null;
    if (!isMobile) {
      const BLOBS = 40;
      const blobPos = new Float32Array(BLOBS * 3);
      const blobCol = new Float32Array(BLOBS * 3);
      for (let i = 0; i < BLOBS; i++) {
        const r = 20 + Math.random() * 30;
        const theta = Math.random() * Math.PI * 2;
        const phi   = Math.acos(2 * Math.random() - 1);
        blobPos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
        blobPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        blobPos[i * 3 + 2] = (Math.random() - 0.5) * 40;
        // Orange-amber colours, slightly varied
        blobCol[i * 3]     = 0.90 + Math.random() * 0.10;
        blobCol[i * 3 + 1] = 0.25 + Math.random() * 0.20;
        blobCol[i * 3 + 2] = 0.02 + Math.random() * 0.05;
      }
      blobGeo = new THREE.BufferGeometry();
      blobGeo.setAttribute("position", new THREE.BufferAttribute(blobPos, 3));
      blobGeo.setAttribute("color",    new THREE.BufferAttribute(blobCol, 3));
      blobMat = new THREE.PointsMaterial({
        size:         18,
        map:          glowTex,
        blending:     THREE.AdditiveBlending,
        transparent:  true,
        depthWrite:   false,
        vertexColors: true,
        opacity:      0.18,
        sizeAttenuation: true,
      });
      blobPoints = new THREE.Points(blobGeo, blobMat);
      scene.add(blobPoints);
    }

    // ═══════════════════════════════════════════════════════════════
    // LAYER 2 — Fine ember particles with flow-field motion
    // ═══════════════════════════════════════════════════════════════
    const COUNT = isMobile ? 1200 : 4000;

    // Typed arrays — no GC pressure in the hot loop
    const pos = new Float32Array(COUNT * 3);
    const vel = new Float32Array(COUNT * 3); // x, y, z velocities
    const col = new Float32Array(COUNT * 3);

    for (let i = 0; i < COUNT; i++) {
      // Spherical shell distribution — more interesting than a cube
      const r     = 15 + Math.random() * 45;
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = (Math.random() - 0.5) * 55;

      // Zero initial velocity
      vel[i * 3] = vel[i * 3 + 1] = vel[i * 3 + 2] = 0;

      // Colour: bright orange core blend to amber/red at edges
      const t = Math.random();
      col[i * 3]     = 0.88 + t * 0.12;          // R
      col[i * 3 + 1] = 0.18 + t * 0.30;          // G
      col[i * 3 + 2] = 0.00 + t * 0.04;          // B
    }

    const pGeo = new THREE.BufferGeometry();
    const posAttr = new THREE.BufferAttribute(pos, 3);
    posAttr.setUsage(THREE.DynamicDrawUsage);     // tell GPU positions update every frame
    pGeo.setAttribute("position", posAttr);
    pGeo.setAttribute("color",    new THREE.BufferAttribute(col, 3));

    const pMat = new THREE.PointsMaterial({
      size:         isMobile ? 1.8 : 2.6,
      map:          glowTex,
      blending:     THREE.AdditiveBlending,
      transparent:  true,
      depthWrite:   false,
      vertexColors: true,
      opacity:      isMobile ? 0.55 : 0.75,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(pGeo, pMat);
    scene.add(points);

    // ═══════════════════════════════════════════════════════════════
    // LAYER 3 — Floating tech-label sprites (desktop only)
    // Each sprite is a CanvasTexture pill with brand colour + text.
    // They drift slowly through the nebula like deep-space annotations.
    // ═══════════════════════════════════════════════════════════════
    const TECH_LABELS = [
      { text: "REACT",       color: "#61DAFB" },
      { text: "NODE.JS",     color: "#8CC84B" },
      { text: "DOCKER",      color: "#2496ED" },
      { text: "KUBERNETES",  color: "#326CE5" },
      { text: "AWS",         color: "#FF9900" },
      { text: "MONGODB",     color: "#47A248" },
      { text: "TYPESCRIPT",  color: "#3178C6" },
      { text: "GRAFANA",     color: "#F46800" },
      { text: "PROMETHEUS",  color: "#E6522C" },
      { text: "NEXT.JS",     color: "#ffffff" },
      { text: "REDIS",       color: "#FF4438" },
      { text: "THREE.JS",    color: "#f97316" },
    ];

    const sprites = [];

    if (!isMobile) {
      const labelW = 220, labelH = 54;

      TECH_LABELS.forEach((label, i) => {
        // ── CanvasTexture for this label ───────────────────────────
        const lc = document.createElement("canvas");
        lc.width = labelW; lc.height = labelH;
        const lx = lc.getContext("2d");

        // Dark pill background
        lx.fillStyle = "rgba(5,5,5,0.72)";
        lx.beginPath();
        lx.moveTo(14, 0); lx.lineTo(labelW - 14, 0);
        lx.quadraticCurveTo(labelW, 0, labelW, 14);
        lx.lineTo(labelW, labelH - 14);
        lx.quadraticCurveTo(labelW, labelH, labelW - 14, labelH);
        lx.lineTo(14, labelH);
        lx.quadraticCurveTo(0, labelH, 0, labelH - 14);
        lx.lineTo(0, 14);
        lx.quadraticCurveTo(0, 0, 14, 0);
        lx.closePath();
        lx.fill();

        // Brand-colour border (subtle)
        lx.strokeStyle = label.color;
        lx.lineWidth = 1.2;
        lx.globalAlpha = 0.45;
        lx.stroke();
        lx.globalAlpha = 1;

        // Brand-colour left accent bar
        lx.fillStyle = label.color;
        lx.fillRect(0, labelH * 0.25, 3, labelH * 0.5);

        // Text
        lx.fillStyle = label.color;
        lx.font = "bold 20px 'Courier New', monospace";
        lx.textAlign = "center";
        lx.textBaseline = "middle";
        lx.fillText(label.text, labelW / 2 + 4, labelH / 2);

        const tex = new THREE.CanvasTexture(lc);
        const mat = new THREE.SpriteMaterial({
          map:         tex,
          transparent: true,
          blending:    THREE.AdditiveBlending,
          depthWrite:  false,
          opacity:     0.30 + Math.random() * 0.22,
        });
        const sprite = new THREE.Sprite(mat);

        // Scale sprite to world units (canvas aspect ratio preserved)
        sprite.scale.set(labelW / 10, labelH / 10, 1);

        // Random position in the nebula volume
        const r     = 18 + Math.random() * 34;
        const theta = Math.random() * Math.PI * 2;
        const phi   = Math.acos(2 * Math.random() - 1);
        sprite.position.set(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta) * 0.6,
          (Math.random() - 0.5) * 28,
        );

        // Drift velocities (very slow)
        sprite.userData = {
          vx:      (Math.random() - 0.5) * 0.012,
          vy:      (Math.random() - 0.5) * 0.010,
          vz:      (Math.random() - 0.5) * 0.006,
          phase:   Math.random() * Math.PI * 2,
          baseOp:  mat.opacity,
        };

        scene.add(sprite);
        sprites.push({ sprite, mat, tex });
      });
    }

    // ── Mouse tracking ───────────────────────────────────────────────
    const REPEL_RADIUS = 18;
    const REPEL_FORCE  = 0.06;

    const onMouse = (e) => {
      // Normalise to [-1, 1]
      mouseRef.current.x =  (e.clientX / window.innerWidth  - 0.5) * 2;
      mouseRef.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouse, { passive: true });

    // ── Resize ───────────────────────────────────────────────────────
    const onResize = () => {
      const w = mount.clientWidth, h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // ── Animation loop ───────────────────────────────────────────────
    let animId;
    const clock = new THREE.Clock();

    // World-space mouse position (project to z=0 plane at camera.z)
    const mWorld = new THREE.Vector3();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t   = clock.getElapsedTime();
      const dt  = Math.min(clock.getDelta(), 0.05); // cap at 50ms to avoid spiral

      const scrollY    = scrollRef.current;
      const scrollNorm = scrollY / Math.max(
        document.body.scrollHeight - window.innerHeight, 1
      );
      const flowSpeed = 1 + scrollNorm * 0.8;  // scroll speeds up the field

      // Project mouse to world space (z=0 plane)
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      mWorld.set(mx * 50, my * 50, 0); // approximate world coords

      // ── Update each ember particle ────────────────────────────────
      for (let i = 0; i < COUNT; i++) {
        const ix = i * 3, iy = ix + 1, iz = ix + 2;
        const px = pos[ix], py = pos[iy], pz = pos[iz];

        // 3-D flow field — sin/cos field with time
        const nx = noise(px * 0.015, py * 0.015, t * 0.12 * flowSpeed);
        const ny = noise(py * 0.015, pz * 0.015, t * 0.10 * flowSpeed);
        const nz = noise(pz * 0.015, px * 0.015, t * 0.08 * flowSpeed);

        vel[ix] += nx * 0.008;
        vel[iy] += ny * 0.008 - 0.0003; // very subtle upward drift (embers rise)
        vel[iz] += nz * 0.004;

        // Mouse repulsion
        if (!isMobile) {
          const dxm = px - mWorld.x, dym = py - mWorld.y;
          const dm  = Math.sqrt(dxm * dxm + dym * dym);
          if (dm < REPEL_RADIUS && dm > 0.01) {
            const force = (REPEL_RADIUS - dm) / REPEL_RADIUS * REPEL_FORCE;
            vel[ix] += (dxm / dm) * force;
            vel[iy] += (dym / dm) * force;
          }
        }

        // Damping
        vel[ix] *= 0.975;
        vel[iy] *= 0.975;
        vel[iz] *= 0.975;

        // Integrate position
        pos[ix] += vel[ix];
        pos[iy] += vel[iy];
        pos[iz] += vel[iz];

        // Boundary wrap — keeps the field full
        if (Math.abs(pos[ix]) > 65) pos[ix] *= -0.85;
        if (pos[iy] >  65) pos[iy] = -65;
        if (pos[iy] < -65) pos[iy] =  65;
        if (Math.abs(pos[iz]) > 35) pos[iz] *= -0.90;
      }

      posAttr.needsUpdate = true;

      // ── Camera: mouse parallax + scroll zoom out ──────────────────
      camera.position.x += (mx * 5  - camera.position.x) * 0.035;
      camera.position.y += (my * 3  - camera.position.y) * 0.035;
      camera.position.z  = 42 + scrollNorm * 12;

      // ── Blob layer slow rotation ──────────────────────────────────
      if (blobPoints) {
        blobPoints.rotation.y = t * 0.018;
        blobPoints.rotation.x = t * 0.007;
      }

      // ── Sprite label drift + opacity pulse ───────────────────────
      sprites.forEach(({ sprite, mat }) => {
        const ud = sprite.userData;
        sprite.position.x += ud.vx;
        sprite.position.y += ud.vy;
        sprite.position.z += ud.vz;
        // Soft bounce at boundaries
        if (Math.abs(sprite.position.x) > 52) ud.vx *= -1;
        if (Math.abs(sprite.position.y) > 32) ud.vy *= -1;
        if (Math.abs(sprite.position.z) > 22) ud.vz *= -1;
        // Gentle opacity breathe
        mat.opacity = ud.baseOp + Math.sin(t * 0.35 + ud.phase) * 0.10;
      });

      camera.lookAt(scene.position);
      renderer.render(scene, camera);

      if (prefersReduced) cancelAnimationFrame(animId);
    };
    animate();

    // ── Cleanup ──────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);

      pGeo.dispose(); pMat.dispose();
      blobGeo?.dispose(); blobMat?.dispose();
      glowTex.dispose();
      sprites.forEach(({ mat, tex }) => { mat.dispose(); tex.dispose(); });
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [prefersReduced]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="absolute inset-0 z-0"
      style={{ pointerEvents: "none" }}
    />
  );
};

export default ThreeBackground;
