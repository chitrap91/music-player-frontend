import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useFormik } from "formik";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

function PlaylistDetails() {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const [playList, setPlayList] = useState(null);
  const [allTracks, setAllTracks] = useState([]);
  const [filteredTracks, setFilteredTracks] = useState([]);

  // Fetch playlist details
  const fetchPlayLists = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/playlist/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPlayList(res.data.data);
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
      setAllTracks(res.data.data);
      setFilteredTracks(res.data.data); // Initially show all tracks
    } catch (err) {
      console.log("Error fetching tracks:", err);
    }
  };

  // Add track to playlist
  const addTrackToPlaylist = async (trackId) => {
    try {
      const res = await axios.post(
        `http://localhost:3000/playlist/${id}/add-track`,
        { trackId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPlayList(res.data.data);
    } catch (err) {
      console.log("Error adding track:", err);
    }
  };

  // Remove track from playlist
  const removeTrackFromPlaylist = async (trackId) => {
    try {
      const res = await axios.delete(
        `http://localhost:3000/playlist/${id}/remove-track`,
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { trackId },
        }
      );
      setPlayList(res.data.data);
    } catch (err) {
      console.log("Error removing track:", err);
    }
  };

  // Search form using useFormik
  const formik = useFormik({
    initialValues: { query: "" },
    onSubmit: async (values) => {
      try {
        const res = await axios.get(
          `http://localhost:3000/track?search=${values.query}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFilteredTracks(res.data.data);
      } catch (err) {
        console.log("Error searching tracks:", err);
      }
    },
  });

  useEffect(() => {
    fetchPlayLists();
    fetchAllTracks();
  }, []);

  return (
    <div className="p-4">
      <div className="max-w-3xl mx-auto bg-gray-800 text-white rounded-lg p-6 shadow-md">
        <h1 className="text-3xl font-bold mb-4 text-center">
          {playList ? playList.name : "Loading..."}
        </h1>

        {playList && (
          <>
            
            {/* Search Tracks */}
            <form
              onSubmit={formik.handleSubmit}
              className="mb-4 flex gap-2"
            >
              <input
                type="text"
                name="query"
                placeholder="Search songs..."
                value={formik.values.query}
                onChange={formik.handleChange}
                className="flex-1 px-3 py-2 rounded text-gray-900"
              />
              <button
                type="submit"
                className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
              >
                Search
              </button>
            </form>

            {/* Tracks in Playlist */}
            <h2 className="text-2xl font-semibold mb-3">Tracks in Playlist</h2>
            {playList.tracks.length === 0 && (
              <p className="text-gray-400 mb-4">No tracks added yet</p>
            )}
            <ul className="space-y-2 mb-6">
              {playList.tracks.map((track) => (
                <li
                  key={track._id}
                  className="flex justify-between items-center bg-gray-700 p-3 rounded"
                >
                  <span>{track.title || track.songName || "Untitled"}</span>
                  <button
                    onClick={() => removeTrackFromPlaylist(track._id)}
                    className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>

            {/* Add Tracks */}
            <h2 className="text-2xl font-semibold mb-3">Add Tracks</h2>
            <ul className="space-y-2">
              {filteredTracks.map((track) => (
                <li
                  key={track._id}
                  className="flex justify-between items-center bg-gray-700 p-3 rounded"
                >
                  <span>{track.title || track.songName || "Untitled"}</span>
                  {!playList.tracks.find((t) => t._id === track._id) && (
                    <button
                      onClick={() => addTrackToPlaylist(track._id)}
                      className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded"
                    >
                      Add
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

export default PlaylistDetails;
