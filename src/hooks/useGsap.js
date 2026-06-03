/**
 * hooks/useGsap.js
 * ─────────────────────────────────────────────────────────────────
 * Thin wrapper around gsap.context() that handles cleanup automatically.
 * Modelled after the official @gsap/react useGSAP hook.
 *
 * Usage:
 *   const { contextSafe } = useGsap(
 *     (self) => {
 *       gsap.from(".my-el", { opacity: 0, y: 40, duration: 0.6 });
 *     },
 *     { scope: containerRef, dependencies: [someState] }
 *   );
 *
 *   // Inside event handlers that need to be context-safe:
 *   const handleClick = contextSafe(() => {
 *     gsap.to(".my-el", { scale: 1.1 });
 *   });
 *
 * Notes:
 *  - Uses useLayoutEffect so GSAP reads correct DOM measurements.
 *  - ctx.revert() on cleanup kills all tweens/ScrollTriggers created
 *    inside the context — zero leaks guaranteed.
 *  - Pass `scope` as a ref to scope CSS selector queries to that element.
 */

import { useLayoutEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";

/**
 * @param {(self: gsap.Context) => void} fn   — animation setup callback
 * @param {{ scope?: React.RefObject, dependencies?: any[] }} options
 * @returns {{ contextSafe: (fn: Function) => Function }}
 */
export const useGsap = (fn, { scope, dependencies = [] } = {}) => {
  const ctxRef = useRef(null);

  useLayoutEffect(() => {
    const scopeEl = scope?.current ?? undefined;
    const ctx = gsap.context(fn, scopeEl);
    ctxRef.current = ctx;

    return () => {
      ctx.revert();
      ctxRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  /**
   * Wrap any event handler so tweens it creates belong to the same
   * context and are reverted on cleanup.
   */
  const contextSafe = useCallback(
    (callback) => {
      return (...args) => {
        if (ctxRef.current) {
          return ctxRef.current.add(() => callback(...args));
        }
        return callback(...args);
      };
    },
    [] // stable — context ref is mutable
  );

  return { contextSafe };
};
