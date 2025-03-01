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
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Moves items into uncategorised before deletion
    await client.query(
      "UPDATE items SET category_id = 1 WHERE category_id = $1",
      [catId]
    );

    await client.query("DELETE FROM categories WHERE id = $1", [catId]);

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error deleting category:", err);
  } finally {
    client.release();
  }
}

async function addItem(catId, itemName, desc, price, stock) {
  const SQL = `
  INSERT INTO items (category_id, name, description, price, inventory)
  VALUES ($1, $2, $3, $4, $5);
  `;

  try {
    await pool.query(SQL, [catId, itemName, desc, price, stock]);
  } catch (err) {
    console.error("Error adding item:", err);
  }
}

async function updateItem(itemId, itemName, desc, price, stock, catId) {
  const SQL = `
  UPDATE items SET name = $2, description = $3, price = $4, inventory = $5, category_id = $6
  WHERE id = $1`;

  try {
    await pool.query(SQL, [itemId, itemName, desc, price, stock, catId]);
  } catch (err) {
    throw err;
  }
}

async function deleteItem(id) {
  const SQL = `
  DELETE FROM items WHERE id = $1
  `;

  try {
    await pool.query(SQL, [id]);
    console.log(`Succesfully deleted item:${id}`);
  } catch (err) {
    console.error("Something went wrong in delete item for id:", id);
    throw err;
  }
}

module.exports = {
  getItems,
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,

  addItem,
  updateItem,
  deleteItem,
};
