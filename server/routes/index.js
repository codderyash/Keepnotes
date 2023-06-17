const express=require('express');
const route=express.Router();
const maincontroller=require('../controller/mainControllers');


// app route

route.get('/',maincontroller.homepage);
route.get('/about',maincontroller.about);
module.exports=route;