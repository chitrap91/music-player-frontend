import axios from "axios";
import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import SongCard from "./SongCard";
import { AuthContext } from "../context/AuthContext";

function Home() {
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState((true));
    const fetchSongs = async () => {
        try {
            if (!token) {
                console.log("No token found, redirecting to login");
                navigate("/login");
                return;
            }
            const resp = await axios.get("http://localhost:3000/track", {
                headers: {
                    Authorization: token
                }
            });
            setSongs(resp.data.data)
        }
        catch (error) {
            console.log("Fetch songs error:", error)
            // If 401 (unauthorized), redirect to login
            if (error.response?.status === 401) {
                localStorage.removeItem("token");
                navigate("/login");
            }

        }
        finally {
            setLoading(false);
        }


    }

    useEffect(() => {
        fetchSongs();

    }, [])

    if (loading) {
        return (
            <div className="text-white text-center text-2xl p-10">
                Loading songs...
            </div>
        );
    }



    return (

        <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
            {songs.map((song) => (
                <SongCard
                    key={song._id} song={song}

                />
            ))}
        </div>
    );
}

export default Home;




