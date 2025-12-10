const User =require("../../models/userSchema")



const loadSignupPage = async (req,res)=>{
    try {
        return res.render("user/signup")
    } catch (error) {
        console.log(error);
    }
}

const signup =async (req,res)=>{
    try {
        const {name,email,password,confirmPassword} = req.body
        const newUser = new User({name,email,password})
        await newUser.save()
        console.log(newUser);
        return res.redirect("/")
    } catch (error) {
        console.log(error)
        res.status(500)
        
    }
}

const pageNotFound = async (req,res)=>{
    try {
        return res.render("user/pageNotFound")
    } catch (error) {
        res.redirect("/pageNotFound")
            console.log(error);
    }
}

const loadHomepage = async (req,res)=>{
    try {
        return res.render("user/home")
    } catch (error) {     
        console.log(error);      
    }
}


module.exports = {
    loadHomepage,
    pageNotFound,
    loadSignupPage,
    signup
}