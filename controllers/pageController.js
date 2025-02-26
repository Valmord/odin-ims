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

async function addCategory(req, res) {
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

  db.addCategory(catName, friendlyName);
  res.redirect("/");
}

module.exports = {
  loadCategory,
  loadIndex,
  pageNotFound,
  addCategory,
};
