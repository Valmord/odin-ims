const { Pool } = require("pg");
const process = require("node:process");
require("dotenv").config();
const { DATABASE_URL } = process.env;

module.exports = new Pool({
  connectionString: DATABASE_URL,
  // host: DB_HOST,
  // user: DB_USER,
  // database: DATABASE,
  // password: DB_PASS,
  // port: DB_PORT,
});
