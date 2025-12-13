// Secret key for signing JWT tokens
const { JWT_SECRET = "super-strong-secret" } = process.env;

const PORT = process.env.PORT || 3001;
const MONGO_URI = "mongodb://127.0.0.1:27017/wtwr_db";

module.exports = {
  JWT_SECRET,
  PORT,
  MONGO_URI,
};
