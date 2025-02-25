const express = require("express");
const pageController = require("../controllers/pageController");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("index", { title: "Index" });
});
// router.get('/strategy', )

router.get("/:route", pageController.loadCategory);

module.exports = router;
