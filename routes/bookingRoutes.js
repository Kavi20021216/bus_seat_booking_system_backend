import express from "express";
import { createBooking, cancelBooking, getBookingInfo, getAllBookings, getBookingsByDate } from "../Controllers/bookingController.js";

const router = express.Router();
router.post("/create", createBooking);
router.get("/all", getAllBookings);            
router.get("/:bookingId", getBookingInfo);
router.delete("/cancel/:bookingId", cancelBooking);
router.get("/daily-report/:date", getBookingsByDate);

export default router;
