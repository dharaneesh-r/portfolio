import { useEffect } from "react";
import { gsap } from "gsap";
import logogif from "../images/logo.gif";
import Aboutme from "./Aboutme";
import Skills from "./Skills";
import Projects from "./Projects";
import Contact from "./Contact";

const Home = () => {
  useEffect(() => {
    const timeline = gsap.timeline();

    // Title animation
    timeline.fromTo(
      ".main-title",
      { opacity: 0, y: -50, scale: 0.8 },
      { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "power2.out" }
    );

    // Subtext animation
    timeline.fromTo(
      ".subtext",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.2, ease: "power2.out", delay: 0.5 }
    );

    // Logo and role animation
    timeline.fromTo(
      ".logo-role",
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 1, ease: "power2.out", delay: 0.5 }
    );
  }, []);

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#121212] px-6 py-12">
        <div className="text-center md:text-left md:w-1/2">
          {/* Main Title */}
          <div
            className="main-title text-orange-500 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold relative"
            style={{
              textShadow: `
                1px 1px 2px rgba(255, 255, 255, 0.9),
                2px 2px 4px rgba(255, 165, 0, 0.8),
                3px 3px 6px rgba(255, 255, 255, 0.6),
                4px 4px 8px rgba(255, 165, 0, 0.4)
              `,
            }}
          >
            {`I'M DHARANEESH !!!`}
          </div>

          {/* Subtext */}
          <div className="subtext text-white text-base sm:text-lg md:text-xl lg:text-2xl mt-6">
            <span className="logo-role inline-flex items-center space-x-2 border-2 border-white px-4 py-2 rounded-md font-semibold">
              <img src={logogif} alt="Logo" className="w-10 h-10" />
              <span>Full Stack Developer</span>
            </span>
          </div>
        </div>
      </div>

      {/* Other Sections */}
      <div>
        <Aboutme />
      </div>
      <div>
        <Skills />
      </div>
      <div>
        <Projects />
      </div>
      <div>
        <Contact />
      </div>
    </>
  );
};

export default Home;
