import { useContext } from "react";
import { PlayerContext } from "../context/PlayerContext";


function SongCard({ song }) {

    const { setCurrentSong } = useContext(PlayerContext)

    const playSong = () => {
        setCurrentSong(song)

    }



    return (
        <div className="bg-gray-800 rounded-xl p-4 shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer">
            <img src={song.coverUrl} alt={song.title} className="w-full h-48 object-cover rounded-lg" />
            <h3 className="text-xl font-semibold mt-3">{song.title}</h3>
            <p className="text-gray-400">{song.artist}</p>
            <button onClick={playSong} className="mt-3 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white ">
                Play</button>
        </div>

    )



}
export default SongCard;