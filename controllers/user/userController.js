const User = require("../../models/userSchema")
const nodemailer = require("nodemailer")
const env = require("dotenv").config()

//load signup
const loadSignupPage = async (req,res)=>{
    try {
        return res.render("user/signup")
    } catch (error) {
        console.log(error);
    }
}
//generate OTP function
function generateOtp(){
    return Math.floor(100000 + Math.random()*900000).toString()
}

// OTP email verification function
async function sendVerificationEmail (email,otp){
    try {
        
        const transporter = nodemailer.createTransport({

            service:'gmail',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:process.env.NODEMAILER_EMAIL,
                pass:process.env.NODEMAILER_PASSWORD
            }
        })

        const info = await transporter.sendMail({
            from:process.env.NODEMAILER_EMAIL,
            to:email,
            subject:"Verify your email account",
            text:`your OTP:${otp}`,
            html:`<b>Tour OTP:${otp}<b>`
        })

        return info.accepted.length >0;
    } catch (error) {

        console.error("error sending email",error);
        return false;
        
    }
}

const signup =async (req,res)=>{
    try {
        const {name,email,password,confirmPassword} = req.body;
        if(password !== confirmPassword){
            return res.render("user/signup",{message:"password don't match"});
        }

        const findUser = await User.findOne({email});
        if(findUser){
            return res.render("user/signup",{message:"user already exists"});
        }
        //generateOTP
        const otp = generateOtp();
        //email send
        const emailSend = await sendVerificationEmail(email,otp)

        if(!emailSend){
            return res.json("email-error")
        }

        req.session.userOtp = otp;
        req.session.userData = {name,email,password};

        res.render("user/verify-otp");
        console.log("OTP send",otp);
        
    } catch (error) {
        console.log(error)
        res.redirect("/pageNotFound")
        
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