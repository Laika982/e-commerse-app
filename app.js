const express = require('express');
const app = express();
const hbs = require("hbs");
const path = require("path");
const session = require("express-session")
const env = require('dotenv').config();
const connectDB = require('./config/db');
const userRouter = require("./routes/userRouter")
connectDB();


//build-in middilware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));

//session midilware
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

//set up viewengine
app.set("view engine","hbs");
app.set("views",path.join(__dirname,"views"));
hbs.registerPartials(path.join(__dirname, "views/partials"));

//userRouter middilware
app.use("/",userRouter) 




// globel error middilware
app.use((req, res) => {
    res.status(404).render("user/pageNotFound");
});






app.listen(process.env.PORT, () => {console.log(`Server is running on port 3000`)});


module.exports = app;