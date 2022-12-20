import mongoose from "mongoose";
import handlePostDeleteUser from "../middleware/userDelete.js";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    refreshToken: {
        type: String
    }
});

userSchema.post("deleteOne", { document: true, query: false }, handlePostDeleteUser);

export default mongoose.model("User", userSchema);
