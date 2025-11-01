const User = require("../models/user");

// GET all users
const getUsers = (req, res) => {
  User.find({})
    .then((users) =>
      res.status(200).send(
        users.map((u) => ({
          _id: u._id.toString(),
          name: u.name,
          avatar: u.avatar,
        }))
      )
    )
    .catch(() =>
      res.status(500).send({ message: "An error occurred on the server" })
    );
};

// CREATE new user
const createUser = (req, res) => {
  const { name, avatar } = req.body;

  // Manual field presence check to catch missing keys
  if (!name || !avatar) {
    return res.status(400).send({ message: "Invalid user data" });
  }

  User.create({ name, avatar })
    .then((user) =>
      res.status(201).send({
        _id: user._id.toString(),
        name: user.name,
        avatar: user.avatar,
      })
    )
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: "Invalid user data" });
      }
      res.status(500).send({ message: "An error occurred on the server" });
    });
};

// GET user by ID
const getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
      res.status(200).send({
        _id: user._id.toString(),
        name: user.name,
        avatar: user.avatar,
      });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Invalid user ID" });
      }
      res.status(500).send({ message: "An error occurred on the server" });
    });
};

module.exports = { getUsers, createUser, getUserById };