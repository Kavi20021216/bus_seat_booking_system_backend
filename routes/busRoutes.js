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



router.get("/", getBuses);
router.get("/search", searchBuses);
router.get("/:busId", getBusInfo);
router.post("/add", addBus);
router.put("/:busId", updateBus);
router.delete("/:busId", deleteBus);

export default router;



