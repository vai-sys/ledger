const express=require("express");
const {userRegisterController ,userLoginController ,userLogout}=require("../controllers/auth.controller.js");
const { authMiddleware } = require("../middleware/auth.middleware.js");


const router=express.Router();

router.post("/register",userRegisterController)
router.post("/login",userLoginController);
router.post("/logout",authMiddleware,userLogout)


module.exports=router;

