import { useContext, useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { PlayerContext } from "../context/PlayerContext";

function PlaylistDetails() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { token } = useContext(AuthContext);
    const { playSong, currentSong, isPlaying, togglePlay } = useContext(PlayerContext);

    const [playlist, setPlaylist] = useState(null);
    const [allTracks, setAllTracks] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    // Fetch playlist details
    const fetchPlaylist = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/playlist/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPlaylist(res.data.data);
        } catch (err) {
            console.log("Error fetching playlist:", err);
        }
    };

    // Fetch all tracks
    const fetchAllTracks = async () => {
        try {
            const res = await axios.get("http://localhost:3000/track", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAllTracks(res.data.data || []);
        } catch (err) {
            console.log("Error fetching tracks:", err);
        }
    };

    useEffect(() => {
        if (token) {
            fetchPlaylist();
            fetchAllTracks();
        } else {
            setPlaylist(null);
            setAllTracks([]);
            navigate("/login");
        }
    }, []);

    // Add / Remove Tracks
    const addTrack = async (trackId) => {
        try {
            const res = await axios.post(
                `http://localhost:3000/playlist/${id}/add-track`,
                { trackId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setPlaylist(res.data.data);
        } catch (err) {
            console.log(err);
            alert(err.response?.data?.message || "Error adding track");
        }
    };

    const removeTrack = async (trackId) => {
        try {
            const res = await axios.delete(
                `http://localhost:3000/playlist/${id}/remove-track`,
                { headers: { Authorization: `Bearer ${token}` }, data: { trackId } }
            );
            setPlaylist(res.data.data);
        } catch (err) {
            console.log(err);
        }
    };

    // Filter tracks for search
    const filteredTracks = allTracks.filter((t) =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const isPlayingTrack = (track) =>
        currentSong?._id === track._id && isPlaying;

    return (
        <div className="p-4 max-w-5xl mx-auto">
            {playlist ? (
                <>
                    {/* Playlist Header */}
                    <div className="flex items-center gap-6 mb-6 bg-gray-800 p-6 rounded-lg shadow-md">
                        <div className="w-48 h-48 bg-gray-600 rounded-lg overflow-hidden">
                            <img
                                src={playlist.coverUrl || "/default_playlist.png"}
                                alt={playlist.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold mb-2">{playlist.name}</h1>
                            <p className="text-gray-400 mb-2">{playlist.description}</p>
                            <p className="text-gray-400">
                                {playlist.tracks.length} {playlist.tracks.length === 1 ? "song" : "songs"}
                            </p>
                        </div>
                    </div>

                    {/* Search Tracks */}
                    <input
                        type="text"
                        placeholder="Search tracks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full mb-4 px-4 py-2 rounded text-gray-900"
                    />

                    {/* Tracks Table */}
                    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-md">
                        <table className="w-full">
                            <thead className="bg-gray-700">
                                <tr>
                                    <th className="text-left p-3">Title</th>
                                    <th className="text-left p-3">Artist</th>
                                    <th className="text-left p-3">Album</th>
                                    <th className="text-left p-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {playlist.tracks.map((track, index) => (
                                    <tr
                                        key={track._id}
                                        className={`hover:bg-gray-700 ${isPlayingTrack(track) ? "bg-green-700" : ""}`}
                                    >
                                        <td className="p-3">{track.title}</td>
                                        <td className="p-3">{track.artist}</td>
                                        <td className="p-3">{track.album}</td>
                                        <td className="p-3 flex gap-2">
                                            <button
                                                className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
                                                onClick={() =>
                                                    currentSong?._id === track._id ? togglePlay() : playSong(track, index)
                                                }
                                            >
                                                {isPlayingTrack(track) ? "Pause" : "Play"}
                                            </button>
                                            <button
                                                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                                                onClick={() => removeTrack(track._id)}
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Add Tracks Section */}
                    <h2 className="text-2xl font-semibold mt-6 mb-2">Add Tracks</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {filteredTracks
                            .filter((track) => !playlist.tracks.some((t) => t._id === track._id))
                            .map((track) => (
                                <div
                                    key={track._id}
                                    className="bg-gray-700 p-3 rounded flex justify-between items-center"
                                >
                                    <span>{track.title}</span>
                                    <button
                                        onClick={() => addTrack(track._id)}
                                        className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded"
                                    >
                                        Add
                                    </button>
                                </div>
                            ))}
                    </div>
                </>
            ) : (
                <p>Loading playlist...</p>
            )}
        </div>
    );
}

export default PlaylistDetails;
