const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
    vehicleNumber: { type: String, required: true, unique: true, uppercase: true },
    ownerEmail: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Vehicle", vehicleSchema);
