const express = require("express");
const router = express.Router();
const Vehicle = require("../models/Vehicle");

// Register a vehicle
router.post("/register", async (req, res) => {
    try {
        const { vehicleNumber, email } = req.body;
        if (!vehicleNumber || !email) return res.status(400).json({ message: "Missing fields" });

        const cleanNumber = vehicleNumber.replace(/\s/g, "").toUpperCase();

        const existing = await Vehicle.findOne({ vehicleNumber: cleanNumber });
        if (existing) {
            if (existing.ownerEmail === email) {
                return res.json({ message: "Vehicle already registered to you", vehicle: existing });
            } else {
                return res.status(409).json({ message: "This vehicle number is already registered with another email ID." });
            }
        }

        const newVehicle = new Vehicle({ vehicleNumber: cleanNumber, ownerEmail: email });
        await newVehicle.save();
        res.status(201).json(newVehicle);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get my vehicles
router.get("/my-vehicles", async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) return res.status(400).json({ message: "Email required" });
        const vehicles = await Vehicle.find({ ownerEmail: email });
        res.json(vehicles);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Check status (for landing page)
router.get("/status/:vehicleNumber", async (req, res) => {
    try {
        const { email } = req.query; // Current user email (optional)
        const vNum = req.params.vehicleNumber.replace(/\s/g, "").toUpperCase();

        const vehicle = await Vehicle.findOne({ vehicleNumber: vNum });
        if (!vehicle) {
            return res.json({ status: "unregistered" });
        }

        if (email && vehicle.ownerEmail === email) {
            return res.json({ status: "owned_by_self" });
        }

        return res.json({ status: "owned_by_other" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
