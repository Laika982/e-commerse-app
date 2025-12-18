const User = require("../../models/userSchema");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

//loadLogin
const loadLogin = (req,res)=>{

    if(req.session.admin){
        return res.redirect("/admin/dashboard");
    }
    res.render("admin/login");
}



module.exports = {
    loadLogin,
}
