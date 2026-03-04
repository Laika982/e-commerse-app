const User = require("../../models/userSchema");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

//loadLogin
const loadLogin = (req, res) => {

    if (req.session.admin) {
        return res.redirect("/admin");
    }
    res.render("admin/login", { message: null });
}

//adminlogin
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await User.findOne({ email, isAdmin: true });

        if (admin) {

            const passwordMatch = await bcrypt.compare(password, admin.password);
            if (passwordMatch) {
                req.session.admin = true;
                return res.redirect("/admin");
            } else {
                return res.render("admin/login", { message: "Invalid password" });
            }
        } else {
            return res.render("admin/login", { message: "Admin not found" });
        }
    } catch (error) {
        console.log("login error", error);
        return res.redirect("/pageerror");
    }
}

//loadDashboard

const loadAdminDashboard = async (req, res) => {
    if (req.session.admin) {
        try {
            res.render("admin/dashboard");
        } catch (error) {
            res.redirect("/pageerror");
        }
    } else {
        res.redirect("/admin/login");
    }
}

const logout = async (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                console.log(err);
                return res.redirect("/pageerror");
            }
            res.redirect("/admin/login");
        })
    } catch (error) {
        console.log("logout error", error);
        return res.redirect("/pageerror");
    }
}

module.exports = {
    loadLogin,
    adminLogin,
    loadAdminDashboard,
    logout,

}