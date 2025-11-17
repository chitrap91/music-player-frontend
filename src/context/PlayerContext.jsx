import { useRef } from "react";
import { createContext, useState } from "react";


export const PlayerContext = createContext();


export const PlayerProvider = ({ children }) => {

    const [currentSong, setCurrentSong] = useState(null);

    return (
        <PlayerContext.Provider value={{ currentSong, setCurrentSong }}>
            {children}

            {/* Global Audio Player */}
            {currentSong && (
                <div className="fixed bottom-0 left-0 right-0 bg-gray-900 p-4 text-white">
                    <h3 className="text-lg font-semibold">{currentSong.title}</h3>
                    <p className="text-gray-400">{currentSong.artist}</p>

                    <audio
                        src={currentSong.url}   // <-- S3 URL
                        controls
                        autoPlay
                        className="w-full mt-2"
                    />
                </div>
            )}
        </PlayerContext.Provider>
    );

    // const audioRef = useRef();

    // const [currentSong, setCurrentSong] = useState(null);
    // const [isPlaying, setIsPlaying] = useState(false);

    // const playSong = (song) => {

    //     setCurrentSong(song);

    //     if (audioRef.current) {
    //         audioRef.current.src = song.url
    //         audioRef.current.play();
    //     }
    //     setIsPlaying(true);
    // }

    // const togglePlay = () => {

    //     if (!audioRef.current)
    //         return;
    //     if (isPlaying) {
    //         audioRef.current.pause();

    //     } else {
    //         audioRef.current.play();
    //     }
    //     setIsPlaying(!isPlaying)

    // }
    // return (

    //     <PlayerContext.Provider value={{ currentSong, setCurrentSong, isPlaying, setIsPlaying, playSong, togglePlay }}>

    //         {children}

    //         <audio ref={audioRef} />
    //     </PlayerContext.Provider>
    // )




}
