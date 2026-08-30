const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Allow the frontend to communicate with the backend
app.use(cors());

// Allow JSON data
app.use(express.json());

// Simple home route
app.get("/", (req, res) => {
  res.json({
    message: "SatQuery AI Backend is running 🌍",
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "SatQuery Backend",
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`SatQuery Backend running on port ${PORT}`);
});