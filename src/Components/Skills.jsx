import { motion } from "framer-motion";

const Skills = () => {
  const cardVariants = {
    initial: { opacity: 0, x: -100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 100 },
  };

  return (
    <div className="flex flex-col items-center justify-center h-auto bg-[#121212]">
      {/* Title */}
      <h1 className="text-white font-semibold mb-10 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans">
        MY SKILLS
      </h1>

      {/* Skill Cards */}
      <div className="flex flex-wrap justify-center gap-10">
        {/* Skill 1: HTML */}
        <motion.div
          className="bg-gray-800 p-8 w-56 rounded-lg shadow-lg flex flex-col justify-center items-center transition-all duration-300 hover:scale-110 hover:bg-[#2e2e2e] hover:shadow-xl"
          variants={cardVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.8 }}
        >
          <img
            src="https://imgs.search.brave.com/e3lg83hyaKQTnOW7RZrrZjY2VgqFnToFbNKFfkV9PxU/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/d29ybGR2ZWN0b3Js/b2dvLmNvbS9sb2dv/cy9odG1sLTEuc3Zn"
            width={50}
            height={50}
            alt="HTML"
            className="mx-auto mb-4 transition-all duration-300 hover:scale-125"
          />
          <div className="text-white text-xl font-semibold">HTML</div>
        </motion.div>

        {/* Skill 2: CSS */}
        <motion.div
          className="bg-gray-800 p-8 w-56 rounded-lg shadow-lg flex flex-col justify-center items-center transition-all duration-300 hover:scale-110 hover:bg-[#2e2e2e] hover:shadow-xl"
          variants={cardVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <img
            src="https://imgs.search.brave.com/aEGiTSo22dl3ju1IuSx7-Ex0GTyZ0ELtoLb2u8BWqBY/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YTIuZGV2LnRvL2R5/bmFtaWMvaW1hZ2Uv/d2lkdGg9ODAwLGhl/aWdodD0sZml0PXNj/YWxlLWRvd24sZ3Jh/dml0eT1hdXRvLGZv/cm1hdD1hdXRvL2h0/dHBzOi8vZGV2LXRv/LXVwbG9hZHMuczMu/YW1hem9uYXdzLmNv/bS91cGxvYWRzL2Fy/dGljbGVzLzdqMzUz/djh4ZTFoODYxdWM1/aTUzLnBuZw"
            width={50}
            height={50}
            alt="CSS"
            className="mx-auto mb-4 transition-all duration-300 hover:scale-125"
          />
          <div className="text-white text-xl font-semibold">CSS</div>
        </motion.div>

        <motion.div
          className="bg-gray-800 p-8 w-56 rounded-lg shadow-lg flex flex-col justify-center items-center transition-all duration-300 hover:scale-110 hover:bg-[#2e2e2e] hover:shadow-xl"
          variants={cardVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <img
            src="https://imgs.search.brave.com/WNxGnfQEvbgOy-66HgDZiPdK5ARVsvzhVQOvpcBelos/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/d29ybGR2ZWN0b3Js/b2dvLmNvbS9sb2dv/cy90YWlsd2luZC1j/c3MtMi5zdmc"
            width={50}
            height={50}
            alt="React.js"
            className="mx-auto mb-4 transition-all duration-300 hover:scale-125"
          />
          <div className="text-white text-xl font-semibold">TailwindCSS</div>
        </motion.div>

        {/* Skill 3: JavaScript */}
        <motion.div
          className="bg-gray-800 p-8 w-56 rounded-lg shadow-lg flex flex-col justify-center items-center transition-all duration-300 hover:scale-110 hover:bg-[#2e2e2e] hover:shadow-xl"
          variants={cardVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <img
            src="https://imgs.search.brave.com/1r9jZFaLjOks3DS7KJ_K_F4ihnHLzWUKorG3ATyOUJY/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9zZWVr/bG9nby5jb20vaW1h/Z2VzL0ovamF2YXNj/cmlwdC1qcy1sb2dv/LTI5NDk3MDE3MDIt/c2Vla2xvZ28uY29t/LnBuZw"
            width={50}
            height={50}
            alt="JavaScript"
            className="mx-auto mb-4 transition-all duration-300 hover:scale-125"
          />
          <div className="text-white text-xl font-semibold">JavaScript</div>
        </motion.div>

        {/* Skill 4: React */}
        <motion.div
          className="bg-gray-800 p-8 w-56 rounded-lg shadow-lg flex flex-col justify-center items-center transition-all duration-300 hover:scale-110 hover:bg-[#2e2e2e] hover:shadow-xl"
          variants={cardVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <img
            src="https://imgs.search.brave.com/9vKTcCIDDozQMYqmROSq7hb9MEbNZjl7SDPlkheHaG0/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9sb2dv/cy1kb3dubG9hZC5j/b20vd3AtY29udGVu/dC91cGxvYWRzLzIw/MTYvMDkvUmVhY3Rf/bG9nb19sb2dvdHlw/ZV9lbWJsZW0tNzAw/eDYyNi5wbmc"
            width={50}
            height={50}
            alt="React.js"
            className="mx-auto mb-4 transition-all duration-300 hover:scale-125"
          />
          <div className="text-white text-xl font-semibold">React.js</div>
        </motion.div>

        <motion.div
          className="bg-gray-800 p-8 w-56 rounded-lg shadow-lg flex flex-col justify-center items-center transition-all duration-300 hover:scale-110 hover:bg-[#2e2e2e] hover:shadow-xl"
          variants={cardVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <img
            src="https://imgs.search.brave.com/jVHeQcjIIhr4DryzbcXOAJz-NROqDmestlvetAi8xEo/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/dmVjdG9ybG9nby56/b25lL2xvZ29zL25l/eHRqcy9uZXh0anMt/aWNvbi5zdmc"
            width={50}
            height={50}
            alt="React.js"
            className="mx-auto mb-4 transition-all duration-300 hover:scale-125"
          />
          <div className="text-white text-xl font-semibold">Next.js</div>
        </motion.div>

        <motion.div
          className="bg-gray-800 p-8 w-56 rounded-lg shadow-lg flex flex-col justify-center items-center transition-all duration-300 hover:scale-110 hover:bg-[#2e2e2e] hover:shadow-xl"
          variants={cardVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <img
            src="https://imgs.search.brave.com/sOv_5GQnC11NvZdTD2kCJi1LPmCsTBu48lANSXl2H8M/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9hc3Nl/dHMuc3RpY2twbmcu/Y29tL2ltYWdlcy81/ODQ3ZjQwZWNlZjEw/MTRjMGI1ZTQ4OGEu/cG5n"
            width={50}
            height={50}
            alt="React.js"
            className="mx-auto mb-4 transition-all duration-300 hover:scale-125"
          />
          <div className="text-white text-xl font-semibold">Firebase</div>
        </motion.div>

        <motion.div
          className="bg-gray-800 p-8 w-56 rounded-lg shadow-lg flex flex-col justify-center items-center transition-all duration-300 hover:scale-110 hover:bg-[#2e2e2e] hover:shadow-xl"
          variants={cardVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <img
            src="https://imgs.search.brave.com/9csQs7n45LOxCX5IKDCmwlJH7UaNxfcbjhQ8eru1tE4/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy8y/LzI0L0dpdGh1Yl9s/b2dvX3N2Zy5zdmc"
            width={50}
            height={50}
            alt="React.js"
            className="mx-auto mb-4 transition-all duration-300 hover:scale-125"
          />
          <div className="text-white text-xl font-semibold">Github</div>
        </motion.div>

        <motion.div
          className="bg-gray-800 p-8 w-56 rounded-lg shadow-lg flex flex-col justify-center items-center transition-all duration-300 hover:scale-110 hover:bg-[#2e2e2e] hover:shadow-xl"
          variants={cardVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <img
            src="https://imgs.search.brave.com/G4W4ekbS31fQcq7GkHDgmKogV4VQ6iafr52f_r53kuc/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9zZWVr/bG9nby5jb20vaW1h/Z2VzL1AvcG9zdG1h/bi1hcGktcGxhdGZv/cm0tbG9nby1ENkI4/QUI5QjBELXNlZWts/b2dvLmNvbS5wbmc"
            width={50}
            height={50}
            alt="React.js"
            className="mx-auto mb-4 transition-all duration-300 hover:scale-125"
          />
          <div className="text-white text-xl font-semibold">Postman</div>
        </motion.div>

        <motion.div
          className="bg-gray-800 p-8 w-56 rounded-lg shadow-lg flex flex-col justify-center items-center transition-all duration-300 hover:scale-110 hover:bg-[#2e2e2e] hover:shadow-xl"
          variants={cardVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <img
            src="https://imgs.search.brave.com/wgX9w9J00j3mJir4Jqu1UK8CcT-6aVe7_VSTy38gTBw/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9zZWVr/bG9nby5jb20vaW1h/Z2VzL04vbm9kZWpz/LWxvZ28tRkJFMTIy/RTM3Ny1zZWVrbG9n/by5jb20ucG5n"
            width={50}
            height={50}
            alt="React.js"
            className="mx-auto mb-4 transition-all duration-300 hover:scale-125"
          />
          <div className="text-white text-xl font-semibold">Node.js</div>
        </motion.div>

        <motion.div
          className="bg-gray-800 p-8 w-56 rounded-lg shadow-lg flex flex-col justify-center items-center transition-all duration-300 hover:scale-110 hover:bg-[#2e2e2e] hover:shadow-xl"
          variants={cardVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <img
            src="https://imgs.search.brave.com/Nl3NY_blqManrX5mz2JNxeyXGmsAe8bD1lSVtHDKMRw/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9jbG91/ZC5naXRodWJ1c2Vy/Y29udGVudC5jb20v/YXNzZXRzLzk1MDEx/Mi8xNDA4MDc0MC84/ZjkyMDM3YS1mNTI0/LTExZTUtOGM1Mi0y/N2E5YWM2M2FmNTAu/cG5n"
            width={50}
            height={50}
            alt="React.js"
            className="mx-auto mb-4 transition-all duration-300 hover:scale-125"
          />
          <div className="text-white text-xl font-semibold">Express.js</div>
        </motion.div>

        <motion.div
          className="bg-gray-800 p-8 w-56 rounded-lg shadow-lg flex flex-col justify-center items-center transition-all duration-300 hover:scale-110 hover:bg-[#2e2e2e] hover:shadow-xl"
          variants={cardVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <img
            src="https://imgs.search.brave.com/A5fgk_PDeP_UtAwayg6FF0hKArvi-Lh0iZGHNsT-wlA/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9wbHVz/cG5nLmNvbS9pbWct/cG5nL2xvZ28tbW9u/Z29kYi1wbmctZmls/ZS1tb25nb2RiLWxv/Z28tc3ZnLTEwMjQu/cG5n"
            width={70}
            height={60}
            alt="React.js"
            className="mx-auto mb-4 transition-all duration-300 hover:scale-125"
          />
          <div className="text-white text-xl font-semibold">MongoDB</div>
        </motion.div>
      </div>
    </div>
  );
};

export default Skills;
