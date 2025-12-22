const express = require("express");
const router = express.Router();
const adminController =require("../controllers/admin/adminController");


//adminLogin
router.get("/login",adminController.loadLogin);
//loadAdminDashboard
router.post("/login",adminController.adminLogin);
router.get("/",adminController.loadAdminDashboard);



module.exports = router;