const express = require("express");
const methodOverride = require("method-override");
const ShortUrl = require("./models/shortUrl");
const Database = require("./database");



const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));


app.get("/", async (req, res) => {
  const shortUrls = await ShortUrl.find({});
  res.render("index", { shortUrls: shortUrls });
});

app.post("/", (req, res) => {
  res.send("hello from simple server :)");
});
app.post("/shortUrls", async (req, res) => {
  console.log(req.body.fullurl);
  const checkFullUrl = await ShortUrl.find({ full: req.body.fullurl });
  console.log(checkFullUrl.length);
  if (checkFullUrl.length >= 1)
    return res.send("url already exist").sendStatus(404);
  await ShortUrl.create({ full: req.body.fullurl });
  res.redirect("/");
});

app.get("/:shortUrl", async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
  if (shortUrl == null) return res.sendStatus(404);
  shortUrl.clicks++;
  shortUrl.save();
  res.redirect(shortUrl.full);
});

app.get("/link/:id", async (req, res) => {
  const { id } = req.params;
  const shortUrl = await ShortUrl.findById(id);
  console.log(shortUrl);
  res.render("show", { shortUrl: shortUrl });
});

app.delete("/deleteUrl/:id", async (req, res) => {
  const { id } = req.params;
  await ShortUrl.findByIdAndDelete(id);
  res.redirect("/");
});


Database.connect(app);
