import { Route, Routes } from "react-router-dom"
import Home from "./Components/Home"
import Navbar from "./Components/Navbar"


const App = () => {
  return (
    <div className="bg-black h-screen">
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  )
}

export default App