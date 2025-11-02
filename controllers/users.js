const User = require("../models/user");
const BadRequestError = require("../utils/errors/BadRequestError");
const NotFoundError = require("../utils/errors/NotFoundError");
const InternalServerError = require("../utils/errors/InternalServerError");
const ERROR_CODES = require("../utils/errors");

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).send({ data: users });
  } catch (err) {
    return res
      .status(ERROR_CODES.INTERNAL_SERVER_ERROR)
      .send({ message: new InternalServerError().message });
  }
};

const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(ERROR_CODES.NOT_FOUND)
        .send({ message: new NotFoundError("User not found").message });
    }
    return res.status(200).send({ data: user });
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

const createUser = async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const user = await User.create({ name, avatar });
    return res.status(201).send({ data: user });
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

module.exports = {
  getUsers,
  getUserById,
  createUser,
};
