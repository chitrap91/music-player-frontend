import { createContext, useContext } from "react";
import { AuthContext } from "./AuthContext";

const CommentContext = createContext();
const { token } = useContext(AuthContext)

export const CommentProvider = ({ children }) => {
    const [comments, setComments] = useState({});

    const fetchCommments = async (trackId) => {
        if (!trackId) return;
        try {

            const res = await axios.get('http:localhost:3000/${trackId}/comments', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setComments(res.data.data || [])
        }
        catch (err) {
            console.log("Error fetching comments:", err);
        }
    }

    const addComment = async (trackId, commentText) => {
        try {
            const res = await axios.post("http:localhost:3000/${trackId}/comments", {
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
        <CommentContext.Provider value={{ comments, fetchCommments, addComment }}>
            {children}
        </CommentContext.Provider>              

    )
}
export default CommentContext;
