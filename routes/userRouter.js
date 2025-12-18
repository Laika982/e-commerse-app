const express = require("express");
const router = express.Router();
const passport = require("passport");
const userController = require("../controllers/user/userController");

//userRouter homepage
router.get("/",userController.loadHomepage);
//pageNotFound
router.get("/pageNotFound",userController.pageNotFound);
//signup
router.get("/signup",userController.loadSignupPage);
router.post("/signup",userController.signup);
//Verify-OTP
router.post("/verify-otp",userController.verifyOtp);
//Resend OTP
router.post("/resend-otp",userController.resendOtp);
//Google auth route
router.get("/auth/google",passport.authenticate("google",{scope:["profile","email"],prompt: "select_account"}));
//success or failure
router.get("/auth/google/callback",passport.authenticate("google",{failureRedirect:"/signup"}),(req,res)=>{
    res.redirect("/");
})
//Login
router.get("/login",userController.loadLogin);
router.post("/login",userController.login);
//logout
router.get("/logout",userController.logout);


//test

  

module.exports = router;