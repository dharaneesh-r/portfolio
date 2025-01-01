import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaReact, FaNodeJs } from "react-icons/fa";
import { SiTailwindcss, SiMongodb, SiFirebase } from "react-icons/si";
import { useEffect } from "react";
import gsap from "gsap";

const Projects = () => {
  useEffect(() => {
    // GSAP animation for 3D rotation effect on tech stack icons
    gsap.fromTo(
      ".tech-icon",
      {
        rotateY: 0,
        opacity: 0,
        scale: 0.5,
      },
      {
        rotateY: 360,
        opacity: 1,
        scale: 1,
        duration: 1.2,
        stagger: 0.2,
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true,
      }
    );
  }, []);

  const projectData = [
    {
      title: "INFORMATIVE JOURNAL",
      description:
        "Developed Informative Journal, a news application using Next.js, Node.js with Express.js, and MongoDB for scalability and performance. Features include real-time categorized news, dynamic routing, and seamless API integration. Designed a user-friendly interface for efficient navigation and smooth user experience.",
      techStack: [
        { icon: <FaNodeJs key="nodejs" className="tech-icon text-green-600 text-5xl shadow-2xl hover:scale-110 transition-all duration-300" />, name: "Node.js" },
        { icon: <SiTailwindcss key="tailwind" className="tech-icon text-teal-400 text-5xl shadow-2xl hover:scale-110 transition-all duration-300" />, name: "TailwindCSS" },
        { icon: <SiMongodb key="mongodb" className="tech-icon text-green-800 text-5xl shadow-2xl hover:scale-110 transition-all duration-300" />, name: "MongoDB" },
        { icon: <SiFirebase key="firebase" className="tech-icon text-yellow-600 text-5xl shadow-2xl hover:scale-110 transition-all duration-300" />, name: "Firebase" },
      ],
      link: "https://informativejournal.vercel.app/",
    },
    {
      title: "CRYPTO MARKETPLACE",
      description:
        "Built a Crypto Marketplace using React.js and Tailwind CSS, ensuring a modern, responsive user experience. Key features include real-time cryptocurrency tracking, intuitive navigation, and a visually appealing interface tailored for crypto enthusiasts.",
      techStack: [
        { icon: <FaReact key="react" className="tech-icon text-cyan-500 text-5xl shadow-2xl hover:scale-110 transition-all duration-300" />, name: "React" },
        { icon: <SiTailwindcss key="tailwind" className="tech-icon text-teal-400 text-5xl shadow-2xl hover:scale-110 transition-all duration-300" />, name: "TailwindCSS" },
      ],
      link: "https://crypto-marketplace-ten.vercel.app/",
    },
    {
      title: "TODO APPLICATION",
      description:
        "Developed a TO-DO app using React.js and Tailwind CSS to create a simple, interactive task management tool.",
      techStack: [
        { icon: <FaReact key="react" className="tech-icon text-cyan-500 text-5xl shadow-2xl hover:scale-110 transition-all duration-300" />, name: "React" },
        { icon: <SiTailwindcss key="tailwind" className="tech-icon text-teal-400 text-5xl shadow-2xl hover:scale-110 transition-all duration-300" />, name: "TailwindCSS" },
      ],
      link: "https://to-do-application-six-eta.vercel.app/",
    },
    {
      title: "DESIGNED UI PAGE",
      description:
        "This design page, built using React.js, GSAP, and TailwindCSS, features smooth animations like fade-ins and scaling effects. It showcases a responsive layout with animated cards and a styled button, offering an engaging user interface. TailwindCSS provides modern styling, while GSAP adds dynamic visual effects.",
      techStack: [
        { icon: <FaReact key="react" className="tech-icon text-cyan-500 text-5xl shadow-2xl hover:scale-110 transition-all duration-300" />, name: "React" },
        { icon: <SiTailwindcss key="tailwind" className="tech-icon text-teal-400 text-5xl shadow-2xl hover:scale-110 transition-all duration-300" />, name: "TailwindCSS" },
        { icon: <FaNodeJs key="gsap" className="tech-icon text-green-600 text-5xl shadow-2xl hover:scale-110 transition-all duration-300" />, name: "GSAP" },
      ],
      link: "https://vite-aboutus-landingpage.vercel.app/",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#121212] px-6 py-16">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="text-slate-400 text-4xl md:text-5xl lg:text-6xl font-extrabold mb-10"
      >
        PROJECTS
      </motion.h1>

      <div className="grid gap-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mx-auto max-w-7xl">
        {projectData.map((project, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.8,
              ease: "easeInOut",
              delay: 0.2 + index * 0.2,
            }}
            whileHover={{ scale: 1.05 }}
            className="bg-[#1e1e1e] text-white rounded-lg shadow-2xl p-8 hover:shadow-3xl"
          >
            <Link to={project.link} target="_blank" rel="noopener noreferrer">
              <h2 className="text-2xl font-bold mb-4">{project.title}</h2>
              <p className="text-gray-400 mb-3">{project.description}</p>
              <div className="flex space-x-6 flex-wrap justify-center">
                {project.techStack.map((tech, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.2, rotateY: 180 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-4"
                  >
                    {tech.icon}
                    <p className="text-sm mt-2 text-gray-300">{tech.name}</p>
                  </motion.div>
                ))}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut", delay: 1.5 }}
        whileHover={{ scale: 1.1 }}
        className="mt-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full text-xl font-semibold shadow-2xl hover:shadow-3xl"
      >
        See More Projects
      </motion.div>
    </div>
  );
};

export default Projects;
