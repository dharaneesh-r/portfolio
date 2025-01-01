import { motion } from "framer-motion";

const AboutMe = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#121212] px-6 py-16">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="text-slate-400 text-4xl md:text-5xl lg:text-6xl font-extrabold mb-10"
      >
        WHO AM I?
      </motion.h1>

      <div className="space-y-8">
        {[
          "Built fast and reliable web applications using MongoDB, Express.js, React, and Node.js, ensuring efficient data management and smooth user interactions.",
          "Integrated Firebase to implement secure and easy Google login for users, providing a reliable authentication system for web applications.",
          "Managed code versions and collaborated efficiently with team members using GitHub, ensuring smooth deployment and effective teamwork on all projects.",
          "Always passionate about learning new technologies and improving my skill set to build better and more efficient web applications."
        ].map((text, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeInOut", delay: 0.4 + index * 0.4 }}
            whileHover={{ scale: 1.05 }}
            className="text-white text-base sm:text-lg md:text-xl lg:text-2xl text-center mx-auto max-w-4xl px-4"
          >
            {text}
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut", delay: 2.5 }}
        whileHover={{ scale: 1.1 }}
        className="mt-10 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full text-lg font-semibold shadow-lg hover:shadow-2xl"
      >
        Let’s Build Something Amazing Together!
      </motion.div>
    </div>
  );
};

export default AboutMe;
