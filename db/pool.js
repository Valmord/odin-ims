const { Pool } = require("pg");
const process = require("node:process");
require("dotenv").config();
const { DB_URL } = process.env;

module.exports = new Pool({
  connectionString: DB_URL,
  // host: DB_HOST,
  // user: DB_USER,
  // database: DATABASE,
  // password: DB_PASS,
  // port: DB_PORT,
});
