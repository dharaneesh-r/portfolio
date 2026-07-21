import { useState, useRef, useEffect } from "react";
import emailjs from "@emailjs/browser";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  FaGithub, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt,
  FaPaperPlane, FaCheckCircle, FaTimesCircle, FaArrowRight,
} from "react-icons/fa";
import { personalInfo } from "../data/personal";
import MagneticWrapper from "./ui/MagneticWrapper";
import GsapButton from "./ui/GsapButton";
import SocialIcon from "./ui/SocialIcon";
import SEO from "./SEO";
import { useReducedMotion } from "../context/ReducedMotionContext";
import { EASE, DUR } from "../motion/tokens";

// ── ScrambleHeading ────────────────────────────────────────────────────────
const ScrambleHeading = ({ children, className = "", delay = 0 }) => {
  const elRef = useRef(null);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#@!$";

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    const original = el.textContent;
    const TICK = 36, DUR_MS = 400, STAG = 45;

    const run = () => {
      const now = Date.now();
      const starts = original.split("").map((_, i) => now + i * STAG + delay);
      const settled = original.split("").map(() => false);
      const iv = setInterval(() => {
        const t = Date.now();
        let all = true;
        const result = original.split("").map((ch, i) => {
          if (ch === " ") return " ";
          if (settled[i]) return ch;
          if (t < starts[i]) { all = false; return ch; }
          const elapsed = t - starts[i];
          if (elapsed >= DUR_MS) { settled[i] = true; return ch; }
          all = false;
          return chars[Math.floor(Math.random() * chars.length)];
        });
        el.textContent = result.join("");
        if (all) clearInterval(iv);
      }, TICK);
      return iv;
    };

    let iv;
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 88%",
      once: true,
      onEnter: () => { iv = run(); },
    });
    return () => { st.kill(); clearInterval(iv); };
  }, []);

  return <h2 ref={elRef} className={className}>{children}</h2>;
};

// ── Contact ────────────────────────────────────────────────────────────────
const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const formRef = useRef(null);
  const pageRef = useRef(null);
  const reducedMotion = useReducedMotion();

  // ── Hero clip-path reveal (immediate, no scroll trigger) ──────────────
  useEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-line",
        { clipPath: "inset(0 0 100% 0)", y: 40, opacity: 0 },
        {
          clipPath: "inset(0 0 0% 0)",
          y: 0,
          opacity: 1,
          duration: 1.0,
          ease: "power4.out",
          stagger: 0.15,
        }
      );
      gsap.fromTo(
        ".hero-sub",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.45 }
      );
      gsap.fromTo(
        ".hero-label",
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.6, ease: "power2.out", delay: 0.1 }
      );
    }, pageRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  // ── Individual scroll-triggered animations ────────────────────────────
  useEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      // Contact info cards — each triggers itself
      gsap.utils.toArray(".contact-info-card").forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, x: -50 },
          {
            opacity: 1,
            x: 0,
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
            duration: 0.7,
            delay: i * 0.1,
            ease: "power3.out",
          }
        );
      });

      // Form wrapper
      const formWrap = document.querySelector(".contact-form-wrap");
      if (formWrap) {
        gsap.fromTo(
          formWrap,
          { opacity: 0, x: 50 },
          {
            opacity: 1,
            x: 0,
            scrollTrigger: { trigger: formWrap, start: "top 88%", once: true },
            duration: 0.8,
            ease: "power3.out",
          }
        );
      }

      // Form fields — each triggers itself
      gsap.utils.toArray(".form-field").forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
            duration: 0.5,
            delay: i * 0.08,
            ease: "power2.out",
          }
        );
      });

      // Bottom CTA section
      const cta = document.querySelector(".cta-section");
      if (cta) {
        gsap.fromTo(
          cta,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            scrollTrigger: { trigger: cta, start: "top 88%", once: true },
            duration: 0.9,
            ease: "power3.out",
          }
        );
      }
    }, pageRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  // ── Form focus label highlight ─────────────────────────────────────────
  const handleFocus = (labelFor) => {
    const label = document.querySelector(`label[for="${labelFor}"]`);
    if (label) gsap.to(label, { color: "#f97316", scale: 1.04, duration: 0.2, transformOrigin: "left center" });
  };
  const handleBlur = (labelFor) => {
    const label = document.querySelector(`label[for="${labelFor}"]`);
    if (label) gsap.to(label, { color: "#ffffff", scale: 1, duration: 0.2, transformOrigin: "left center" });
  };

  // ── Submit ─────────────────────────────────────────────────────────────
  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    const btn = e.currentTarget.querySelector(".submit-btn");
    if (btn) gsap.to(btn, { scale: 0.97, duration: 0.12 });

    try {
      const result = await emailjs.sendForm(
        "YOUR_SERVICE_ID",
        "YOUR_TEMPLATE_ID",
        formRef.current,
        "YOUR_PUBLIC_KEY"
      );
      console.log("Email sent:", result.text);
      setSubmitStatus({ type: "success", message: "Message sent! I'll get back to you soon." });
      formRef.current.reset();
    } catch (error) {
      console.error("Email failed:", error);
      setSubmitStatus({ type: "error", message: "Failed to send. Please email me directly." });
    } finally {
      setIsSubmitting(false);
      if (btn) gsap.to(btn, { scale: 1, duration: 0.3, ease: "elastic.out(1, 0.5)" });
    }
  };

  const github = personalInfo.socialLinks.find((l) => l.platform === "GitHub");
  const linkedin = personalInfo.socialLinks.find((l) => l.platform === "LinkedIn");

  return (
    <div ref={pageRef} className="min-h-screen bg-dark-900 relative overflow-hidden">
      <SEO 
        title="Contact | Dharaneesh R" 
        description="Get in touch with Dharaneesh R for opportunities, collaborations, or just to say hi." 
      />
      {/* Subtle background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-32 left-0 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-40 right-0 w-[500px] h-[500px] bg-primary-600/5 rounded-full blur-[100px]" />
      </div>

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="pt-24 pb-16 px-6 sm:px-10 lg:px-20 xl:px-28 relative z-10">
        <div className="max-w-7xl mx-auto">
          <p className="hero-label font-mono text-primary-500 text-sm tracking-[0.2em] uppercase mb-6 flex items-center gap-3">
            <span className="inline-block w-6 h-px bg-primary-500" />
            Contact
          </p>

          <div className="overflow-hidden mb-2">
            <h1
              className="hero-line font-heading font-black text-white leading-none"
              style={{ fontSize: "clamp(52px, 9vw, 130px)" }}
            >
              GET IN
            </h1>
          </div>
          <div className="overflow-hidden mb-8">
            <h1
              className="hero-line font-heading font-black leading-none"
              style={{
                fontSize: "clamp(52px, 9vw, 130px)",
                WebkitTextStroke: "2px #f97316",
                color: "transparent",
              }}
            >
              TOUCH.
            </h1>
          </div>

          <p className="hero-sub text-white/50 text-lg sm:text-xl max-w-2xl leading-relaxed">
            Have a project in mind or want to{" "}
            <span className="text-primary-500 font-semibold">collaborate</span>?
            I'm always open to new opportunities and interesting conversations.
          </p>
        </div>
      </section>

      {/* ── MAIN GRID ─────────────────────────────────────────────────── */}
      <section className="py-16 px-6 sm:px-10 lg:px-20 xl:px-28 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

            {/* ── LEFT SIDEBAR ────────────────────────────────────────── */}
            <div className="lg:col-span-1 space-y-5">

              {/* Availability */}
              <div className="contact-info-card rounded-xl border border-white/6 bg-white/[0.02] hover:bg-white/[0.04] hover:border-primary-500/20 transition-all duration-500 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400" />
                  </span>
                  <span className="font-mono text-xs text-white/40 uppercase tracking-widest">Status</span>
                </div>
                <p className="text-white font-heading font-black text-xl leading-tight mb-1">
                  Available for Work
                </p>
                <p className="text-white/40 text-sm font-mono leading-relaxed">
                  {personalInfo.currentFocus}
                </p>
              </div>

              {/* Email */}
              <div className="contact-info-card rounded-xl border border-white/6 bg-white/[0.02] hover:bg-white/[0.04] hover:border-primary-500/20 transition-all duration-500 p-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FaEnvelope className="text-primary-500 text-sm" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-mono text-xs text-white/30 uppercase tracking-widest mb-1">Email</p>
                    <a
                      href={`mailto:${personalInfo.email}`}
                      className="text-white hover:text-primary-500 transition-colors duration-300 text-sm break-all leading-relaxed"
                    >
                      {personalInfo.email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="contact-info-card rounded-xl border border-white/6 bg-white/[0.02] hover:bg-white/[0.04] hover:border-primary-500/20 transition-all duration-500 p-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FaPhone className="text-primary-500 text-sm" />
                  </div>
                  <div>
                    <p className="font-mono text-xs text-white/30 uppercase tracking-widest mb-1">Phone</p>
                    <a
                      href={`tel:${personalInfo.phone}`}
                      className="text-white hover:text-primary-500 transition-colors duration-300 text-sm"
                    >
                      {personalInfo.phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="contact-info-card rounded-xl border border-white/6 bg-white/[0.02] hover:bg-white/[0.04] hover:border-primary-500/20 transition-all duration-500 p-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FaMapMarkerAlt className="text-primary-500 text-sm" />
                  </div>
                  <div>
                    <p className="font-mono text-xs text-white/30 uppercase tracking-widest mb-1">Location</p>
                    <p className="text-white text-sm">{personalInfo.location}</p>
                  </div>
                </div>
              </div>

              {/* Social links with 3D tilt */}
              <div className="contact-info-card rounded-xl border border-white/6 bg-white/[0.02] hover:bg-white/[0.04] hover:border-primary-500/20 transition-all duration-500 p-5">
                <p className="font-mono text-xs text-white/30 uppercase tracking-widest mb-4">Connect</p>
                <div className="flex gap-3">
                  {github && (
                    <SocialIcon href={github.url} icon={FaGithub} label="GitHub" size="lg" />
                  )}
                  {linkedin && (
                    <SocialIcon href={linkedin.url} icon={FaLinkedin} label="LinkedIn" size="lg" />
                  )}
                </div>
              </div>

              {/* Response time */}
              <div className="contact-info-card rounded-xl border border-white/6 bg-white/[0.02] hover:bg-white/[0.04] hover:border-primary-500/20 transition-all duration-500 p-5">
                <p className="font-mono text-xs text-white/30 uppercase tracking-widest mb-2">Response Time</p>
                <p className="text-white text-sm leading-relaxed">
                  Usually within{" "}
                  <span className="text-primary-500 font-semibold">24 hours</span>.
                  Looking forward to hearing from you!
                </p>
              </div>
            </div>

            {/* ── CONTACT FORM ────────────────────────────────────────── */}
            <div className="contact-form-wrap lg:col-span-2">
              <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-6 sm:p-8">
                <ScrambleHeading className="font-heading font-black text-white text-3xl sm:text-4xl mb-8">
                  Send a Message
                </ScrambleHeading>

                <form ref={formRef} onSubmit={onSubmit} className="space-y-5">
                  {/* Name */}
                  <div className="form-field">
                    <label
                      htmlFor="user_name"
                      className="block text-white font-mono text-xs uppercase tracking-widest mb-2"
                    >
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="user_name"
                      name="user_name"
                      required
                      placeholder="John Doe"
                      onFocus={() => handleFocus("user_name")}
                      onBlur={() => handleBlur("user_name")}
                      className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-xl text-white placeholder-white/20 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all duration-300 text-sm"
                    />
                  </div>

                  {/* Email */}
                  <div className="form-field">
                    <label
                      htmlFor="user_email"
                      className="block text-white font-mono text-xs uppercase tracking-widest mb-2"
                    >
                      Your Email *
                    </label>
                    <input
                      type="email"
                      id="user_email"
                      name="user_email"
                      required
                      placeholder="john@example.com"
                      onFocus={() => handleFocus("user_email")}
                      onBlur={() => handleBlur("user_email")}
                      className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-xl text-white placeholder-white/20 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all duration-300 text-sm"
                    />
                  </div>

                  {/* Subject */}
                  <div className="form-field">
                    <label
                      htmlFor="subject"
                      className="block text-white font-mono text-xs uppercase tracking-widest mb-2"
                    >
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      placeholder="Project Collaboration"
                      onFocus={() => handleFocus("subject")}
                      onBlur={() => handleBlur("subject")}
                      className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-xl text-white placeholder-white/20 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all duration-300 text-sm"
                    />
                  </div>

                  {/* Message */}
                  <div className="form-field">
                    <label
                      htmlFor="message"
                      className="block text-white font-mono text-xs uppercase tracking-widest mb-2"
                    >
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows="5"
                      placeholder="Tell me about your project..."
                      onFocus={() => handleFocus("message")}
                      onBlur={() => handleBlur("message")}
                      className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-xl text-white placeholder-white/20 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all duration-300 resize-none text-sm"
                    />
                  </div>

                  {/* Submit */}
                  <div className="form-field">
                    <GsapButton
                      as="button"
                      type="submit"
                      variant="solid"
                      disabled={isSubmitting}
                      className={`submit-btn w-full px-8 py-4 rounded-full font-heading font-black text-base ${
                        isSubmitting
                          ? "opacity-60 cursor-not-allowed"
                          : "hover:shadow-[0_0_40px_rgba(249,115,22,0.4)]"
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <FaPaperPlane className="text-sm" />
                          Send Message
                          <FaArrowRight className="text-sm ml-1" />
                        </>
                      )}
                    </GsapButton>
                  </div>

                  {/* Status notification */}
                  {submitStatus && (
                    <div
                      className={`flex items-center gap-3 p-4 rounded-xl border animate-fadeIn ${
                        submitStatus.type === "success"
                          ? "bg-green-500/10 border-green-500/30 text-green-400"
                          : "bg-red-500/10 border-red-500/30 text-red-400"
                      }`}
                    >
                      {submitStatus.type === "success" ? (
                        <FaCheckCircle className="text-xl flex-shrink-0" />
                      ) : (
                        <FaTimesCircle className="text-xl flex-shrink-0" />
                      )}
                      <p className="text-sm font-mono">{submitStatus.message}</p>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ────────────────────────────────────────────────── */}
      <section className="py-16 px-6 sm:px-10 lg:px-20 xl:px-28 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div
            className="cta-section rounded-2xl p-8 sm:p-12 border border-primary-500/20 relative overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, rgba(249,115,22,0.08) 0%, rgba(249,115,22,0.02) 50%, rgba(255,255,255,0.01) 100%)",
            }}
          >
            {/* Decorative orb */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary-500/10 rounded-full blur-[80px] pointer-events-none" />

            <p className="font-mono text-primary-500 text-xs uppercase tracking-[0.2em] mb-4">
              — Ready to start?
            </p>

            <ScrambleHeading
              className="font-heading font-black text-white text-3xl sm:text-4xl lg:text-5xl mb-4 leading-tight"
              delay={100}
            >
              Let's Build Together
            </ScrambleHeading>

            <p className="text-white/40 text-base sm:text-lg max-w-xl mb-8 leading-relaxed">
              Whether it's a startup MVP, an enterprise platform, or an open-source
              project — let's turn your ideas into reality.
            </p>

            <div className="flex flex-wrap gap-4">
              <MagneticWrapper>
                <GsapButton
                  as="a"
                  href={`mailto:${personalInfo.email}`}
                  variant="solid"
                  className="px-7 py-3.5 rounded-full font-heading font-black text-sm hover:shadow-[0_0_30px_rgba(249,115,22,0.5)]"
                >
                  <FaEnvelope className="text-xs" />
                  Email Me Directly
                </GsapButton>
              </MagneticWrapper>

              {linkedin && (
                <MagneticWrapper>
                  <GsapButton
                    as="a"
                    href={linkedin.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outline"
                    className="px-7 py-3.5 rounded-full font-heading font-black text-sm"
                  >
                    <FaLinkedin className="text-xs" />
                    Connect on LinkedIn
                  </GsapButton>
                </MagneticWrapper>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
