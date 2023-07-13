const { Router } = require("express");
const router = Router();
const User = require("../models/user");
const passport = require("passport");
const { storeReturnTo } = require("../middleware/middleware");
const catchAsync = require("../helpers/catchAsync");
const { validateRegister,  validateLogin } = require("../validation/authValidation");
const ExpressError = require("../helpers/ExpressError");

router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post(
  "/register",
  validateRegister,
  catchAsync(async (req, res, next) => {
    try {
      const { email, username, password } = req.body;
      const findEmail = await User.findOne({ email });
      if (findEmail) {
        req.flash("error", "Email already in use.");
        return res.redirect("register");
      }
      const user = new User({ email, username });
      const registeredUser = await User.register(user, password);
      req.login(registeredUser, (err) => {
        if (err) return next(err);
        req.flash("success", "Welcome to Shorty!");
        res.redirect("/");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/register");
    }
  })
);

router.get("/login", async (req, res) => {
  res.render("users/login");
});

router.post(
  "/login",
  storeReturnTo,
  validateLogin,
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  catchAsync((req, res) => {
    req.flash("success", "Welcome back!");
    const redirectUrl = res.locals.returnTo || "/shoty";
    res.redirect(redirectUrl);
  })
);

router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Goodbye!");
    res.redirect("/");
  });
});

module.exports = router;
