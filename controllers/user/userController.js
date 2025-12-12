const User = require("../../models/userSchema");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt")
const env = require("dotenv").config();

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
        console.log("inside sendverificationemail",email);
        
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
            html:`<b>your OTP:${otp}<b>`
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


        if (!email) {
            console.log("Signup hit with empty email — stopping.");
            return res.status(400).send("Invalid request");
        }

        

        console.log("inside signup",email);
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

        console.log("OTP send",otp);
       return res.render("user/verify-otp");
        
    } catch (error) {
        console.log(error);
        res.redirect("/pageNotFound");
        
    }
}

const securePassword = async (password)=>{
    try {
        
        const passwordHash = await bcrypt.hash(password,10);

        return passwordHash;

    } catch (error) {
        
    }
}

const verifyOtp = async (req,res)=>{
    try {
        const {otp} = req.body;
        console.log("Entered OTP:", otp);
        console.log("Session OTP:", req.session.userOtp);

        if(otp===req.session.userOtp){
            const user = req.session.userData;
            const passwordHash = await securePassword(user.password);

            const saveUserData = new User({
                name:user.name,
                email:user.email,
                password:passwordHash
            })

            await saveUserData.save();
            req.session.user = saveUserData._id;
            res.json({success:true,redirectUrl:"/"})
        }else{
            res.status(400).json({success:false, message:"Invalid OTP please try agin"})
        }
        
    } catch (error) {
        console.error("error varifing otp",error)
        res.status(500).json({success:false,message:"error"
        })
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
    signup,
    verifyOtp
}