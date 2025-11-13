const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const ERROR_CODES = require("../utils/errors");

module.exports = (req, res, next) => {
  // Public routes
  if (
    (req.method === "POST" && (req.path === "/signin" || req.path === "/signup")) ||
    (req.method === "GET" && req.path === "/items")
  ) {
    return next();
  }

  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(ERROR_CODES.UNAUTHORIZED)
      .send({ message: "Authorization required" });
  }

  const token = authorization.replace("Bearer ", "");

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res
      .status(ERROR_CODES.UNAUTHORIZED)
      .send({ message: "Invalid or expired token" });
  }

  req.user = payload;
  next();
};
