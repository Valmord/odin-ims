const { body, validationResult } = require("express-validator");
const db = require("../db/queries");

String.prototype.toProperCase = function () {
  return this.split(" ")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
};

let categories = [];

async function loadIndex(req, res) {
  if (categories.length === 0) {
    categories = await db.getCategories();
  }
  console.log(categories);

  res.render("index", { title: "Home Page", categories });
}

async function loadCategory(req, res) {
  if (categories.length === 0) {
    categories = await db.getCategories();
  }
  const routeName = req.params.route;

  console.log("query parameters", req.query);

  const catInfo = categories.find(
    (category) => category.category_name === routeName
  );
  // console.log(catInfo);

  if (!catInfo) {
    res.redirect("/404");
    return;
  }

  try {
    const items = await db.getItems(catInfo.id, req.query, categories);
    if (!items) throw new Error("Bad query");
    res.render("items", {
      title: routeName.toProperCase(),
      page: routeName,
      sort: req.query,
      items,
      categories,
    });
  } catch (err) {
    console.error("Something went wrong");
    res.send("Something went wrong: " + err.message);
  }
}

async function pageNotFound(req, res) {
  if (categories.length === 0) {
    categories = await db.getCategories();
  }
  res.render("404", { title: "Page Not Found", categories });
}

async function editCategory(req, res) {
  if (categories.length === 0) {
    categories = await db.getCategories();
  }
  res.render("editCats", {
    title: "Edit Categories",
    categories,
    id: "",
    modalShown: "",
    category: [],
  });
}

async function editCategoryModal(req, res) {
  if (categories.length === 0) {
    categories = await db.getCategories();
  }

  const id = req.params.id;
  res.render("editCats", {
    title: "Edit Categories",
    id,
    categories,
    category: categories[+id - 1],
    modalShown: "shown",
  });
}

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
        categories,
        errors: errors.array(),
      });
    }

    if (categories.length === 0) {
      categories = await db.getCategories();
    }

    const catName = req.body["cat-name"].toLowerCase();
    const friendlyName = req.body["cat-friendly-name"];

    if (
      categories.find((cat) => cat.category_name === catName) ||
      catName.length < 3 ||
      friendlyName.length < 3
    ) {
      res.send("Category Already Exists!");
    }

    await db.addCategory(catName, friendlyName);
    categories = await db.getCategories();
    res.redirect("/");
  },
];

const updateCategory = [
  validateNewCategory,
  async (req, res) => {
    if (categories.length === 0) {
      categories = await db.getCategories();
    }
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
      return res.status(400).render("error", {
        title: "Error updating category",
        categories,
        errors: errors.array(),
      });
    }

    const catName = req.body["cat-name"].toLowerCase();
    const friendlyName = req.body["cat-friendly-name"];
    const catId = +req.params.id;

    if (catId >= categories.length) {
      return res.status(400).render("error", {
        title: "Error updating category",
        categories,
        errors: [{ msg: "id more then allowable" }],
      });
    }

    if (
      categories.find((cat) => cat.category_name === catName) ||
      catName.length < 3 ||
      friendlyName.length < 3
    ) {
      res.send("Category Already Exists!");
    }

    await db.updateCategory(catName, friendlyName, catId);
    categories = await db.getCategories();
    res.redirect("/cat/edit");
  },
];

module.exports = {
  loadCategory,
  loadIndex,
  pageNotFound,
  addCategory,
  updateCategory,
  editCategory,
  editCategoryModal,
};
