const { get } = require('node:http');
const pool = require('./pool');
const { type } = require('node:os');

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
const addItem = async function (body) {
    await pool.query("INSERT INTO stock (item_name,category) VALUES ($1,$2);",[body.name,body.categ==='custom'?body.newCat:body.categ]);
    await pool.query(
        `
        INSERT INTO quantity (stock_id, price, total, sold)
        SELECT s.id, $3, $4, $5
        FROM stock s
        WHERE s.item_name = $1
            AND s.category = $2
            AND NOT EXISTS (
            SELECT 1
            FROM quantity q
            WHERE q.stock_id = s.id
            )
        `,
        [
            body.name,
            body.categ === 'custom' ? body.newCat : body.categ,
            body.price,
            body.total||null,
            body.sold||null
        ]
    );
}

const getItems = async function (categ, name, price, id, total, sold) {
  let query = 'SELECT stock.id, stock.item_name, stock.category, quantity.price, quantity.total, quantity.sold FROM stock LEFT JOIN quantity ON stock.id = quantity.stock_id';
  let userInp = [categ, name, price, id, total, sold];
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
      } else if (i === 5) {
        query += ` total = $${sanzInp.length + 1}`;
        sanzInp.push(Number(val));
      } else if (i === 6) {
        query += ` sold = $${sanzInp.length + 1}`;
        sanzInp.push(Number(val));
      }
    }
  }

  const { rows } = await pool.query(query, sanzInp);
  return rows;
}

const updateValues = async function (categ, name, price, id, total, sold, newCateg, newName, newPrice, newTotal, newSold) {
  let where = [{val:categ,type:"stock.category"}, {val:name, type:"stock.item_name"}, {val:price,type:"quantity.price"},{val:id,type:"stock.id"}, {val:total,type:"quantity.total"}, {val:sold,type:"quantity.sold"}];
  console.log(where);
  where = where.filter(e=>e.val&&e.val.trim().length>0);
  let set = [{val:newCateg,type:"stock.category"}, {val:newName, type:"stock.item_name"}, {val:newPrice,type:"quantity.price"}, {val:newTotal,type:"quantity.total"}, {val:newSold,type:"quantity.sold"}];
  console.log(set);
  set = set.filter(e=>e.val&&e.val.trim().length>0);

  if(set.length==0){
      return
  }

  let queryS = "UPDATE stock";
  let queryQ = "UPDATE quantity";
  let arrS = [];
  let arrQ = [];

  set.forEach(e=>{
    if(e.type.includes("stock")){
      arrS.push(conform(e.val));
      queryS+=queryS.includes("SET")?",":" SET";
      queryS+=` ${e.type.replace("stock.","")}=$${arrS.length}`
    }
    else{
      arrQ.push(conform(e.val));
      queryQ+=queryQ.includes("SET")?",":" SET";
      queryQ+=` ${e.type.replace("quantity.","")}=$${arrQ.length}`
    }
  })
  let lenS = arrS.length;
  let lenQ = arrQ.length;


  queryS+=" FROM quantity WHERE stock.id = quantity.stock_id";
  queryQ+=" FROM stock WHERE stock.id = quantity.stock_id";

  if(where.length>0){
    where.forEach(e=>{
      arrS.push(conform(e.val))
      arrQ.push(conform(e.val))
      queryS+=queryS.includes("WHERE")?" AND":" WHERE"
      queryS+=` ${e.type}=$${arrS.length}`
      queryQ+=queryQ.includes("WHERE")?" AND":" WHERE"
      queryQ+=` ${e.type}=$${arrQ.length}`
    })
  }

  queryS+=';';
  queryQ+=';';

  console.log(queryS);
  console.log(queryQ);

  if(lenS){await pool.query(queryS,arrS);}
  if(lenQ){await pool.query(queryQ,arrQ);}
}

const deleteItems = async function (categ, name, price, id, total, sold) {
  let where = [{val:categ,type:"stock.category"}, {val:name, type:"stock.item_name"}, {val:price,type:"quantity.price"},{val:id,type:"stock.id"}, {val:total,type:"quantity.total"}, {val:sold,type:"quantity.sold"}];
  console.log(where);
  where = where.filter(e=>e.val&&e.val.trim().length>0);

  let queryS = "DELETE FROM stock USING quantity WHERE stock.id = quantity.stock_id";
  let arrS = [];

  if(where.length>0){
    where.forEach(e=>{
      arrS.push(conform(e.val))
      queryS+=" AND";
      queryS+=` ${e.type}=$${arrS.length}`;
    })
  }

  queryS+=';';

  console.log(queryS);

  await pool.query(queryS,arrS);
}

module.exports = {
    getCategory,
    getByItems,
    addItem,
    getItems,
    updateValues,
    deleteItems
}