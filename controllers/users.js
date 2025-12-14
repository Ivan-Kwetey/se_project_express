const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const BadRequestError = require("../utils/errors/BadRequestError");
const NotFoundError = require("../utils/errors/NotFoundError");
const InternalServerError = require("../utils/errors/InternalServerError");
const ERROR_CODES = require("../utils/errors");

const { JWT_SECRET } = require("../utils/config");

// GET CURRENT USER
const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(ERROR_CODES.NOT_FOUND)
        .send({ message: new NotFoundError("User not found").message });
    }

    return res.status(ERROR_CODES.OK).send({ data: user });
  } catch (err) {
    if (err.name === "CastError") {
      return res
        .status(ERROR_CODES.BAD_REQUEST)
        .send({ message: new BadRequestError("Invalid user ID").message });
    }

    return res
      .status(ERROR_CODES.INTERNAL_SERVER_ERROR)
      .send({ message: new InternalServerError().message });
  }
};

// UPDATE CURRENT USER
const updateCurrentUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, avatar } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, avatar },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res
        .status(ERROR_CODES.NOT_FOUND)
        .send({ message: new NotFoundError("User not found").message });
    }

    return res.status(ERROR_CODES.OK).send({ data: updatedUser });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res
        .status(ERROR_CODES.BAD_REQUEST)
        .send({ message: new BadRequestError("Invalid user data").message });
    }

    return res
      .status(ERROR_CODES.INTERNAL_SERVER_ERROR)
      .send({ message: new InternalServerError().message });
  }
};

// CREATE USER (SIGNUP)
const createUser = async (req, res) => {
  try {
    const { name, about, avatar, email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res
        .status(ERROR_CODES.BAD_REQUEST)
        .send({ message: "Email and password are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      about,
      avatar,
      email,
      password: hashedPassword,
    });

    const userSafe = user.toObject();
    delete userSafe.password;

    return res.status(ERROR_CODES.CREATED).send({ data: userSafe });
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(ERROR_CODES.CONFLICT)
        .send({ message: "User with this email already exists" });
    }

    if (err.name === "ValidationError") {
      return res
        .status(ERROR_CODES.BAD_REQUEST)
        .send({ message: new BadRequestError("Invalid user data").message });
    }

    return res
      .status(ERROR_CODES.INTERNAL_SERVER_ERROR)
      .send({ message: new InternalServerError().message });
  }
};

// LOGIN (SIGNIN)
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(ERROR_CODES.BAD_REQUEST)
      .send({ message: "Email and password are required" });
  }

  try {
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    return res.send({ token });
  } catch (err) {
    if (err.message === "Incorrect email or password") {
      return res
        .status(ERROR_CODES.UNAUTHORIZED)
        .send({ message: "Invalid email or password" });
    }
    return res
      .status(ERROR_CODES.INTERNAL_SERVER_ERROR)
      .send({ message: new InternalServerError().message });
  }
};

module.exports = {
  getCurrentUser,
  updateCurrentUser,
  createUser,
  login,
};
