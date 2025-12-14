const router = require("express").Router();

const {
  createUser,
  login,
  getCurrentUser,
  updateCurrentUser,
} = require("../controllers/users");

const {
  validateSignup,
  validateSignin,
  validateUpdateUser,
} = require("../middlewares/validation");

// Public routes
router.post("/signup", validateSignup, createUser);
router.post("/signin", validateSignin, login);

// Protected routes
router.get("/me",getCurrentUser);
router.patch("/me",validateUpdateUser, updateCurrentUser);

module.exports = router;
