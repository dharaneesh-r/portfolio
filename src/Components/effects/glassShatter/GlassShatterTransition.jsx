/**
 * glassShatter/GlassShatterTransition.jsx
 * ─────────────────────────────────────────────────────────────────────
 * Cinematic 3D glass-shatter transition between pages.
 *
 * Double-click (or double-tap) anywhere on a page → the current page
 * shatters into hundreds of glass fragments that fly out in 3D while the
 * camera dollies through, and the NEXT page in the nav order is revealed
 * behind the breaking glass.
 *
 * Page order (cycles): / → /aboutme → /skills → /projects → /contact → /
 *
 * Additive & non-invasive: renders nothing into the page. It snapshots
 * the live page with html2canvas, maps it onto shards in a full-screen
 * Three.js overlay, navigates underneath the still-intact glass, then
 * lets the shards break apart to reveal the next page.
 *
 *   • Works on every page; advances to the next page each time.
 *   • Ignores double-clicks on interactive controls (links, buttons,
 *     inputs…) so it never fires while you're using the UI.
 *   • Guarded: `runningRef` blocks re-triggers; runs once per interaction.
 *   • The running scene survives the route change and disposes itself.
 *   • Desktop dblclick + mobile double-tap; resize-safe; full disposal.
 *   • Reduced-motion / disabled / capture-failure → plain navigate.
 *
 * ENABLE/DISABLE: flip `ENABLED`. REMOVE: delete this folder + the mount
 * line in App.jsx.
 */

import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as THREE from "three";
import { gsap } from "gsap";
import html2canvas from "html2canvas";
import { useReducedMotion } from "../../../context/ReducedMotionContext";
import { buildShards } from "./buildShards";
import { vertexShader, fragmentShader } from "./shaders";

const ENABLED = true;
// Page sequence — double-click advances to the next entry (cycles round).
const ORDER = ["/", "/aboutme", "/skills", "/projects", "/contact"];

const nextOf = (path) => {
  const i = ORDER.indexOf(path);
  if (i < 0) return null;                 // unknown route → effect disabled
  return ORDER[(i + 1) % ORDER.length];
};

// Don't hijack double-clicks that land on interactive UI.
const isInteractive = (el) =>
  !!(el && el.closest && el.closest("a,button,input,textarea,select,label,[role='button'],[data-cursor]"));

const GlassShatterTransition = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const prefersReduced = useReducedMotion();
  const runningRef = useRef(false);

  useEffect(() => {
    const target = nextOf(pathname);
    if (!ENABLED || !target) return;

    let lastTap = 0;

    const trigger = (x, y) => {
      if (runningRef.current) return;             // prevent multiple triggers
      runningRef.current = true;
      window.getSelection?.()?.removeAllRanges?.();
      run(x, y, target);
    };

    const onDblClick = (e) => {
      if (isInteractive(e.target)) return;
      trigger(e.clientX, e.clientY);
    };
    const onTouchEnd = (e) => {
      const t = e.changedTouches && e.changedTouches[0];
      if (!t) return;
      const now = Date.now();
      if (now - lastTap < 320 && !isInteractive(e.target)) trigger(t.clientX, t.clientY);
      lastTap = now;
    };

    window.addEventListener("dblclick", onDblClick);
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    async function run(px, py, dest) {
      if (prefersReduced) {
        navigate(dest);
        runningRef.current = false;
        return;
      }

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const isMobile = vw < 768;

      // ── 1. Snapshot the current page ────────────────────────────────
      let snap;
      try {
        snap = await html2canvas(document.body, {
          backgroundColor: "#050505",
          scale: Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2),
          useCORS: true,        // CORS-friendly CDNs load; others skip (no taint)
          allowTaint: false,    // never taint the canvas (WebGL-safe)
          logging: false,
          width: vw,
          height: vh,
          windowWidth: vw,
          windowHeight: vh,
          x: window.scrollX,
          y: window.scrollY,
        });
      } catch {
        navigate(dest);
        runningRef.current = false;
        return;
      }

      let overlay, renderer, geo, mat, tex, raf;
      const dispose = () => {
        if (raf) cancelAnimationFrame(raf);
        window.removeEventListener("resize", onResize);
        geo?.dispose();
        mat?.dispose();
        tex?.dispose();
        renderer?.dispose();
        if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
        runningRef.current = false;
      };
      const onResize = () => {
        if (!renderer) return;
        const w = window.innerWidth, h = window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };

      let camera;
      try {
        // ── 2. Overlay + renderer (above everything, click-through) ───
        overlay = document.createElement("div");
        Object.assign(overlay.style, {
          position: "fixed", inset: "0", zIndex: "300", pointerEvents: "none", opacity: "1",
        });
        document.body.appendChild(overlay);

        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !isMobile });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(vw, vh);
        renderer.setClearColor(0x000000, 0);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.domElement.style.cssText = "display:block;width:100%;height:100%;";
        overlay.appendChild(renderer.domElement);

        // ── 3. Scene / camera sized so the plane fills the viewport ───
        const scene = new THREE.Scene();
        const FOV = 50;
        const D = 600;
        camera = new THREE.PerspectiveCamera(FOV, vw / vh, 0.1, 4000);
        camera.position.set(0, 0, D);

        const planeH = 2 * D * Math.tan((FOV * Math.PI) / 360);
        const planeW = planeH * (vw / vh);

        const impactX = (px / vw - 0.5) * planeW;
        const impactY = -(py / vh - 0.5) * planeH;

        const cols = isMobile ? 16 : 26;
        const rows = isMobile ? 11 : 16;

        geo = buildShards({ W: planeW, H: planeH, impactX, impactY, cols, rows });

        tex = new THREE.CanvasTexture(snap);
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;

        mat = new THREE.ShaderMaterial({
          uniforms: {
            uTexture:  { value: tex },
            uProgress: { value: 0 },
            uTravel:   { value: Math.max(planeW, planeH) * 0.9 },
            uGravity:  { value: planeH * 0.14 },
            uStretch:  { value: 0.55 },
          },
          vertexShader,
          fragmentShader,
          transparent: true,
          side: THREE.DoubleSide,
          depthWrite: false,
        });

        scene.add(new THREE.Mesh(geo, mat));
        window.addEventListener("resize", onResize);

        const renderLoop = () => {
          raf = requestAnimationFrame(renderLoop);
          renderer.render(scene, camera);
        };

        // Cover with the intact snapshot, THEN navigate underneath it.
        renderer.render(scene, camera);
        renderLoop();
        navigate(dest);

        // ── 4. Timeline: shatter + camera dolly-through ─────────────
        const DUR = 1.9;
        const tl = gsap.timeline({
          onComplete: () => {
            gsap.to(overlay, { opacity: 0, duration: 0.35, ease: "power2.out", onComplete: dispose });
          },
        });
        tl.to(mat.uniforms.uProgress, { value: 1, duration: DUR, ease: "power2.in" }, 0);
        tl.to(camera.position, { z: D * 0.12, duration: DUR, ease: "power2.inOut" }, 0);
        tl.to(camera.position, { x: planeW * 0.04, y: -planeH * 0.02, duration: DUR, ease: "sine.inOut" }, 0);
      } catch {
        // Any WebGL/texture failure → fall back to a plain navigate.
        dispose();
        navigate(dest);
      }
    }

    // Cleanup ONLY detaches listeners — a running animation survives the
    // route change and disposes itself on completion.
    return () => {
      window.removeEventListener("dblclick", onDblClick);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [pathname, navigate, prefersReduced]);

  return null;
};

export default GlassShatterTransition;
