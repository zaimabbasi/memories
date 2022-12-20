import express from "express";
import fileUpload from "express-fileupload";
import verifyJWT from "../middleware/verifyJWT.js";
import fileExtLimiter from "../middleware/fileExtLimiter.js";
import filePayloadExists from "../middleware/filePayloadExists.js";
import fileSizeLimiter from "../middleware/fileSizeLimiter.js";
import {
    getAllPosts,
    createNewPost,
    getPost,
    updatePost,
    deletePost,
    likeUnlikePost
} from "../controllers/postsController.js";

const router = express.Router();

router
    .route("/")
    .get(getAllPosts)
    .post(
        verifyJWT,
        fileUpload(),
        filePayloadExists,
        fileExtLimiter([".png", ".jpg", ".jpeg"]),
        fileSizeLimiter,
        createNewPost
    );
router
    .route("/:postId")
    .get(getPost)
    .patch(verifyJWT, fileUpload(), fileExtLimiter([".png", ".jpg", ".jpeg"]), fileSizeLimiter, updatePost)
    .delete(verifyJWT, deletePost);
router.route("/like/:postId").patch(verifyJWT, likeUnlikePost);

export default router;
