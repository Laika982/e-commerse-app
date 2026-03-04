const express = require("express");
const router = express.Router();
const passport = require("passport");
const userController = require("../controllers/user/userController");
const { isLoggedIn, isLoggedOut } = require("../middlewares/authMiddleware");


//userRouter homepage
router.get("/", userController.loadHomepage);
//pageNotFound
router.get("/pageNotFound", userController.pageNotFound);
//signup
router.get("/signup", isLoggedOut, userController.loadSignupPage);
router.post("/signup", isLoggedOut, userController.signup);
//Verify-OTP
router.get("/verify-otp", isLoggedOut, userController.loadVerifyOtpPage);
router.post("/verify-otp", isLoggedOut, userController.verifyOtp);
//Resend OTP
router.post("/resend-otp", userController.resendOtp);
//Google auth route
router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"], prompt: "select_account" }));
//success or failure
router.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/signup" }), (req, res) => {
  req.session.user = req.user._id;
  req.session.save(() => {
    res.redirect("/");
  });
})
//Login
router.get("/login", isLoggedOut, userController.loadLogin);
router.post("/login", isLoggedOut, userController.login);
//logout
router.get("/logout", userController.logout);


module.exports = router;