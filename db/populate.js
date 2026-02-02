require('dotenv').config({});
const { Client } = require("pg");

const SQL = `
CREATE TABLE IF NOT EXISTS stock (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  item_name TEXT, category TEXT
);

CREATE TABLE IF NOT EXISTS quantity (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY, 
  stock_id INTEGER REFERENCES stock(id) ON DELETE CASCADE,
  price REAL, total INTEGER, sold INTEGER
);
`;

const addItem = async function (client,body) {
    await client.query("INSERT INTO stock (item_name,category) VALUES ($1,$2);",[body.name,body.categ]);
    await client.query(
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
            body.categ,
            body.price,
            body.total||null,
            body.sold||null
        ]
    );
}

async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  let pop = [{name:"Mango",categ:"Fruit",price:2.39,total:65,sold:15},
    {name:"Ham",categ:"Meat",price:49.99,total:30,sold:8},
    {name:"Soda",categ:"Beverage",price:0.75,total:120,sold:40}
  ]
  await client.connect();
  await client.query(SQL);
  for(const e of pop){
    await addItem(client,e);
  }
  await client.end();
  console.log("done");
}

main();