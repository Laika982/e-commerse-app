const express = require("express");
const router = express.Router();
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
router.post("/resend-otp",userController.resendOtp)



module.exports = router;