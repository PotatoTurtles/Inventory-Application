require('dotenv').config({});

const express = require('express');
const app = express();
const path = require('node:path');
const port = process.env.PORT || 3000;

const db = require('./db/queries');

const homeRouter = require('./routes/home');
const newRouter = require('./routes/new');
const updateRouter = require('./routes/update');
const deleteRouter = require('./routes/delete');

app.use(express.urlencoded({extended:true}));

app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

app.use('/new',newRouter);
app.use('/update',updateRouter);
app.use('/delete',deleteRouter);
app.use('/',homeRouter);

app.listen(port,err=>{
    if(err){
        throw err
    }
    console.log(`My first Express app - listening on port ${port}!`);
})
