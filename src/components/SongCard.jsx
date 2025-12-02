import { useContext } from "react";
import { PlayerContext } from "../context/PlayerContext";

function SongCard({ song, songs, index, onAddToPlaylist, playlists }) {

    const { playSong, togglePlay, currentSong, isPlaying } = useContext(PlayerContext);

    const isThisSongPlaying =
        currentSong && currentSong._id === song._id && isPlaying;

    const handlePlayPause = (e) => {
        e.stopPropagation();

        if (!currentSong || currentSong._id !== song._id) {
            playSong(song, songs, index);
        } else {
            togglePlay();
        }
    };
    const alreadyInAllPlaylists = (playlists || []).every(pl =>
        (pl.tracks || []).some(track => track._id === song._id)
    );

    const handleAddClick = (e) => {
        e.stopPropagation();
        if (!alreadyInAllPlaylists) {
            onAddToPlaylist(song);
        }
    };

    return (
        <div
            onClick={() => playSong(song, songs, index)}
            className={`rounded-xl p-4 shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer' 
             ${isThisSongPlaying ? "bg-blue-800" : "bg-gray-800"}`}
        >
            <img
                src={song.coverUrl}
                alt={song.title}
                className="w-full h-48 object-cover rounded-lg"
            />

            <h3 className="text-xl font-semibold mt-3">{song.title}</h3>
            <p className="text-gray-400">{song.artist}</p>

            <div className="mt-3 flex gap-3">

                <button
                    onClick={handlePlayPause}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white"
                >
                    {isThisSongPlaying ? "Pause" : "Play"}
                </button>

                <button
                    onClick={handleAddClick}
                    disabled={alreadyInAllPlaylists}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white"
                >
                    Add to Playlist
                </button>

            </div>
        </div>
    );
}

export default SongCard;
