const User = require('../models/user');
const BadRequestError = require('../utils/errors/BadRequestError');
const NotFoundError = require('../utils/errors/NotFoundError');
const InternalServerError = require('../utils/errors/InternalServerError');

// Get all users
module.exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    next(new InternalServerError('Failed to retrieve users'));
  }
};

// Get user by ID
module.exports.getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    res.send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Invalid user ID format'));
    } else {
      next(err);
    }
  }
};

// Create new user
module.exports.createUser = async (req, res, next) => {
  try {
    const { name, avatar, email } = req.body;

    if (!name || !avatar || !email) {
      throw new BadRequestError('Name, avatar, and email are required');
    }

    const newUser = await User.create({ name, avatar, email });
    res.status(201).send(newUser);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Invalid user data'));
    } else {
      next(err);
    }
  }
};
