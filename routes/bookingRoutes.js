import express from "express";
import { createBooking, cancelBooking, getBookingInfo } from "../Controllers/bookingController.js";

const router = express.Router();

router.post("/create", createBooking);
router.delete("/cancel/:bookingId", cancelBooking);
router.get("/:bookingId", getBookingInfo);

export default router;
