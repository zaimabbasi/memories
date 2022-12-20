import mongoose from "mongoose";
import handlePostDeleteComment from "../middleware/commentDelete.js";

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

commentSchema.post("deleteOne", { document: true, query: false }, handlePostDeleteComment);

export default mongoose.model("Comment", commentSchema);
