const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const adminController = require("../controllers/admin/adminController");
const customerController = require("../controllers/admin/customerController");
const categoryController = require("../controllers/admin/categoryController");

// Multer Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

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

//category
router.get("/categories", categoryController.categoryInfo);
router.get("/addCategory", categoryController.addCategoryInfo);
router.post("/addCategory", upload.single("image"), categoryController.addCategory);

module.exports = router;