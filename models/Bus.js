import mongoose from "mongoose";

const seatSchema = new mongoose.Schema({
	number: Number,
	status: {
		type: String,
		enum: ["available", "booked"],
		default: "available",
	},
});

const busSchema = new mongoose.Schema(
	{
		route: String,
		date: String,
		time: String,
		seats: [seatSchema],
	},
	{ timestamps: true }
);

const Bus = mongoose.model("Bus", busSchema);
export default Bus;
