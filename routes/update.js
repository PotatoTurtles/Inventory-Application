const {Router} = require('express');
const db = require('../db/queries')
const updateRouter = Router();

async function form(req,res){
    let cats = await db.getCategory();
    res.render('delete',{cats:cats,rows:[],vals:{}});
}
updateRouter.get('/',(req,res)=>{
    form(req,res);
})
async function update(req,res){
    if(req.body.isEdit!=="true"){
        let cats = await db.getCategory();
        let rows = await db.getItems(req.body.categ, req.body.name, req.body.price, req.body.id,req.body.total,req.body.sold);
        let vals = {categ:req.body.categ,name:req.body.name,price:req.body.price,id:req.body.id,total:req.body.total,sold:req.body.sold}
        res.render('delete',{cats:cats,rows:rows,vals:vals})
    }
    else{
        await db.updateValues(req.body.categ, req.body.name, req.body.price, req.body.id, req.body.total, req.body.sold, req.body.newCateg, req.body.newName, req.body.newPrice, req.body.newTotal, req.body.newSold);
        return res.redirect('/');
    }
}
updateRouter.post('/',update)

module.exports = updateRouter;