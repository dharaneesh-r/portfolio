import {motion} from 'framer-motion'

const Home = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#121212]">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="text-center"
      >
        <div className="text-orange-500 text-4xl font-bold">
          {`I'm Dharaneesh !!!`}
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1.5 }}
          className="text-white text-lg mt-5"
        >
          Welcome to my portfolio!
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Home;
