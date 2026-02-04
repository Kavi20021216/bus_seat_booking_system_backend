import express from "express";
import { createBooking, cancelBooking } from "../Controllers/bookingController.js";

const router = express.Router();

router.post("/create", createBooking);
router.delete("/cancel/:bookingId", cancelBooking);

export default router;
