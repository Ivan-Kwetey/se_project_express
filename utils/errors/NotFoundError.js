class NotFoundError extends Error {
  constructor(message = "Not found") {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = 404;
  }
}

module.exports = NotFoundError;
