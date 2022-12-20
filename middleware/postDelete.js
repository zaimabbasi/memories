import Comment from "../models/Comment.js";

const handlePostDeletePost = async (doc, next) => {
    doc.comments.forEach(async (commentId) => {
        await Comment.deleteOne({ _id: commentId });
    });

    next();
};

export default handlePostDeletePost;
