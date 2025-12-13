const express = require('express');
const app = express();
const hbs = require("hbs");
const path = require("path");
const session = require("express-session");
const passport = require("./config/passport");
const env = require('dotenv').config();
const connectDB = require('./config/db');
const userRouter = require("./routes/userRouter")
connectDB();


//build-in middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));

//session middleware
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        secure:false,
        httpOnly:true,
        maxAge:72*60*60*1000
    }
}))

//passport initialize
app.use(passport.initialize());
app.use(passport.session());

//set up viewengine
app.set("view engine","hbs");
app.set("views",path.join(__dirname,"views"));
hbs.registerPartials(path.join(__dirname, "views/partials"));

//userRouter middleware
app.use("/",userRouter) 




// global error middleware
// app.use((req, res) => {
//     res.status(404).render("user/pageNotFound");
// });






app.listen(process.env.PORT, () => {console.log(`Server is running on port ${process.env.PORT}`)});


module.exports = app;