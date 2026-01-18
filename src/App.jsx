import { Route, Routes } from "react-router-dom";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Home from "./Components/Home";
import Navbar from "./Components/Navbar";
import Aboutme from "./Components/Aboutme";
import Skills from "./Components/Skills";
import Projects from "./Components/Projects";
import Contact from "./Components/Contact";

const App = () => {
  const cursorRef = useRef(null);
  const cursorDotRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (cursorRef.current && cursorDotRef.current) {
        gsap.to(cursorRef.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.3,
          ease: "power2.out"
        });

        gsap.to(cursorDotRef.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.1,
          ease: "power2.out"
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Custom Cursor */}
      <div
        ref={cursorRef}
        className="fixed w-8 h-8 border-2 border-primary-500 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
        style={{ left: 0, top: 0 }}
      />
      <div
        ref={cursorDotRef}
        className="fixed w-2 h-2 bg-primary-500 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2"
        style={{ left: 0, top: 0 }}
      />

      <Navbar />
      <main className="w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/aboutme" element={<Aboutme />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;

