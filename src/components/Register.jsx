import axios from "axios";
import { useFormik } from "formik";
import { useState } from "react";

import { useNavigate } from "react-router-dom";

function Register() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState((false));



    const formik = useFormik({
        initialValues: {
            username: "",
            email: "",
            password: ""

        },
        validate: (values) => {
            let error = {};
            if (!values.username) {
                error.username = "Username is required"
            }
            if (!values.email) {
                error.email = "Email is required"
            }
            if (values.password.length < 6) {
                error.password = "Password must be at least 6 characters"
            }
            return error;
        },
        onSubmit: async (values) => {
            setLoading(true);
            try {

                const res = await axios.post("http://localhost:3000/auth/register", values)
                // localStorage.setItem("user", JSON.stringify(res.data.user));

                formik.resetForm();
                navigate('/login');

                console.log(res);

            }
            catch (error) {
                console.log(error)
                alert("Registration failed. Please check your details.");
            }

            finally {
                setLoading(false);
            }
        }
    })
    return (
        <div className="max-w-md mx-auto mt-10 p-6 border border-gray-300 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
            <form onSubmit={formik.handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="username">Username</label>
                    <input
                        className="w-full px-3 py-2 border border-gray-300 rounded text-gray-800"
                        type="text"
                        id="username"
                        name="username"
                        onChange={formik.handleChange}
                        value={formik.values.username}
                    />
                    {formik.errors.username ? <div className="text-red-500 text-sm mt-1">{formik.errors.username}</div> : null}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
                    <input
                        className="w-full px-3 py-2 border border-gray-300 text-gray-800 rounded"
                        type="email"
                        id="email"
                        name="email"
                        onChange={formik.handleChange}
                        value={formik.values.email}
                    />
                    {formik.errors.email ? <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div> : null}
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
                    <input
                        className="w-full px-3 py-2 border border-gray-800 text-gray-800 rounded"
                        type="password"
                        id="password"
                        name="password"
                        onChange={formik.handleChange}
                        value={formik.values.password}
                    />
                    {formik.errors.password ? <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div> : null}
                </div>
                <input
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition text-gray-800 duration-200"
                    type="submit"
                    disabled={loading}
                    value={loading ? "Registering..." : "Register"}
                />

            </form>
        </div>



    )

}
export default Register;