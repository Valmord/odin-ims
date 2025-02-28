const { body, validationResult } = require("express-validator");
const { categories } = require("./pageController");
const db = require("../db/queries");

const itemValidator = [
  body("item-name")
    .trim()
    .notEmpty()
    .withMessage("Item must have a name")
    .isLength({ min: 1, max: 255 })
    .withMessage("Item name must be between 1 and 255"),

  body("item-description")
    .trim()
    .notEmpty()
    .withMessage("Item must have a description"),

  body("item-price")
    .trim()
    .notEmpty()
    .withMessage("Item price is required")
    .isNumeric()
    .withMessage("Item must have a price!"),

  body("item-stock")
    .trim()
    .notEmpty()
    .withMessage("Item stock")
    .isNumeric()
    .withMessage("Item must have at least 0 stock!"),
];

const addNewItem = [
  itemValidator,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      return res.status(400).render("error", {
        title: "Error adding item",
        categories: categories.get(),
        errors: errors.array(),
      });
    }

    const itemName = req.body["item-name"];
    const itemDesc = req.body["item-description"];
    const itemPrice = +req.body["item-price"];
    const itemStock = +req.body["item-stock"];
    const catID = +req.body["item-category"];
    const { cat_name } = req.params;
    // const catID = categories
    //   .get()
    //   .find((cat) => cat.category_name === cat_name).id;

    console.log(req.body);

    if (!cat_name) return res.redirect("/");

    try {
      await db.addItem(catID, itemName, itemDesc, itemPrice, itemStock);
      res.redirect(`/category/${cat_name}`);
    } catch (err) {
      console.error("Error adding new item", err);
      res.redirect("/");
    }
  },
];

async function updateItem(req, res) {
  const { id } = req.params;
  const { name, desc, price, inventory, catId } = req.body;
  // console.log(req.body);
  console.log(name, desc, price, inventory, catId);

  try {
    db.updateItem(id, name, desc, price, inventory, catId);
    res.status(200).json({ message: "Sucessfully updated item" });
  } catch (err) {
    console.error("Error updating item:", err);
  }
}

async function deleteItem(req, res) {
  const { id } = req.params;

  try {
    db.deleteItem(id);
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (err) {
    console.error("Error deleting item:", err);
  }
}

module.exports = {
  addNewItem,
  updateItem,
  deleteItem,
};
