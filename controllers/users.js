const User = require("../models/user");

const getUsers = (req, res) => User.find({})
    .then((users) => res.status(200).send({
      data: users.map((u) => ({
        _id: u._id.toString(),
        name: u.name,
        avatar: u.avatar,
      })),
    }))
    .catch(() => res.status(500).send({ message: "An error occurred on the server" }));

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  if (!name || !avatar) {
    return res.status(400).send({ message: "Invalid user data" });
  }

  return User.create({ name, avatar })
    .then((user) =>
      res.status(201).send({
        data: {
          _id: user._id.toString(),
          name: user.name,
          avatar: user.avatar,
        },
      })
    )
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: "Invalid user data" });
      }
      return res.status(500).send({ message: "An error occurred on the server" });
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;

  return User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
      return res.status(200).send({
        data: {
          _id: user._id.toString(),
          name: user.name,
          avatar: user.avatar,
        },
      });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Invalid user ID" });
      }
      return res.status(500).send({ message: "An error occurred on the server" });
    });
};

module.exports = { getUsers, createUser, getUserById };
