import Post from "../models/Post.js";

const handlePostDeleteComment = async (doc, next) => {
    const post = await Post.findOne({ comments: { $in: doc._id } });
    post.comments = post.comments.filter((id) => id.toString() !== doc._id.toString());
    await post.save();

    next();
};

export default handlePostDeleteComment;
