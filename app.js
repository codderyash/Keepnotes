require('dotenv').config()

const express = require('express');
const expressLayout = require('express-ejs-layouts');
const methodOverride=require('method-override')
const connectDB=require('./server/config/db');

// if user already log in keep track of  log in status

const session=require('express-session');
const  passport=require('passport');
const MongoStore=require('connect-mongo');
var today = new Date();
var milliseconds = today.getTime();


const app = express();

const port =  process.env.PORT||3000;
app.use(passport.initialize());
app.use(session({

    secret:'keyboard cat',
    resave:false,
    saveUninitialized:true,
    store:MongoStore.create({
        mongoUrl:process.env.MONGODB_URI
    }),
   
     
}));


app.use(passport.session());


app.use(express.urlencoded({extended:true}));
app.use(express.json());
connectDB();
app.use(methodOverride("_method"));

// mongodb connection

// static files

app.use(express.static('public'));

app.use(expressLayout);
app.set('view engine','ejs');
app.set('layout','./layouts/main');

// app.get('/',function(req,res){

//     const locals={ 
//         title:'nodejs notes',
//         description:'very useful notes'
//     }
    
//     res.render('index.ejs',locals);
// })


// Routes

app.use('/',require('./server/routes/index'));
app.use('/',require('./server/routes/dashboard'));
app.use('/',require('./server/routes/auth'));

app.get('*',function(req,res){
    res.status(404).render('404');
})
app.listen(port,function(){
    console.log(`server started on port ${port}`)
})



