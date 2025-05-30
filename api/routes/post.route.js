import express from "express";
import { verifyToken } from "../utils/verifyToken.js";
import { createPost, getPosts, deletePost, updatePost } from "../controllers/post.controller.js";

const router = express.Router();

router.post("/create-post", verifyToken, createPost);
router.get("/get-posts", getPosts);
router.delete("/delete-post/:postId/:userId", verifyToken, deletePost);
router.put("/update-post/:postId/:userId", verifyToken, updatePost);

export default router;
