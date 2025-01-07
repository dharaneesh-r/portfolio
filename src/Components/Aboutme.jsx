import { useEffect } from "react";
import { gsap } from "gsap";

const AboutMe = () => {
  useEffect(() => {
    const timeline = gsap.timeline();

    // Title animation
    timeline.fromTo(
      ".title",
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 1.2, ease: "power2.out" }
    );

    // Paragraph animations
    gsap.fromTo(
      ".about-paragraph",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        stagger: 0.4,
        delay: 0.4,
      }
    );

    // Button animation
    gsap.fromTo(
      ".cta-button",
      { scale: 0.9, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1, ease: "power2.out", delay: 2.5 }
    );
  }, []);

  const texts = [
    "Built fast and reliable web applications using MongoDB, Express.js, React, and Node.js, ensuring efficient data management and smooth user interactions.",
    "Integrated Firebase to implement secure and easy Google login for users, providing a reliable authentication system for web applications.",
    "Managed code versions and collaborated efficiently with team members using GitHub, ensuring smooth deployment and effective teamwork on all projects.",
    "Always passionate about learning new technologies and improving my skill set to build better and more efficient web applications.",
  ];

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#121212] px-6 py-16">
      {/* Title */}
      <h1 className="title text-slate-400 text-4xl md:text-5xl lg:text-6xl font-extrabold mb-10">
        WHO AM I?
      </h1>

      {/* Paragraphs */}
      <div className="space-y-8">
        {texts.map((text, index) => (
          <div
            key={index}
            className="about-paragraph text-white text-base sm:text-lg md:text-xl lg:text-2xl text-center mx-auto max-w-4xl px-4"
          >
            {text}
          </div>
        ))}
      </div>

      {/* Call to Action Button */}
      <div className="cta-button mt-10 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full text-lg font-semibold shadow-lg hover:shadow-2xl transition-transform duration-300 hover:scale-110">
        Let’s Build Something Amazing Together!
      </div>
    </div>
  );
};

export default AboutMe;
