import { createContext, useState, useRef, useEffect } from "react";

export const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const audioRef = useRef(null);

  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  const playSong = (song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const onTimeUpdate = () => {
    const current = audioRef.current.currentTime;
    const total = audioRef.current.duration;
    setProgress(current);
    setDuration(total);
  };

  const handleSeek = (e) => {
    const time = Number(e.target.value);
    audioRef.current.currentTime = time;
    setProgress(time);
  };

  const handleVolume = (e) => {
    const vol = Number(e.target.value);
    setVolume(vol);
    audioRef.current.volume = vol;
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
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
        handleSeek,
        handleVolume,
      }}
    >
      {children}

      {currentSong && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 p-4 h-50 text-white shadow-lg rounded-t-xl">

          {/* Main Bar: Song Info + Progress + Play */}
          <div className="flex items-center justify-center gap-6">

            {/* Song Info */}
            <div className="flex-1 text-center">
              <h3 className="text-lg font-bold">{currentSong.title}</h3>
              <p className="text-blue-300 text-sm">{currentSong.artist}</p>
            </div>

            {/* Progress Slider */}
            <div className="flex-1">
              <input
                type="range"
                min="0"
                max={duration}
                value={progress}
                onChange={handleSeek}
                className="
                  w-full h-4 cursor-pointer appearance-none rounded-full
                  [&::-webkit-slider-runnable-track]:bg-[linear-gradient(to_right,#3b82f6_var(--fill),#4b5563_var(--fill))]
                  [&::-webkit-slider-thumb]:appearance-none h-3 w-3 rounded-full bg-blue-500 shadow
                  [&::-webkit-slider-thumb]:hover:scale-125 duration-150
                "
              />
              <div className="flex justify-between text-xs text-blue-300 mt-1">
                <span>{formatTime(progress)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Play / Pause */}
            <button
              onClick={togglePlay}
              className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center shadow-lg active:scale-90 transition"
            >
              {isPlaying ? "❚❚" : "▶"}
            </button>

          </div>

          {/* Volume Slider at Bottom Right */}
          <div className="absolute bottom-4 right-4 flex items-center gap-2">
            <span className="text-blue-400 text-lg">🔊</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolume}
              className="
                w-24 h-1 cursor-pointer appearance-none rounded-full
                [&::-webkit-slider-runnable-track]:bg-gray-700
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500
                [&::-webkit-slider-thumb]:hover:scale-125
                [&::-webkit-slider-thumb]:transition duration-150
              "
            />
          </div>

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
