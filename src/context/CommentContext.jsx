import { createContext, useContext, useState } from "react";
import { AuthContext } from "./AuthContext";
import axios from "axios";

export const CommentContext = createContext();


export const CommentProvider = ({ children }) => {
    const { token } = useContext(AuthContext)
    const [comments, setComments] = useState([]);

    const fetchComments = async (trackId) => {
        if (!trackId) return;
        try {

            const res = await axios.get(`http://localhost:3000/track/${trackId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setComments(res.data.data.comments|| [])
        }
        catch (err) {
            console.log("Error fetching comments:", err);
        }
    }

    const addComment = async (trackId, commentText) => {
        try {
            const res = await axios.post(`http://localhost:3000/track/${trackId}/comments`, {
                comment: commentText
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })



            setComments((prevComments) => [...prevComments, res.data.data]);
        }



        catch (err) {
            console.log("Error adding comment:", err);

        }
    }

    return (
        <CommentContext.Provider value={{ comments, fetchComments, addComment }}>
            {children}
        </CommentContext.Provider>

    )
}
export default CommentContext;
