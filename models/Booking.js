import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
	{
		bookingId: {
			type: String,
			required: true,
			unique: true,
		},
		busId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Bus",
			required: true,
		},
		seatNumber: {
			type: Number,
			required: true,
		},
		passengerName: {
			type: String,
			required: true,
			trim: true,
		},
		phone: {
			type: String,
			required: true,
		},
		email: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
