const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const mainRouter = require("./routes/index");
const auth = require("./middlewares/auth");
const { MONGO_URI, PORT, NODE_ENV } = require("./utils/config");
const ERROR_CODES = require("./utils/errors");
const { createUser, login } = require("./controllers/users");

const app = express();

// ---------------------------
// Middleware
// ---------------------------
app.use(cors());
app.use(express.json());
// Serve a simple favicon route without auth to avoid browser 401s on /favicon.ico
app.get("/favicon.ico", (req, res) => {
  // Serve a tiny inline SVG as the favicon
  res.setHeader("Content-Type", "image/svg+xml");
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
    <rect width="64" height="64" rx="12" ry="12" fill="#4F46E5" />
    <text x="32" y="38" font-size="28" text-anchor="middle" fill="#fff" font-family="Arial, Helvetica, sans-serif">W</text>
  </svg>`;
  res.status(200).send(svg);
});
app.use(auth);

// ---------------------------
// Public routes
// ---------------------------
app.post("/signup", createUser);
app.post("/signin", login);

// ---------------------------
// Protected routes
// ---------------------------
app.use("/", mainRouter);

// ---------------------------
// 404 handler
// ---------------------------
app.use((req, res) => {
  res
    .status(ERROR_CODES.NOT_FOUND)
    .send({ message: "Requested resource not found" });
});

// ---------------------------
// MongoDB connection
// ---------------------------
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // Exit if DB connection fails
  });

// ---------------------------
// Start server
// ---------------------------
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

module.exports = app;
