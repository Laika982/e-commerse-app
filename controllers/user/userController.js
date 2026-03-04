const User = require("../../models/userSchema");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const req = require("express/lib/request");
const env = require("dotenv").config();


//404 error page
const pageNotFound = async (req, res) => {
    try {
        return res.render("user/pageNotFound")
    } catch (error) {
        console.log(error);
        return res.redirect("/pageNotFound");
    }
}

//load homepage
const loadHomepage = async (req, res) => {
    try {
        const user = req.session.user;
        if (user) {
            const userData = await User.findById(user);
            return res.render("user/home", { user: userData });
        }
        return res.render("user/home");

    } catch (error) {
        console.log(error);
        res.redirect("/pageNotFound");
    }
}

//load signup
const loadSignupPage = async (req, res) => {
    try {
        return res.render("user/signup")
    } catch (error) {
        console.log(error);
    }
}

//generate OTP function
function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString()
}

// OTP email verification function
async function sendVerificationEmail(email, otp) {
    try {
        console.log("inside sendverificationemail", email);

        const transporter = nodemailer.createTransport({

            service: 'gmail',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: process.env.NODEMAILER_EMAIL,
                pass: process.env.NODEMAILER_PASSWORD
            }
        })

        const info = await transporter.sendMail({
            from: process.env.NODEMAILER_EMAIL,
            to: email,
            subject: "Verify your email account",
            text: `your OTP:${otp}`,
            html: `<b>your OTP:${otp}<b>`
        })

        return info.accepted.length > 0;
    } catch (error) {

        console.error("error sending email", error);
        return false;

    }
}

//sign up
const signup = async (req, res) => {
    try {
        const {
            name: rawName = "",
            email: rawEmail = "",
            password: rawPassword = "",
            confirmPassword: rawConfirm = "",
        } = req.body || {};

        const name = typeof rawName === "string" ? rawName.trim() : "";
        const email = typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : "";
        const password = typeof rawPassword === "string" ? rawPassword : "";
        const confirmPassword = typeof rawConfirm === "string" ? rawConfirm : "";

        if (!email) {
            return res.status(400).render("user/signup", { message: "Email is required" });
        }

        console.log("inside signup", email);
        if (password !== confirmPassword) {
            return res.render("user/signup", { message: "password don't match" });
        }

        const findUser = await User.findOne({ email });
        if (findUser) {
            return res.render("user/signup", { message: "user already exists" });
        }
        //generateOTP
        const otp = generateOtp();

        // Save OTP and user data to session first
        req.session.userOtp = otp;
        req.session.userData = { name, email, password };
        await new Promise((resolve, reject) => {
            req.session.save((err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        //email send
        const emailSend = await sendVerificationEmail(email, otp)

        if (!emailSend) {
            // Clear session data if email failed
            delete req.session.userOtp;
            delete req.session.userData;
            return res.status(500).render("user/signup", { message: "Failed to send verification email. Please try again." })
        }

        console.log("OTP send", otp);
        return res.redirect("/verify-otp");

    } catch (error) {
        console.log(error);
        res.redirect("/pageNotFound");

    }
}

// secure password using bcrypt
const securePassword = async (password) => {
    try {

        const passwordHash = await bcrypt.hash(password, 10);

        return passwordHash;

    } catch (error) {
        console.error("error securing password", error);

    }
}

//Load verify-otp page
const loadVerifyOtpPage = async (req, res) => {
    try {
        // If user is already logged in, redirect to home
        if (req.session.user) {
            return res.redirect("/");
        }
        // If there's no OTP session data, redirect to signup
        if (!req.session.userOtp || !req.session.userData) {
            return res.redirect("/signup");
        }
        return res.render("user/verify-otp");
    } catch (error) {
        console.log("error loading verify-otp page", error);
        res.redirect("/pageNotFound");
    }
}

//OTP verification
const verifyOtp = async (req, res) => {
    try {
        const { otp } = req.body;
        if (otp === req.session.userOtp) {
            const user = req.session.userData;
            const passwordHash = await securePassword(user.password);

            const saveUserData = new User({
                name: user.name,
                email: user.email,
                password: passwordHash
            })

            await saveUserData.save();
            req.session.user = saveUserData._id;
            // Clear OTP and userData from session after successful verification
            delete req.session.userOtp;
            delete req.session.userData;
            await new Promise((resolve, reject) => {
                req.session.save((err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
            res.json({ success: true, redirectUrl: "/" })
        } else {
            res.status(400).json({ success: false, message: "Invalid OTP please try again" })
        }

    } catch (error) {
        console.error("error verifying otp", error)
        res.status(500).json({ success: false, message: "error" })
    }
}

//Resenf OTP
const resendOtp = async (req, res) => {
    try {
        const userData = req.session.userData;
        if (!userData || !userData.email) {
            return res.status(400).json({ success: false, message: "Email is required. Please sign up again." });
        }
        const { email } = userData;
        const otp = generateOtp();
        req.session.userOtp = otp;
        await new Promise((resolve, reject) => {
            req.session.save((err) => {
                if (err) reject(err);
                else resolve();
            });
        });
        const emailSend = await sendVerificationEmail(email, otp);

        if (!emailSend) {
            return res.status(500).json({ success: false, message: "Failed to send verification email. Please try again." });
        }
        return res.status(200).json({ success: true, message: "OTP sent successfully. Please check your email." });
        console.log("resend otp :", otp);


    } catch (error) {
        console.error("Error resending otp", error);
        return res.status(500).json({ success: false, message: "Error occurred while resending OTP" });
    }
}

//Loadlogin
const loadLogin = async (req, res) => {
    try {
        res.render("user/login");
    } catch (error) {
        console.log("login error", error);
        res.status(400).redirect("pageNotFound")
    }
}

//Login
const login = async (req, res) => {
    try {
        const { email, password } = req.body

        const findUser = await User.findOne({ isAdmin: 0, email: email });

        if (!findUser) {
            return res.render("user/login", { message: "user not found" });
        }
        if (findUser.isBlocked) {
            res.render("user/login", { message: "User Blocked By Admin" });
        }

        const passwordMatch = await bcrypt.compare(password, findUser.password);

        if (!passwordMatch) {
            return res.render("user/login", { message: "Incorrect Password" })
        }

        req.session.user = findUser._id;
        await new Promise((resolve, reject) => {
            req.session.save((err) => {
                if (err) reject(err);
                else resolve();
            });
        });
        res.redirect("/")
    } catch (error) {
        console.log("login error", error);
        res.status(400).render("user/login", { message: "Login failed. Please try again latter" });
    }
}

//logOut
const logout = async (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                console.log("logout session error", err);
                res.redirect("pageNotFound");
            }
            return res.redirect("/login");
        })
    } catch (error) {
        console.log("logout erroe", error);

        res.redirect("pageNotFound");
    }
}



module.exports = {
    loadHomepage,
    pageNotFound,
    loadSignupPage,
    signup,
    loadVerifyOtpPage,
    verifyOtp,
    resendOtp,
    loadLogin,
    login,
    logout
}