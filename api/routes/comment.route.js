import express from "express";
import {
    createComment,
    getPostComments,
    likeComment,
    updateComment,
    deleteComment,
    getAllComments,
} from "../controllers/comment.controller.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/get-all-comments", verifyToken, getAllComments);
router.get("/get-post-comments/:postId", verifyToken, getPostComments);

router.post("/create", verifyToken, createComment);

router.put("/like-comment/:commentId", verifyToken, likeComment);
router.put("/update-comment/:commentId", verifyToken, updateComment);

router.delete("/delete-comment/:commentId", verifyToken, deleteComment);

export default router;
