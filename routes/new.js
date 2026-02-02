const {Router} = require('express');
let db = require('../db/queries');

const newRouter = Router();

async function form(req,res){
    let rows = await db.getCategory();
    res.render('add',{cats:rows});
}
newRouter.get('/',form);

newRouter.post('/',(req,res)=>{
    console.log(req.body);
    Object.keys(req.body).length>0&&db.addItem(req.body);
    res.redirect('/');
})

module.exports=newRouter;