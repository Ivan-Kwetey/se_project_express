const ClothingItem = require("../models/clothingItem");
const BadRequestError = require("../utils/errors/BadRequestError");
const NotFoundError = require("../utils/errors/NotFoundError");
const InternalServerError = require("../utils/errors/InternalServerError");

module.exports.getItems = async (req, res, next) => {
  try {
    const items = await ClothingItem.find({});
    res.send(items);
  } catch (err) {
    next(new InternalServerError("Failed to retrieve clothing items"));
  }
};

module.exports.createItem = async (req, res, next) => {
  try {
    const { name, weather, imageUrl } = req.body;
    const owner = req.user._id;

    if (!name || !weather || !imageUrl) {
      throw new BadRequestError("Name, weather, and imageUrl are required");
    }

    const item = await ClothingItem.create({ name, weather, imageUrl, owner });
    res.status(201).send({ data: item });
  } catch (err) {
    if (err.name === "ValidationError") {
      next(new BadRequestError("Invalid clothing item data"));
    } else {
      next(err);
    }
  }
};

module.exports.getItemById = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const item = await ClothingItem.findById(itemId);

    if (!item) {
      throw new NotFoundError("Clothing item not found");
    }

    res.send({ data: item });
  } catch (err) {
    if (err.name === "CastError") {
      next(new BadRequestError("Invalid item ID format"));
    } else {
      next(err);
    }
  }
};

module.exports.deleteItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const item = await ClothingItem.findByIdAndDelete(itemId);

    if (!item) {
      throw new NotFoundError("Clothing item not found");
    }

    res.send({ message: "Item successfully deleted" });
  } catch (err) {
    if (err.name === "CastError") {
      next(new BadRequestError("Invalid item ID format"));
    } else {
      next(err);
    }
  }
};

module.exports.likeItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const item = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    );

    if (!item) {
      throw new NotFoundError("Clothing item not found");
    }

    res.send({ data: item });
  } catch (err) {
    if (err.name === "CastError") {
      next(new BadRequestError("Invalid item ID format"));
    } else {
      next(new InternalServerError("Failed to like clothing item"));
    }
  }
};

module.exports.dislikeItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const item = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $pull: { likes: req.user._id } },
      { new: true }
    );

    if (!item) {
      throw new NotFoundError("Clothing item not found");
    }

    res.send({ data: item });
  } catch (err) {
    if (err.name === "CastError") {
      next(new BadRequestError("Invalid item ID format"));
    } else {
      next(new InternalServerError("Failed to dislike clothing item"));
    }
  }
};
