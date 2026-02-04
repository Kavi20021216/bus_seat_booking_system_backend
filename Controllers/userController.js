import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/* ================= REGISTER ================= */
export async function createUser(req, res) {
	try {
		const hashedPassword = bcrypt.hashSync(req.body.password, 10);

		const user = new User({
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email,
			phone: req.body.phone,
			password: hashedPassword,
		});

		await user.save();
		res.json({ message: "User registered successfully" });
	} catch (error) {
		res.status(500).json({ message: "Failed to create user" });
	}
}

/* ================= LOGIN ================= */
export async function loginUser(req, res) {
	const { email, password } = req.body;

	const user = await User.findOne({ email });
	if (!user) {
		return res.status(404).json({ message: "User not found" });
	}

	const isCorrect = bcrypt.compareSync(password, user.password);
	if (!isCorrect) {
		return res.status(403).json({ message: "Incorrect password" });
	}

	const token = jwt.sign(
		{
			email: user.email,
			firstName: user.firstName,
			lastName: user.lastName,
			role: user.role,
			isBlocked: user.isBlocked,
			isEmailVerified: user.isEmailVerified,
			image: user.image,
		},
		process.env.JWT_SECRET
	);

	res.json({
		message: "Login successful",
		token: token,
		role: user.role,
	});
}

/* ================= GET LOGGED USER ================= */
export function getUser(req, res) {
	if (!req.user) {
		return res.status(401).json({ message: "Not logged in" });
	}
	res.json(req.user);
}

/* ================= ADMIN CHECK ================= */
export function isAdmin(req) {
	return req.user && req.user.role === "admin";
}

/* ================= GET USERS (ADMIN) ================= */
export async function getUsers(req, res) {
	if (!isAdmin(req)) {
		return res.status(403).json({ message: "Admins only" });
	}

	const users = await User.find();
	res.json(users);
}
