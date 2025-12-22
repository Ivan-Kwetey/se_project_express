const ClothingItem = require("../models/clothingItem");
const BadRequestError = require("../utils/errors/BadRequestError");
const NotFoundError = require("../utils/errors/NotFoundError");
const ForbiddenError = require("../utils/errors/ForbiddenError");

// CREATE ITEM
const createItem = async (req, res, next) => {
  try {
    const { name, weather, imageUrl } = req.body;
    const owner = req.user._id;

    const item = await ClothingItem.create({ name, weather, imageUrl, owner });
    return res.status(201).send({ data: item });
  } catch (err) {
    if (err.name === "ValidationError") {
      return next(new BadRequestError("Invalid clothing item data"));
    }
    return next(err);
  }
};

// GET ALL ITEMS
const getItems = async (req, res, next) => {
  try {
    const items = await ClothingItem.find({});
    return res.send({ data: items });
  } catch (err) {
    return next(err);
  }
};

// GET ITEM BY ID
const getItemById = async (req, res, next) => {
  try {
    const item = await ClothingItem.findById(req.params.itemId);

    if (!item) {
      return next(new NotFoundError("Item not found"));
    }

    return res.send({ data: item });
  } catch (err) {
    if (err.name === "CastError") {
      return next(new BadRequestError("Invalid item ID"));
    }
    return next(err);
  }
};

// DELETE ITEM (OWNER ONLY)
const deleteItem = async (req, res, next) => {
  try {
    const item = await ClothingItem.findById(req.params.itemId);

    if (!item) {
      return next(new NotFoundError("Item not found"));
    }

    if (item.owner.toString() !== req.user._id) {
      return next(new ForbiddenError("You do not have permission to delete this item"));
    }

    await item.deleteOne();
    return res.send({ message: "Item deleted successfully" });
  } catch (err) {
    if (err.name === "CastError") {
      return next(new BadRequestError("Invalid item ID"));
    }
    return next(err);
  }
};

// LIKE ITEM
const likeItem = async (req, res, next) => {
  try {
    const item = await ClothingItem.findByIdAndUpdate(
      req.params.itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    );

    if (!item) {
      return next(new NotFoundError("Item not found"));
    }

    return res.send({ data: item });
  } catch (err) {
    if (err.name === "CastError") {
      return next(new BadRequestError("Invalid item ID"));
    }
    return next(err);
  }
};

// DISLIKE ITEM
const dislikeItem = async (req, res, next) => {
  try {
    const item = await ClothingItem.findByIdAndUpdate(
      req.params.itemId,
      { $pull: { likes: req.user._id } },
      { new: true }
    );

    if (!item) {
      return next(new NotFoundError("Item not found"));
    }

    return res.send({ data: item });
  } catch (err) {
    if (err.name === "CastError") {
      return next(new BadRequestError("Invalid item ID"));
    }
    return next(err);
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
