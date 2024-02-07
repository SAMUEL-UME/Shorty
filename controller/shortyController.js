const ShortUrl = require("../models/shortUrl");
const { isValidUrl, removeSpaces } = require("../config/utils");
const ExpressError = require("../helpers/ExpressError");

// ------------------------------------------

module.exports.getAllLinks = async (req, res) => {
  const user = req.user._id;
  const shortUrls = await ShortUrl.find({ author: user });
  res.render("shortlinks/index", { shortUrls: shortUrls, msg: req.flash() });
};

// -----------------------shorty create-----------------------
module.exports.renderNewForm = (req, res) => {
  res.render("shortlinks/new");
};

module.exports.createShorty = async (req, res) => {
  const { full, short, description } = req.body.shortlink;

  try {
    const trimmedFull = removeSpaces(full);
    const trimmedShort = removeSpaces(short);

    const isValid = isValidUrl(trimmedFull);
    if (!isValid) {
      req.flash("error", "Invalid URL");
      return res.redirect("/shorty/new");
    }

    const existingShortUrl = await ShortUrl.exists({ full: trimmedFull });
    if (existingShortUrl) {
      req.flash("error", "URL already exists");
      return res.redirect("/shorty");
    }

    const newShorty = new ShortUrl({
      full: trimmedFull,
      short: trimmedShort,
      description,
    });
    newShorty.author = req.user._id;
    await newShorty.save();
    req.flash("success", "Successfully created a new shorty!");
    res.redirect("/shorty/link/" + newShorty._id);
  } catch (error) {
    req.flash("error", "Oops! Something went wrong while creating shorty");
    res.redirect("/shorty");
  }
};
// -----------------------shorty create-----------------------

// -----------------------shorty redirect-----------------------
module.exports.shortyRedirect = async (req, res) => {
  console.log(req.params);
  console.log("I got here");
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
  if (shortUrl == null) return res.sendStatus(404);
  shortUrl.clicks++;
  shortUrl.save();
  console.log(shortUrl)
  res.redirect(shortUrl.full);
};
// -----------------------shorty redirect-----------------------

// ------------------get one shorty------------------
module.exports.getOneShorty = async (req, res) => {
  console.log({ mssg: "I got into getoneshorty" });
  const { id } = req.params;
  const shortUrl = await ShortUrl.findById(id).populate("author");
  console.log(shortUrl);
  if (!shortUrl) return new ExpressError("Cannot find that shorty!", 404);
  res.render("shortlinks/show", { shortUrl: shortUrl });
};

// ---------------------------------------------------

// ------------------edit shorty------------------
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const shortUrl = await ShortUrl.findById(id);
  console.log(shortUrl);
  res.render("shortlinks/edit", { shortUrl: shortUrl });
};

module.exports.updateShorty = async (req, res) => {
  const { full, short, description } = req.body.shortlink;
  try {
    const trimmedFull = removeSpaces(full);
    const trimmedShort = removeSpaces(short);
    const { id } = req.params;
    const description = req.body.shortlink.description;
    const isValid = isValidUrl(full);

    if (!isValid)
      return new ExpressError("Invalid URL", 400, `/shorty/link/${id}`);

    const existingFullUrl = await ShortUrl.exists({ full: trimmedFull });
    if (existingFullUrl)
      return new ExpressError(
        "Full URL already exists, try another one",
        409,
        `/shorty/link/${id}`
      );

    const existingShortUrl = await ShortUrl.exists({ short: trimmedShort });
    if (existingShortUrl)
      return new ExpressError(
        "Short URL already exists, try another one",
        409,
        `/shorty/link/${id}`
      );

    await ShortUrl.findByIdAndUpdate(id, {
      full: trimmedFull,
      short: trimmedShort,
      description,
    });
    req.flash("success", "Successfully updated a shorty!");
    res.redirect(`/shorty/link/${id}`);
  } catch (error) {
    new ExpressError(
      "Oops! Something went wrong while updating shorty",
      500,
      `/shorty/link/${id}`
    );
  }
};

// ------------------edit shorty------------------

// ------------------delete shorty------------------
module.exports.deleteShorty = async (req, res, next) => {
  console.log({ mssg: "i got into delete shorty" });
  const { id } = req.params;
  await ShortUrl.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted a shorty!");
  res.redirect("/shorty");
};

// ------------------delete shorty------------------
