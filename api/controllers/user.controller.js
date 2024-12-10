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
    if (req.user.id !== req.params.id) {
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
