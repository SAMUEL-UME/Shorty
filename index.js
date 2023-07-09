const express = require("express");
const morgan = require("morgan");
const methodOverride = require("method-override");
const path = require("path");
const shortyRoutes = require("./routes/shortyRoutes");
const ejsMate = require("ejs-mate");
const flash = require("connect-flash");
const session = require("express-session");

const Database = require("./database");

const app = express();

app.use(morgan("dev"));
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const sessionConfig = {
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

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.get("/", (req, res) => {
  res.render("home");
});

app.use("/shorty", shortyRoutes);

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
