import { errorHandler } from "../utils/error.js";
import Post from "../models/post.model.js";

export const createPost = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(errorHandler("You are not allowed to create a post", 403));
    }

    if (!req.body.title || !req.body.content) {
        return next(errorHandler("Title and content are required", 400));
    }

    // Create a SEO-friendly slug from the title
    const slug = req.body.title
        .split(" ")
        .join("-")
        .toLowerCase()
        // replaces all special characters with a dash
        .replace(/[^a-zA-Z0-9-]/g, "-")
        // replaces multiple consecutive dashes with a single dash
        .replace(/-+/g, "-");

    const post = new Post({ ...req.body, slug, userId: req.user.id });

    try {
        const savedPost = await post.save();
        res.status(201).json(savedPost);
    } catch (error) {
        return next(error);
    }
};
