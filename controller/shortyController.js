const ShortUrl = require("../models/shortUrl");
const { isValidUrl, removeSpaces } = require("../config/utils");

module.exports.getAllLinks = async (req, res) => {
  const shortUrls = await ShortUrl.find({});
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
      return res.redirect("/shorty");
    }

    const existingShortUrl = await ShortUrl.exists({ full: trimmedFull });
    if (existingShortUrl) {
      req.flash("error", "URL already exists");
      return res.redirect("/shorty");
    }

    await ShortUrl.create({
      full: trimmedFull,
      short: trimmedShort,
      description,
    });

    req.flash("success", "Successfully created a new shorty!");
    res.redirect("/shorty");
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
  res.redirect(shortUrl.full);
};
// -----------------------shorty redirect-----------------------

// ------------------get one shorty------------------
module.exports.getOneShorty = async (req, res) => {
  try {
    console.log({ mssg: "I got into getoneshorty" });
    const { id } = req.params;
    const shortUrl = await ShortUrl.findById(id);
    console.log(shortUrl);
    res.render("shortlinks/show", { shortUrl: shortUrl });
  } catch (e) {
    req.flash("error", "Opps! something went wrong while getting shorty");
    res.redirect("/shorty");
  }
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

    if (!isValid) {
      req.flash("error", "Invalid URL");
      return res.redirect(`/shorty/link/${id}`);
    }

    const existingFullUrl = await ShortUrl.exists({ full: trimmedFull });
    if (existingFullUrl) {
      req.flash("error", "Full URL already exists, try another one");
      return res.redirect(`/shorty/link/${id}`);
    }

    const existingShortUrl = await ShortUrl.exists({ short: trimmedShort });
    if (existingShortUrl) {
      req.flash("error", "Short URL already exists, try another one");
      return res.redirect(`/shorty/link/${id}`);
    }

    await ShortUrl.findByIdAndUpdate(id, {
      full: trimmedFull,
      short: trimmedShort,
      description,
    });
    req.flash("success", "Successfully updated a shorty!");
    res.redirect(`/shorty/link/${id}`);
  } catch (error) {
    req.flash(
      "error",
      "Oops! Something went wrong while updating the shorty, please try again"
    );
    res.redirect(`/shorty/link/${req.params.id}`);
  }
};

// ------------------edit shorty------------------

// ------------------delete shorty------------------
module.exports.deleteShorty = async (req, res, next) => {
  console.log({ mssg: "i got into delete shorty" });
  try {
    const { id } = req.params;
    await ShortUrl.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted a shorty!");
    res.redirect("/shorty");
  } catch (e) {
    next("Could not delete this shorty");
  }
};

// ------------------delete shorty------------------
