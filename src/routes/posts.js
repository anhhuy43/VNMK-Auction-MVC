const express = require("express");
const router = express.Router();
const postController = require("../app/controllers/PostController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/create", [authMiddleware.isAuthenticated], postController.create);
router.post("/store", [authMiddleware.isAuthenticated], postController.store);
router.post("/comment", [authMiddleware.isAuthenticated], postController.comment);
router.get("/:id/edit", postController.edit);
router.put("/:id", postController.update);
router.delete("/:id", postController.delete);
router.get("/:slug", [authMiddleware.isAuthenticated], postController.show);
router.post("/search", postController.search)

module.exports = router;
