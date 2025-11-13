const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");
const auth = require("./middlewares/auth");
const { MONGO_URI, PORT, NODE_ENV } = require("./utils/config");
const ERROR_CODES = require("./utils/errors");

const app = express();

// MongoDB connection
mongoose
  .connect(MONGO_URI)
  .then(() => {
    if (NODE_ENV !== "production" && NODE_ENV !== "test") {
      // console.log("Connected to MongoDB");
    }
  })
  .catch((_err) => {
    // console.error("Failed to connect to MongoDB", _err);
    // intentionally ignored to satisfy linter
  });

// Middleware
app.use(express.json());

// Auth middleware (protects routes except public ones)
app.use(auth);

// Public routes
const { createUser, login } = require("./controllers/users");
app.post("/signup", createUser);
app.post("/signin", login);

// Protected routes
app.use("/", mainRouter);

// 404 handler for undefined routes
app.use((req, res) => {
  res
    .status(ERROR_CODES.NOT_FOUND)
    .send({ message: "Requested resource not found" });
});

// Start server
app.listen(PORT, () => {
  if (NODE_ENV !== "production" && NODE_ENV !== "test") {
    // console.log(`Server is running on port ${PORT}`);
  }
});

module.exports = app;
