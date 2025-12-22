const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const challanRoutes = require("./routes/challanRoutes");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
    .connect("mongodb+srv://harsh:<Harsh@6644>@cluster0.arafzy1.mongodb.net/?appName=Cluster0")
    .then(() => console.log("✅ Custom MongoDB Connected"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Routes
app.use("/api/challans", challanRoutes);
app.use("/api/vehicles", require("./routes/vehicleRoutes"));

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
