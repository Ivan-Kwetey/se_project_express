const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");
const ERROR_CODES = require("./utils/errors");

const app = express();
const { PORT = 3001, NODE_ENV } = process.env;

// MongoDB connection
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    if (NODE_ENV !== "production" && NODE_ENV !== "test") {
      console.log("Connected to MongoDB");
    }
  })
  .catch((err) => {
    if (NODE_ENV !== "production" && NODE_ENV !== "test") {
      console.error("Failed to connect to MongoDB", err);
    }
  });

// Temporary authorization middleware
app.use((req, res, next) => {
  req.user = {
    _id: "6905e27e1251ff6a3eff9718", // Test user _id
  };
  next();
});

app.use(express.json());
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
    console.log(`Server is running on port ${PORT}`);
  }
});

module.exports = app;
