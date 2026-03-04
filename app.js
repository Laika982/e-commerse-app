const express = require('express');
const app = express();
const hbs = require("hbs");
const path = require("path");
const session = require("express-session");
const passport = require("./config/passport");
const env = require('dotenv').config();
const connectDB = require('./config/db');
const userRouter = require("./routes/userRouter");
const adminRouter = require("./routes/adminRouter");
connectDB();


//build-in middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

//session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 72 * 60 * 60 * 1000,
        sameSite: 'lax'
    }
}))

//passport initialize
app.use(passport.initialize());
app.use(passport.session());

// Middleware to prevent browser caching of authenticated pages
app.use((req, res, next) => {
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
    res.set("Pragma", "no-cache");
    res.set("Expires", "-1");
    next();
});

//set up viewengine
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
hbs.registerPartials(path.join(__dirname, "views/partials"));

//userRouter middleware
app.use("/", userRouter);
//adminrouter middleware
app.use("/admin", adminRouter);




// global error middleware
// app.use((req, res) => {
//     res.status(404).render("user/pageNotFound");
// });






app.listen(process.env.PORT, () => { console.log(`Server is running on port ${process.env.PORT}`) });


module.exports = app;