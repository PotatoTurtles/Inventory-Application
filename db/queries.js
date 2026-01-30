const { get } = require('node:http');
const pool = require('./pool');

const getCategory = async function (){
    const {rows} = await pool.query("SELECT DISTINCT * FROM stock");
    return rows;
}
function conform(val){
    val = val.trim();
    if(val.length<=0){
        return ""
    }
    else if(Number(val)){
        return Number(val);
    }
    return val
}
const getByItems = async function (categ, name, price, id) {
  let query = 'SELECT stock.id, stock.item_name, stock.category, quantity.price, quantity.total, quantity.sold FROM stock LEFT JOIN quantity ON stock.id = quantity.stock_id';
  let userInp = [categ, name, price, id];
  let sanzInp = [];

  for (let i = 1; i <= userInp.length; i++) {
    const val = conform(userInp[i - 1]);

    if (val !== '') {
      if (!query.includes('WHERE')) {
        query += ' WHERE';
      } else {
        query += ' AND';
      }

      if (i === 1) {
        query += ` category ILIKE $${sanzInp.length + 1}`;
        sanzInp.push(`%${val}%`);
      } else if (i === 2) {
        query += ` item_name ILIKE $${sanzInp.length + 1}`;
        sanzInp.push(`%${val}%`);
      } else if (i === 3) {
        query += ` price = $${sanzInp.length + 1}`;
        sanzInp.push(Number(val));
      } else if (i === 4) {
        query += ` stock.id = $${sanzInp.length + 1}`;
        sanzInp.push(Number(val));
      }
    }
  }

  const { rows } = await pool.query(query, sanzInp);
  return rows;
}

module.exports = {
    getCategory,
    getByItems
}