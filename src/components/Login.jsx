import { useFormik } from "formik";
import { useContext, useState } from "react"
import axios from "axios";

import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Login() {
    const { setToken, setUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            email: "",
            password: ""
        },
        validate: (values) => {
            let error = {};
            if (!values.email) {
                error.email = "Email is required";
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
                error.email = "Invalid email address";
            }
            if (!values.password) {
                error.password = "Password is required";
            } else if (values.password.length < 6) {
                error.password = "Password must be at least 6 characters";
            }
            return error;
        },
        onSubmit: async (values) => {
            setLoading(true);
            try {
                const resp = await axios.post("http://localhost:3000/auth/login", values)
                const respData = resp?.data ?? null;
                //if (resp?.data?.status)
                if (respData != null) {
                    // backend may return token directly or inside data

                    const tokenRaw = respData?.token ?? null;
                    const token = tokenRaw ? String(tokenRaw).replace(/^Bearer\s+/i, "") : null;
                    console.log('Login response data:', resp.data, 'extracted token:', token);
                    if (token) {
                        setToken(token);
                        await new Promise(r => setTimeout(r, 50));

                        
                        const userResp = await axios.get(`http://localhost:3000/users/${respData.userId}`,
                            {
                                headers: {

                                    Authorization: `Bearer ${token}`
                                }
                            });

                        setUser(userResp?.data?.data ?? null)
                    } else {
                        console.warn('No token returned from login response');
                    }

                    formik.resetForm();
                    navigate("/home");
                }
            } catch (error) {
                console.log("Login failed:", error);
                alert("Login failed. Please check your credentials.");
            }
            finally {
                setLoading(false); // stop loading
            }


        }
    })
    return (
        <div className="max-w-md mx-auto mt-10 p-6 border border-gray-300 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
            <form onSubmit={formik.handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
                    <input
                        className="w-full px-3 py-2 border border-gray-300 text-gray-900 rounded"
                        type="email"
                        id="email"
                        name="email"
                        onChange={formik.handleChange}
                        value={formik.values.email}
                    />
                    {formik.errors.email ? <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div> : null}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
                    <input
                        className="w-full px-3 py-2 border border-gray-300 text-gray-900 rounded"
                        type="password"
                        id="password"
                        name="password"
                        onChange={formik.handleChange}
                        value={formik.values.password}
                    />
                    {formik.errors.password ? <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div> : null}
                </div>
                <input
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 flex justify-center items-center"
                    type="submit"
                    value={loading ? "Logging in..." : "Login"}
                    disabled={loading}
                />
                {loading && <span className="ml-2">⏳</span>}
            </form>
            <p className="mt-4 text-sm text-gray-400">
                Don't have an account?{' '}
                <Link to="/register" className="text-blue-500 hover:underline">
                    Register here
                </Link>
            </p>
        </div>


    )
}


export default Login;       