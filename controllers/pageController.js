const db = require("../db/queries");

const CATEGORIES = new Map();
CATEGORIES.set("strategy", 1);
CATEGORIES.set("rpg", 2);
CATEGORIES.set("party", 3);
CATEGORIES.set("minis", 4);
CATEGORIES.set("dice", 5);
CATEGORIES.set("misc", 6);

String.prototype.toProperCase = function () {
  return this.split(" ")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
};

async function loadCategory(req, res) {
  const routeName = req.params.route;

  console.log(routeName);

  if (!CATEGORIES.has(routeName)) {
    res.redirect("/");
    res.send("No route");
    console.log("in this bad place");
  }

  const catID = CATEGORIES.get(routeName);
  console.log(catID);

  const items = await db.getItems(catID);
  console.log(items);

  try {
    res.render("items", { title: routeName.toProperCase(), items });
  } catch (err) {
    res.send("Something went wrong");
  }
}

module.exports = {
  loadCategory,
};
