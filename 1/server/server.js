const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const challanRoutes = require("./routes/challanRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Custom MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

app.use("/api/challans", challanRoutes);
app.use("/api/vehicles", require("./routes/vehicleRoutes"));

const buildPath = path.resolve(__dirname, "..", "build");
app.use(express.static(buildPath));

// ✅ EXPRESS v5 SAFE CATCH-ALL
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
