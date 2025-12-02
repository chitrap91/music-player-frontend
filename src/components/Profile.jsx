import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { PlayerContext } from "../context/PlayerContext";
import axios from "axios";
import SongCard from "./SongCard";

function Profile() {
    const { user, token } = useContext(AuthContext);
    const { playSong } = useContext(PlayerContext);

    const [profile, setProfile] = useState(null);
    const [recentSongs, setRecentSongs] = useState([]);
    const [modalSong, setModalSong] = useState(null);

    const handleAddToPlaylist = (song) => {
        setModalSong(song);
    };

    // Fetch profile
    const fetchProfile = async () => {
        try {
            const res = await axios.get(
                `http://localhost:3000/users/profile/${user._id}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setProfile(res.data.data);
        } catch (error) {
            console.log("Error fetching profile:", error);
        }
    };

    // Fetch recently played
    const fetchRecentSongs = async () => {
        try {
            const res = await axios.get(
                `http://localhost:3000/users/recent/${user._id}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setRecentSongs(res.data.recentSongs || []);
        } catch (error) {
            console.log("Error fetching recent songs:", error);
        }
    };


    useEffect(() => {
        if (user && token) {
            fetchProfile();
            fetchRecentSongs();
        }
    }, [user, token]);

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Profile Info */}
            <div className="bg-gray-800 text-white rounded-xl p-6 shadow-md flex items-center gap-6 mb-6">
                <div className="w-24 h-24 bg-purple-500 rounded-full flex items-center justify-center text-3xl font-bold">
                    {profile?.username?.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h2 className="text-2xl font-bold">{profile?.username}</h2>
                    <p className="text-gray-400">{profile?.email}</p>
                </div>
            </div>

            {/* Recently Played */}
            <div className="bg-gray-900 text-white rounded-xl p-6 shadow-md">
                <h3 className="text-xl font-bold mb-4">Recently Played</h3>

                {recentSongs.length === 0 ? (
                    <p className="text-gray-400">No recently played songs</p>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {recentSongs.map((song, index) => (
                            <SongCard
                                key={song._id}
                                song={song}
                                index={index}
                                songs={recentSongs}
                                onAddToPlaylist={() => { handleAddToPlaylist(song); }}
                            />
                        ))}
                    </div>
                )}
            </div>





        </div>

    );
}

export default Profile;
