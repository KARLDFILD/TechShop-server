const Router = require("express");
const router = new Router();
const basketController = require("../controllers/basketController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, basketController.addToBasket);
router.get("/", authMiddleware, basketController.getBasket);
router.delete("/:deviceId", authMiddleware, basketController.removeFromBasket);

module.exports = router;
