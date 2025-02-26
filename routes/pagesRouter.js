const express = require("express");
const pageController = require("../controllers/pageController");
const router = express.Router();

router.get("/", pageController.loadIndex);
router.get("/404", pageController.pageNotFound);
router.get("/category/:route", pageController.loadCategory);
router.post("/create/category/", pageController.addCategory);

module.exports = router;
