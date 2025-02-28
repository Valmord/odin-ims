const express = require("express");
const pageController = require("../controllers/pageController");
const categoryController = require("../controllers/categoryController");
const itemController = require("../controllers/itemController");
const router = express.Router();

router.get("/", pageController.loadIndex);
router.get("/404", pageController.pageNotFound);
router.get("/category/:route", pageController.loadCategory);
router.get("/cat/edit", pageController.editCategory);
router.get("/cat/edit/:id", pageController.editCategoryModal);

router.post("/cat/create", categoryController.addCategory);
router.put("/cat/update/:id", categoryController.updateCategory);
router.delete("/cat/delete/:id", categoryController.deleteCategory);

router.post("/item/create/:cat_name", itemController.addNewItem);
router.put("/item/update/:id", itemController.updateItem);
router.delete("/item/delete/:id", itemController.deleteItem);

module.exports = router;
