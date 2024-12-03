import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const signUp = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        if (
            !username ||
            !email ||
            !password ||
            username === "" ||
            email === "" ||
            password === ""
        ) {
            // creating a custom error using errorHandler function then handling it using middleware
            return next(errorHandler("All fields are required", 400));
        }

        const hashedPassword = bcryptjs.hashSync(password, 10);

        await User.create({ username, email, password: hashedPassword });

        res.status(201).json("Sign up successful");
    } catch (err) {
        // middleware for handling error
        next(err);
    }
};

export const signIn = async (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password || username === "" || password === "") {
        next(errorHandler("All fields are required"));
    }

    try {
        const validUser = await User.findOne({ username });

        if (!validUser) {
            return next(errorHandler("User not found", 404));
        }

        const validPassword = bcryptjs.compareSync(
            password,
            validUser.password
        );

        if (!validPassword) {
            return next(errorHandler("Invalid password", 400));
        }

        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        const { password: userPassword, ...user } = validUser._doc;

        res.cookie("access_token", token, { httpOnly: true })
            .status(200)
            .json(user);
    } catch (err) {
        next(err);
    }
};
