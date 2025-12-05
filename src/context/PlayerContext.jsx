import axios from "axios";
import { createContext, useState, useRef, useEffect, useContext, use } from "react";
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
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentModal, setCommentModal] = useState(false);
  


  /** SHUFFLE ARRAY */
  const shuffleArray = (array) => {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  /** PLAY SONG */
  const playSong = async (song, playlistContext = [], index = 0) => {
    const list = playlistContext.length ? playlistContext : playlist;
    setPlaylist(list);

    // Build queue based on shuffle state
    const queue = shuffle ? shuffleArray([...list]) : [...list];
    setPlaylistQueue(queue);

    const idx = queue.findIndex((s) => s._id === song._id);
    setCurrentIndex(idx !== -1 ? idx : index);

    setCurrentSong(song);
    setIsPlaying(true);

    if (token) {
      await axios.post(
        "http://localhost:3000/track/recent",
        { trackId: song._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }
  };

  /** PLAY / PAUSE */
  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();

    setIsPlaying(!isPlaying);
  };

  /** NEXT SONG */
  const playNext = () => {
    if (!playlistQueue.length) return;

    if (repeatMode === "one") {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      return;
    }

    let nextIndex = shuffle
      ? Math.floor(Math.random() * playlistQueue.length)
      : currentIndex + 1;

    if (nextIndex >= playlistQueue.length) {
      if (repeatMode === "all") nextIndex = 0;
      else return setIsPlaying(false);
    }

    setCurrentIndex(nextIndex);
    setCurrentSong(playlistQueue[nextIndex]);
    setIsPlaying(true);
  };

  /** PREVIOUS SONG */
  const playPrev = () => {
    if (!playlistQueue.length) return;

    let prevIndex = shuffle
      ? Math.floor(Math.random() * playlistQueue.length)
      : currentIndex - 1;

    if (prevIndex < 0) {
      if (repeatMode === "all") prevIndex = playlistQueue.length - 1;
      else return setIsPlaying(false);
    }

    setCurrentIndex(prevIndex);
    setCurrentSong(playlistQueue[prevIndex]);
    setIsPlaying(true);
  };

  /** TIME UPDATE */
  const onTimeUpdate = () => {
    if (!audioRef.current) return;
    setProgress(audioRef.current.currentTime);
    setDuration(audioRef.current.duration || 0);
  };

  /** SEEK */
  const handleSeek = (e) => {
    const time = Number(e.target.value);
    if (audioRef.current) audioRef.current.currentTime = time;
    setProgress(time);
  };

  /** VOLUME */
  const handleVolume = (e) => {
    const vol = Number(e.target.value);
    if (audioRef.current) audioRef.current.volume = vol;
    setVolume(vol);
  };

  /** FORMAT TIME */
  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  /** DOWNLOAD */
  const handleDownload = async () => {
    if (!currentSong?._id) return;

    try {
      const res = await axios.get(
        `http://localhost:3000/track/download/${currentSong._id}`,
        {
          responseType: "blob",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const blob = new Blob([res.data]);
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${currentSong.title}.mp3`;
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  const handleLike = async (trackId) => {
    if (!token || !currentSong) return;
    if (!trackId) {
      console.warn("handleLike called without trackId");
      return;
    }

    // Optimistic UI update: toggle like locally first
    setLikes(prevLikes => {
      if (prevLikes.includes(trackId)) {
        return prevLikes.filter(id => id !== trackId);
      } else {
        return [...prevLikes, trackId];
      }
    });

    try {
      console.log("Posting like request:", { trackId, token: token.substring(0, 10) + "..." });
      const res = await axios.post(
        `http://localhost:3000/track/${trackId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Like response:", res.data);

      // Sync with server response if it includes likes array
      if (res.data && res.data.likes) {
        setLikes(res.data.likes.map(id => id.toString()));
      } else if (res.data && res.data.data && res.data.data.likes) {
        setLikes(res.data.data.likes.map(id => id.toString()));
      }
    } catch (error) {
      console.error(
        "Error liking/unliking track:",
        "Status:", error.response?.status,
        "Data:", error.response?.data,
        "Message:", error.message
      );

      // Revert optimistic update on error
      setLikes(prevLikes => {
        if (prevLikes.includes(trackId)) {
          return prevLikes.filter(id => id !== trackId);
        } else {
          return [...prevLikes, trackId];
        }
      });
    }
  };






  /** AUTO-PLAY ON SONG CHANGE — FIXED */
  useEffect(() => {
    if (!currentSong || !audioRef.current) return;

    const audio = audioRef.current;

    audio.src = currentSong.url;
    audio.load();

    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch((err) => console.log("Autoplay blocked:", err));
  }, [currentSong]);

  /** AUTO NEXT TRACK */
  useEffect(() => {
    if (!audioRef.current) return;

    const handleEnded = () => playNext();
    const el = audioRef.current;

    el.addEventListener("ended", handleEnded);
    return () => el.removeEventListener("ended", handleEnded);
  }, [currentIndex, playlistQueue, repeatMode, shuffle]);

  /** PROGRESS BAR FILL */
  useEffect(() => {
    const percent = duration ? (progress / duration) * 100 : 0;
    document.documentElement.style.setProperty("--fill", `${percent}%`);
  }, [progress, duration]);


  useEffect(() => {
    if (!token || !currentSong) return;

    const fetchLikes = async () => {
      try {
        const res = await axios.get("http://localhost:3000/user/likes", {
          headers: { Authorization: `Bearer ${token}` }
        });

        setLikes(res.data.data.likes.map(id => id.toString()));
      } catch (error) {
        console.error("Error fetching likes:", error);
      }
    };

    fetchLikes();
  }, [token]);



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
        handleDownload,
        shuffle,
        setShuffle,
        repeatMode,
        setRepeatMode,
        likes,
        handleLike,
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
              <button onClick={playPrev} className="text-white text-2xl">⏮</button>
              <button onClick={togglePlay} className="text-white text-3xl">
                {isPlaying ? "❚❚" : "▶"}
              </button>
              <button onClick={playNext} className="text-white text-2xl">⏭</button>

              {/* SHUFFLE BUTTON — FIXED */}
              <button
                onClick={() => {
                  setShuffle((prev) => {
                    const active = !prev;

                    const q = active
                      ? shuffleArray([...playlist])
                      : [...playlist];

                    setPlaylistQueue(q);

                    const idx = q.findIndex((s) => s._id === currentSong._id);
                    setCurrentIndex(idx !== -1 ? idx : 0);

                    return active;
                  });
                }}
              >
                {shuffle ? "🔀" : "➡️"}
              </button>
              <button onClick={() => handleLike(currentSong._id)}>
                {likes.includes(currentSong._id.toString()) ? "❤️" : "🤍"}
              </button>

              {/* REPEAT BUTTON */}
              <button
                className="text-white text-2xl"
                onClick={() => {
                  setRepeatMode((prev) =>
                    prev === "none" ? "all" : prev === "all" ? "one" : "none"
                  );
                }}
              >
                {repeatMode === "none"
                  ? "🔁"
                  : repeatMode === "all"
                    ? "🔂"
                    : "🔂1"}
              </button>

              <button onClick={handleDownload}>⬇️</button>
            </div>


            {/* PROGRESS BAR */}
            <div className="flex items-center gap-2 w-full px-2">
              <span className="text-gray-300 text-xs">{formatTime(progress)}</span>
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={progress}
                onChange={handleSeek}
                className="flex-1 h-1 bg-gray-700 rounded-lg cursor-pointer"
              />
              <span className="text-gray-300 text-xs">{formatTime(duration)}</span>
            </div>
          </div>

          {/* VOLUME */}
          <div className="flex items-center gap-2 flex-1 justify-end">
            <span className="text-white text-lg">🔊</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolume}
              className="w-24 h-1 bg-gray-700 rounded-lg"
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



export default PlayerProvider;
