const { render } = require('ejs');
const {Router} = require('express');
const db = require('../db/queries');

const homeRouter = Router();

const getHome = async function (req,res){
    let rows = await db.getByItems(req.query.categ,req.query.name,req.query.price,req.query.id);
    res.render('home',{render:true,rows:rows});
}
homeRouter.get('/',(req,res,next)=>{
    console.log(Object.keys(req.query))
    if(req.query && Object.keys(req.query).length>0){
        getHome(req,res);
    }
    else{
        next();
    }
})
homeRouter.use('/',(req,res)=>{
    res.render('home',{render:false});
})

module.exports = homeRouter;