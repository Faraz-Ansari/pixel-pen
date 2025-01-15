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

export const getPostComments = async (req, res) => {
    try {
        const comments = await Comment.find({ postId: req.params.postId }).sort(
            { createdAt: -1 }
        );

        res.status(200).json(comments);
    } catch (error) {
        next(error);
    }
};
