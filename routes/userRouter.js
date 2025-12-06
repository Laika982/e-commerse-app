const express = require("express");
const router = express.Router();
const userContoller = require("../controllers/user/userController");

//userRouter homepage
router.get("/",userContoller.loadHomepage);
//pageNotFound
router.get("/pageNotFound",userContoller.pageNotFound);



module.exports = router;