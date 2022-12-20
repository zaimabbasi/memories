import mongoose from "mongoose";
import Comment from "../models/Comment.js";
import Post from "../models/Post.js";

export const createNewComment = async (req, res) => {
    const { postId, content } = req.body;

    if (!(postId && content)) return res.status(400).json({ message: "PostId and content are required" }); // bad request

    const foundPost = await Post.findById(postId);
    if (!foundPost) return res.status(404).json({ message: "Post not found" }); // not found

    try {
        const comment = await Comment.create({
            content,
            author: req.id
        });

        foundPost.comments.push(comment._id);
        await foundPost.save();

        res.status(201).json({ comment });
    } catch (error) {
        res.sendStatus(500); //internal server error
    }
};

export const editComment = async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!mongoose.Types.ObjectId.isValid(commentId)) return res.status(400).json({ massage: "Invalid commentId" }); // bad request
    if (!content) return res.status(400).json({ message: "Content is required" }); // bad request

    const foundComment = await Comment.findById(commentId);
    if (!foundComment) return res.status(404).json({ message: "Comment not found" }); // not found

    if (foundComment.author.toString() !== req.id) return res.status(401).json({ message: "Unauthorized" }); // unauthorized

    try {
        foundComment.content = content;
        await foundComment.save();

        res.status(200).json({ comment: foundComment });
    } catch (error) {
        res.sendStatus(500); //internal server error
    }
};

export const deleteComment = async (req, res) => {
    const { commentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(commentId)) return res.status(400).json({ massage: "Invalid commentId" }); // bad request

    const foundComment = await Comment.findById(commentId);
    if (!foundComment) return res.status(404).json({ message: "Comment not found" }); // not found

    if (foundComment.author.toString() !== req.id) return res.status(401).json({ message: "Unauthorized" }); // unauthorized

    try {
        const result = await foundComment.deleteOne();

        res.status(200).json({ comment: result });
    } catch (error) {
        res.sendStatus(500); //internal server error
    }
};
