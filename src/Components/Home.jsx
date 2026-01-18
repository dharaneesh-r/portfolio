import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { FaGithub, FaLinkedin, FaEnvelope, FaDownload, FaRocket } from "react-icons/fa";
import { personalInfo } from "../data/personal";

const Home = () => {
  const [currentRole, setCurrentRole] = useState(0);

  const roles = [
    "Full-Stack Architect",
    "Software Engineering Ninja",
    "MERN Stack Powerhouse",
    "React Performance Wizard",
  ];

  useEffect(() => {
    // Animated background gradient
    gsap.to(".hero-gradient", {
      backgroundPosition: "200% 50%",
      duration: 20,
      repeat: -1,
      ease: "linear"
    });

    // Floating particles with complex animations
    gsap.to(".particle", {
      y: "random(-40, 40)",
      x: "random(-40, 40)",
      rotation: "random(-180, 180)",
      duration: "random(4, 8)",
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: {
        each: 0.3,
        from: "random"
      }
    });

    // Background orbs animation
    gsap.to(".orb", {
      y: "random(-100, 100)",
      x: "random(-100, 100)",
      scale: "random(1, 1.5)",
      duration: "random(10, 15)",
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 0.5
    });

    // Role rotation
    const roleInterval = setInterval(() => {
      gsap.to(".role-text", {
        y: -20,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          setCurrentRole((prev) => (prev + 1) % roles.length);
          gsap.fromTo(".role-text",
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" }
          );
        }
      });
    }, 3500);

    return () => {
      clearInterval(roleInterval);
    };
  }, []);

  return (
    <div className="relative h-screen flex items-center justify-center place-content-center overflow-hidden bg-dark-900">
      {/* Multi-layer Animated Background */}
      <div className="hero-gradient absolute inset-0 bg-gradient-to-br from-dark-900 via-primary-950 to-dark-900 opacity-90"
        style={{
          backgroundSize: "400% 400%",
          backgroundPosition: "0% 50%"
        }}
      />

      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <div className="orb absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500 rounded-full blur-[120px]" />
        <div className="orb absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary-600 rounded-full blur-[100px]" />
        <div className="orb absolute top-1/2 right-1/3 w-72 h-72 bg-primary-400 rounded-full blur-[90px]" />
      </div>

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-primary-500/5 via-transparent to-transparent" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'linear-gradient(rgba(249, 115, 22, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(249, 115, 22, 0.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }} />

      {/* Floating particles with glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="particle absolute w-3 h-3 bg-primary-500 rounded-full blur-sm"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.6 + 0.2
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center h-full overflow-y-auto py-10">
        <div className="w-full text-center space-y-6">
          {/* Greeting with unique design */}
          <div className="hero-greeting inline-flex items-center gap-3 px-6 py-2 mb-4 rounded-full glass-dark border-2 border-primary-500/40 backdrop-blur-xl">
            <span className="text-2xl animate-bounce">👋</span>
            <p className="text-primary-400 text-lg sm:text-xl font-bold tracking-wide">
              Hello, I'm
            </p>
          </div>

          {/* Name with shimmer */}
          <h1 className="hero-name font-heading font-black mb-6 relative px-4">
            <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl bg-gradient-to-r from-white via-primary-300 to-white bg-clip-text text-transparent relative overflow-hidden leading-[1.1] tracking-tight">
              {personalInfo.name}
              <span className="name-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent transform -translate-x-full" />
            </span>
            <div className="absolute -inset-8 bg-gradient-to-r from-primary-500/20 via-primary-400/20 to-primary-500/20 blur-3xl -z-10 animate-pulse" />
          </h1>

          {/* Role with icon */}
          <div className="hero-role mb-6 min-h-[3rem] flex items-center justify-center px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
              <span className="text-gray-400 font-normal">I'm a </span>
              <span className="role-text inline-block bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 bg-clip-text text-transparent font-extrabold">
                {roles[currentRole]}
              </span>
            </h2>
          </div>

          {/* Description */}
          <p className="hero-description text-gray-300 text-lg sm:text-xl md:text-2xl max-w-4xl mx-auto mb-8 leading-relaxed font-medium px-4">
            {personalInfo.tagline}
          </p>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto mb-8 px-4">
            <div className="stat-card glass-dark rounded-xl p-4 border-2 border-primary-500/30 hover:border-primary-500/60 transition-all duration-300">
              <div className="text-3xl mb-2">🚀</div>
              <div className="text-2xl font-black text-primary-500 mb-1">15+</div>
              <div className="text-xs text-gray-400 font-semibold">Projects</div>
            </div>
            <div className="stat-card glass-dark rounded-xl p-4 border-2 border-primary-500/30 hover:border-primary-500/60 transition-all duration-300">
              <div className="text-3xl mb-2">⚡</div>
              <div className="text-2xl font-black text-primary-500 mb-1">1</div>
              <div className="text-xs text-gray-400 font-semibold">Year Exp</div>
            </div>
            <div className="stat-card glass-dark rounded-xl p-4 border-2 border-primary-500/30 hover:border-primary-500/60 transition-all duration-300">
              <div className="text-3xl mb-2">💼</div>
              <div className="text-2xl font-black text-primary-500 mb-1">100%</div>
              <div className="text-xs text-gray-400 font-semibold">Dedicated</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link
              to="/projects"
              className="hero-cta group relative px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold text-base rounded-full overflow-hidden transition-all duration-500 hover:shadow-[0_0_40px_rgba(249,115,22,0.7)] hover:scale-110">
              <span className="relative z-10 flex items-center gap-2">
                <FaRocket className="text-lg" />
                View My Work
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600 bg-[length:200%_100%] animate-gradient" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </Link>

            <Link
              to="/contact"
              className="hero-cta group relative px-6 py-3 bg-transparent border-2 border-primary-500 text-primary-400 font-bold text-base rounded-full transition-all duration-500 hover:bg-primary-500 hover:text-white hover:shadow-[0_0_40px_rgba(249,115,22,0.7)] hover:scale-110 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                <FaEnvelope className="text-lg" />
                Get In Touch
              </span>
              <div className="absolute inset-0 bg-primary-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </Link>

            <a
              href={personalInfo.resume.url}
              download={personalInfo.resume.filename}
              className="hero-cta group px-6 py-3 glass-dark border border-primary-500/30 text-white font-bold text-base rounded-full transition-all duration-500 hover:bg-white/10 hover:border-primary-500 hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] hover:scale-110 flex items-center gap-2"
            >
              <FaDownload className="text-lg group-hover:animate-bounce" />
              <span>Resume</span>
            </a>
          </div>

          {/* Social Links */}
          <div className="flex gap-4 justify-center mb-6">
            <a
              href={personalInfo.socialLinks[0].url}
              target="_blank"
              rel="noopener noreferrer"
              className="hero-social w-12 h-12 flex items-center justify-center rounded-full glass-dark border border-primary-500/30 text-white hover:text-primary-400 hover:bg-primary-500/10 hover:border-primary-500 transition-all duration-500 hover:shadow-[0_0_25px_rgba(249,115,22,0.6)] hover:scale-130"
              aria-label="GitHub"
            >
              <FaGithub size={24} />
            </a>
            <a
              href={personalInfo.socialLinks[1].url}
              target="_blank"
              rel="noopener noreferrer"
              className="hero-social w-12 h-12 flex items-center justify-center rounded-full glass-dark border border-primary-500/30 text-white hover:text-primary-400 hover:bg-primary-500/10 hover:border-primary-500 transition-all duration-500 hover:shadow-[0_0_25px_rgba(249,115,22,0.6)] hover:scale-130"
              aria-label="LinkedIn"
            >
              <FaLinkedin size={24} />
            </a>
            <a
              href={`mailto:${personalInfo.email}`}
              className="hero-social w-12 h-12 flex items-center justify-center rounded-full glass-dark border border-primary-500/30 text-white hover:text-primary-400 hover:bg-primary-500/10 hover:border-primary-500 transition-all duration-500 hover:shadow-[0_0_25px_rgba(249,115,22,0.6)] hover:scale-130"
              aria-label="Email"
            >
              <FaEnvelope size={24} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
