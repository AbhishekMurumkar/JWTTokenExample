const {Router} = require("express");
const allRouters = Router({mergeParams:true});

const authController = require("../controllers/auth");
const {verifyJWTToken} = require("../middlewares/auth");

allRouters.post("/login",authController.login)
allRouters.post("/logout",verifyJWTToken,authController.logout);

module.exports=allRouters;