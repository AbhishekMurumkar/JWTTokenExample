const express = require('express');
const bodyParser = require('body-parser');
const routes = require("./routes/startRouter");
const mongoose = require('mongoose');

const app =express();
const port = 3000;
let {dbUrl}=require("./config/config.json");
mongoose.connect(dbUrl)

app
.use(express.urlencoded({extended:true,}))
.use(bodyParser.json())
.use(routes)
.listen(port,(err,data)=>{
    console.log("Server is running on "+port)
})