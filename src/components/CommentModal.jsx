import { useContext } from "react";
import CommentContext from "../context/CommentContext";
import { useFormik } from "formik";

const CommentModal = ({ trackId, isOpen, onClose }) => {
    const { addComment, comments } = useContext(CommentContext);

    const formik = useFormik({
        initialValues: { commentText: "" },
        validate: (values) => {
            let error = {};
            if (!values.commentText.trim()) {
                error.commentText = "Comment cannot be empty";
            }
            return error;
        },
        onSubmit: async (values) => {
            try {
                await addComment(trackId, values.commentText);
                formik.resetForm();
                onClose();
            } catch (err) {
                console.log("Error adding comment:", err);
            }
        },
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">

            {/* Modal Box */}
            <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl animate-fade-in">

                <h2 className="text-xl font-bold mb-4">Add Comment</h2>

                {/* Existing Comments */}
                <div className="max-h-60 overflow-y-auto mb-4 pr-2">
                    {comments.length === 0 ? (
                        <p className="text-gray-500 text-sm">No comments yet.</p>
                    ) : (
                        comments.map((c, idx) => (
                            <div key={idx} className="mb-3 border-b border-gray-200 pb-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-bold">
                                        {c.user?.username?.charAt(0).toUpperCase() || "U"}
                                    </div>
                                    <span className="font-semibold">{c.user?.username || "User"}</span>
                                    <span className="text-gray-400 text-xs">
                                        {new Date(c.createdAt).toLocaleString()}
                                    </span>
                                </div>
                                <p className="ml-10 mt-1">{c.text}</p>
                            </div>
                        ))
                    )}
                </div>

                {/* Form */}
                <form onSubmit={formik.handleSubmit}>
                    <textarea
                        name="commentText"
                        value={formik.values.commentText}
                        onChange={formik.handleChange}
                        className="w-full border border-gray-300 p-3 rounded-lg mb-3 focus:ring-2 focus:ring-blue-500"
                        rows="3"
                        placeholder="Write a comment..."
                    ></textarea>

                    {formik.errors.commentText && (
                        <p className="text-red-500 text-sm mb-2">{formik.errors.commentText}</p>
                    )}

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Submit
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
};

export default CommentModal;
