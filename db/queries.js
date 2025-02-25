const pool = require("./pool");

async function getItems(id) {
  const SQL = "SELECT * FROM items WHERE category_id = $1";
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
  }
}

module.exports = {
  getItems,
};
