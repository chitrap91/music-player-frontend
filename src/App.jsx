import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"
import Login from "./components/Login"
import Register from "./components/Register"
import Home from "./components/Home"
import ProductedRoute from "./context/ProtectedRoute"
import Navbar from "./components/Navbar"


function App() {


  return (
    <>
      <BrowserRouter>


        <div className="bg-gray-950  h-screen text-white">
          <Navbar />
          <div className="p-6 text-center text-2xl">
            🎵 Welcome to My Music Player
          </div>

          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<Home />} />
          </Routes>
        </div >
      </BrowserRouter>


    </>
  )
}

export default App
