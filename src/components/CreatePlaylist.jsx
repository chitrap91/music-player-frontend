import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { api } from "../config/axios.config";

function CreatePlaylist() {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            name: ""
        },
        validate: (values) => {
            const errors = {};
            if (!values.name.trim()) {
                errors.name = "Playlist name is required";
            }
            return errors;
        },
        onSubmit: async (values) => {
            try {
                await api.post("/playlist", { name: values.name.trim() });
                navigate("/playlists");
            } catch (error) {
                console.log(error);
                alert("Failed to create playlist");
            }
        }
    });

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Create Playlist</h1>
            <form onSubmit={formik.handleSubmit}>
                <input
                    placeholder="Enter playlist name"
                    type="text"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    className="border rounded p-2 w-full text-gray-800"
                />
                {formik.errors.name && (
                    <div className="text-red-500">{formik.errors.name}</div>
                )}
                <button
                    type="submit"
                    className="bg-green-600 text-gray-800 px-4 py-2 rounded disabled:opacity-60"
                >
                    Create
                </button>
            </form>
        </div>
    );
}

export default CreatePlaylist;
