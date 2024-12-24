import { Route, Routes } from "react-router-dom";
import Home from "./Components/Home";
import Navbar from "./Components/Navbar";
import Aboutme from "./Components/Aboutme";
import Skills from "./Components/Skills";

const App = () => {
  return (
    <div className="bg-black h-screen">
      <div className="md:h-[12%] sm:h-[15%] h-[15%]">
        <Navbar />
      </div>
      <div className="h-[88%] overflow-y-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/aboutme" element={<Aboutme />} />
          <Route path="/skills" element={<Skills />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
