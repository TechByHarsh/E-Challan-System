const mongoose = require("mongoose");

const challanSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    type: { type: String, required: true },
    location: { type: String, required: true },
    licensePlate: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, required: true, enum: ["Pending", "Paid"] },
});

module.exports = mongoose.model("Challan", challanSchema);
