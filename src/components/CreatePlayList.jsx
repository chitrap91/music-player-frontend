import { useFormik } from "formik";
import { useContext } from "react";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function CreatePlaylist() {
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);

    const formik = useFormik({
        initialValues: {
            name: ""
        },
        validate: (values) => {
            let errors = {}
            if (values.name === "") {
                errors.name = "Playlists name is required"

            }
            return errors;
        },
        onSubmit: async (values) => {
            try {

                await axios.post("http://localhost:3000/playlist", values, {
                    headers: {
                        Authorization: `Bearer ${token}`

                    }

                })
                navigate("/playlists");

            }
            catch (error) {
                console.log(error);
                alert("Failed to create playlist")
            }

        }

    })

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Create Playlist</h1>
            <form onSubmit={formik.handleSubmit}>
                <input
                    placeholder="Enter playList name"
                    type="text"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    className="border rounded p-2 w-full text-gray-800"

                />
                {formik.errors.name && (
                    <div className="text-red-500">{formik.errors.name}</div>
                )}
                <input
                    type="submit"
                    className="bg-green-600 text-gray-800 px-4 py-2 rounded"
                    value="Create"
                />



            </form>

        </div>




    )
}

export default CreatePlaylist