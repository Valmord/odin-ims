const { categories } = require("./pageController");
const { body, validationResult } = require("express-validator");
const db = require("../db/queries");

const validateNewCategory = [
  body("cat-name")
    .trim()
    .isLength({
      min: 2,
      max: 30,
    })
    .withMessage(
      "Category name must be more then 1 character and less than 51"
    ),

  body("cat-friendly-name")
    .trim()
    .isLength({
      min: 5,
      max: 50,
    })
    .withMessage(
      "Category name must be more then 4 characters and less that 51"
    ),
];

const addCategory = [
  validateNewCategory,
  async (req, res) => {
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
      return res.status(400).render("error", {
        title: "Error adding category",
        categories: categories.get(),
        errors: errors.array(),
      });
    }

    await categories.setup();

    const catName = req.body["cat-name"].toLowerCase();
    const friendlyName = req.body["cat-friendly-name"];

    if (
      categories.get().find((cat) => cat.category_name === catName) ||
      catName.length < 3 ||
      friendlyName.length < 3
    ) {
      res.send("Category Already Exists!");
    }

    await db.addCategory(catName, friendlyName);
    categories.update();
    res.redirect("/");
  },
];

const updateCategory = [
  validateNewCategory,
  async (req, res) => {
    console.log("body in updateCat", req.body);

    await categories.setup();
    const errors = validationResult(req);
    // console.log(errors);
    if (!errors.isEmpty()) {
      return res.status(400).render("error", {
        title: "Error updating category",
        categories: categories.get(),
        errors: errors.array(),
      });
    }

    const catName = req.body["cat-name"].toLowerCase();
    const friendlyName = req.body["cat-friendly-name"];
    const catId = +req.params.id;

    console.log("Values", catId, catName, friendlyName);

    if (!categories.get().find((val) => val.id === catId)) {
      return res.status(400).render("error", {
        title: "Error updating category",
        categories: categories.get(),
        errors: [{ msg: "invalid id" }],
      });
    }

    if (
      categories
        .get()
        .find(
          (cat) =>
            cat.category_name === catName && cat.friendly_name === friendlyName
        ) ||
      catName.length < 3 ||
      friendlyName.length < 3
    ) {
      return res.send("Category Already Exists!");
    }

    try {
      await db.updateCategory(catName, friendlyName, catId);
      categories.update();
      res.status(200).json({ message: "Category updated successfully" });
      // res.redirect("/");
    } catch (err) {
      console.error(err);
      res.status(500).send("Error Updating Category");
    }
  },
];

async function deleteCategory(req, res) {
  await categories.setup();
  const catId = +req.params.id;

  if (!categories.get().find((category) => category.id === catId)) {
    console.log("hopefully not in here");
    return res.status(400).render("error", {
      title: "Error updating category",
      categories: categories.get(),
      errors: [{ msg: "invalid id" }],
    });
  }

  await db.deleteCategory(catId);
  categories.update();
  res.status(200).json({ message: `Deleting category with id: ${catId}` });
}

module.exports = {
  addCategory,
  updateCategory,
  deleteCategory,
};
