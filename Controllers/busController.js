import Bus from "../models/Bus.js";
import { isAdmin } from "./userController.js";

/**
 * Get all buses
 * Accessible to all users
 */
export async function getBuses(req, res) {
	try {
		const buses = await Bus.find().sort({ date: 1, time: 1 });
		return res.json(buses);
	} catch (error) {
		console.error("Error fetching buses:", error);
		return res.status(500).json({ message: "Failed to fetch buses" });
	}
}

/**
 * Add a new bus (Admin only)
 */
export async function addBus(req, res) {
	if (!isAdmin(req)) {
		return res.status(403).json({ message: "Access denied. Admins only." });
	}

	const { route, date, time, seats } = req.body;

	try {
		const bus = new Bus({
			route,
			date,
			time,
			seats
		});

		const savedBus = await bus.save();

		return res.json({
			message: "Bus schedule added successfully",
			bus: savedBus
		});
	} catch (error) {
		console.error("Error adding bus:", error);
		return res.status(500).json({ message: "Failed to add bus" });
	}
}
