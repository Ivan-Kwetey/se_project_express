const ClothingItem = require("../models/clothingItem");
const {
  BadRequestError,
  NotFoundError,
  InternalServerError,
} = require("../utils/errors");

// CREATE
const createItem = async (req, res) => {
  try {
    const { name, weather, imageUrl } = req.body;
    const owner = req.user._id;
    const item = await ClothingItem.create({ name, weather, imageUrl, owner });
    res.status(201).send(item);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res
        .status(400)
        .send({ message: new BadRequestError("Invalid clothing item data").message });
    }
    res.status(500).send({ message: new InternalServerError().message });
  }
};

// READ ALL
const getItems = async (req, res) => {
  try {
    const items = await ClothingItem.find({});
    res.status(200).send(items);
  } catch (err) {
    res.status(500).send({ message: new InternalServerError().message });
  }
};

// READ ONE
const getItemById = async (req, res) => {
  try {
    const { itemId } = req.params;
    const item = await ClothingItem.findById(itemId);
    if (!item) {
      return res
        .status(404)
        .send({ message: new NotFoundError("Item not found").message });
    }
    res.status(200).send(item);
  } catch (err) {
    if (err.name === "CastError") {
      return res
        .status(400)
        .send({ message: new BadRequestError("Invalid item ID").message });
    }
    res.status(500).send({ message: new InternalServerError().message });
  }
};

// DELETE
const deleteItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const deleted = await ClothingItem.findByIdAndDelete(itemId);
    if (!deleted) {
      return res
        .status(404)
        .send({ message: new NotFoundError("Item not found").message });
    }
    res.status(200).send({ message: "Item deleted successfully" });
  } catch (err) {
    if (err.name === "CastError") {
      return res
        .status(400)
        .send({ message: new BadRequestError("Invalid item ID").message });
    }
    res.status(500).send({ message: new InternalServerError().message });
  }
};

// LIKE an item
const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res
          .status(404)
          .send({ message: new NotFoundError("Item not found").message });
      }
      res.status(200).send(item);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res
          .status(400)
          .send({ message: new BadRequestError("Invalid item ID").message });
      }
      res.status(500).send({ message: new InternalServerError().message });
    });
};

// DISLIKE an item
const dislikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res
          .status(404)
          .send({ message: new NotFoundError("Item not found").message });
      }
      res.status(200).send(item);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res
          .status(400)
          .send({ message: new BadRequestError("Invalid item ID").message });
      }
      res.status(500).send({ message: new InternalServerError().message });
    });
};

module.exports = {
  createItem,
  getItems,
  getItemById,
  deleteItem,
  likeItem,
  dislikeItem,
};
