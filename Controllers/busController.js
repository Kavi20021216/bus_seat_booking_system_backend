import Bus from "../models/Bus.js";
import { isAdmin } from "./userController.js";

/* ================= CREATE BUS (ADMIN) ================= */
export async function addBus(req, res) {
	if (!isAdmin(req)) {
		return res.status(403).json({ message: "Admins only" });
	}

	try {
		const bus = new Bus(req.body);
		const savedBus = await bus.save();

		res.json({
			message: "Bus created successfully",
			bus: savedBus,
		});
	} catch (error) {
		console.error("Error creating bus:", error);
		res.status(500).json({ message: "Failed to create bus" });
	}
}

/* ================= GET ALL BUSES (NO PAGINATION) ================= */
export async function getBuses(req, res) {
	try {
		const buses = await Bus.find().sort({ createdAt: -1 });
		return res.json(buses);
	} catch (error) {
		console.error("Error fetching buses:", error);
		return res.status(500).json({
			message: "Failed to fetch buses",
		});
	}
}

/* ================= GET SINGLE BUS ================= */
export async function getBusInfo(req, res) {
	try {
		const bus = await Bus.findOne({ busId: req.params.busId });
		if (!bus) {
			return res.status(404).json({ message: "Bus not found" });
		}
		res.json(bus);
	} catch (error) {
		console.error("Error fetching bus:", error);
		res.status(500).json({ message: "Failed to fetch bus" });
	}
}

/* ================= UPDATE BUS (ADMIN) ================= */
export async function updateBus(req, res) {
	if (!isAdmin(req)) {
		return res.status(403).json({ message: "Admins only" });
	}

	try {
		const busId = req.params.busId;
		const data = req.body;
		data.busId = busId;

		await Bus.updateOne({ busId }, data);
		res.json({ message: "Bus updated successfully" });
	} catch (error) {
		console.error("Error updating bus:", error);
		res.status(500).json({ message: "Failed to update bus" });
	}
}

/* ================= DELETE BUS (ADMIN) ================= */
export async function deleteBus(req, res) {
	if (!isAdmin(req)) {
		return res.status(403).json({ message: "Admins only" });
	}

	try {
		const busId = req.params.busId;
		await Bus.deleteOne({ busId });
		res.json({ message: "Bus deleted successfully" });
	} catch (error) {
		console.error("Error deleting bus:", error);
		res.status(500).json({ message: "Failed to delete bus" });
	}
}

/* ================= SEARCH BUSES ================= */
export async function searchBuses(req, res) {
	try {
		const { from, to, date } = req.query;

		const buses = await Bus.find({
			"route.from": { $regex: `^${from}$`, $options: "i" },
			"route.to": { $regex: `^${to}$`, $options: "i" },
			date: date,
		});

		res.json(buses);
	} catch (error) {
		console.error("Error searching buses:", error);
		res.status(500).json({ message: "Failed to search buses" });
	}
}
