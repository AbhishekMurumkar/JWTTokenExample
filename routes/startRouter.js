const {Router} = require("express");
const allRouters = new Router({mergeParams:true});
const userRoute = require("./user");
const authRoute = require("./auth");


allRouters
.get("/",(req,resp)=>resp.send("App is working"))
.use(authRoute)
.use(userRoute)
.use('*',(req,resp)=>{
    resp.status(404).send("Invalid Route")
})

module.exports=allRouters;