const ClothingItem = require("../models/clothingItem");
const BadRequestError = require("../utils/errors/BadRequestError");
const NotFoundError = require("../utils/errors/NotFoundError");
const InternalServerError = require("../utils/errors/InternalServerError");
const ERROR_CODES = require("../utils/errors");

const createItem = async (req, res) => {
  try {
    const { name, weather, imageUrl } = req.body;
    const owner = req.user._id;

    const item = await ClothingItem.create({ name, weather, imageUrl, owner });
    return res.status(201).send({ data: item });
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

const getItems = async (req, res) => {
  try {
    const items = await ClothingItem.find({});
    return res.status(200).send({ data: items });
  } catch (err) {
    return res
      .status(ERROR_CODES.INTERNAL_SERVER_ERROR)
      .send({ message: new InternalServerError().message });
  }
};

const getItemById = async (req, res) => {
  try {
    const { itemId } = req.params;
    const item = await ClothingItem.findById(itemId);
    if (!item) {
      return res
        .status(ERROR_CODES.NOT_FOUND)
        .send({ message: new NotFoundError("Item not found").message });
    }
    return res.status(200).send({ data: item });
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

const deleteItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const deleted = await ClothingItem.findByIdAndDelete(itemId);
    if (!deleted) {
      return res
        .status(ERROR_CODES.NOT_FOUND)
        .send({ message: new NotFoundError("Item not found").message });
    }
    return res.status(200).send({ message: "Item deleted successfully" });
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

const likeItem = async (req, res) => {
  try {
    const item = await ClothingItem.findByIdAndUpdate(
      req.params.itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!item) {
      return res
        .status(ERROR_CODES.NOT_FOUND)
        .send({ message: new NotFoundError("Item not found").message });
    }
    return res.status(200).send({ data: item });
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

const dislikeItem = async (req, res) => {
  try {
    const item = await ClothingItem.findByIdAndUpdate(
      req.params.itemId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!item) {
      return res
        .status(ERROR_CODES.NOT_FOUND)
        .send({ message: new NotFoundError("Item not found").message });
    }
    return res.status(200).send({ data: item });
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
