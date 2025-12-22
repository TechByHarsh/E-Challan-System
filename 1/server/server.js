const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const challanRoutes = require("./routes/challanRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Custom MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// API Routes
app.use("/api/challans", challanRoutes);
app.use("/api/vehicles", require("./routes/vehicleRoutes"));

/* ===============================
   SERVE REACT FRONTEND (PROD)
   =============================== */

// Serve static files from React build
app.use(express.static(path.join(__dirname, "../build")));

// Catch-all: return React app for any route not starting with /api
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
