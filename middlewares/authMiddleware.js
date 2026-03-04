// middleware/authMiddleware.js
const User = require("../models/userSchema");


// block login/signup if already logged in
const isLoggedOut = (req, res, next) => {
  if (req.session.user) {
    return res.redirect("/");
  }
  next();
};

// protect pages (must be logged in)
const isLoggedIn = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  next();
};

const isAdminLoggedIn = (req, res, next) => {
  if (!req.session.admin) {
    return res.redirect("/admin/login");
  }
  next();
}

const isAdminLoggedOut = (req, res, next) => {
  if (req.session.admin) {
    return res.redirect("/admin");
  }
  next();
}

module.exports = {
  isLoggedIn,
  isLoggedOut,
  isAdminLoggedIn,
  isAdminLoggedOut
};
