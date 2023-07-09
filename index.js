const express = require("express");
const morgan = require("morgan");
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const { isLoggedIn } = require("./middleware");
const { MONGO_URL } = require("./config/config");
const MongoStore = require("connect-mongo");

const Database = require("./database");
const app = express();

const shortyRoutes = require("./routes/shortyRoutes");
const userRoutes = require("./routes/userRoutes");

app.use(morgan("dev"));
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const sessionConfig = {
  store: MongoStore.create({
    mongoUrl: MONGO_URL,
    secret: "thisshouldbeabettersecret",
    touchAfter: 24 * 3600,
  }),
  name: "session",
  secret: "thisshouldbeabettersecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 27 * 7,
    maxAge: 1000 * 60 * 60 * 27 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser()); // how to store user in session
passport.deserializeUser(User.deserializeUser()); // how to get user out of session

app.use((req, res, next) => {
  console.log(req.session);
  res.locals.currentUser = req.user; // req.user is defined by passport
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.get("/", (req, res) => {
  res.render("home");
});

app.use("/", userRoutes);
app.use("/shorty", isLoggedIn, shortyRoutes);

app.use("*", (req, res, next) => {
  console.log("i got here");
  res.status(404).send("Opps page not found! 404");
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong" } = err;
  req.flash("error", err.message || "Something went wrong");
});

Database.connect(app);

// SVGAElement
// https://docrdsfx76ssb.cloudfront.net/static/1687983623/pages/wp-content/uploads/2022/04/H-Generic-LP-new.svg
