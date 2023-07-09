const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const shortId = require("shortid");

const shortUrlSchema = new Schema(
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
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
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
