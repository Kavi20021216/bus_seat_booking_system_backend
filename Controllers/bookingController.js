import Bus from "../models/Bus.js";
import Booking from "../models/Booking.js";
import { isAdmin } from "./userController.js";

// ---------------- CREATE BOOKING ----------------
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
      const seat = bus.seats.find((s) => s.number === seatNo);
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
    bus.seats.forEach((seat) => {
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

// ---------------- GET SINGLE BOOKING ----------------
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

// ---------------- GET ALL BOOKINGS (ADMIN) ----------------
export async function getAllBookings(req, res) {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
}



export async function cancelBooking(req, res) {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const bookingId = req.params.bookingId;

    // Find booking
    const booking = await Booking.findOne({ bookingId });
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // ✅ FIX HERE
    const bus = await Bus.findOne({ busId: booking.busId });
    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    // Free seats
    bus.seats.forEach((seat) => {
      if (booking.seats.includes(seat.number)) {
        seat.status = "available";
      }
    });

    await bus.save();

    // Delete booking
    await Booking.deleteOne({ bookingId });

    res.json({ message: "Booking cancelled successfully", bookingId });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res.status(500).json({ message: "Failed to cancel booking" });
  }
}

export async function getBookingsByDate(req, res) {
  try {
    const dateParam = req.params.date; // e.g., "2026-02-09"
    
    // Start and end of the day
    const start = new Date(dateParam);
    start.setHours(0, 0, 0, 0);
    const end = new Date(dateParam);
    end.setHours(23, 59, 59, 999);

    const bookings = await Booking.find({
      createdAt: { $gte: start, $lte: end } // MongoDB date filter
    });

    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get daily report" });
  }
}