import express from "express";
import { createBooking, cancelBooking, getBookingInfo, getAllBookings } from "../Controllers/bookingController.js";

const router = express.Router();
router.post("/create", createBooking);
router.get("/all", getAllBookings);            
router.get("/:bookingId", getBookingInfo);
router.delete("/cancel/:bookingId", cancelBooking);

export default router;
