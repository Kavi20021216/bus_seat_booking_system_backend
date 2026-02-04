import Bus from "../models/Bus.js";
import Booking from "../models/Booking.js";

export async function createBooking(req, res) {
	try {
		// optional: login check (remove if not needed)
		if (req.user == null) {
			return res.status(401).json({ message: "Please login to book a seat" });
		}

		const { busId, seatNumber, passengerName, phone } = req.body;

		// find bus
		const bus = await Bus.findById(busId);
		if (!bus) {
			return res.status(404).json({ message: "Bus not found" });
		}

		// find seat
		const seat = bus.seats.find((s) => s.number === seatNumber);
		if (!seat) {
			return res.status(400).json({ message: "Seat not found" });
		}

		if (seat.status === "booked") {
			return res.status(400).json({ message: "Seat already booked" });
		}

		/* ---------------- Booking ID generation (like orderID) ---------------- */

		const latestBooking = await Booking.find()
			.sort({ createdAt: -1 })
			.limit(1);

		let bookingId = "BK00001";

		if (latestBooking.length > 0) {
			const lastBookingId = latestBooking[0].bookingId; // BK00012
			const numberPart = lastBookingId.replace("BK", ""); // 00012
			const newNumber = (parseInt(numberPart) + 1)
				.toString()
				.padStart(5, "0"); // 00013
			bookingId = "BK" + newNumber;
		}

		/* ---------------- Update seat status ---------------- */

		seat.status = "booked";
		await bus.save();

		/* ---------------- Create booking ---------------- */

		const booking = new Booking({
			bookingId: bookingId,
			busId: busId,
			seatNumber: seatNumber,
			passengerName: passengerName,
			phone: phone,
			email: req.user.email, // optional
		});

		const result = await booking.save();

		res.json({
			message: "Seat booked successfully",
			result: result,
		});
	} catch (error) {
		console.error("Error creating booking:", error);
		res.status(500).json({ message: "Failed to create booking" });
	}
}

export async function cancelBooking(req, res) {
	try {
		// Admin check
		if (!isAdmin(req)) {
			return res.status(403).json({
				message: "Access denied. Admins only.",
			});
		}

		const bookingId = req.params.bookingId;

		// Find booking
		const booking = await Booking.findOne({ bookingId: bookingId });
		if (!booking) {
			return res.status(404).json({ message: "Booking not found" });
		}

		// Find bus
		const bus = await Bus.findById(booking.busId);
		if (!bus) {
			return res.status(404).json({ message: "Bus not found" });
		}

		// Find seat and make it available again
		const seat = bus.seats.find(
			(s) => s.number === booking.seatNumber
		);

		if (seat) {
			seat.status = "available";
			await bus.save();
		}

		// Delete booking
		await Booking.deleteOne({ bookingId: bookingId });

		res.json({
			message: "Booking cancelled successfully",
			bookingId: bookingId,
		});
	} catch (error) {
		console.error("Error cancelling booking:", error);
		res.status(500).json({ message: "Failed to cancel booking" });
	}
}