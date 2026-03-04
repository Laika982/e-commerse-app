const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin/adminController");
const customerController = require("../controllers/admin/customerController");

//adminLogin
router.get("/login", adminController.loadLogin);
//loadAdminDashboard
router.post("/login", adminController.adminLogin);
router.get("/", adminController.loadAdminDashboard);

//logout
router.get("/logout", adminController.logout);

//customers
router.get("/users", customerController.customerInfo);
router.get("/user", customerController.customerInfo);
router.get("/blockCustomer", customerController.customerBlocked);
router.get("/unblockCustomer", customerController.customerunBlocked);

module.exports = router;