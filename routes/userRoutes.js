import express from "express";
import {
	createUser,
	loginUser,
	getUser,
	getAllUsers,
	deleteUser,
	updateUser,
} from "../Controllers/userController.js";

const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/me", getUser);
router.get("/all", getAllUsers); 
router.delete("/:email",deleteUser); 
router.put("/:email",updateUser)

export default router;
