const model = require("../../models/user/user");


const getCurrentUserProfile=async(req,resp)=>{
    let result =await model.getCurrentUserProfileModal(req.headers);
    resp.status(result.status).send(result.message);
}

const updateUserDetails=async(req,resp)=>{
    if(req.body||JSON.stringify(req.body)!="{}"){
        let result =await model.updateUserDetailsModal(req.headers,req.body);
        console.log("result",result)
        resp.status(result.status).send(result.message);
    }else{
        resp.end(400).send("Empty Body Received");
    }
}

const deleteCurrentUser=async(req,resp)=>{
    let result= await model.deleteCurrentUserModal(req.headers,req.body);
    resp.status(result.status).send(result.message);
}

const getUserById=async(req,resp)=>{
    let email = req.params.username;
    let result = await model.getUserByEmail(email);
    resp.status(result.status).send(result.message)
}

const createNewUser=async(req,resp)=>{
    let newUserStatus = await model.createNewUserModal(req.body);
    // console.log("newUserStatus",newUserStatus);
    resp.status(newUserStatus.status).send(newUserStatus.message)
}



module.exports={
    getCurrentUserProfile,
    updateUserDetails,
    deleteCurrentUser,
    getUserById,
    createNewUser
}