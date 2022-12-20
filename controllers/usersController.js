import bcrypt from "bcrypt";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { validateEmail, validateUsername } from "../utils/validation.js";

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().populate("followers");

        res.status(200).json({ users });
    } catch (error) {
        res.sendStatus(500); // internal server error
    }
};

export const getUser = async (req, res) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).json({ message: "Invalid userId" }); // bad request

    try {
        const foundUser = await User.findById(userId).populate("followers");
        if (!foundUser) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ user: foundUser });
    } catch (error) {
        res.sendStatus(500); // internal server error
    }
};

export const createNewUser = async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    if (!(username && email && password && confirmPassword))
        return res.status(400).json({ message: "All fields are required" }); // bad request

    if (!validateUsername(username)) return res.status(400).json({ message: "Invalid username" });
    if (!validateEmail(email)) return res.status(400).json({ message: "Invalid email address" });

    let foundUser;
    foundUser = await User.findOne({ username });
    if (foundUser) return res.status(409).json({ message: "Username already taken" });
    foundUser = await User.findOne({ email });
    if (foundUser) return res.status(409).json({ message: "Email already in use" });

    if (password !== confirmPassword) return res.status(400).json({ message: "Password does not match" });

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await User.create({
            username,
            email,
            password: hashedPassword
        });

        res.status(201).json({ user }); // created
    } catch (error) {
        res.sendStatus(500); //internal server error
    }
};

export const authUser = async (req, res) => {
    const { username, email, password } = req.body;

    if (!((username || email) && password)) return res.status(400).json({ message: "All fields are required" }); // bad request

    let foundUser;
    if (username) {
        if (!validateUsername(username)) return res.status(400).json({ message: "Invalid username" });
        foundUser = await User.findOne({ username });
    } else if (email) {
        if (!validateEmail(email)) return res.status(400).json({ message: "Invalid email address" });
        foundUser = await User.findOne({ email });
    }

    if (!foundUser) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const accessToken = jwt.sign({ id: foundUser._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30m" });
    const refreshToken = jwt.sign({ id: foundUser._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1d" });

    try {
        foundUser.refreshToken = refreshToken;
        await foundUser.save();

        res.cookie("jwt", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 24 * 60 * 60 * 1000
        });
        res.status(200).json({
            user: foundUser,
            accessToken
        });
    } catch (error) {
        res.sendStatus(500); //internal server error
    }
};

export const refreshToken = async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" }); // unauthorized

    const refreshToken = cookies.jwt;

    const foundUser = await User.findOne({ refreshToken });
    if (!foundUser) return res.status(404).json({ message: "User not found" }); // not found

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, decoded) => {
        if (error) return res.status(403).json({ message: "Error verifying refresh token" });
        else if (decoded.id !== foundUser._id.toString()) return res.status(403).json({ message: "Forbidden" });

        const accessToken = jwt.sign({ id: foundUser._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30m" });

        res.status(200).json({ accessToken });
    });
};

export const logoutUser = async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.sendStatus(204); // no content

    const refreshToken = cookies.jwt;

    const foundUser = await User.findOne({ refreshToken });
    if (foundUser) {
        foundUser.refreshToken = "";
        await foundUser.save();
    }

    res.clearCookie("jwt", { httpOnly: true, secure: true, sameSite: "None", maxAge: 24 * 60 * 60 * 1000 });
    res.sendStatus(204); // no content
};

export const deleteUser = async (req, res) => {
    const { userId } = req.params;
    const { password } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).json({ message: "Invalid userId" }); // bad request
    if (!password) return res.status(400).json({ message: "User password is required" }); // bad request

    const foundUser = await User.findById(userId);
    if (!foundUser) return res.status(404).json({ message: "User not found" }); // not found

    if (foundUser._id.toString() !== req.id) return res.status(401).json({ message: "Unauthorized" }); // unauthorized

    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" }); // invalid credentials

    try {
        const result = await foundUser.deleteOne();

        res.clearCookie("jwt", { httpOnly: true, secure: true, sameSite: "None", maxAge: 24 * 60 * 60 * 1000 });
        res.status(200).json({ user: result });
    } catch (error) {
        res.sendStatus(500); //internal server error
    }
};

export const updateUser = async (req, res) => {
    const { userId } = req.params;
    const { username, email } = req.body;
    const { files } = req;
    const fileBase64Array = [];

    if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).json({ message: "Invalid userId" }); // bad request

    const foundUser = await User.findById(userId);
    if (!foundUser) return res.status(404).json({ message: "User not found" }); // not found

    if (foundUser._id.toString() !== req.id) return res.status(401).json({ message: "Unauthorized" }); // unauthorized

    if (files) {
        Object.keys(files).forEach((key) => {
            const file = files[key];
            fileBase64Array.push(`data:${file.mimetype};base64,${file.data.toString("base64")}`);
        });

        foundUser.image = fileBase64Array[0];
    }

    if (username) {
        if (!validateUsername(username)) return res.status(400).json({ message: "Invalid username" });

        const otherUser = await User.findOne({ username });
        if (otherUser && otherUser._id !== foundUser._id)
            return res.status(409).json({ message: "Username already taken" }); // conflict

        foundUser.username = username;
    }

    if (email) {
        if (!validateEmail(email)) return res.status(400).json({ message: "Invalid email address" });

        const otherUser = await User.findOne({ email });
        if (otherUser && otherUser._id !== foundUser._id)
            return res.status(409).json({ message: "Email already in use" }); // conflict

        foundUser.email = email;
    }

    try {
        await foundUser.save();

        res.status(200).json({ user: foundUser });
    } catch (error) {
        res.sendStatus(500); // internal server error
    }
};

export const changePassword = async (req, res) => {
    const { userId } = req.params;
    const { password, newPassword, confirmPassword } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).json({ message: "Invalid userId" }); // bad request

    if (!(password && newPassword && confirmPassword))
        return res.status(400).json({ message: "All fields are required" }); // bad request

    const foundUser = await User.findById(userId);
    if (!foundUser) return res.status(404).json({ message: "User not found" }); // not found

    if (foundUser._id.toString() !== req.id) return res.status(401).json({ message: "Unauthorized" }); // unauthorized

    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" }); // invalid credentials

    if (newPassword !== confirmPassword) return res.status(400).json({ message: "Password does not match" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    try {
        foundUser.password = hashedPassword;
        await foundUser.save();

        res.status(200).json({ user: foundUser });
    } catch (error) {
        res.sendStatus(500); //internal server error
    }
};

export const followUnfollowUser = async (req, res) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).json({ message: "Invalid userId" }); // bad request

    const foundUser = await User.findById(userId);
    if (!foundUser) return res.status(404).json({ message: "User not found" }); // not found

    if (foundUser._id.toString() === req.id) return res.status(400).json({ message: "Cannot follow or unfollow user" }); // bad request

    if (foundUser.followers.find((id) => id.toString() === req.id))
        foundUser.followers = foundUser.followers.filter((id) => id.toString() !== req.id);
    else foundUser.followers.push(req.id);

    try {
        await foundUser.save();

        res.status(200).json({ user: foundUser });
    } catch (error) {
        res.sendStatus(500); //internal server error
    }
};
