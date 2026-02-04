import express from "express";
import { getBuses, addBus } from "../Controllers/busController.js";

const router = express.Router();

router.get("/", getBuses);
router.post("/add", addBus);

export default router;
