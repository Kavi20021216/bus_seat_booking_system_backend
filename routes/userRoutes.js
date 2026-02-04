import express from "express";
import {
	createUser,
	loginUser,
	getUser,
	getUsers,
} from "../Controllers/userController.js";

const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/me", getUser);
router.get("/all", getUsers); // admin only

export default router;
