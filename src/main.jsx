/**
 * main.jsx — application entry point
 * ─────────────────────────────────────────────────────────────────
 * Provider tree (outermost → innermost):
 *   BrowserRouter          — router context
 *   ReducedMotionProvider  — single OS matchMedia listener
 *   LenisProvider          — smooth scroll + gsap.ticker RAF
 *   App                    — layout, cursor, page transition, routes
 *
 * gsap.registerPlugin is called ONCE here.
 * No component may call registerPlugin themselves.
 */

import { createRoot }    from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { gsap }          from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./index.css";
import App from "./App.jsx";
import { LenisProvider }          from "./context/LenisContext.jsx";
import { ReducedMotionProvider }  from "./context/ReducedMotionContext.jsx";

// ── Single plugin registration point ────────────────────────────────
gsap.registerPlugin(ScrollTrigger);

// Prevent the browser from restoring scroll position on reload/back-nav.
// Without this, the page reloads mid-scroll and GSAP ScrollTrigger sees
// elements already past their start points, completing animations instantly.
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}
window.scrollTo(0, 0);

createRoot(document.getElementById("root")).render(
  <HelmetProvider>
    <BrowserRouter>
      <ReducedMotionProvider>
      <LenisProvider>
        <App />
      </LenisProvider>
    </ReducedMotionProvider>
  </BrowserRouter>
  </HelmetProvider>
);

