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

//adminlogin
const adminLogin = async (req,res)=>{
    try {
        const {email,password} = req.body;
        
        const admin = await User.findOne({email,isAdmin:true});

        if(admin){

            const passwordMatch = await bcrypt.compare(password,admin.password);
            if(passwordMatch){
                req.session.admin = true;
                return res.render("admin/dashboard");
            }else{
                return res.render("admin/login");
            }
        }else{
            return res.render("admin/login");
        }
    } catch (error) {
        console.log("login error",error);
        return res.redirect("pageerror");  
    }
}

//loadDashboard

const loadAdminDashboard = async (req,res)=>{
    if(req.session.admin){
        try {
            res.render("admin/dashboard");
        } catch (error) {
            res.redirect("/pageerror")
            
        }
    }
}

module.exports = {
    loadLogin,
    adminLogin,
    loadAdminDashboard,

}
