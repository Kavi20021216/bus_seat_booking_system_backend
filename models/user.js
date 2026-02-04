import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: true,
		},
		lastName: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		phone: {
			type: String,
			default: "NOT GIVEN",
		},
		role: {
			type: String,
			enum: ["user", "admin"],
			default: "user",
		},
		isBlocked: {
			type: Boolean,
			default: false,
		},
		isEmailVerified: {
			type: Boolean,
			default: false
		},
		image: {
			type: String,
			default: "https://png.pngtree.com/png-clipart/20191120/original/pngtree-outline-user-icon-png-image_5045523.jpg"
		}
	},
	{ timestamps: true }
);

const User = mongoose.model("users", userSchema);
export default User;
