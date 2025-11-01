const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");

const app = express();
const { PORT = 3001, NODE_ENV } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    if (NODE_ENV !== "production") {
      // Allow logs only in development
      // eslint-disable-next-line no-console
      console.log("Connected to MongoDB");
    }
  })
  .catch((err) => {
    if (NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.error("Failed to connect to MongoDB", err);
    }
  });

// Temporary authorization middleware
app.use((req, res, next) => {
  req.user = {
    _id: "6905e27e1251ff6a3eff9718", // Replace with your test user _id
  };
  next();
});

app.use(express.json());
app.use("/", mainRouter);

// 404 handler — must go after all route declarations
app.use((req, res) => {
  res.status(404).send({ message: "Requested resource not found" });
});

app.listen(PORT, () => {
  if (NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.log(`Server is running on port ${PORT}`);
  }
});

module.exports = app;
