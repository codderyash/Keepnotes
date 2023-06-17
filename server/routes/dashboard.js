const express=require('express');
const routes=express.Router();
const dashboardcontroller=require('../controller/dashboardController');

/*
dashboard routes
*/ 
const {isLoggedin}=require('../middlerware/cheakauth');

routes.get('/dashboard', isLoggedin ,dashboardcontroller.dashboard);
routes.get('/dashboard/item/:id', isLoggedin ,dashboardcontroller.viewnotes);
routes.put('/dashboard/item/:id', isLoggedin ,dashboardcontroller.updatenotes);
routes.delete('/dashboard/item-delete/:id', isLoggedin ,dashboardcontroller.deletenotes);
routes.get('/dashboard/add', isLoggedin ,dashboardcontroller.adddashboard);
routes.post('/dashboard/add', isLoggedin ,dashboardcontroller.dashboardadd);
routes.get('/dashboard/search', isLoggedin ,dashboardcontroller.dashboardsearch);
routes.post('/dashboard/search', isLoggedin ,dashboardcontroller.dashboardsearchfind);

module.exports=routes;
 