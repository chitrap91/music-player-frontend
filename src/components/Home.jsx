import axios from "axios";
import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import SongCard from "./SongCard";
import { AuthContext } from "../context/AuthContext";
import Search from "./Search";
import PlaylistSelectModal from "./PlaylistSelectModal";

function Home() {
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const [playlists, setPlaylists] = useState([]);
    const [modalSong, setModalSong] = useState(null);

    const fetchSongs = async (searchQuery, pageNumber = 1) => {
        if (!token) {
            setSongs([]);
            setPage(1);
            setTotalPages(1);
            navigate("/login");
            return;
        }

        setLoading(true);

        try {
            const resp = await axios.get("http://localhost:3000/track", {
                headers: { Authorization: `Bearer ${token}` },
                params: { search: searchQuery, page: pageNumber },
            });

            const data = resp.data;
            setSongs(data.data || []);
            setPage(data.page || 1);
            setTotalPages(data.totalPages || 1);

        } catch (error) {
            console.log("Fetch songs error:", error);

            if (error.response?.status === 401) {
                navigate("/login");
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchPlaylists = async () => {
        if (!token) {
            navigate("/login");
            return;
        }
        const res = await axios.get("http://localhost:3000/playlist", {
            headers: { Authorization: `Bearer ${token}` },
        });
        setPlaylists(res.data.data || []);
    };

    useEffect(() => {
        fetchSongs(searchQuery, 1);
        fetchPlaylists();
    }, []);

    const handleAddToPlaylist = (song) => {
        setModalSong(song);
    };

    if (loading) {
        return (
            <div className="text-white text-center text-2xl p-10">
                Loading songs...
            </div>
        );
    }

    return (
        <div className="p-4">

            <Search handleSearch={(query) => {
                setSearchQuery(query);
                fetchSongs(query);
            }} />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
                {songs.map((song, index) => (
                    <SongCard
                        key={song._id}
                        songs={songs}
                        song={song}
                        index={index}
                        onAddToPlaylist={handleAddToPlaylist} playlists={playlists}
                    />
                ))}


                {modalSong && (
                    <PlaylistSelectModal
                        playlists={playlists}
                        song={modalSong}
                        token={token}
                        onClose={() => setModalSong(null)}
                    />
                )}
                {/* Pagination */}
                <div className="flex justify-center mt-8 mb-32">
                    {totalPages > 1 &&
                        (<div className="flex justify-center items-center mt-6 gap-4">
                            <button disabled={page === 1}
                                onClick={() => fetchSongs(searchQuery, page - 1)}
                                className="px-4 py-2 bg-gray-700 text-white text-xl rounded disabled:opacity-50" >
                                Prev </button>
                            <span className="text-white text-xl">
                                Page {page} of {totalPages} </span>
                            <button disabled={page === totalPages}
                                onClick={() => fetchSongs(searchQuery, page + 1)}
                                className="px-4 py-2 bg-gray-700 text-white text-xl rounded disabled:opacity-50">
                                Next </button> </div>)}
                </div>

            </div>

        </div>
    );
}

export default Home;
