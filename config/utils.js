const url = require("url");

function isValidUrl(fullUrl) {
  try {
    const parsedUrl = new URL(fullUrl);
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
  } catch (error) {
    return false;
  }
}
function removeSpaces(str) {
  return str.replace(/\s/g, "");
}

module.exports = {
  isValidUrl,
  removeSpaces,
};
