const router = require("express").Router();

const userRoutes = require("./users");
const clothingRoutes = require("./clothingItems");

router.use("/users", userRoutes);
router.use("/items", clothingRoutes);

module.exports = router;
