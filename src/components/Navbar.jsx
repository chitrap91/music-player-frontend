import { useContext, useState } from "react"
import { FaHeart, FaHome, FaMusic } from "react-icons/fa"
import { IoMdPerson } from "react-icons/io"
import { Link } from 'react-router-dom'
import { AuthContext } from "../context/AuthContext"

function Navbar() {
    const { user, setUser, setToken } = useContext(AuthContext);

    const [showMenu, setShowMenu] = useState(false);

    const handleLogout = () => {
        setUser(null);
        setToken(null);
        // localStorage.removeItem("token");
        // localStorage.removeItem("user");
        setShowMenu(false);
    }

    return (

        <nav className="bg-gray-900 text-gray-300 shadow-md">
            <div className="max-w-7xl mx-auto w-full p-4 h-16 flex justify-between items-center">
                <div className="text-white text-2xl font-bold"> My Player </div>
                <div className="flex gap-2 space-x-6 text-lg">
                    <Link to="/home" className="hover:text-white flex items-center gap-2">
                        <FaHome />
                        <span>Home</span>
                    </Link>
                
                    <Link to="/playlists" className="hover:text-white flex items-center gap-2">
                        <FaHeart />
                        <span>Playlists</span>
                    </Link>
                    {/* <Link to="/register" className={`hover:text-white flex items-center gap-2 
                        ${user ? "pointer-events-none opacity-50" : ""}`}>
                        <IoMdPerson />
                        <span> {user ? user.username : "Login / Signup"}</span>
                    </Link> */}

                    {/* User Menu */}
                    {user ? (
                        <div className="relative">
                            <button
                                onClick={() => setShowMenu(!showMenu)}
                                className="flex items-center gap-2 hover:text-white"
                            >
                                <IoMdPerson />
                                <span>{user.username}</span>
                            </button>

                            {showMenu && (
                                <div className="absolute right-0 mt-2 w-40 bg-gray-800 text-white rounded shadow-lg py-2">
                                    <Link
                                        to="/profile"
                                        className="block px-4 py-2 hover:bg-gray-700"
                                        onClick={() => setShowMenu(false)}
                                    >
                                        My Profile
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-700"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/login" className="hover:text-white flex items-center gap-2">
                            <IoMdPerson /> <span>Login</span>
                        </Link>
                    )}

                </div>
            </div>
        </nav >
    )




}
export default Navbar