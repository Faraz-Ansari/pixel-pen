import express from "express";
import { verifyToken } from "../utils/verifyToken.js";
import {
    updateUser,
    deleteUser,
    signOut,
    getUsers,
} from "../controllers/user.controller.js";

const router = express.Router();

router.put("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.get("/sign-out", signOut);
router.get("/get-users", verifyToken, getUsers);

export default router;
