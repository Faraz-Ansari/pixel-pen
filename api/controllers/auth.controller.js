import bcryptjs from "bcryptjs";
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
            next(errorHandler("All fields are required", 400));
        }

        const hashedPassword = bcryptjs.hashSync(password, 10);

        await User.create({ username, email, password: hashedPassword });

        res.status(201).json("Sign up successful");
    } catch (err) {
        // middleware for handling error
        next(err);
    }
};
