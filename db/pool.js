const {Pool} = require("pg");

module.exports = new Pool({
    host:'localhost',
    user: process.env.DB_USERNAME,
    database: 'inventory',
    password: process.env.DB_PASSWORD,
    port:5432,
})