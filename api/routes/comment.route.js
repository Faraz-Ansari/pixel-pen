import express from "express";
import {
    createComment,
    getPostComments,
} from "../controllers/comment.controller.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/create", verifyToken, createComment);
router.get("/get-post-comments/:postId", getPostComments);

export default router;
