const Router = require("express");
const router = new Router();
const brandController = require("../controllers/brandController");
const checkRole = require("../middleware/checkRoleMiddleware");

router.post("/", checkRole("ADMIN"), brandController.create);
router.get("/", brandController.getAll);
router.delete("/:name", checkRole("ADMIN"), brandController.delete);
router.put("/:name", checkRole("ADMIN"), brandController.updateBrandByName);

module.exports = router;
