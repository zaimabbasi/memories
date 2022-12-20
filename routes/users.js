import express from "express";
import fileUpload from "express-fileupload";
import verifyJWT from "../middleware/verifyJWT.js";
import fileExtLimiter from "../middleware/fileExtLimiter.js";
import fileSizeLimiter from "../middleware/fileSizeLimiter.js";
import {
    getAllUsers,
    getUser,
    createNewUser,
    authUser,
    refreshToken,
    logoutUser,
    deleteUser,
    updateUser,
    changePassword,
    followUnfollowUser
} from "../controllers/usersController.js";

const router = express.Router();

router.route("/").get(getAllUsers).post(createNewUser);
router
    .route("/:userId")
    .get(getUser)
    .delete(verifyJWT, deleteUser)
    .patch(verifyJWT, fileUpload(), fileExtLimiter([".png", ".jpg", ".jpeg"]), fileSizeLimiter, updateUser);
router.route("/auth").post(authUser);
router.route("/auth/refresh").get(refreshToken);
router.route("/auth/logout").post(logoutUser);
router.route("/password/:userId").patch(verifyJWT, changePassword);
router.route("/follow/:userId").patch(verifyJWT, followUnfollowUser);

export default router;
