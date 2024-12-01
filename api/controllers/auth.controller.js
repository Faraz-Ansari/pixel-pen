import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";

export const signUp = async (req, res) => {
    const { username, email, password } = req.body;

    if (
        !username ||
        !email ||
        !password ||
        username === "" ||
        email === "" ||
        password === ""
    ) {
        return res.status(400).json({ message: "Please fill in all fields" });
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);

    try {
        await User.create({ username, email, password: hashedPassword });

        res.status(201).json("Sign up successful");
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
