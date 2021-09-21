const { Router }     = require("express");
let   routers        = Router({ mergeParams: true });
const authMiddleware = require("../middlewares/auth");
const userController = require("../controllers/user/user");

routers
    .get("/me", authMiddleware.verifyJWTToken, userController.getCurrentUserProfile)
    .put("/me", authMiddleware.verifyJWTToken, userController.updateUserDetails)
    .delete("/me", authMiddleware.verifyJWTToken, userController.deleteCurrentUser)
    .get("/user/:username", authMiddleware.verifyJWTToken, userController.getUserById)
    .post("/signup", userController.createNewUser)

module.exports = routers;