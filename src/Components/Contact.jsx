import { useEffect } from "react";
import { gsap } from "gsap";

const Contact = () => {
  useEffect(() => {
    // Fade-in and slide-up for the container
    gsap.from(".contact-container", { 
      opacity: 0, 
      y: 50, 
      duration: 1, 
      ease: "power3.out" 
    });

    // Fade-in and bounce effect for the title
    gsap.from(".contact-title", { 
      opacity: 0, 
      scale: 0.9, 
      duration: 1, 
      delay: 0.3, 
      ease: "elastic.out(1, 0.5)" 
    });

    // Staggered slide-in effect for the contact info items
    gsap.from(".contact-info", { 
      opacity: 0, 
      x: -50, 
      duration: 1, 
      stagger: 0.3, 
      delay: 0.5, 
      ease: "power3.out" 
    });

    // Glow animation for the container
    gsap.to(".contact-container", {
      boxShadow: "0px 0px 20px 5px rgba(255, 165, 0, 0.5)",
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // Hover effect for links
    const links = document.querySelectorAll(".contact-info a");
    links.forEach((link) => {
      link.addEventListener("mouseenter", () => {
        gsap.to(link, { scale: 1.1, duration: 0.2, ease: "power1.inOut" });
      });
      link.addEventListener("mouseleave", () => {
        gsap.to(link, { scale: 1, duration: 0.2, ease: "power1.inOut" });
      });
    });
  }, []);

  return (
    <div className="bg-black min-h-screen flex items-center justify-center m-auto py-10">
      <div className="contact-container bg-[#121212] p-10 rounded-xl shadow-xl max-w-lg w-full border border-gray-700 animate-bounce hover:animate-none">
        <h2 className="contact-title text-4xl font-bold text-orange-500 mb-8 text-center">
          {`Let's Connect Together!!!`}
        </h2>
        <hr className="mb-5" />
        <div className="contact-info mb-6">
          <p className="text-gray-300 text-lg">
            <strong className="text-orange-400">Email:</strong>{" "}
            <a
              href="mailto:dharaneeshr0803@gmail.com"
              className="text-orange-400 hover:text-orange-300 hover:underline transition duration-300"
            >
              dharaneeshr0803@gmail.com
            </a>
          </p>
        </div>
        <div className="contact-info mb-6">
          <p className="text-gray-300 text-lg">
            <strong className="text-orange-400">Phone:</strong>{" "}
            <a
              href="tel:+919566865145"
              className="text-orange-400 hover:text-orange-300 hover:underline transition duration-300"
            >
              +91 9566865145
            </a>
          </p>
        </div>
        <div className="contact-info mb-6">
          <p className="text-gray-300 text-lg">
            <strong className="text-orange-400">LinkedIn:</strong>{" "}
            <a
              href="https://www.linkedin.com/in/dharaneeshr/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-400 hover:text-orange-300 hover:underline transition duration-300"
            >
              dharaneeshr
            </a>
          </p>
        </div>
        <div className="contact-info">
          <p className="text-gray-300 text-lg">
            <strong className="text-orange-400">GitHub:</strong>{" "}
            <a
              href="https://github.com/dharaneesh-r"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-400 hover:text-orange-300 hover:underline transition duration-300"
            >
              dharaneesh-r
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
