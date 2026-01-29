const { get } = require('node:http');
const pool = require('./pool');

const getCategory = async function (){
    const {rows} = await pool.query("SELECT DISTINCT * FROM stock");
    return rows;
}

module.exports = {
    getCategory
}