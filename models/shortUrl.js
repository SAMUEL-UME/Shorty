const mongoose = require("mongoose");
const shortId = require("shortid");

const shortUrlSchema = new mongoose.Schema(
  {
    full: {
      type: String,
      required: true,
      unique: true,
    },
    short: {
      type: String,
      required: true,
      default: shortId.generate,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    clicks: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ShortUrl", shortUrlSchema);
