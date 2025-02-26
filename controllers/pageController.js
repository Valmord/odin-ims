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

  const catInfo = categories.find(
    (category) => category.category_name === routeName
  );
  console.log(catInfo);

  if (!catInfo) {
    res.redirect("/404");
    return;
  }

  // const catID = CATEGORIES.get(routeName);
  // console.log("catid", catID);

  const items = await db.getItems(catInfo.id);
  // console.log(items);

  try {
    res.render("items", {
      title: routeName.toProperCase(),
      items,
      categories,
    });
  } catch (err) {
    res.send("Something went wrong");
  }
}

async function pageNotFound(req, res) {
  if (categories.length === 0) {
    categories = await db.getCategories();
  }
  res.render("404", { title: "Page Not Found", categories });
}

module.exports = {
  loadCategory,
  loadIndex,
  pageNotFound,
};
