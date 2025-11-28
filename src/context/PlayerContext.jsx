import { createContext, useState, useRef, useEffect } from "react";

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

  const playSong = (song, playlistContext = [], index = 0) => {
    setCurrentSong(song);
    setPlaylist(playlistContext);
    setCurrentIndex(index);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const playNext = () => {
    if (!playlist.length) return;
    const nextIndex = (currentIndex + 1) % playlist.length;
    setCurrentIndex(nextIndex);
    setCurrentSong(playlist[nextIndex]);
    setIsPlaying(true);
  };

  const playPrev = () => {
    if (!playlist.length) return;
    const prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    setCurrentSong(playlist[prevIndex]);
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
