import { motion } from "framer-motion";

const Aboutme = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#121212] px-4 py-12">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="text-slate-400 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-8"
      >
        WHO AM I?
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeInOut", delay: 0.5 }}
        whileHover={{ scale: 1.02 }} 
        className="text-white text-base sm:text-lg md:text-xl lg:text-2xl text-center mb-4 mx-4 sm:mx-8 md:mx-16 lg:mx-32"
      >
        Built fast and reliable web applications using MongoDB, Express.js, React, and Node.js, ensuring efficient data management and smooth user interactions.
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeInOut", delay: 0.8 }}
        whileHover={{ scale: 1.2 }} 
        className="text-white text-base sm:text-lg md:text-xl lg:text-2xl text-center mb-4 mx-4 sm:mx-8 md:mx-16 lg:mx-32"
      >
        Integrated Firebase to implement secure and easy Google login for users, providing a reliable authentication system for web applications.
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeInOut", delay: 1.1 }}
        whileHover={{ scale: 1.2 }} 
        className="text-white text-base sm:text-lg md:text-xl lg:text-2xl text-center mb-4 mx-4 sm:mx-8 md:mx-16 lg:mx-32 justify-evenly"
      >
        Managed code versions and collaborated efficiently with team members using GitHub, ensuring smooth deployment and effective teamwork on all projects.
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut", delay: 1.5 }}
        className="text-white text-base sm:text-lg md:text-xl lg:text-2xl text-center mt-6 mx-4 sm:mx-8 md:mx-16 lg:mx-32"
      >
        Always passionate about learning new technologies and improving my skill set to build better and more efficient web applications.
      </motion.div>
    </div>
  );
};

export default Aboutme;
