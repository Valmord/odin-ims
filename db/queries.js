const pool = require("./pool");

const validDirections = ["asc", "desc"];

async function getItems(id, settings, validFields) {
  let SQL = "SELECT * FROM items WHERE category_id = $1 ORDER BY id";

  if (settings.sort !== undefined) {
    // Checks against SQL injection

    if (
      !validDirections.includes(settings.order.toLowerCase()) &&
      !validFields.includes(settings.sort.toLowerCase())
    ) {
      console.error("Prevent potential malicious attack");
      return;
    }

    SQL = `SELECT * FROM items WHERE category_id = $1 ORDER BY ${settings.sort} ${settings.order}`;
  }

  try {
    const data = await pool.query(SQL, [id]);
    const { fields, rows } = data;
    return {
      rows,
      fields: fields.reduce((acc, field) => {
        if (field.name !== "id" && field.name !== "category_id")
          acc.push(field.name);
        return acc;
      }, []),
    };
  } catch (err) {
    console.error(`Error querying id:${id}`, err);
    throw err;
  }
}

async function getCategories() {
  const SQL = "SELECT * FROM categories ORDER BY id;";
  try {
    const { rows } = await pool.query(SQL);
    return rows;
  } catch (err) {
    console.error(`Error getting categories`, err);
  }
}

async function addCategory(categoryName, friendlyName) {
  const SQL =
    "INSERT INTO categories (category_name, friendly_name) VALUES ($1, $2)";

  try {
    await pool.query(SQL, [categoryName, friendlyName]);
  } catch (err) {
    console.error("Error adding category:", err);
  }
}

async function updateCategory(categoryName, friendlyName, catId) {
  const SQL =
    "UPDATE categories SET category_name = $1, friendly_name = $2 WHERE id = $3";

  try {
    await pool.query(SQL, [categoryName, friendlyName, catId]);
  } catch (err) {
    console.error("Error updating category:", err);
  }
}

async function deleteCategory(catId) {
  console.log("in sql", catId);
  const SQL = "DELETE FROM categories WHERE id = $1";

  try {
    await pool.query(SQL, [catId]);
  } catch (err) {
    console.error("Error deleting category:", err);
  }
}

module.exports = {
  getItems,
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
};
