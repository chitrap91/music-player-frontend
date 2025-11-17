import { FaHeart, FaHome, FaMusic } from "react-icons/fa"
import { IoMdPerson } from "react-icons/io"
import { Link } from 'react-router-dom'

function Navbar() {
    return (

        <nav className="bg-gray-900 text-gray-300 shadow-md">
            <div className="max-w-7xl mx-auto w-full p-4 h-16 flex justify-between items-center">
                <div className="text-white text-2xl font-bold"> My Player </div>
                <div className="flex gap-2 space-x-6 text-lg">
                    <Link to="/home" className="hover:text-white flex items-center gap-2">
                        <FaHome />
                        <span>Home</span>
                    </Link>
                    <Link to="/home" className="hover:text-white flex items-center gap-2">
                        <FaMusic />
                        <span>Songs</span>
                    </Link>
                    <Link to="/home" className="hover:text-white flex items-center gap-2">
                        <FaHeart />
                        <span>Favourites</span>
                    </Link>
                    <Link to="/register" className="hover:text-white flex items-center gap-2">
                        <IoMdPerson />
                        <span>Login/Signup</span>
                    </Link>

                </div>
            </div>
        </nav>
    )




}
export default Navbar