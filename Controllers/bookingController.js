import Bus from "../models/Bus.js";
import Booking from "../models/Booking.js";
import { isAdmin } from "./userController.js";

// export async function createBooking(req, res) {
// 	try {
// 		// optional: login check (remove if not needed)
// 		// if (req.user == null) {
// 		// 	return res.status(401).json({ message: "Please login to book a seat" });
// 		// }

// 		const { busId, seatNumber, passengerName, phone } = req.body;

// 		// find bus
// 		const bus = await Bus.findById(busId);
// 		if (!bus) {
// 			return res.status(404).json({ message: "Bus not found" });
// 		}

// 		// find seat
// 		const seat = bus.seats.find((s) => s.number === seatNumber);
// 		if (!seat) {
// 			return res.status(400).json({ message: "Seat not found" });
// 		}

// 		if (seat.status === "booked") {
// 			return res.status(400).json({ message: "Seat already booked" });
// 		}

// 		/* ---------------- Booking ID generation (like orderID) ---------------- */

// 		const latestBooking = await Booking.find()
// 			.sort({ createdAt: -1 })
// 			.limit(1);

// 		let bookingId = "BK00001";

// 		if (latestBooking.length > 0) {
// 			const lastBookingId = latestBooking[0].bookingId; // BK00012
// 			const numberPart = lastBookingId.replace("BK", ""); // 00012
// 			const newNumber = (parseInt(numberPart) + 1)
// 				.toString()
// 				.padStart(5, "0"); // 00013
// 			bookingId = "BK" + newNumber;
// 		}

// 		/* ---------------- Update seat status ---------------- */

// 		seat.status = "booked";
// 		await bus.save();

// 		/* ---------------- Create booking ---------------- */

// 		const booking = new Booking({
// 			bookingId: bookingId,
// 			busId: busId,
// 			seatNumber: seatNumber,
// 			passengerName: passengerName,
// 			phone: phone,
// 			email: req.user.email, // optional
// 		});

// 		const result = await booking.save();

// 		res.json({
// 			message: "Seat booked successfully",
// 			result: result,
// 		});
// 	} catch (error) {
// 		console.error("Error creating booking:", error);
// 		res.status(500).json({ message: "Failed to create booking" });
// 	}
// }

// export async function createBooking(req, res) {
//   try {
//     const { busId, seatNumber, passengerName, phone, email } = req.body;

//     if (!busId || !seatNumber || !passengerName || !phone) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     const bus = await Bus.findById(busId);
//     if (!bus) {
//       return res.status(404).json({ message: "Bus not found" });
//     }

//     const seat = bus.seats.find(
//       (s) => Number(s.number) === Number(seatNumber)
//     );

//     if (!seat) {
//       return res.status(400).json({ message: "Seat not found" });
//     }

//     if (seat.status === "booked") {
//       return res.status(409).json({ message: "Seat already booked" });
//     }

//     // Generate Booking ID
//     const latestBooking = await Booking.find().sort({ createdAt: -1 }).limit(1);

//     let bookingId = "BK00001";
//     if (latestBooking.length > 0) {
//       const num = parseInt(latestBooking[0].bookingId.replace("BK", ""));
//       bookingId = "BK" + String(num + 1).padStart(5, "0");
//     }

//     // Update seat
//     seat.status = "booked";
//     await bus.save();

//     const booking = await Booking.create({
//       bookingId,
//       busId,
//       seatNumber: Number(seatNumber),
//       passengerName,
//       phone,
//       email,
//     });

//     res.status(201).json({
//       message: "Seat booked successfully",
//       booking,
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Booking failed" });
//   }
// }

export async function createBooking(req, res) {
  try {
    const { busId, seats, passengerName, phone, email, totalPrice } = req.body;

    if (!busId || !seats?.length || !passengerName || !phone) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const bus = await Bus.findOne({ busId });
    if (!bus) return res.status(404).json({ message: "Bus not found" });

    // Check seats availability
    for (let seatNo of seats) {
      const seat = bus.seats.find(s => s.number === seatNo);
      if (!seat) return res.status(400).json({ message: `Seat ${seatNo} not found` });
      if (seat.status === "booked")
        return res.status(409).json({ message: `Seat ${seatNo} already booked` });
    }

    // Generate booking ID
    const latest = await Booking.findOne().sort({ createdAt: -1 });
    let bookingId = "BK00001";

    if (latest) {
      const num = parseInt(latest.bookingId.replace("BK", ""));
      bookingId = "BK" + String(num + 1).padStart(5, "0");
    }

    // Mark seats as booked
    bus.seats.forEach(seat => {
      if (seats.includes(seat.number)) {
        seat.status = "booked";
      }
    });

    await bus.save();

    // Create ONE booking
    const booking = await Booking.create({
      bookingId,
      busId,
      seats,
      passengerName,
      phone,
      email,
      totalPrice,
    });

    res.status(201).json({
      message: "Booking successful",
      booking,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Booking failed" });
  }
}


export async function getBookingInfo(req, res) {
  try {
    const booking = await Booking.findOne({
      bookingId: req.params.bookingId,
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json(booking);
  } catch (error) {
    console.error("Error fetching booking:", error);
    res.status(500).json({ message: "Failed to fetch booking" });
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



// export async function getAllBookings(req, res) {
//   try {
//     // Admin check
//     if (!isAdmin(req)) {
//       return res.status(403).json({ message: "Access denied. Admins only." });
//     }

//     // Fetch all bookings sorted by newest first
//     const bookings = await Booking.find().sort({ createdAt: -1 });

//     // Optional: attach bus info manually
//     const bookingsWithBus = await Promise.all(
//       bookings.map(async (booking) => {
//         const bus = await Bus.findOne({ busId: booking.busId }); // manual busId string
//         return {
//           ...booking._doc, // booking data
//           bus: bus || null, // attach bus info or null if not found
//         };
//       })
//     );

//     res.json(bookingsWithBus);
//   } catch (error) {
//     console.error("Error fetching bookings:", error);
//     res.status(500).json({ message: "Failed to fetch bookings" });
//   }
// }
