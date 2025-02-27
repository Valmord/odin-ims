const express = require("express");
const pageController = require("../controllers/pageController");
const router = express.Router();

router.get("/", pageController.loadIndex);
router.get("/404", pageController.pageNotFound);
router.get("/category/:route", pageController.loadCategory);
router.get("/cat/edit", pageController.editCategory);
router.get("/cat/edit/:id", pageController.editCategoryModal);
router.post("/cat/create", pageController.addCategory);
router.post("/cat/update/:id", pageController.updateCategory);
router.delete("/cat/delete/:id");

module.exports = router;
