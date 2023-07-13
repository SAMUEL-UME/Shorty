const User = require("../models/user");
const passport = require("passport");
const ExpressError = require("../helpers/ExpressError");

module.exports.renderRegister = (req, res) => {
  res.render("users/register");
};

module.exports.register = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to Shorty!");
      res.redirect("/");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("register");
  }
};

module.exports.renderLogin = (req, res) => {
  res.render("users/login");
};

module.exports.login = (req, res, next) => {
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
    (req, res, next) => {
      console.log("I got inside login");
      req.flash("success", "Welcome back!");
      const redirectUrl = res.locals.returnTo || "/shoty";
      res.redirect(redirectUrl);
    };
};

module.exports.logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Goodbye!");
    res.redirect("/");
  });
};
