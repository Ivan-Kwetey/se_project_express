const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const mainRouter = require("./routes/index");
const auth = require("./middlewares/auth");
const { MONGO_URI, PORT, NODE_ENV } = require("./utils/config");
const ERROR_CODES = require("./utils/errors");
const { createUser, login } = require("./controllers/users");

const app = express();

// MongoDB connection
mongoose
  .connect(MONGO_URI)
  .then(() => {
    if (NODE_ENV !== "production" && NODE_ENV !== "test") {
      // console.log("Connected to MongoDB");
    }
  })
  .catch(() => {
    if (NODE_ENV !== "production" && NODE_ENV !== "test") {
      // console.error("Failed to connect to MongoDB");
    }
  });

// Middleware
app.use(cors());
app.use(express.json());
app.use(auth);

// Public routes
app.post("/signup", createUser);
app.post("/signin", login);

// Protected routes
app.use("/", mainRouter);

// 404 handler
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
