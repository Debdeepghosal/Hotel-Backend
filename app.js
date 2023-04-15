const express = require("express");
const app=express();
const path = require('path');
const port = process.env.PORT || 3000;
require('dotenv').config(({ path: 'config.env' }));
const bodyparser = require('body-parser') 
const connectDB = require('./db/connect');


app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));



//load router
const Route =require("./routes/router")
app.use('/', Route);






const start=async()=>{
    try{
       await connectDB(process.env.MONGO_URI);
        app.listen(port,()=>{
            console.log("server running at port",port)
        })
    }
    catch(err){
        console.log(err);
    }
};
start();

