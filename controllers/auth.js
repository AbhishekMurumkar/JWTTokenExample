const model = require("../models/auth");


const login = async(req,resp)=>{
    let formdata = req.body;
    let authLogin =await model.loginModel(formdata);
    resp.status(authLogin.status).send(authLogin.message)
}

const logout = (req,resp)=>{
    let formdata = req.body;
    resp.status(200).send(formdata);
}


module.exports={
    login,
    logout
}