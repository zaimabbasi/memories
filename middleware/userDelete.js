import User from "../models/User.js";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";

const handlePostDeleteUser = async (doc, next) => {
    // remove refs from users' followers list
    const followingUsers = await User.find({ followers: { $in: doc._id } });
    followingUsers.forEach(async (user) => {
        user.followers = user.followers.filter((id) => id.toString() !== doc._id.toString());
        await user.save();
    });

    // remove refs from posts' likes list
    const likedPosts = await Post.find({ likes: { $in: doc._id } });
    likedPosts.forEach(async (post) => {
        post.likes = post.likes.filter((id) => id.toString() !== doc._id.toString());
        await post.save();
    });

    // delete user posts
    const userPosts = await Post.find({ author: doc._id });
    userPosts.forEach(async (post) => {
        post.comments.forEach(async (commentId) => {
            await Comment.deleteOne({ _id: commentId });
        });

        await post.deleteOne();
    });

    // delete user comments
    const userComments = await Comment.find({ author: doc._id });
    userComments.forEach(async (comment) => {
        const post = await Post.findOne({ comments: { $in: comment._id } });
        post.comments = post.comments.filter((id) => id.toString() !== comment._id.toString());
        await post.save();

        await comment.deleteOne();
    });

    next();
};

export default handlePostDeleteUser;
