import { useEffect } from "react";
import { gsap } from "gsap";

const Skills = () => {
  useEffect(() => {
    // Title animation
    gsap.fromTo(
      ".title",
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 1.2, ease: "power2.out" }
    );

    // Card animations
    gsap.fromTo(
      ".skill-card",
      { opacity: 0, y: 100 },
      { opacity: 1, y: 0, stagger: 0.2, duration: 1, ease: "power2.out" }
    );
  }, []);

  const skills = [
    { name: "HTML", img: "https://cdn.worldvectorlogo.com/logos/html-1.svg" },
    { name: "CSS", img: "https://cdn.worldvectorlogo.com/logos/css-3.svg" },
    { name: "JavaScript", img: "https://cdn.worldvectorlogo.com/logos/javascript-1.svg" },
    { name: "React.js", img: "https://cdn.worldvectorlogo.com/logos/react-2.svg" },
    { name: "Next.js", img: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Nextjs-logo.svg" }, // Updated
    { name: "Node.js", img: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg" },
    { name: "Express.js", img: "https://cdn.worldvectorlogo.com/logos/express-109.svg" },
    { name: "MongoDB", img: "https://cdn.worldvectorlogo.com/logos/mongodb-icon-1.svg" },
    { name: "Firebase", img: "https://cdn.worldvectorlogo.com/logos/firebase-1.svg" },
    { name: "TailwindCSS", img: "https://cdn.worldvectorlogo.com/logos/tailwind-css-2.svg" },
    { name: "Github", img: "https://cdn.worldvectorlogo.com/logos/github-icon-1.svg" },
    { name: "Postman", img: "https://cdn.worldvectorlogo.com/logos/postman.svg" },
    { name: "Kubernetes", img: "https://upload.wikimedia.org/wikipedia/commons/3/39/Kubernetes_logo_without_workmark.svg" }, // Updated
    { name: "Docker", img: "https://cdn.worldvectorlogo.com/logos/docker.svg" },
    { name: "AWS", img: "https://cdn.worldvectorlogo.com/logos/aws-2.svg" },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-auto bg-[#121212]">
      {/* Title */}
      <h1 className="title text-slate-400 text-4xl md:text-5xl lg:text-6xl font-extrabold mb-10">
        MY SKILLS
      </h1>

      {/* Skill Cards */}
      <div className="flex flex-wrap justify-center gap-10 m-1">
        {skills.map((skill, index) => (
          <div
            key={index}
            className="skill-card bg-gray-800 p-8 w-56 rounded-lg shadow-lg flex flex-col justify-center items-center transition-all duration-300 hover:scale-110 hover:bg-[#2e2e2e] hover:shadow-xl"
          >
            <img
              src={skill.img}
              alt={skill.name}
              width={50}
              height={50}
              className="mx-auto mb-4 transition-all duration-300 hover:scale-125"
            />
            <div className="text-white text-xl font-semibold">{skill.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skills;
