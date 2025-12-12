const router = require("express").Router();
const {
  createItem,
  getItems,
  getItemById,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

const {
  validateCreateItem,
  validateItemIdParam,
} = require("../middlewares/validation");

router.get("/", getItems);
router.get("/:itemId", validateItemIdParam, getItemById);
router.post("/", validateCreateItem, createItem);
router.delete("/:itemId", validateItemIdParam, deleteItem);
router.put("/:itemId/likes", validateItemIdParam, likeItem);
router.delete("/:itemId/likes", validateItemIdParam, dislikeItem);

module.exports = router;
