import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    // one-time load from localStorage
    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) setUser(JSON.parse(savedUser));

        const savedToken = localStorage.getItem("token");
        if (savedToken) setToken(savedToken); // ✅ fixed here

    }, []);

    // // every time user or token changes, save to localStorage
    // useEffect(() => {
    //     if (user) localStorage.setItem("user", JSON.stringify(user));
    //     if (token) localStorage.setItem("token", JSON.stringify(token));
    // }, [user, token]);


    // every time user changes, save to localStorage
    useEffect(() => {
        if (user) localStorage.setItem("user", JSON.stringify(user));
    }, [user]);


    // every time token changes, save to localStorage
    useEffect(() => {
        if (token) localStorage.setItem("token", token);
    }, [token]);

    return (
        <AuthContext.Provider value={{ user, setUser, token, setToken }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;
