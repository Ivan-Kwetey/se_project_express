const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const BadRequestError = require("../utils/errors/BadRequestError");
const NotFoundError = require("../utils/errors/NotFoundError");
const ConflictError = require("../utils/errors/ConflictError");
const UnauthorizedError = require("../utils/errors/UnauthorizedError");

const { JWT_SECRET } = require("../utils/config");

// GET CURRENT USER
const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return next(new NotFoundError("User not found"));
    }

    res.send({ data: user });
  } catch (err) {
    if (err.name === "CastError") {
      return next(new BadRequestError("Invalid user ID"));
    }
    return next(err);
  }
};

// UPDATE CURRENT USER
const updateCurrentUser = async (req, res, next) => {
  try {
    const { name, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, avatar },
      { new: true, runValidators: true }
    );

    if (!user) {
      return next(new NotFoundError("User not found"));
    }

    res.send({ data: user });
  } catch (err) {
    if (err.name === "ValidationError") {
      return next(new BadRequestError("Invalid user data"));
    }
    return next(err);
  }
};

// CREATE USER (SIGNUP)
const createUser = async (req, res, next) => {
  try {
    const { name, about, avatar, email, password } = req.body;

    if (!email || !password) {
      throw new BadRequestError("Email and password are required");
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    });

    const userSafe = user.toObject();
    delete userSafe.password;

    res.status(201).send({ data: userSafe });
  } catch (err) {
    if (err.code === 11000) {
      return next(new ConflictError("User with this email already exists"));
    }
    if (err.name === "ValidationError") {
      return next(new BadRequestError("Invalid user data"));
    }
    return next(err);
  }
};

// LOGIN (SIGNIN)
const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("Email and password are required"));
  }

  try {
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.send({ token });
  } catch (err) {
    if (err.message === "Incorrect email or password") {
      return next(new UnauthorizedError("Invalid email or password"));
    }
    return next(err);
  }
};

module.exports = {
  getCurrentUser,
  updateCurrentUser,
  createUser,
  login,
};
