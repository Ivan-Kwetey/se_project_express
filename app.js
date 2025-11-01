const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");
const { NOT_FOUND } = require("./utils/errors");

const app = express();
const { PORT = 3001, NODE_ENV } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    if (NODE_ENV !== "production") {
      console.log("Connected to MongoDB"); // safe logging in dev
    }
  })
  .catch((err) => {
    if (NODE_ENV !== "production") {
      console.error("Failed to connect to MongoDB", err);
    }
  });

// Temporary authorization middleware
app.use((req, res, next) => {
  req.user = { _id: "6905e27e1251ff6a3eff9718" }; 
  next();
});

app.use(express.json());
app.use("/", mainRouter);

// 404 handler — must go after all routes
app.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});

app.listen(PORT, () => {
  if (NODE_ENV !== "production") {
    console.log(`Server is running on port ${PORT}`);
  }
});

module.exports = app;
