const {Router} = require('express');
const db = require('../db/queries')
const deleteRouter = Router();

async function form(req,res){
    let cats = await db.getCategory();
    res.render('delete',{cats:cats,rows:[],vals:{}});
}
deleteRouter.get('/',(req,res)=>{
    form(req,res);
})
async function dlt(req,res){
    if(req.body.isEdit!=="true"){
        let cats = await db.getCategory();
        let rows = await db.getItems(req.body.categ, req.body.name, req.body.price, req.body.id,req.body.total,req.body.sold);
        let vals = {categ:req.body.categ,name:req.body.name,price:req.body.price,id:req.body.id,total:req.body.total,sold:req.body.sold}
        res.render('delete',{cats:cats,rows:rows,vals:vals})
    }
    else{
        console.log('here');
        await db.deleteItems(req.body.categ, req.body.name, req.body.price, req.body.id, req.body.total, req.body.sold);
        return res.redirect('/');
    }
}
deleteRouter.post('/',dlt)

module.exports = deleteRouter;