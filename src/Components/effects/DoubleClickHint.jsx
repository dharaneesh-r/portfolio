/**
 * Components/effects/DoubleClickHint.jsx — homepage hint toast
 * ─────────────────────────────────────────────────────────────────────
 * 10 seconds after landing on the homepage, a small toast slides in to
 * tell the visitor they can double-click the page to trigger the glass-
 * shatter transition. Auto-dismisses, is manually closable, and shows
 * only once per browser session.
 *
 * Additive & non-invasive — renders a fixed toast, touches nothing else.
 * Mounted (gated to "/") in App.jsx. Remove = delete file + that line.
 */

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaHandPointer, FaTimes } from "react-icons/fa";
import { useReducedMotion } from "../../context/ReducedMotionContext";

const SESSION_KEY = "dh_dblclick_hint";
const SHOW_AFTER  = 10000;  // ms before the toast appears
const AUTO_HIDE   = 9000;   // ms the toast stays before auto-dismissing

const DoubleClickHint = () => {
  const [show, setShow] = useState(false);
  const prefersReduced = useReducedMotion();

  // Arm the 10s timer once per session
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(SESSION_KEY)) return;
    const t = setTimeout(() => {
      sessionStorage.setItem(SESSION_KEY, "1");
      setShow(true);
    }, SHOW_AFTER);
    return () => clearTimeout(t);
  }, []);

  // Auto-dismiss
  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => setShow(false), AUTO_HIDE);
    return () => clearTimeout(t);
  }, [show]);

  // Springy drop-in from the top; dramatic pop-up + blur-out on dismiss.
  const variants = prefersReduced
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0 } },
        exit:    { opacity: 0, transition: { duration: 0 } },
      }
    : {
        initial: { opacity: 0, y: -48, scale: 0.9 },
        animate: {
          opacity: 1, y: 0, scale: 1,
          transition: { type: "spring", stiffness: 320, damping: 20, mass: 0.7 },
        },
        exit: {
          opacity: 0, y: -64, scale: 0.62, rotate: -8, filter: "blur(6px)",
          transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] },
        },
      };

  return (
    <div className="fixed top-20 inset-x-0 z-[150] flex justify-center px-4 pointer-events-none">
      <AnimatePresence>
        {show && (
          <motion.div
            role="status"
            aria-live="polite"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="pointer-events-auto w-[330px] max-w-[90vw] flex items-start gap-3 rounded-2xl border border-primary-500/30 bg-dark-800/90 backdrop-blur-xl shadow-2xl shadow-primary-500/15 p-4 pr-3 overflow-hidden"
          >
            {/* icon */}
            <motion.div
              className="shrink-0 w-9 h-9 rounded-xl bg-primary-500/15 border border-primary-500/30 flex items-center justify-center text-primary-500"
              animate={prefersReduced ? {} : { y: [0, -3, 0] }}
              transition={prefersReduced ? {} : { duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            >
              <FaHandPointer className="text-sm" />
            </motion.div>

            {/* copy */}
            <div className="min-w-0 flex-1">
              <p className="font-heading font-bold text-white text-sm leading-tight mb-0.5">
                Try this <span className="text-primary-500">✦</span>
              </p>
              <p className="text-white/55 text-xs leading-relaxed font-mono">
                Double-click anywhere to shatter the page and jump to the next one.
              </p>
            </div>

            {/* close */}
            <button
              onClick={() => setShow(false)}
              aria-label="Dismiss"
              className="shrink-0 -mr-1 p-1 text-white/30 hover:text-white transition-colors duration-200"
            >
              <FaTimes className="text-xs" />
            </button>

            {/* auto-hide progress bar */}
            {!prefersReduced && (
              <motion.div
                className="absolute bottom-0 left-0 h-0.5 bg-primary-500/70"
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: AUTO_HIDE / 1000, ease: "linear" }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DoubleClickHint;
