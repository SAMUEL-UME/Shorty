class ExpressError extends Error {
  constructor(message, statusCode, redirectUrl) {
    super();
    this.message = message;
    this.statusCode = statusCode;
    this.redirectUrl = redirectUrl;
  }
}

module.exports = ExpressError;
