import { createContext, useEffect, useState } from "react";
import axios from 'axios';

export const AuthContext = createContext();

function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [token, setToken] = useState(() => {
        const savedToken = localStorage.getItem("token");
        if (!savedToken) return null;
        // normalize token (strip leading 'Bearer ' if present)
        return String(savedToken).replace(/^Bearer\s+/i, "");
    });


    // every time user changes, save to localStorage
    useEffect(() => {
        if (user) localStorage.setItem("user", JSON.stringify(user)); else localStorage.removeItem("user");
    }, [user]);


    // every time token changes, save to localStorage
    useEffect(() => {
        if (token) {
            // store normalized token (no Bearer prefix)
            const normalized = String(token).replace(/^Bearer\s+/i, "");
            localStorage.setItem("token", normalized);
        } else {
            localStorage.removeItem("token");
        }
    }, [token]);

    // // configure axios default Authorization header whenever token changes
    // useEffect(() => {
    //     if (token) {
    //         axios.defaults.headers.common['Authorization'] = `Bearer ${String(token).replace(/^Bearer\s+/i, "")}`;
    //     } else {
    //         delete axios.defaults.headers.common['Authorization'];
    //     }
    // }, [token]);

    return (
        <AuthContext.Provider value={{ user, setUser, token, setToken }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;
