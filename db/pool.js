const { Pool } = require("pg");
const process = require("node:process");
require("dotenv").config();
const { DATABASE, DB_USER, DB_PASS, DB_HOST, DB_PORT } = process.env;

module.exports = new Pool({
  host: DB_HOST,
  user: DB_USER,
  database: DATABASE,
  password: DB_PASS,
  port: DB_PORT,
});
