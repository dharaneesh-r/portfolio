import { useEffect } from "react";
import { gsap } from "gsap";

const Contact = () => {
  useEffect(() => {
    // GSAP Animation for the form elements
    gsap.from(".contact-container", { opacity: 0, y: 50, duration: 1, ease: "power3.out" });
    gsap.from(".contact-title", { opacity: 0, y: -20, duration: 1, delay: 0.3, ease: "power3.out" });
    gsap.from(".contact-info", { opacity: 0, x: -50, duration: 1, stagger: 0.3, delay: 0.5, ease: "power3.out" });
  }, []);

  return (
    <div className="bg-black min-h-screen flex items-center justify-center m-auto py-10">
      <div className="contact-container bg-[#121212] p-10 rounded-xl shadow-xl max-w-lg w-full border border-gray-700">
        <h2 className="contact-title text-4xl font-bold text-orange-500 mb-8 text-center">
          {`Let's Connect Together!!!`}
        </h2>
        <hr className="mb-5"/>
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
