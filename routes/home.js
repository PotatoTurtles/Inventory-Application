const {Router} = require('express');

const homeRouter = Router();

homeRouter.use('/',(req,res)=>{
    res.render('home');
})

module.exports = homeRouter;