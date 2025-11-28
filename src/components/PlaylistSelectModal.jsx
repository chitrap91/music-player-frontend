import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function PlaylistSelectModal({ playlists, song, token, onClose }) {
    const [selected, setSelected] = React.useState([]);
    const navigate = useNavigate();

    const toggleSelect = (id) => {
        if (selected.includes(id)) {
            setSelected(selected.filter(p => p !== id));
        } else {
            setSelected([...selected, id]);
        }
    };

    const addSongToPlaylists = async () => {
        for (let i = 0; i < selected.length; i++) {
            const playlistId = selected[i];

            try {
                await axios.post(
                    `http://localhost:3000/playlist/${playlistId}/add-track`,
                    { trackId: song._id },
                    { headers: { Authorization: `Bearer ${token}` } }
                );

         
                navigate(`/playlists/${playlistId}`);

            } catch (error) {
                if (error.response?.data?.message === "Song already in playlist") {
                    alert(`Song already exists in playlist: ${playlists.find(p => p._id === playlistId).name}`);
                } else {
                    alert("Something went wrong!");
                }
            }
        }

        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center">
            <div className="bg-white p-6 rounded-xl w-96">

                <h2 className="text-xl font-bold mb-4 text-gray-800">Select Playlists</h2>

                {playlists.map((pl) => (
                    <label key={pl._id} className="flex items-center gap-3 p-2 text-gray-800">
                        <input
                            type="checkbox"
                            checked={selected.includes(pl._id)}
                            onChange={() => toggleSelect(pl._id)}
                        />
                        <span>{pl.name}</span>
                    </label>
                ))}

                <div className="mt-4 flex justify-between">
                    <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
                    <button onClick={addSongToPlaylists} className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
                </div>
            </div>
        </div>
    );
}

export default PlaylistSelectModal;
