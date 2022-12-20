import mongoose from "mongoose";
import Post from "../models/Post.js";

export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate("author")
            .populate("likes")
            .populate({ path: "comments", populate: { path: "author" } });

        res.status(200).json({ posts });
    } catch (error) {
        res.sendStatus(500); //internal server error
    }
};

export const createNewPost = async (req, res) => {
    const { caption } = req.body;
    const { files } = req;
    const fileBase64Array = [];

    Object.keys(files).forEach((key) => {
        const file = files[key];
        fileBase64Array.push(`data:${file.mimetype};base64,${file.data.toString("base64")}`);
    });

    try {
        const post = await Post.create({
            caption,
            image: fileBase64Array[0],
            author: req.id
        });

        res.status(201).json({ post });
    } catch (error) {
        res.sendStatus(500); //internal server error
    }
};

export const getPost = async (req, res) => {
    const { postId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(postId)) return res.status(400).json({ message: "Invalid postId" }); // bad request

    try {
        const foundPost = await Post.findById(postId)
            .populate("author")
            .populate("likes")
            .populate({ path: "comments", populate: { path: "author" } });

        if (!foundPost) return res.status(404).json({ message: "Post not found" });

        res.status(200).json({ post: foundPost });
    } catch (error) {
        res.sendStatus(500); //internal server error
    }
};

export const updatePost = async (req, res) => {
    const { postId } = req.params;
    const { caption } = req.body;
    const { files } = req;
    const fileBase64Array = [];

    if (!mongoose.Types.ObjectId.isValid(postId)) return res.status(400).json({ message: "Invalid postId" }); // bad request

    const foundPost = await Post.findById(postId);
    if (!foundPost) return res.status(404).json({ message: "Post not found" }); // not found

    if (foundPost.author.toString() !== req.id) return res.status(401).json({ message: "Unauthorized" }); // unauthorized

    if (files) {
        Object.keys(files).forEach((key) => {
            const file = files[key];
            fileBase64Array.push(`data:${file.mimetype};base64,${file.data.toString("base64")}`);
        });
    }

    try {
        foundPost.caption = caption;
        if (fileBase64Array.length) foundPost.image = fileBase64Array[0];

        await foundPost.save();

        res.status(200).json({ post: foundPost });
    } catch (error) {
        res.sendStatus(500); //internal server error
    }
};

export const deletePost = async (req, res) => {
    const { postId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(postId)) return res.status(400).json({ message: "Invalid postId" }); // bad request

    const foundPost = await Post.findById(postId);
    if (!foundPost) return res.status(404).json({ message: "Post not found" }); // not found

    if (foundPost.author.toString() !== req.id) return res.status(401).json({ message: "Unauthorized" }); // unauthorized

    try {
        const result = await foundPost.deleteOne();

        res.status(200).json({ post: result });
    } catch (error) {
        res.sendStatus(500); //internal server error
    }
};

export const likeUnlikePost = async (req, res) => {
    const { postId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(postId)) return res.status(400).json({ message: "Invalid postId" }); // bad request

    const foundPost = await Post.findById(postId);

    if (!foundPost) return res.status(404).json({ message: "Post not found" }); // not found

    if (foundPost.likes.find((id) => id.toString() === req.id))
        foundPost.likes = foundPost.likes.filter((id) => id.toString() !== req.id);
    else foundPost.likes.push(req.id);

    try {
        await foundPost.save();

        res.status(200).json({ post: foundPost });
    } catch (error) {
        res.sendStatus(500); //internal server error
    }
};
