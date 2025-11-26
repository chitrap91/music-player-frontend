import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function PlayList() {

    const [playLists, setPlaylists] = useState([]);

    useEffect(() => {
        fetchPlayLists()
    }, [])

    const fetchPlayLists = async () => {
        const res = await axios.get("http://localhost:3000/playlist/");
        setPlaylists(res.data.data|| 0)
    }

    return (

        <div className="p-4">
            <h1 className="text-xl font-bold">Your Playlists</h1>
            <Link to="/playlists/new">
                <button className="bg-blue-600 text-white px-3 py-1 rounded mt-3">
                    + Create New Palylist

                </button>
            </Link>
            <div className="mt-4 flex flex-col gap-2 ">
                {playLists.length === 0 && <p>No playlists found</p>}

                {playLists.map((p) => (
                    < Link key={p._id} to={`/playlists/${p._id}`}>
                        <div className="border p-2 rounded">
                            {p.name} ({p.tracks.length||0} Songs)
                        </div>

                    </Link>

                ))}

            </div>


        </div >
    )

}

export default PlayList;