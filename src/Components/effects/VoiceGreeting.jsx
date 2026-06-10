/**
 * Components/effects/VoiceGreeting.jsx — spoken welcome
 * ─────────────────────────────────────────────────────────────────────
 * Speaks "Welcome to Dharaneesh's portfolio" using the Web Speech API
 * (SpeechSynthesis). Renders nothing.
 *
 * WHY ON FIRST INTERACTION (not on load):
 *   Browsers block speech/audio until the page has a user-activation
 *   gesture (click / key / tap). Calling speak() on load is silently
 *   dropped. So we arm a one-shot that fires on the first real gesture.
 *
 *   • Speaks once per browser tab session (sessionStorage guard).
 *   • Picks a natural English voice when one is available.
 *   • No-ops gracefully where SpeechSynthesis is unavailable.
 *
 * REMOVAL: delete this file + its mount line in App.jsx.
 */

import { useEffect } from "react";

// Phonetic respelling of "Dharaneesh" so the speech engine says it
// clearly as "Dhuh-rah-neesh" (Web Speech API has no reliable SSML, so
// we shape pronunciation via spelling). On-screen text is unchanged.
const GREETING = "Welcome to Dhuh-rah-neesh's portfolio";
const SESSION_KEY = "dh_voice_greeted";

const VoiceGreeting = () => {
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (sessionStorage.getItem(SESSION_KEY)) return;

    const synth = window.speechSynthesis;
    // Activation gestures the browser accepts for unblocking audio.
    const events = ["pointerdown", "keydown", "touchstart", "click"];

    const cleanup = () => {
      events.forEach((e) => window.removeEventListener(e, onGesture));
    };

    const pickVoice = () => {
      const voices = synth.getVoices() || [];
      return (
        voices.find((v) => /^en/i.test(v.lang) && /natural|google|samantha|zira|aria|jenny/i.test(v.name)) ||
        voices.find((v) => /^en[-_]?US/i.test(v.lang)) ||
        voices.find((v) => /^en/i.test(v.lang)) ||
        null
      );
    };

    const speak = () => {
      if (sessionStorage.getItem(SESSION_KEY)) { cleanup(); return; }
      try {
        const u = new SpeechSynthesisUtterance(GREETING);
        u.lang = "en-US";
        u.rate = 0.96;
        u.pitch = 1.05;
        u.volume = 1;
        const v = pickVoice();
        if (v) u.voice = v;
        synth.cancel();      // clear any stuck queue
        synth.speak(u);
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* ignore — speech is a nicety, never break the page */
      }
      cleanup();
    };

    const onGesture = () => speak();

    // Voices can load asynchronously; warm them up so pickVoice() has data.
    if (typeof synth.onvoiceschanged !== "undefined") {
      synth.onvoiceschanged = () => synth.getVoices();
    }
    synth.getVoices();

    events.forEach((e) => window.addEventListener(e, onGesture, { passive: true }));
    return cleanup;
  }, []);

  return null;
};

export default VoiceGreeting;
