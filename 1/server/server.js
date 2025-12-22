const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const challanRoutes = require("./routes/challanRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// ===============================
// Middleware
// ===============================
app.use(cors());
app.use(express.json());

// ===============================
// MongoDB Connection
// ===============================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Custom MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ===============================
// API Routes
// ===============================
app.use("/api/challans", challanRoutes);
app.use("/api/vehicles", require("./routes/vehicleRoutes"));

// ===============================
// Serve React Frontend (PROD)
// ===============================

// Absolute path to CRA build folder
const buildPath = path.resolve(__dirname, "..", "build");

// Serve static assets
app.use(express.static(buildPath));

// Catch-all (must be AFTER API routes)
app.get("*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

// ===============================
// Start Server
// ===============================
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
