const { Router } = require("express");
const shortyController = require("../controller/shortyController");
const { isAuthor } = require("../middleware");

const router = Router();

router.route("/").get(shortyController.getAllLinks);
router.route("/").post(shortyController.createShorty);
router.route("/new").get(shortyController.renderNewForm);
router.route("/link/:id").get(shortyController.getOneShorty);
router.route("/:shortUrl").get(shortyController.shortyRedirect);
router.route("/edit/:id").get(shortyController.renderEditForm);
router.route("/edit/:id").put(isAuthor, shortyController.updateShorty);
router.route("/deleteUrl/:id").delete(isAuthor, shortyController.deleteShorty);

module.exports = router;


