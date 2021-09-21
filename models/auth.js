const mongoose = require('mongoose'); 
const { generateNewJWTToken } = require('../middlewares/auth');
const User = require("../models/schemas/user");
// let users=require("./user/user").users;
// let tokenModal  = require("./user/authTokens");
// console.log(users)

const loginModel = (formdata)=>{
    return new Promise((resolve)=>{
            User
                .findOne({email:formdata.email})
                .then(user=>{
                    console.log(user)
                    if(!user.active){
                        resolve({
                            status:405,
                            message:"User is already deleted"
                        })
                    }
                    let isCorrect = user.comparePassword(formdata.password,user.password);
                    if(isCorrect){
                        let accessToken = generateNewJWTToken(formdata.email);
                        resolve({
                            status:200,
                            message:{
                                accessToken
                            }
                        })
                    }else{
                        resolve({
                            status:400,
                            message:"Authentication failure"
                        })
                    }
                })
                .catch(err=>{
                    if(err.name=="ValidationError"){
                        console.log("err from validations",err)
                        resolve({
                            status:400,
                            message:err.toString()
                        })
                    }else{
                        resolve({
                            status:500,
                            message:err.toString()
                        })
                    }
                })
    })
}
const logoutModel=()=>{}

module.exports={
    loginModel,
    logoutModel
}