const express = require("express");
const router = express.Router();
const userContoller = require("../controllers/user/userController");

//userRouter homepage
router.get("/",userContoller.loadHomepage);
//pageNotFound
router.get("/pageNotFound",userContoller.pageNotFound);
//signup
router.get("/signup",userContoller.loadSignupPage);
router.post("/signup",userContoller.signup);



module.exports = router;