import Comment from "../models/comment.model.js";
import { errorHandler } from "../utils/error.js";

export const createComment = async (req, res) => {
    try {
        const { content, postId, userId } = req.body;

        if (userId !== req.user.id) {
            return next(errorHandler("You are not allowed to comment", 401));
        }

        const comment = await Comment.create({
            content,
            postId,
            userId,
        });

        res.status(201).json(comment);
    } catch (error) {
        next(error);
    }
};
