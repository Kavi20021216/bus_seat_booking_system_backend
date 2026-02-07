import express from "express";
import {
  addBus,
  getBuses,
  getBusInfo,
  updateBus,
  deleteBus,
  searchBuses
} from "../Controllers/busController.js";

const router = express.Router();

/* ================= PUBLIC ROUTES ================= */

// Get all buses
router.get("/", getBuses);

// Search buses (from, to, date)
router.get("/search", searchBuses);

// Get single bus by busId
router.get("/:busId", getBusInfo);


/* ================= ADMIN ROUTES ================= */

// Create bus
router.post("/add", addBus);

// Update bus
router.put("/:busId", updateBus);

// Delete bus
router.delete("/:busId", deleteBus);

export default router;
