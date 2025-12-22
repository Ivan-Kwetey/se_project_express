const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const UnauthorizedError = require("../utils/errors/UnauthorizedError");

module.exports = (req, res, next) => {
  // Allow preflight requests
  if (req.method === "OPTIONS") {
    return next();
  }

  // Public routes
  if (
    (req.method === "POST" && (req.path === "/signin" || req.path === "/signup")) ||
    (req.method === "GET" && req.path === "/items")
  ) {
    return next();
  }

  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new UnauthorizedError("Authorization required"));
  }

  const token = authorization.replace("Bearer ", "");

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    return next();
  } catch (err) {
    return next(new UnauthorizedError("Invalid or expired token"));
  }
};
