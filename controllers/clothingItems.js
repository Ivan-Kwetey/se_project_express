const ClothingItem = require("../models/clothingItem");
const BadRequestError = require("../utils/errors/BadRequestError");
const NotFoundError = require("../utils/errors/NotFoundError");
const InternalServerError = require("../utils/errors/InternalServerError");
const ERROR_CODES = require("../utils/errors");

// CREATE ITEM
const createItem = async (req, res) => {
  try {
    const { name, weather, imageUrl } = req.body;
    const owner = req.user._id;

    const item = await ClothingItem.create({ name, weather, imageUrl, owner });
    return res.status(ERROR_CODES.CREATED).send({ data: item });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res
        .status(ERROR_CODES.BAD_REQUEST)
        .send({ message: new BadRequestError("Invalid clothing item data").message });
    }
    return res
      .status(ERROR_CODES.INTERNAL_SERVER_ERROR)
      .send({ message: new InternalServerError().message });
  }
};

// GET ALL ITEMS
const getItems = async (req, res) => {
  try {
    const items = await ClothingItem.find({});
    return res.status(ERROR_CODES.OK).send({ data: items });
  } catch (err) {
    return res
      .status(ERROR_CODES.INTERNAL_SERVER_ERROR)
      .send({ message: new InternalServerError().message });
  }
};

// GET ITEM BY ID
const getItemById = async (req, res) => {
  try {
    const { itemId } = req.params;
    const item = await ClothingItem.findById(itemId);
    if (!item) {
      return res
        .status(ERROR_CODES.NOT_FOUND)
        .send({ message: new NotFoundError("Item not found").message });
    }
    return res.status(ERROR_CODES.OK).send({ data: item });
  } catch (err) {
    if (err.name === "CastError") {
      return res
        .status(ERROR_CODES.BAD_REQUEST)
        .send({ message: new BadRequestError("Invalid item ID").message });
    }
    return res
      .status(ERROR_CODES.INTERNAL_SERVER_ERROR)
      .send({ message: new InternalServerError().message });
  }
};

// DELETE ITEM (OWNER ONLY)
const deleteItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    const item = await ClothingItem.findById(itemId);
    if (!item) {
      return res
        .status(ERROR_CODES.NOT_FOUND)
        .send({ message: new NotFoundError("Item not found").message });
    }

    if (item.owner.toString() !== req.user._id) {
      return res
        .status(ERROR_CODES.FORBIDDEN)
        .send({ message: "You do not have permission to delete this item" });
    }

    await item.deleteOne();

    return res.status(ERROR_CODES.OK).send({ message: "Item deleted successfully" });
  } catch (err) {
    if (err.name === "CastError") {
      return res
        .status(ERROR_CODES.BAD_REQUEST)
        .send({ message: new BadRequestError("Invalid item ID").message });
    }
    return res
      .status(ERROR_CODES.INTERNAL_SERVER_ERROR)
      .send({ message: new InternalServerError().message });
  }
};

// LIKE ITEM
const likeItem = async (req, res) => {
  try {
    const item = await ClothingItem.findByIdAndUpdate(
      req.params.itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    );

    if (!item) {
      return res
        .status(ERROR_CODES.NOT_FOUND)
        .send({ message: new NotFoundError("Item not found").message });
    }

    return res.status(ERROR_CODES.OK).send({ data: item });
  } catch (err) {
    if (err.name === "CastError") {
      return res
        .status(ERROR_CODES.BAD_REQUEST)
        .send({ message: new BadRequestError("Invalid item ID").message });
    }
    return res
      .status(ERROR_CODES.INTERNAL_SERVER_ERROR)
      .send({ message: new InternalServerError().message });
  }
};

// DISLIKE ITEM
const dislikeItem = async (req, res) => {
  try {
    const item = await ClothingItem.findByIdAndUpdate(
      req.params.itemId,
      { $pull: { likes: req.user._id } },
      { new: true }
    );

    if (!item) {
      return res
        .status(ERROR_CODES.NOT_FOUND)
        .send({ message: new NotFoundError("Item not found").message });
    }

    return res.status(ERROR_CODES.OK).send({ data: item });
  } catch (err) {
    if (err.name === "CastError") {
      return res
        .status(ERROR_CODES.BAD_REQUEST)
        .send({ message: new BadRequestError("Invalid item ID").message });
    }
    return res
      .status(ERROR_CODES.INTERNAL_SERVER_ERROR)
      .send({ message: new InternalServerError().message });
  }
};

module.exports = {
  createItem,
  getItems,
  getItemById,
  deleteItem,
  likeItem,
  dislikeItem,
};
