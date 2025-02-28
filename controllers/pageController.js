const db = require("../db/queries");

String.prototype.toProperCase = function () {
  return this.split(" ")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
};

const categories = {
  current: [],
  isLoading: false,
  setup: async function () {
    if (!this.isLoading && this.current.length === 0) {
      this.isLoading = true;
      this.current = await db.getCategories();
    }
    this.isLoading = false;
  },
  update: async function () {
    this.current = await db.getCategories();
  },
  get: function () {
    return this.current;
  },
};

async function loadIndex(req, res) {
  await categories.setup();

  res.render("index", { title: "Home Page", categories: categories.get() });
}

async function loadCategory(req, res) {
  await categories.setup();
  const routeName = req.params.route;

  // console.log("query parameters", req.query);

  const catInfo = categories
    .get()
    .find((category) => category.category_name === routeName);
  // console.log(catInfo);

  if (!catInfo) {
    res.redirect("/404");
    return;
  }

  try {
    const items = await db.getItems(catInfo.id, req.query, categories.get());
    if (!items) throw new Error("Bad query");
    res.render("items", {
      title: routeName.toProperCase(),
      page: routeName,
      sort: req.query,
      cat_name: req.params.route,
      items,
      categories: categories.get(),
    });
  } catch (err) {
    console.error("Something went wrong");
    res.send("Something went wrong: " + err.message);
  }
}

async function pageNotFound(req, res) {
  await categories.setup();
  res.render("404", { title: "Page Not Found", categories: categories.get() });
}

async function editCategory(req, res) {
  await categories.setup();
  res.render("editCats", {
    title: "Edit Categories",
    categories: categories.get(),
    id: "",
    modalShown: "",
    category: [],
  });
}

async function editCategoryModal(req, res) {
  await categories.setup();

  const id = +req.params.id;
  res.render("editCats", {
    title: "Edit Categories",
    id,
    categories: categories.get(),
    category: categories.get().find((category) => category.id === id),
    modalShown: "shown",
  });
}

module.exports = {
  categories,

  loadCategory,
  loadIndex,
  pageNotFound,
  editCategory,
  editCategoryModal,
};
