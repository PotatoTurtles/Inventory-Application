require('dotenv').config({});
const {Pool} = require("pg");

module.exports = new Pool({
  host: process.env.PGHOST, // or wherever the db is hosted
  user: process.env.PGUSER,
  database: process.env.PGDATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.PGPORT
});