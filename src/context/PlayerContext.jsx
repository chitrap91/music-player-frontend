import axios from "axios";
import { createContext, useState, useRef, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";

export const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const audioRef = useRef(null);

  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { token } = useContext(AuthContext);
  const [shuffle, setShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState("none");
  const [playlistQueue, setPlaylistQueue] = useState([]);

  const playSong = async (song, playlistContext = [], index = 0) => {
    setCurrentSong(song);
    setPlaylist(playlistContext);
    setPlaylistQueue(playlistContext);
    setCurrentIndex(index);
    setIsPlaying(true);
    if (token) {
      await axios.post(
        `http://localhost:3000/track/recent`,


        { trackId: song._id }
        ,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const playNext = () => {
    if (!playlistQueue.length) return;
    let nextIndex;
    if (shuffle) {
      // Pick a random index different from current
      do {
        nextIndex = Math.floor(Math.random() * playlistQueue.length);
      } while (nextIndex === currentIndex && playlistQueue.length > 1);
    } else {
      nextIndex = currentIndex + 1;
      if (nextIndex >= playlistQueue.length) {
        if (repeatMode === "all") nextIndex = 0;
        else if (repeatMode === "none") {
          setIsPlaying(false);
          return;
        }
        else if (repeatMode === "one") nextIndex = currentIndex;
      }
    }
    setCurrentIndex(nextIndex);
    setCurrentSong(playlistQueue[nextIndex]);
    setIsPlaying(true);
  };


  const playPrev = () => {
    let prevIndex;
    if (shuffle) {
      do {
        prevIndex = Math.floor(Math.random() * playlistQueue.length);
      } while (prevIndex === currentIndex && playlistQueue.length > 1);
    } else {
      prevIndex = currentIndex - 1;
      if (prevIndex < 0) {
        if (repeatMode === "all") prevIndex = playlistQueue.length - 1;
        else if (repeatMode === "none") {
          setIsPlaying(false);
          return;
        }
        else if (repeatMode === "one") prevIndex = currentIndex;
      }
    }
    setCurrentIndex(prevIndex);
    setCurrentSong(playlistQueue[prevIndex]);
    setIsPlaying(true);
  };

  const onTimeUpdate = () => {
    if (!audioRef.current) return;
    setProgress(audioRef.current.currentTime);
    setDuration(audioRef.current.duration || 0);
  };

  const handleSeek = (e) => {
    const time = Number(e.target.value);
    if (audioRef.current) audioRef.current.currentTime = time;
    setProgress(time);
  };

  const handleVolume = (e) => {
    const vol = Number(e.target.value);
    if (audioRef.current) audioRef.current.volume = vol;
    setVolume(vol);
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleDownload=async(song)=>{
      if (!currentSong?._id) return;
    try{
      const res = await axios.get(`http://localhost:3000/track/download/${currentSong._id}`,{
        headers:{
          Authorization:'Bearer ${token}'
        }
    });
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
   a. href = url;
   a.download = `${currentSong.title}+.mp3`;
   document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);  
}
    catch(error){
      console.error("Download error:",error);
    } 
  }

  useEffect(() => {
    if (currentSong && audioRef.current) {
      audioRef.current.src = currentSong.url;
      audioRef.current.play();
    }
  }, [currentSong]);

  useEffect(() => {
    const percent = duration ? (progress / duration) * 100 : 0;
    document.documentElement.style.setProperty("--fill", `${percent}%`);
  }, [progress, duration]);

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        playSong,
        togglePlay,
        progress,
        duration,
        volume,
        playNext,
        playPrev,
        playlist,
        handleSeek,
        handleVolume,
        currentIndex,
        formatTime,
      }}
    >
      {children}

      {currentSong && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-11/12 max-w-3xl bg-gray-900/90 backdrop-blur-md p-4 rounded-xl shadow-lg flex flex-col md:flex-row items-center gap-4 z-50">

          {/* Song Info */}
          <div className="flex items-center gap-4 flex-1">
            <img
              src={currentSong.coverUrl}
              alt={currentSong.title}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="flex flex-col">
              <h3 className="text-white font-semibold">{currentSong.title}</h3>
              <p className="text-gray-300 text-sm">{currentSong.artist}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center flex-1 w-full md:w-auto">
            <div className="flex items-center gap-4 mb-2">
              <button
                onClick={playPrev}
                className="text-white hover:text-blue-400 text-2xl"
              >
                ⏮
              </button>

              <button
                onClick={togglePlay}
                className="text-white hover:text-blue-400 text-3xl"
              >
                {isPlaying ? "❚❚" : "▶"}
              </button>

              <button
                onClick={playNext}
                className="text-white hover:text-blue-400 text-2xl"
              >
                ⏭
              </button>
              <button onClick={() => setShuffle(!shuffle)}>🔀</button>
              <button onClick={() => {
                if (repeatMode === "none") setRepeatMode("all");
                else if (repeatMode === "all") setRepeatMode("one");
                else setRepeatMode("none");
              }}>
                {repeatMode === "none" ? "🔁" : repeatMode === "all" ? "🔁" : "🔂"}
              </button>
              <button onClick={()=>handleDownload(currentSong)}>⬇️</button>  
            </div>

            {/* Progress Bar */}
            <div className="flex items-center gap-2 w-full px-2">
              <span className="text-gray-300 text-xs">{formatTime(progress)}</span>
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={progress}
                onChange={handleSeek}
                className="flex-1 h-1 rounded-lg appearance-none bg-gray-700 cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
              />
              <span className="text-gray-300 text-xs">{formatTime(duration)}</span>
            </div>
          </div>
          

          {/* Volume */}
          <div className="flex items-center gap-2 flex-1 justify-end">
            <span className="text-white text-lg">🔊</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolume}
              className="w-24 h-1 rounded-lg appearance-none bg-gray-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
            />
          </div>

          {/* Hidden Audio Element */}
          <audio
            ref={audioRef}
            onTimeUpdate={onTimeUpdate}
            onLoadedMetadata={(e) => setDuration(e.target.duration)}
          />
        </div>
      )}
    </PlayerContext.Provider>
  );
};
