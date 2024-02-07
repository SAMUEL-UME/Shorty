const { Router } = require("express");
const shortyController = require("../controller/shortyController");
const { isAuthor } = require("../middleware/middleware");
const catchAsync = require("../helpers/catchAsync");
const router = Router();

router
  .route("/")
  .get(catchAsync(shortyController.getAllLinks))
  .post(catchAsync(shortyController.createShorty));

  
router.route("/new").get(catchAsync(shortyController.renderNewForm));
router.route("/link/:id").get(catchAsync(shortyController.getOneShorty));
router.route("/:shortUrl").get(catchAsync(shortyController.shortyRedirect));

router
  .route("/edit/:id")
  .get(catchAsync(shortyController.renderEditForm))
  .put(isAuthor, catchAsync(shortyController.updateShorty));

router
  .route("/deleteUrl/:id")
  .delete(isAuthor, catchAsync(shortyController.deleteShorty));

module.exports = router;
