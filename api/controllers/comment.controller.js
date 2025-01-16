import Comment from "../models/comment.model.js";
import { errorHandler } from "../utils/error.js";

export const createComment = async (req, res, next) => {
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

export const getPostComments = async (req, res, next) => {
    try {
        const comments = await Comment.find({ postId: req.params.postId }).sort(
            { createdAt: -1 }
        );

        res.status(200).json(comments);
    } catch (error) {
        next(error);
    }
};

export const likeComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return next(errorHandler("Comment not found", 404));
        }

        const likeIndex = comment.likes.indexOf(req.user.id);

        if (likeIndex === -1) {
            comment.likes.push(req.user.id);
            comment.numberOfLikes += 1;
        } else {
            comment.likes.splice(likeIndex, 1);
            comment.numberOfLikes =
                comment.numberOfLikes <= 0 ? 0 : comment.numberOfLikes - 1;
        }

        await comment.save();
        res.status(200).json(comment);
    } catch (error) {
        next(error);
    }
};

export const updateComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return next(errorHandler("Comment not found", 404));
        }

        if (req.user.id !== comment.userId && !req.user.isAdmin) {
            return next(
                errorHandler("You are not allowed to update this comment", 401)
            );
        }

        const updatedComment = await Comment.findByIdAndUpdate(
            req.params.commentId,
            { content: req.body.content },
            { new: true }
        );

        res.status(200).json(updatedComment);
    } catch (error) {
        next(error);
    }
};

export const deleteComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return next(errorHandler("Comment not found", 404));
        }

        if (req.user.id !== comment.userId && !req.user.isAdmin) {
            return next(
                errorHandler("You are not allowed to delete this comment", 401)
            );
        }

        await Comment.findByIdAndDelete(req.params.commentId);
        res.status(200).json("Comment deleted successfully");
    } catch (error) {
        next(error);
    }
};

export const getAllComments = async (req, res, next) => {
    try {
        if (!req.user.isAdmin) {
            return next(
                errorHandler("You are not allowed to view all comments", 401)
            );
        }

        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.sort === "desc" ? -1 : 1;

        const comments = await Comment.find()
            .sort({ createdAt: sortDirection })
            .skip(startIndex)
            .limit(limit);

        const totalComments = await Comment.countDocuments();

        const oneMonthAgo = new Date(
            new Date().getFullYear(),
            new Date().getMonth() - 1,
            new Date().getDate()
        );

        const lastMonthComments = await Comment.countDocuments({
            createdAt: { $gte: oneMonthAgo },
        });

        res.status(200).json({ comments, totalComments, lastMonthComments });
    } catch (error) {
        next(error);
    }
};
