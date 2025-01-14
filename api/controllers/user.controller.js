import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";

export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) {
        return next(
            errorHandler("You are not authorized to perform this action", 403)
        );
    }

    if (req.body.password) {
        req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    if (req.body.username) {
        if (req.body.username > 20 || req.body.username < 3) {
            return next(
                errorHandler(
                    "Username must be between 3 and 20 characters",
                    400
                )
            );
        }

        if (req.body.username.includes(" ")) {
            return next(errorHandler("Username must not contain spaces", 400));
        }

        if (req.body.username.match(/[^a-zA-Z0-9]+/)) {
            return next(
                errorHandler(
                    "Username must only contain letters and numbers",
                    400
                )
            );
        }
    }

    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                    profilePicture: req.body.profilePicture,
                },
            },
            // Return the updated user
            { new: true }
        );

        const { password, ...restOfUser } = user._doc;

        res.status(200).json(restOfUser);
    } catch (error) {
        return next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    // Check if the user is an admin or the user is deleting their own account
    // Admins can delete any user's account
    if (!req.user.isAdmin && req.user.id !== req.params.id) {
        return next(
            errorHandler("You are not authorized to perform this action", 403)
        );
    }

    try {
        await User.findByIdAndDelete(req.params.id);

        res.status(200).json("User has been deleted successfully");
    } catch (error) {
        next(error);
    }
};

export const signOut = (req, res, next) => {
    try {
        res.clearCookie("access_token")
            .status(200)
            .json("User signed out successfully");
    } catch (error) {
        next(error);
    }
};

export const getUsers = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(
            errorHandler("You are not authorized to see all users", 403)
        );
    }
    try {
        const startIndex = req.query.startIndex || 0;
        const limit = req.query.limit || 9;
        const sortDirection = req.query.sort === "asc" ? 1 : -1;

        const users = await User.find()
            .sort({ updatedAt: sortDirection })
            .skip(startIndex)
            .limit(limit);

        const restOfUsers = users.map((user) => {
            const { password, ...restOfUser } = user._doc;
            return restOfUser;
        });

        const totalUsers = await User.countDocuments();

        const oneMonthAgo = new Date(
            new Date().getFullYear(),
            new Date().getMonth() - 1,
            new Date().getDate()
        );

        const lastMonthUsers = await User.find({
            createdAt: { $gte: oneMonthAgo },
        });

        res.status(200).json({
            users: restOfUsers,
            totalUsers,
            lastMonthUsers,
        });
    } catch (error) {
        next(error);
    }
};
