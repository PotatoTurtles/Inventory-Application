require('dotenv').config({});

const express = require('express');
const app = express();
const path = require('node:path');
const port = 3000;

const db = require('./db/queries');

const homeRouter = require('./routes/home');

app.use(express.urlencoded({extended:true}));
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

app.use('/',homeRouter);

app.listen(port,err=>{
    if(err){
        throw err
    }
    console.log(`My first Express app - listening on port ${port}!`);
})
