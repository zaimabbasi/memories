import express from "express";
import verifyJWT from "../middleware/verifyJWT.js";
import { createNewComment, editComment, deleteComment } from "../controllers/commentsController.js";

const router = express.Router();

router.route("/").post(verifyJWT, createNewComment);
router.route("/:commentId").patch(verifyJWT, editComment).delete(verifyJWT, deleteComment);

export default router;
