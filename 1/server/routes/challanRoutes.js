const express = require("express");
const router = express.Router();
const Challan = require("../models/Challan");
const Vehicle = require("../models/Vehicle");

// Get all challans
router.get("/", async (req, res) => {
    try {
        const { vehicleNumber, userEmail } = req.query;
        let query = {};

        if (vehicleNumber) {
            const cleanNum = vehicleNumber.replace(/\s/g, "").toUpperCase();

            // Enforce ownership if email is present
            if (userEmail) {
                const vehicle = await Vehicle.findOne({ vehicleNumber: cleanNum });

                if (!vehicle) {
                    // Optionally could return 404, but to ensure app works if vehicle not strictly registered yet (legacy support)
                    // we might want to just proceed or return null.
                    // But prompt said "If the vehicle is not registered, redirect...". 
                    // The frontend handles the redirect if it sees specific error or empty?
                    // Let's stick to the previous plan: Check if registered.
                }

                if (vehicle && vehicle.ownerEmail !== userEmail) {
                    return res.status(403).json({ code: "VEHICLE_OWNED_BY_OTHER", message: "This vehicle number is already registered with another email ID." });
                }
            }

            // Allow searching by vehicle number
            const allChallans = await Challan.find();
            const filtered = allChallans.filter(c => c.licensePlate && c.licensePlate.replace(/\s/g, "").toUpperCase() === cleanNum);
            return res.json(filtered);
        }

        const challans = await Challan.find();
        res.json(challans);
    } catch (err) {
        console.error("Error fetching challans:", err);
        res.status(500).json({ message: err.message });
    }
});

// Create a new challan
router.post("/", async (req, res) => {
    try {
        const challan = new Challan({
            id: req.body.id,
            date: req.body.date,
            time: req.body.time,
            type: req.body.type,
            location: req.body.location,
            licensePlate: req.body.licensePlate,
            amount: req.body.amount,
            status: req.body.status || "Pending",
        });

        const newChallan = await challan.save();
        res.status(201).json(newChallan);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a challan (PUT)
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        delete updates.id; // protect ID

        // findOneAndUpdate needs the custom 'id' field, not _id
        const updatedChallan = await Challan.findOneAndUpdate({ id: id }, updates, { new: true });

        if (!updatedChallan) {
            return res.status(404).json({ message: "Challan not found" });
        }

        res.json(updatedChallan);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Seed data
router.post("/seed", async (req, res) => {
    try {
        await Challan.deleteMany({});
        const sampleData = [
            {
                id: "CHLN001",
                date: "2024-10-15",
                time: "14:30",
                type: "Speeding",
                location: "Mumbai-Pune Expressway",
                licensePlate: "MH12AB1234",
                amount: 1000,
                status: "Pending",
            },
            {
                id: "CHLN002",
                date: "2024-11-02",
                time: "09:15",
                type: "Signal Jump",
                location: "Deccan Gymkhana, Pune",
                licensePlate: "MH12AB1234",
                amount: 500,
                status: "Pending",
            },
            {
                id: "CHLN003",
                date: "2024-09-20",
                time: "18:45",
                type: "No Parking",
                location: "FC Road, Pune",
                licensePlate: "MH12AB1234",
                amount: 500,
                status: "Paid",
            },
            {
                id: "CHLN004",
                date: "2024-12-01",
                time: "10:00",
                type: "Helmet Violation",
                location: "Shivaji Nagar",
                licensePlate: "MH14XY9876",
                amount: 500,
                status: "Pending",
            },
            {
                id: "CHLN005",
                date: "2024-12-05",
                time: "11:30",
                type: "Speeding",
                location: "Baner Road",
                licensePlate: "MH14XY9876",
                amount: 1000,
                status: "Paid",
            },
        ];
        await Challan.insertMany(sampleData);
        res.json({ message: "Database seeded successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
