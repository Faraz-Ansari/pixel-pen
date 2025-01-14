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

export const getPosts = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.order === "asc" ? 1 : -1;

        // Build the filter object
        const filter = {};
        // Add filters if they exist in the query string
        if (req.query.userId) filter.userId = req.query.userId;
        if (req.query.category) filter.category = req.query.category;
        if (req.query.slug) filter.slug = req.query.slug;
        if (req.query.postId) filter._id = req.query.postId;

        // Add search term filter if it exists
        if (req.query.searchTerm) {
            // Search for posts that contain the search term in the title or content field
            filter.$or = [
                // The $regex operator is used to search for a specified pattern in a field
                // The $options operator is used to specify the search options i.e., case-insensitive search
                { title: { $regex: req.query.searchTerm, $options: "i" } },
                { content: { $regex: req.query.searchTerm, $options: "i" } },
            ];
        }

        const posts = await Post.find(filter)
            // Sort posts by the updatedAt field in ascending or descending order
            .sort({ updatedAt: sortDirection })
            .skip(startIndex)
            .limit(limit);

        const totalPosts = await Post.countDocuments();

        const oneMonthAgo = new Date(
            new Date().getFullYear(),
            new Date().getMonth() - 1,
            new Date().getDate()
        );

        const lastMonthPosts = await Post.find({
            updatedAt: { $gte: oneMonthAgo },
        });

        res.status(200).json({ posts, totalPosts, lastMonthPosts });
    } catch (error) {
        next(error);
    }
};

export const deletePost = async (req, res, next) => {
    if (!req.user.isAdmin || req.user.id != req.params.userId) {
        return next(errorHandler("You are not allowed to delete a post", 403));
    }

    try {
        await Post.findByIdAndDelete(req.params.postId);
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        next(error);
    }
};

export const updatePost = async (req, res, next) => {
    try {
        if (!req.user.isAdmin || req.user.id != req.params.userId) {
            return next(
                errorHandler("You are not allowed to update a post", 403)
            );
        }

        const post = await Post.findByIdAndUpdate(
            req.params.postId,
            {
                $set: {
                    title: req.body.title,
                    content: req.body.content,
                    category: req.body.category,
                    image: req.body.image,
                },
            },
            { new: true }
        );
        res.status(200).json(post);
    } catch (error) {
        next(error);
    }
};
