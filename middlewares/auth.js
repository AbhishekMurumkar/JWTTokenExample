let jwtToken = require("jsonwebtoken");
let {webTokenSecurtiyKey} = require("../config/config.json");

const generateNewJWTToken = (data)=>{
    let token = jwtToken.sign({
        data:data,
        exp:Math.floor(Date.now()/1000)+(15*60)
    },webTokenSecurtiyKey);
    console.log(token)
    return {
        "access_token":token,
        "expiresIn":"15 mins"
    }
}

const getUserNameFromToken=(headers)=>{
    let endResponse={};
    try{
        let token = headers.authorization.split("Bearer ")[1];
        let result= jwtToken.verify(token,webTokenSecurtiyKey);
        endResponse['status']=200;
        endResponse['message']=result
    }catch(err){
        endResponse['status']=401;
        endResponse['message']=err.toString()
    }
    return endResponse;
}

const verifyJWTToken=(req,resp,next)=>{
    if(req.headers.authorization){
        let result = getUserNameFromToken(req.headers);
        if(result.status==200){
            next();
        }else{
            resp.status(result.status).send(result.message);
        }
    }else{
        resp.status(400).send('No Auth token was found in request');
    }
}

module.exports={
    generateNewJWTToken,
    verifyJWTToken,
    getUserNameFromToken
}