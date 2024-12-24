import { motion } from "framer-motion";
import logogif from "../images/logo.gif";
import Aboutme from "./Aboutme";
import Skills from "./Skills";

const Home = () => {
  return (
    <>
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#121212] px-6 py-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
        className="text-center md:text-left md:w-1/2"
      >
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 1.2,
            ease: "easeOut",
            delay: 0.5,
          }}
          className="text-orange-500 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold relative"
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 1.5,
            duration: 1.2,
            ease: "easeInOut",
          }}
          className="text-white text-base sm:text-lg md:text-xl lg:text-2xl mt-6"
        >
          <span className="inline-flex items-center space-x-2 border-2 border-white px-4 py-2 rounded-md font-semibold">
            <img src={logogif} alt="Logo" className="w-10 h-10" />
            <span>Full Stack Developer</span>
          </span>
        </motion.div>
      </motion.div>
    </div>
    <div>
      <Aboutme />
    </div>
    <div>
      <Skills />
    </div>
    </>
  );
};

export default Home;
