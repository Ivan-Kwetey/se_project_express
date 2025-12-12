require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const { errors } = require("celebrate");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const { requestLogger, errorLogger } = require("./middlewares/logger");
const { errorHandler } = require("./middlewares/errorHandler");
const { validateSignup, validateSignin } = require("./middlewares/validation");

const auth = require("./middlewares/auth");
const NotFoundError = require("./utils/errors/NotFoundError");

const { createUser, login } = require("./controllers/users");
const clothingItemRouter = require("./routes/clothingItems");
const usersRouter = require("./routes/users");

const { PORT = 3001 } = process.env;

const app = express();

// ---------------------------
// Database Connection
// ---------------------------
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// ---------------------------
// Global Middlewares
// ---------------------------
app.use(express.json());
app.use(helmet());

// CORS config for WTWR project
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://localhost:3000",
      "https://wtwr.ivanavidev.com", // your frontend domain (add if needed)
    ],
    credentials: true,
  })
);

// Rate Limiter
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

// Log all requests
app.use(requestLogger);

// ---------------------------
// Public Routes
// ---------------------------
app.post("/signin", validateSignin, login);
app.post("/signup", validateSignup, createUser);

// ---------------------------
// Authorization Middleware
// ---------------------------
app.use(auth);

// ---------------------------
// Protected Routes
// ---------------------------
app.use("/items", clothingItemRouter);
app.use("/users", usersRouter);

// ---------------------------
// 404 Route
// ---------------------------
// 404 Route
app.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

// Celebrate validation errors
app.use(errors());

// ---------------------------
// Error Logging
// ---------------------------
app.use(errorLogger);

// Centralized error handler
app.use(errorHandler);

// ---------------------------
// Start Server
// ---------------------------
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
