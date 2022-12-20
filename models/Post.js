import mongoose from "mongoose";
import handlePostDeletePost from "../middleware/postDelete.js";

const postSchema = new mongoose.Schema({
    caption: {
        type: String
    },
    image: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    date: {
        type: Date,
        default: Date.now
    }
});

postSchema.post("deleteOne", { document: true, query: false }, handlePostDeletePost);

export default mongoose.model("Post", postSchema);
