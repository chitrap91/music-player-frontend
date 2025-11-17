import { useContext } from "react"
import { createContext } from "react-router-dom"
import { AuthContext } from "./AuthContext"
import { Navigate } from "react-router-dom";

function ProductedRoute({ children }) {

    const { token } = useContext(AuthContext);
    if (!token) {
        return <Navigate to="/login" replace />
    }
    return children
}

export default ProductedRoute;





